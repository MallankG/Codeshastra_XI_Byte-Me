from flask import Flask, request, Response, send_file, jsonify
from flask_cors import CORS
import os
import json
from datetime import datetime, timedelta
import tempfile
import re
from groq import Groq
from langchain.chains import ConversationChain
from langchain.memory import ConversationBufferMemory
from langchain.schema import AIMessage, HumanMessage, SystemMessage
from langdetect import detect
import requests
from gtts import gTTS
import io
import subprocess
import threading
import queue
import soundfile as sf
import numpy as np
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from flask import Flask, render_template
from flask_socketio import SocketIO, emit
import whisper
import io
from gtts import gTTS
from pydub import AudioSegment
import base64

app = Flask(__name__)
CORS(app)

# API Keys
AMADEUS_API_KEY = "KcJe1Ef160GbCmAurWO2ieApdYJnUgKG"
AMADEUS_API_SECRET = "8Axu4TAQGgvWpm0D"
GOOGLE_PLACES_API_KEY = "AIzaSyBF_X-pCPrgGDDT_0XK1ObF7lR1MkEsTl0"
GROQ_API_KEY = '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'

# Initialize Groq client
groq_client = Groq(api_key=GROQ_API_KEY)

# Global conversation state
conversation_state = {
    "memory": ConversationBufferMemory(),
    "history": [SystemMessage(content="""
        You are a professional travel planner assistant with expertise in creating personalized itineraries.
        When given a city, dates, budget, and interests, generate a highly detailed travel plan.
        Format your response with:
        - Day-by-day structure with time slots
        - Hotel recommendations
        - Attraction visits
        - Dining suggestions
        - Transportation tips
        - Estimated costs
        
        After creating an itinerary, remember the traveler's plans and answer questions about
        the destination, suggested activities, or recommend changes to the itinerary.
        Do not use emojis in your responses.
    """)],
    "trip_details": {},
    "generated_itinerary": None,
    "pdf_path": None
}

audio_queue = queue.Queue()

def get_amadeus_token():
    url = "https://test.api.amadeus.com/v1/security/oauth2/token"
    data = {
        "grant_type": "client_credentials",
        "client_id": AMADEUS_API_KEY,
        "client_secret": AMADEUS_API_SECRET
    }
    response = requests.post(url, data=data)
    return response.json().get("access_token")

def get_hotels(city_code, budget="MEDIUM"):
    token = get_amadeus_token()
    url = f"https://test.api.amadeus.com/v1/reference-data/locations/hotels/by-city?cityCode={city_code}"
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(url, headers=headers)
    hotels = response.json().get("data", [])
    return [{"name": hotel['name'], "rating": hotel.get('rating', 'N/A')} for hotel in hotels[:5]]

def get_flights(origin, destination, departure_date, return_date=None, budget="ECONOMY"):
    token = get_amadeus_token()
    url = f"https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode={origin}&destinationLocationCode={destination}&departureDate={departure_date}&adults=1"
    if return_date:
        url += f"&returnDate={return_date}"
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(url, headers=headers)
    flights = response.json().get("data", [])
    flight_details = []
    for f in flights[:3]:
        try:
            departure = f['itineraries'][0]['segments'][0]['departure']['at']
            carrier = f['itineraries'][0]['segments'][0]['carrierCode']
            price = f['price']['total']
            flight_details.append({
                "carrier": carrier,
                "departure": departure,
                "price": price,
                "currency": f['price']['currency']
            })
        except (KeyError, IndexError):
            continue
    return flight_details

def get_attractions(city):
    url = f"https://maps.googleapis.com/maps/api/place/textsearch/json?query=top+attractions+in+{city}&key={GOOGLE_PLACES_API_KEY}"
    response = requests.get(url)
    results = response.json().get("results", [])
    attractions = []
    for place in results[:8]:
        try:
            photo_reference = None
            if 'photos' in place and len(place['photos']) > 0:
                photo_reference = place['photos'][0].get('photo_reference')
            attractions.append({
                "name": place["name"],
                "rating": place.get("rating", "N/A"),
                "address": place.get("formatted_address", "N/A"),
                "type": place.get("types", ["attraction"])[0].replace("_", " ").title(),
                "photo_reference": photo_reference,
                "lat": place["geometry"]["location"]["lat"],
                "lng": place["geometry"]["location"]["lng"]
            })
        except (KeyError, IndexError):
            continue
    return attractions

def get_place_coordinates(place_name, city):
    """Get latitude and longitude for a specific place using Google Places API"""
    url = f"https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input={place_name}+{city}&inputtype=textquery&fields=geometry&key={GOOGLE_PLACES_API_KEY}"
    response = requests.get(url)
    data = response.json()
    
    try:
        location = data["candidates"][0]["geometry"]["location"]
        return location["lat"], location["lng"]
    except (IndexError, KeyError):
        # Fallback to text search if findplacefromtext fails
        url = f"https://maps.googleapis.com/maps/api/place/textsearch/json?query={place_name}+{city}&key={GOOGLE_PLACES_API_KEY}"
        response = requests.get(url)
        data = response.json()
        try:
            location = data["results"][0]["geometry"]["location"]
            return location["lat"], location["lng"]
        except (IndexError, KeyError):
            return None, None

def extract_itinerary_locations(itinerary_text, destination):
    """Extract locations from itinerary and get their coordinates"""
    itinerary_locations = []
    
    # Split itinerary into days
    days = re.split(r'Day \d+:', itinerary_text)
    
    for day_num, day_content in enumerate(days[1:], start=1):
        lines = day_content.split('\n')
        for line in lines:
            line = line.strip()
            if not line or line.startswith(('Hotel recommendations:', 'Transportation tips:', 'Estimated costs:')):
                continue
                
            # Extract place name and type
            # Assuming format like "9:00 AM - Visit Gateway of India" or "Gateway of India"
            match = re.match(r'(?:\d{1,2}:\d{2}\s*(?:AM|PM|am|pm)?\s*-\s*)?(.*?)(?:\s*\((\w+)\))?$', line)
            if match:
                name = match.group(1).strip()
                place_type = match.group(2) if match.group(2) else "attraction"
                
                # Determine type more accurately
                if "hotel" in name.lower() or "inn" in name.lower() or "resort" in name.lower():
                    place_type = "hotel"
                elif "restaurant" in name.lower() or "cafe" in name.lower() or "dining" in name.lower():
                    place_type = "restaurant"
                
                # Get coordinates
                lat, lng = get_place_coordinates(name, destination)
                
                if lat and lng:
                    itinerary_locations.append({
                        "day": day_num,
                        "name": name,
                        "type": place_type,
                        "lat": lat,
                        "lng": lng
                    })
    
    return itinerary_locations

def process_audio_stream():
    while True:
        try:
            audio_data = audio_queue.get()
            if audio_data is None:
                break
            with tempfile.NamedTemporaryFile(suffix='.wav', delete=False) as temp_wav:
                process = subprocess.Popen([
                    'ffmpeg', '-i', 'pipe:0', '-f', 'wav', temp_wav.name,
                    '-y'
                ], stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
                process.communicate(input=audio_data)
                data, samplerate = sf.read(temp_wav.name)
                os.unlink(temp_wav.name)
        except Exception as e:
            print(f"Audio processing error: {str(e)}")

audio_thread = threading.Thread(target=process_audio_stream, daemon=True)
audio_thread.start()

def generate_groq_response(prompt, memory):
    history = memory.load_memory_variables({})["history"]
    messages = []
    for message in history:
        if isinstance(message, SystemMessage):
            messages.append({"role": "system", "content": message.content})
        elif isinstance(message, HumanMessage):
            messages.append({"role": "user", "content": message.content})
        elif isinstance(message, AIMessage):
            messages.append({"role": "assistant", "content": message.content})
    messages.append({"role": "user", "content": prompt})
    chat_completion = groq_client.chat.completions.create(
        messages=messages,
        model="llama3-70b-8192",
        temperature=0.5,
        max_tokens=4000,
        stream=False
    )
    memory.save_context({"input": prompt}, {"output": chat_completion.choices[0].message.content})
    return chat_completion.choices[0].message.content

def text_to_speech(text):
    try:
        lang = detect(text) if detect(text) != "un" else "en"
        with tempfile.NamedTemporaryFile(suffix=".mp3", delete=False) as temp_audio:
            tts = gTTS(text=text[:500], lang=lang)
            tts.save(temp_audio.name)
            with open(temp_audio.name, 'rb') as f:
                audio_data = f.read()
            os.unlink(temp_audio.name)
            return audio_data
    except Exception as e:
        print(f"TTS error: {str(e)}")
        return None

def generate_pdf(itinerary, destination, trip_details):
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4)
    elements = [
        Paragraph(f"{destination.upper()} TRAVEL ITINERARY", getSampleStyleSheet()['Title']),
        Spacer(1, 12),
        Paragraph(itinerary, getSampleStyleSheet()['Normal'])
    ]
    doc.build(elements)
    buffer.seek(0)
    with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False) as temp_file:
        temp_file.write(buffer.getvalue())
        return temp_file.name

@app.route('/api/itinerary', methods=['POST'])
def create_itinerary():
    try:
        data = request.get_json()
        
        destination = data.get('destination')
        origin = data.get('origin')
        departure_date = data.get('departure_date')
        trip_length = int(data.get('trip_length', 3))
        budget = data.get('budget', 'MEDIUM')
        travelers = int(data.get('travelers', 1))
        interests = data.get('interests', '')
        special_requests = data.get('special_requests', '')

        if not all([destination, origin, departure_date]):
            return jsonify({'error': 'Missing required fields'}), 400

        departure_dt = datetime.strptime(departure_date, '%Y-%m-%d')
        return_date = (departure_dt + timedelta(days=trip_length)).strftime('%Y-%m-%d')

        conversation_state["trip_details"] = {
            "destination": destination,
            "origin": origin,
            "departure_date": departure_date,
            "return_date": return_date,
            "duration": trip_length,
            "budget": budget,
            "travelers": travelers,
            "interests": interests,
            "special_requests": special_requests
        }

        city_code = destination[:3].upper()
        hotels = get_hotels(city_code, budget)
        flights = get_flights(origin, city_code, departure_date, return_date, budget)
        attractions = get_attractions(destination)

        hotels_text = "\n".join([f"- {h['name']} (Rating: {h['rating']})" for h in hotels])
        flights_text = "\n".join([f"- {f['carrier']} at {f['departure']} ({f['price']} {f['currency']})" for f in flights])
        attractions_text = "\n".join([f"- {a['name']} ({a['type']}, Rating: {a['rating']})" for a in attractions])

        prompt = f"""
        Create a detailed {trip_length}-day itinerary for {destination} with:
        - Budget: {budget}
        - Travelers: {travelers}
        - Interests: {interests}
        - Special requests: {special_requests if special_requests else 'None'}
        
        Available Hotels:
        {hotels_text}
        
        Flight Options:
        {flights_text}
        
        Top Attractions:
        {attractions_text}
        
        Provide the itinerary in clear, well-structured format without emojis.
        """

        itinerary = generate_groq_response(prompt, conversation_state["memory"])
        conversation_state["generated_itinerary"] = itinerary
        
        # Generate PDF
        pdf_path = generate_pdf(itinerary, destination, conversation_state["trip_details"])
        conversation_state["pdf_path"] = pdf_path

        # Extract locations with coordinates
        locations = extract_itinerary_locations(itinerary, destination)

        return jsonify({
            'itinerary': itinerary,
            'trip_details': conversation_state["trip_details"],
            'locations': locations
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/itinerary/pdf', methods=['GET'])
def get_itinerary_pdf():
    if not conversation_state["pdf_path"] or not os.path.exists(conversation_state["pdf_path"]):
        return jsonify({'error': 'No PDF available'}), 404
    return send_file(
        conversation_state["pdf_path"],
        mimetype='application/pdf',
        as_attachment=True,
        download_name=f"{conversation_state['trip_details']['destination']}_itinerary.pdf"
    )

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        user_input = data.get('message')
        
        if not user_input:
            return jsonify({'error': 'No message provided'}), 400

        context = f"""
        Current itinerary details:
        Destination: {conversation_state["trip_details"].get("destination", "N/A")}
        Dates: {conversation_state["trip_details"].get("departure_date", "N/A")} to {conversation_state["trip_details"].get("return_date", "N/A")}
        Budget: {conversation_state["trip_details"].get("budget", "N/A")}
        Interests: {conversation_state["trip_details"].get("interests", "N/A")}
        
        User question: {user_input}
        
        Please provide a helpful response considering the current itinerary.
        """

        response = generate_groq_response(context, conversation_state["memory"])
        
        return jsonify({
            'response': response
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/audio', methods=['POST'])
def process_audio():
    try:
        if 'audio' not in request.files:
            return jsonify({'error': 'No audio file provided'}), 400
            
        audio_file = request.files['audio']
        audio_data = audio_file.read()
        audio_queue.put(audio_data)
        
        text = request.form.get('text', 'Thank you for your audio input')
        audio_response = text_to_speech(text)
        
        if audio_response:
            return Response(
                audio_response,
                mimetype='audio/mp3',
                headers={'Content-Disposition': 'attachment; filename=response.mp3'}
            )
        else:
            return jsonify({'error': 'Failed to generate audio response'}), 500
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/speech', methods=['POST'])
def get_speech():
    try:
        data = request.get_json()
        text = data.get('text')
        
        if not text:
            return jsonify({'error': 'No text provided'}), 400
            
        audio_data = text_to_speech(text)
        if audio_data:
            return Response(
                audio_data,
                mimetype='audio/mp3',
                headers={'Content-Disposition': 'attachment; filename=speech.mp3'}
            )
        else:
            return jsonify({'error': 'Failed to generate speech'}), 500
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)












# from flask import Flask, request, Response, send_file, jsonify, session, render_template
# from flask_cors import CORS
# import os
# import json
# from datetime import datetime, timedelta
# import tempfile
# import unicodedata
# from PIL import Image
# import io
# import re
# import threading
# import queue
# import subprocess
# from pydub import AudioSegment
# from gtts import gTTS
# import requests
# from groq import Groq
# from langchain.chains import ConversationChain
# from langchain.memory import ConversationBufferMemory
# from langchain.schema import AIMessage, HumanMessage, SystemMessage
# from langdetect import detect
# from fpdf import FPDF
# import time

# # Initialize Flask app
# app = Flask(__name__)
# CORS(app)

# # API Keys
# AMADEUS_API_KEY = "KcJe1Ef160GbCmAurWO2ieApdYJnUgKG"
# AMADEUS_API_SECRET = "8Axu4TAQGgvWpm0D"
# GOOGLE_API_KEY = "AIzaSyBF_X-pCPrgGDDT_0XK1ObF7lR1MkEsTl0"
# GROQ_API_KEY = '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'
# WEATHERAPI_KEY = "AIzaSyBF_X-pCPrgGDDT_0XK1ObF7lR1MkEsTl0"
# AQI_TOKEN = "AIzaSyBF_X-pCPrgGDDT_0XK1ObF7lR1MkEsTl0"
# UNSPLASH_ACCESS_KEY = "FlKz5N26NpYD6MloqmzV-taJRCAf_zYX5O-EAt-XGn4"

# # Initialize Groq client
# groq_client = Groq(api_key=GROQ_API_KEY)

# # Audio queue for real-time processing
# audio_queue = queue.Queue()
# audio_thread_running = False

# # Initialize session state if not present
# def init_session_state():
#     if 'chat_chain' not in session:
#         session['chat_chain'] = {
#             'client': groq_client,
#             'memory': ConversationBufferMemory()
#         }
#     if 'conversation_history' not in session:
#         session['conversation_history'] = [SystemMessage(content="""
#             You are a professional travel planner assistant with expertise in creating personalized itineraries.
#             When given a city, dates, budget, and interests, generate a highly detailed travel plan that includes:
#             - Day-by-day structure with time slots
#             - Hotel recommendations with Google Maps hyperlinks where available
#             - Attraction visits with Google Maps hyperlinks
#             - Dining suggestions
#             - Transportation tips with route optimization
#             - Estimated costs
#             - Local events with Google Maps hyperlinks where available
#             - Weather, AQI, and time zone considerations
#             - YouTube links for destination highlights
            
#             Important guidelines:
#             1. Use hyperlinks (e.g., <a href='url' target='_blank'>Google Maps</a> or <a href='url' target='_blank'>YouTube</a>) for all place references (hotels, attractions, events, routes) and YouTube videos.
#             2. Always provide links when relevant and available.
#             3. Adjust recommendations based on weather, AQI, and time zone if data is available.
#             4. Include YouTube links for destination highlights using <a href='url' target='_blank'>YouTube</a>.
#             5. Do not use emojis in your responses.
#             6. If weather or other data is unavailable, note it and proceed with the itinerary.
#         """)]
#     if 'itineraries' not in session:
#         session['itineraries'] = []
#     if 'trip_details' not in session:
#         session['trip_details'] = {}
#     if 'travel_chat' not in session:
#         session['travel_chat'] = []
#     if 'pdf_paths' not in session:
#         session['pdf_paths'] = []
#     if 'attractions' not in session:
#         session['attractions'] = []
#     session.modified = True

# # Helper Functions
# def geocode_location(location):
#     url = f"https://maps.googleapis.com/maps/api/geocode/json?address={location}&key={GOOGLE_API_KEY}"
#     try:
#         response = requests.get(url)
#         response.raise_for_status()
#         results = response.json().get('results', [])
#         if not results:
#             print(f"No geocoding results for {location}")
#             return None, None
#         lat = results[0]['geometry']['location']['lat']
#         lon = results[0]['geometry']['location']['lng']
#         return lat, lon
#     except Exception as e:
#         print(f"Couldn't geocode {location}: {str(e)}")
#         return None, None

# def get_unsplash_images(city, count=7):
#     queries = [
#         f"{city} landmarks",
#         f"{city} culture",
#         f"{city} scenery",
#         f"{city} architecture",
#         f"{city} hidden gems",
#         f"{city} landmarks",
#         f"{city} landmarks",
#     ]
#     image_urls = []
#     for query in queries[:count]:
#         url = f"https://api.unsplash.com/search/photos?query={query}&per_page=1&client_id={UNSPLASH_ACCESS_KEY}"
#         try:
#             response = requests.get(url)
#             if response.status_code == 403:
#                 print("Unsplash API rate limit exceeded.")
#                 break
#             response.raise_for_status()
#             results = response.json().get('results', [])
#             if results:
#                 image_urls.append(results[0]['urls']['regular'])
#         except Exception as e:
#             print(f"Couldn't fetch image for {query}: {str(e)}")
#     print(f"Found {len(image_urls)} diverse Unsplash images for '{city}'")
#     return image_urls[:count]

# def get_amadeus_token():
#     url = "https://test.api.amadeus.com/v1/security/oauth2/token"
#     data = {"grant_type": "client_credentials", "client_id": AMADEUS_API_KEY, "client_secret": AMADEUS_API_SECRET}
#     try:
#         response = requests.post(url, data=data)
#         response.raise_for_status()
#         return response.json().get("access_token")
#     except Exception as e:
#         print(f"Failed to get Amadeus token: {str(e)}")
#         return None

# def get_hotels(city_code, budget=500):
#     token = get_amadeus_token()
#     if not token:
#         return []
#     url = f"https://test.api.amadeus.com/v1/reference-data/locations/hotels/by-city?cityCode={city_code}"
#     headers = {"Authorization": f"Bearer {token}"}
#     try:
#         response = requests.get(url, headers=headers)
#         response.raise_for_status()
#         hotels = response.json().get("data", [])
#         hotel_list = []
#         for hotel in hotels[:5]:
#             name = hotel['name']
#             rating = hotel.get('rating', 'N/A')
#             lat, lon = geocode_location(f"{name}, {city_code}")
#             google_url = f"https://www.google.com/maps/search/?api=1&query={lat},{lon}" if lat and lon else ""
#             hotel_list.append({"name": name, "rating": rating, "google_url": google_url})
#         return hotel_list
#     except Exception as e:
#         print(f"Couldn't fetch hotels: {str(e)}")
#         return []

# def get_flights(origin, destination, departure_date, return_date=None, budget=500):
#     token = get_amadeus_token()
#     if not token:
#         return []
#     url = f"https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode={origin}&destinationLocationCode={destination}&departureDate={departure_date}&adults=1"
#     if return_date:
#         url += f"&returnDate={return_date}"
#     headers = {"Authorization": f"Bearer {token}"}
#     try:
#         response = requests.get(url, headers=headers)
#         response.raise_for_status()
#         flights = response.json().get("data", [])
#         flight_details = []
#         for f in flights[:3]:
#             try:
#                 departure = f['itineraries'][0]['segments'][0]['departure']['at']
#                 carrier = f['itineraries'][0]['segments'][0]['carrierCode']
#                 price = float(f['price']['total'])
#                 if price <= budget:
#                     flight_details.append({
#                         "carrier": carrier,
#                         "departure": departure,
#                         "price": price,
#                         "currency": f['price']['currency']
#                     })
#             except (KeyError, IndexError):
#                 continue
#         return flight_details
#     except Exception as e:
#         print(f"Couldn't fetch flights: {str(e)}")
#         return []

# def get_attractions(city):
#     search_url = f"https://maps.googleapis.com/maps/api/place/textsearch/json?query=top+attractions+in+{city}&key={GOOGLE_API_KEY}"
#     try:
#         search_response = requests.get(search_url)
#         search_response.raise_for_status()
#         results = search_response.json().get("results", [])
#         attractions = []
#         for place in results[:8]:
#             try:
#                 place_id = place['place_id']
#                 details_url = f"https://maps.googleapis.com/maps/api/place/details/json?place_id={place_id}&fields=name,rating,formatted_address,photos,website,url,types&key={GOOGLE_API_KEY}"
#                 details_response = requests.get(details_url)
#                 details_response.raise_for_status()
#                 details = details_response.json().get('result', {})
#                 photo_url = None
#                 if 'photos' in details and details['photos']:
#                     photo_ref = details['photos'][0]['photo_reference']
#                     photo_url = f"https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference={photo_ref}&key={GOOGLE_API_KEY}"
#                 attractions.append({
#                     "name": details.get("name", place.get("name", "N/A")),
#                     "rating": details.get("rating", "N/A"),
#                     "address": details.get("formatted_address", "N/A"),
#                     "type": details.get("types", ["attraction"])[0].replace("_", " ").title(),
#                     "website": details.get("website", ""),
#                     "google_url": details.get("url", ""),
#                     "photo_url": photo_url
#                 })
#             except Exception as e:
#                 print(f"Couldn't fetch details for attraction: {str(e)}")
#                 continue
#         return attractions
#     except Exception as e:
#         print(f"Couldn't fetch attractions: {str(e)}")
#         return []

# def get_events(city, start_date, end_date):
#     query = f"event venues in {city}"
#     search_url = f"https://maps.googleapis.com/maps/api/place/textsearch/json?query={query}&key={GOOGLE_API_KEY}"
#     try:
#         search_response = requests.get(search_url)
#         search_response.raise_for_status()
#         venues = search_response.json().get("results", [])[:5]
#         events = []
#         for venue in venues:
#             try:
#                 place_id = venue['place_id']
#                 details_url = f"https://maps.googleapis.com/maps/api/place/details/json?place_id={place_id}&fields=name,formatted_address,url,photos,website&key={GOOGLE_API_KEY}"
#                 details_response = requests.get(details_url)
#                 details_response.raise_for_status()
#                 details = details_response.json().get('result', {})
#                 event_date = start_date + timedelta(days=len(events))
#                 name = details.get('name', 'Local Venue')
#                 lat, lon = geocode_location(f"{name}, {city}")
#                 google_url = f"https://www.google.com/maps/search/?api=1&query={lat},{lon}" if lat and lon else ""
#                 events.append({
#                     "name": f"Event at {name}",
#                     "date": event_date.strftime("%Y-%m-%d"),
#                     "venue": name,
#                     "url": details.get('website', details.get('url', '')),
#                     "address": details.get('formatted_address', ''),
#                     "google_url": google_url
#                 })
#                 if len(events) >= 3:
#                     break
#             except Exception as e:
#                 print(f"Couldn't process venue: {str(e)}")
#                 continue
#         return events
#     except Exception as e:
#         print(f"Couldn't fetch events: {str(e)}")
#         return []

# def get_weather_forecast(city, start_date, end_date):
#     lat, lon = geocode_location(city)
#     if not lat or not lon:
#         return None
#     try:
#         weather_url = f"https://api.weatherapi.com/v1/forecast.json?key={WEATHERAPI_KEY}&q={lat},{lon}&days=10"
#         weather_response = requests.get(weather_url)
#         weather_response.raise_for_status()
#         weather_data = weather_response.json().get('forecast', {}).get('forecastday', [])
#         if not weather_data:
#             print(f"No weather data available for {city}")
#             return None
#         trip_forecasts = []
#         current_date = start_date
#         while current_date <= end_date:
#             date_str = current_date.strftime("%Y-%m-%d")
#             daily_forecast = next((f for f in weather_data if f['date'] == date_str), None)
#             if daily_forecast:
#                 trip_forecasts.append({
#                     "date": date_str,
#                     "temp": daily_forecast['day']['avgtemp_c'],
#                     "description": daily_forecast['day']['condition']['text'],
#                     "icon": daily_forecast['day']['condition']['icon'].split('/')[-1],
#                     "humidity": daily_forecast['day']['avghumidity'],
#                     "wind_speed": daily_forecast['day']['maxwind_kph'] / 3.6
#                 })
#             current_date += timedelta(days=1)
#         return trip_forecasts
#     except Exception as e:
#         print(f"Couldn't fetch weather: {str(e)}")
#         return None

# def get_aqi(city):
#     lat, lon = geocode_location(city)
#     if not lat or not lon:
#         return 'N/A'
#     try:
#         aqi_url = f"https://api.waqi.info/feed/geo:{lat};{lon}/?token={AQI_TOKEN}"
#         aqi_response = requests.get(aqi_url)
#         aqi_response.raise_for_status()
#         return aqi_response.json().get('data', {}).get('aqi', 'N/A')
#     except Exception as e:
#         print(f"Couldn't fetch AQI: {str(e)}")
#         return 'N/A'

# def get_route(origin, destination):
#     url = f"https://maps.googleapis.com/maps/api/directions/json?origin={origin}&destination={destination}&key={GOOGLE_API_KEY}"
#     try:
#         response = requests.get(url)
#         response.raise_for_status()
#         routes = response.json().get('routes', [])
#         if not routes:
#             return {"distance": "N/A", "duration": "N/A", "url": ""}
#         route = routes[0]['legs'][0]
#         return {
#             "distance": route['distance']['text'],
#             "duration": route['duration']['text'],
#             "url": f"https://www.google.com/maps/dir/?api=1&origin={origin}&destination={destination}"
#         }
#     except Exception as e:
#         print(f"Couldn't fetch route: {str(e)}")
#         return {"distance": "N/A", "duration": "N/A", "url": ""}

# def get_time_zone(city):
#     lat, lon = geocode_location(city)
#     if not lat or not lon:
#         return 'N/A'
#     try:
#         timestamp = int(time.time())
#         url = f"https://maps.googleapis.com/maps/api/timezone/json?location={lat},{lon}×tamp={timestamp}&key={GOOGLE_API_KEY}"
#         response = requests.get(url)
#         response.raise_for_status()
#         return response.json().get('timeZoneName', 'N/A')
#     except Exception as e:
#         print(f"Couldn't fetch time zone: {str(e)}")
#         return 'N/A'

# def get_youtube_links(query):
#     url = f"https://www.googleapis.com/youtube/v3/search?part=snippet&q={query}&type=video&maxResults=1&key={GOOGLE_API_KEY}"
#     try:
#         response = requests.get(url)
#         response.raise_for_status()
#         items = response.json().get('items', [])
#         if not items:
#             return ""
#         video_id = items[0]['id']['videoId']
#         return f"https://www.youtube.com/watch?v={video_id}"
#     except Exception as e:
#         print(f"Couldn't fetch YouTube link: {str(e)}")
#         return ""

# def generate_pdf(itinerary, destination, trip_details, attractions, itinerary_number=1):
#     class UnicodePDF(FPDF):
#         def header(self):
#             self.set_font("Arial", "B", 20)
#             self.set_text_color(0, 0, 0)
#             self.set_xy(10, 10)
#             self.cell(0, 10, f"Travel Itinerary {itinerary_number}: {destination}", 0, 1, "C")

#         def footer(self):
#             self.set_y(-15)
#             self.set_font("Arial", "I", 8)
#             self.set_text_color(100, 100, 100)
#             self.cell(0, 10, f"Page {self.page_no()} | Generated by AI Travel Planner on {datetime.now().strftime('%Y-%m-%d')}", 0, 0, "C")

#     pdf = UnicodePDF()
#     pdf.set_auto_page_break(auto=True, margin=15)
    
#     city_images = get_unsplash_images(destination, count=5)
    
#     if city_images:
#         pdf.add_page()
#         try:
#             response = requests.get(city_images[0], timeout=10)
#             img = Image.open(io.BytesIO(response.content))
#             img_path = os.path.join(tempfile.gettempdir(), f"cover_{destination}_{itinerary_number}.jpg")
#             img.save(img_path)
#             pdf.image(img_path, x=(210-190)/2, y=30, w=190)
#             pdf.set_font("Arial", "I", 12)
#             pdf.set_xy(10, 100)
#             pdf.set_text_color(0, 51, 102)
#             pdf.cell(0, 10, "A Journey Awaits", 0, 1, "C")
#             os.remove(img_path)
#         except Exception as e:
#             print(f"Failed to add cover image: {str(e)}")
#     else:
#         pdf.add_page()

#     pdf.add_page()
#     pdf.set_fill_color(245, 247, 250)
#     pdf.rect(0, 0, 210, 297, 'F')
#     pdf.set_font("Arial", "B", 16)
#     pdf.set_text_color(0, 51, 102)
#     pdf.cell(0, 10, "Trip Overview", 0, 1, "L")
#     pdf.ln(5)
#     pdf.set_font("Arial", "", 11)
#     pdf.set_text_color(0, 0, 0)
#     pdf.cell(0, 8, f"Duration: {trip_details['duration']} days", 0, 1)
#     pdf.cell(0, 8, f"Dates: {trip_details['departure_date']} to {trip_details['return_date']}", 0, 1)
#     pdf.cell(0, 8, f"Budget: ${trip_details['budget']}", 0, 1)
#     pdf.cell(0, 8, f"Interests: {trip_details['interests']}", 0, 1)
    
#     if trip_details.get('weather'):
#         pdf.ln(10)
#         pdf.set_font("Arial", "B", 14)
#         pdf.cell(0, 10, "Weather Forecast", 0, 1)
#         pdf.set_font("Arial", "", 10)
#         for day in trip_details['weather']:
#             pdf.cell(50, 6, day['date'], border=1)
#             pdf.cell(100, 6, f"{day['description'].title()}, {day['temp']}°C", border=1)
#             pdf.ln(6)

#     if attractions:
#         pdf.add_page()
#         pdf.set_fill_color(245, 247, 250)
#         pdf.rect(0, 0, 210, 297, 'F')
#         pdf.set_font("Arial", "B", 16)
#         pdf.set_text_color(0, 51, 102)
#         pdf.cell(0, 10, "Recommended Attractions", 0, 1)
#         pdf.ln(5)
#         for attraction in attractions[:5]:
#             pdf.set_font("Arial", "B", 12)
#             pdf.cell(0, 8, attraction['name'], 0, 1)
#             pdf.set_font("Arial", "", 10)
#             pdf.cell(0, 6, f"Type: {attraction['type']} | Rating: {attraction['rating']}", 0, 1)
#             pdf.cell(0, 6, f"Address: {attraction['address']}", 0, 1)
#             if attraction.get('google_url'):
#                 pdf.set_text_color(0, 0, 255)
#                 pdf.set_font("Arial", "U", 10)
#                 pdf.cell(0, 6, "Google Maps", ln=1, link=attraction['google_url'])
#                 pdf.set_text_color(0, 0, 0)
#                 pdf.set_font("Arial", "", 10)
#             pdf.ln(8)

#     pdf.add_page()
#     pdf.set_fill_color(245, 247, 250)
#     pdf.rect(0, 0, 210, 297, 'F')
#     pdf.set_font("Arial", "B", 16)
#     pdf.set_text_color(0, 51, 102)
#     pdf.cell(0, 10, f"Your Personalized Itinerary {itinerary_number}", 0, 1)
#     pdf.ln(5)
    
#     clean_itinerary = unicodedata.normalize('NFKD', itinerary).encode('ascii', 'ignore').decode('ascii')
#     paragraphs = clean_itinerary.split('\n\n')
#     image_index = 1

#     for para in paragraphs:
#         if not para.strip():
#             continue
#         lines = para.strip().split('\n')
#         if lines and "Day" in lines[0]:
#             day_title = re.sub(r'\*\*(.*?)\*\*', r'\1', lines[0]).strip()
#             pdf.set_font("Arial", "B", 13)
#             pdf.set_text_color(0, 51, 102)
#             pdf.cell(0, 10, day_title, 0, 1)
#             if image_index < len(city_images) and pdf.get_y() + 60 < pdf.h - 15:
#                 try:
#                     response = requests.get(city_images[image_index])
#                     img = Image.open(io.BytesIO(response.content))
#                     img_path = os.path.join(tempfile.gettempdir(), f"day_{image_index}_{itinerary_number}.jpg")
#                     img.save(img_path)
#                     pdf.image(img_path, x=(210-60)/2, w=60, h=60)
#                     pdf.set_font("Arial", "I", 8)
#                     pdf.cell(0, 5, f"Scene {image_index}: {destination}", 0, 1, "C")
#                     os.remove(img_path)
#                     image_index += 1
#                 except Exception as e:
#                     print(f"Failed to add image {image_index}: {str(e)}")
#             pdf.ln(5)
#             lines = lines[1:]
        
#         pdf.set_font("Arial", "", 11)
#         pdf.set_text_color(0, 0, 0)
#         for line in lines:
#             line = re.sub(r'\*\*(.*?)\*\*', r'\1', line).strip()
#             if '<a href="' in line:
#                 parts = line.split('<a href="')
#                 for i, part in enumerate(parts):
#                     if i == 0:
#                         pdf.multi_cell(0, 8, part, 0, 0)
#                     else:
#                         url, rest = part.split('">')
#                         text, remainder = rest.split('</a>')
#                         pdf.set_text_color(0, 0, 255)
#                         pdf.set_font("Arial", "U", 11)
#                         pdf.multi_cell(0, 8, text, 0, 0, link=url)
#                         pdf.set_text_color(0, 0, 0)
#                         pdf.set_font("Arial", "", 11)
#                         pdf.multi_cell(0, 8, remainder, 0, 0)
#                 pdf.ln(8)
#             elif line.startswith("- "):
#                 pdf.multi_cell(0, 8, f"• {line.lstrip('- ').strip()}", 0, 1)
#             else:
#                 pdf.multi_cell(0, 8, line.strip(), 0, 1)
#         pdf.ln(5)

#     with tempfile.NamedTemporaryFile(delete=False, suffix=f"_itinerary_{itinerary_number}.pdf") as temp_file:
#         pdf_path = temp_file.name
#         pdf.output(pdf_path)
#     return pdf_path

# def generate_groq_response(prompt, memory):
#     history = memory.load_memory_variables({})["history"]
#     messages = []
#     for message in history:
#         if isinstance(message, SystemMessage):
#             messages.append({"role": "system", "content": message.content})
#         elif isinstance(message, HumanMessage):
#             messages.append({"role": "user", "content": message.content})
#         elif isinstance(message, AIMessage):
#             messages.append({"role": "assistant", "content": message.content})
#     messages.append({"role": "user", "content": prompt})
    
#     try:
#         chat_completion = groq_client.chat.completions.create(
#             messages=messages,
#             model="llama3-70b-8192",
#             temperature=0.5,
#             max_tokens=4000,
#             stream=False
#         )
#         memory.save_context({"input": prompt}, {"output": chat_completion.choices[0].message.content})
#         return chat_completion.choices[0].message.content
#     except Exception as e:
#         print(f"Couldn't generate response: {str(e)}")
#         return "Sorry, I couldn't generate a response at this time."

# def text_to_speech(text):
#     try:
#         lang = detect(text) if detect(text) != "un" else "en"
#         with tempfile.NamedTemporaryFile(suffix=".mp3", delete=False) as temp_audio:
#             tts = gTTS(text=text[:500], lang=lang)
#             tts.save(temp_audio.name)
#             audio = AudioSegment.from_file(temp_audio.name)
#             audio_data = audio.raw_data
#             os.unlink(temp_audio.name)
#             return audio_data
#     except Exception as e:
#         print(f"TTS error: {str(e)}")
#         return None

# def process_audio_stream():
#     global audio_thread_running
#     audio_thread_running = True
#     while audio_thread_running:
#         try:
#             audio_data = audio_queue.get(timeout=1)
#             if audio_data is None:
#                 break
#             # Convert to WAV using ffmpeg for real-time processing
#             with tempfile.NamedTemporaryFile(suffix='.mp3', delete=False) as temp_mp3:
#                 temp_mp3.write(audio_data)
#                 temp_mp3.flush()
#                 with tempfile.NamedTemporaryFile(suffix='.wav', delete=False) as temp_wav:
#                     subprocess.run(['ffmpeg', '-i', temp_mp3.name, temp_wav.name, '-y', '-loglevel', 'quiet'], check=True)
#                     audio_segment = AudioSegment.from_file(temp_wav.name)
#                     # Real-time playback (simplified; use a streaming library like pyAudio for production)
#                     audio_segment.export(temp_wav.name, format="wav")
#                     os.unlink(temp_mp3.name)
#                     os.unlink(temp_wav.name)
#         except queue.Empty:
#             continue
#         except Exception as e:
#             print(f"Audio processing error: {str(e)}")
#     audio_thread_running = False

# # Start audio thread
# if not audio_thread_running:
#     audio_thread = threading.Thread(target=process_audio_stream, daemon=True)
#     audio_thread.start()

# # Extract coordinates from itinerary
# def extract_itinerary_locations(itinerary_text, destination):
#     itinerary_locations = []
#     days = re.split(r'Day \d+:', itinerary_text)
#     for day_num, day_content in enumerate(days[1:], start=1):
#         lines = day_content.split('\n')
#         for line in lines:
#             line = line.strip()
#             if not line or line.startswith(('Hotel recommendations:', 'Transportation tips:', 'Estimated costs:')):
#                 continue
#             match = re.match(r'(?:\d{1,2}:\d{2}\s*(?:AM|PM|am|pm)?\s*-\s*)?(.*?)(?:\s*\((\w+)\))?$', line)
#             if match:
#                 name = match.group(1).strip()
#                 place_type = match.group(2) if match.group(2) else "attraction"
#                 if "hotel" in name.lower() or "inn" in name.lower() or "resort" in name.lower():
#                     place_type = "hotel"
#                 elif "restaurant" in name.lower() or "cafe" in name.lower() or "dining" in name.lower():
#                     place_type = "restaurant"
#                 lat, lng = geocode_location(f"{name}, {destination}")
#                 if lat and lng:
#                     itinerary_locations.append({
#                         "day": day_num,
#                         "name": name,
#                         "type": place_type,
#                         "lat": lat,
#                         "lng": lng
#                     })
#     # Print coordinates in JavaScript array format
#     if itinerary_locations:
#         js_array = "const demoItinerary = [\n"
#         for loc in itinerary_locations:
#             js_array += f"  {{ day: {loc['day']}, name: \"{loc['name']}\", type: \"{loc['type']}\", lat: {loc['lat']}, lng: {loc['lng']} }},\n"
#         js_array += "];"
#         print(js_array)
#     return itinerary_locations

# # Routes
# @app.route('/')
# def index():
#     init_session_state()
#     return render_template('index.html')

# @app.route('/api/itinerary', methods=['POST'])
# def create_itinerary():
#     init_session_state()
#     try:
#         data = request.get_json()
#         destination = data.get('destination')
#         origin = data.get('origin')
#         departure_date = data.get('departure_date')
#         trip_length = int(data.get('trip_length', 3))
#         budget = data.get('budget', 500)
#         travelers = int(data.get('travelers', 1))
#         interests = data.get('interests', '')
#         special_requests = data.get('special_requests', '')

#         if not all([destination, origin, departure_date]):
#             return jsonify({'error': 'Missing required fields'}), 400

#         departure_dt = datetime.strptime(departure_date, '%Y-%m-%d')
#         return_date = (departure_dt + timedelta(days=trip_length)).strftime('%Y-%m-%d')

#         session['trip_details'] = {
#             "destination": destination,
#             "origin": origin,
#             "departure_date": departure_date,
#             "return_date": return_date,
#             "duration": trip_length,
#             "budget": budget,
#             "travelers": travelers,
#             "interests": interests,
#             "special_requests": special_requests,
#             "weather": get_weather_forecast(destination, departure_dt, departure_dt + timedelta(days=trip_length)),
#             "aqi": get_aqi(destination),
#             "route": get_route(origin, destination),
#             "time_zone": get_time_zone(destination),
#             "youtube_link": get_youtube_links(f"{destination} travel highlights")
#         }

#         city_code = destination[:3].upper()
#         hotels = get_hotels(city_code, budget)
#         flights = get_flights(origin, city_code, departure_date, return_date, budget)
#         attractions = get_attractions(destination)
#         events = get_events(destination, departure_dt, departure_dt + timedelta(days=trip_length))
#         session['attractions'] = attractions

#         hotels_text = "\n".join([f"- {h['name']} (Rating: {h['rating']}) <a href='{h['google_url']}' target='_blank'>Google Maps</a>" if h['google_url'] else f"- {h['name']} (Rating: {h['rating']})" for h in hotels]) if hotels else "No hotels found"
#         flights_text = "\n".join([f"- {f['carrier']} at {f['departure']} ({f['price']} {f['currency']})" for f in flights]) if flights else "No flights found"
#         attractions_text = "\n".join([f"- {a['name']} ({a['type']}, Rating: {a['rating']}) <a href='{a['google_url']}' target='_blank'>Google Maps</a>" if a['google_url'] else f"- {a['name']} ({a['type']}, Rating: {a['rating']})" for a in attractions]) if attractions else "No attractions found"
#         events_text = "\n".join([f"- {e['name']} at {e['venue']} on {e['date']} <a href='{e['google_url']}' target='_blank'>Google Maps</a>" if e['google_url'] else f"- {e['name']} at {e['venue']} on {e['date']}" for e in events]) if events else "No events found"
#         weather_text = "\n".join([f"- {w['date']}: {w['description']}, {w['temp']}°C" for w in session['trip_details']['weather']]) if session['trip_details'].get('weather') else "Weather data not available"
#         youtube_text = f"<a href='{session['trip_details']['youtube_link']}' target='_blank'>YouTube</a>" if session['trip_details']['youtube_link'] else "No YouTube link available"
#         route_text = f"{session['trip_details']['route']['distance']} in {session['trip_details']['route']['duration']} <a href='{session['trip_details']['route']['url']}' target='_blank'>Route</a>" if session['trip_details']['route']['url'] else f"{session['trip_details']['route']['distance']} in {session['trip_details']['route']['duration']}"

#         prompt_base = f"""
#         Create a detailed {trip_length}-day itinerary for {destination} with:
#         - Budget: ${budget}
#         - Travelers: {travelers}
#         - Interests: {interests}
#         - Special requests: {special_requests if special_requests else 'None'}
        
#         Available Hotels:
#         {hotels_text}
        
#         Flight Options:
#         {flights_text}
        
#         Top Attractions:
#         {attractions_text}
        
#         Local Events During Stay:
#         {events_text}
        
#         Weather Forecast:
#         {weather_text}
        
#         AQI: {session['trip_details']['aqi']}
#         Route: {route_text}
#         Time Zone: {session['trip_details']['time_zone']}
#         YouTube Highlight: {youtube_text}
        
#         Important Instructions:
#         1. Structure the itinerary day-by-day with time slots
#         2. Include weather-appropriate activities if weather data is available
#         3. Suggest relevant events from the events list
#         4. Recommend restaurants based on budget and interests
#         5. Include transportation tips with <a href='url' target='_blank'>Google Maps</a> hyperlinks
#         6. Provide estimated costs where possible
#         7. Adjust activities based on weather, AQI, and time zone if data is available
#         8. Include the YouTube link provided above using <a href='url' target='_blank'>YouTube</a>
#         9. Use hyperlinks (<a href='url' target='_blank'>Google Maps</a> or <a href='url' target='_blank'>YouTube</a>) for all place references (hotels, attractions, events, routes) and YouTube videos
#         10. Always provide links when relevant and available
#         """

#         itineraries = []
#         pdf_paths = []
#         for i in range(3):
#             variation_prompt = prompt_base + f"\n\nGenerate a unique itinerary (Option {i+1}) with a different focus or style (e.g., relaxed pace, adventure-focused, or budget-optimized)."
#             response = generate_groq_response(variation_prompt, session['chat_chain']['memory'])
#             itineraries.append(response)
#             pdf_path = generate_pdf(response, destination, session['trip_details'], attractions, itinerary_number=i+1)
#             pdf_paths.append(pdf_path)

#         session['itineraries'] = itineraries
#         session['pdf_paths'] = pdf_paths
#         session['travel_chat'].append({
#             "role": "assistant",
#             "content": f"I've created three unique {trip_length}-day itineraries for {destination}. Check them out below!"
#         })

#         # Extract and print coordinates
#         locations = []
#         for itinerary in itineraries:
#             locs = extract_itinerary_locations(itinerary, destination)
#             locations.extend(locs)

#         return jsonify({
#             'itineraries': itineraries,
#             'trip_details': session['trip_details'],
#             'pdf_paths': pdf_paths,
#             'locations': locations,
#             'chat': session['travel_chat']
#         })

#     except Exception as e:
#         return jsonify({'error': str(e)}), 500

# @app.route('/api/itinerary/pdf/<int:itinerary_number>', methods=['GET'])
# def get_itinerary_pdf(itinerary_number):
#     init_session_state()
#     if not session['pdf_paths'] or itinerary_number < 1 or itinerary_number > len(session['pdf_paths']):
#         return jsonify({'error': 'No PDF available'}), 404
#     pdf_path = session['pdf_paths'][itinerary_number - 1]
#     if not os.path.exists(pdf_path):
#         return jsonify({'error': 'PDF file not found'}), 404
#     return send_file(
#         pdf_path,
#         mimetype='application/pdf',
#         as_attachment=True,
#         download_name=f"{session['trip_details']['destination'].replace(' ', '_')}_itinerary_option_{itinerary_number}.pdf"
#     )

# @app.route('/api/chat', methods=['POST'])
# def chat():
#     init_session_state()
#     try:
#         data = request.get_json()
#         user_input = data.get('message')
#         if not user_input:
#             return jsonify({'error': 'No message provided'}), 400

#         weather_str = ", ".join([f"{w['date']}: {w['description']}, {w['temp']}°C" for w in session['trip_details'].get('weather', [])]) if session['trip_details'].get('weather') else "Weather data not available"
#         context = f"""
#         Current itinerary details:
#         Destination: {session['trip_details'].get('destination', 'N/A')}
#         Dates: {session['trip_details'].get('departure_date', 'N/A')} to {session['trip_details'].get('return_date', 'N/A')}
#         Budget: ${session['trip_details'].get('budget', 'N/A')}
#         Interests: {session['trip_details'].get('interests', 'N/A')}
#         Special Requests: {session['trip_details'].get('special_requests', 'None')}
#         Weather: {weather_str}
#         AQI: {session['trip_details'].get('aqi', 'N/A')}
#         Route: {session['trip_details']['route']['distance']} in {session['trip_details']['route']['duration']}
#         Time Zone: {session['trip_details'].get('time_zone', 'N/A')}

#         User question/request: {user_input}
#         Please provide a helpful response considering all above details.
#         Use hyperlinks (<a href='url' target='_blank'>Google Maps</a> or <a href='url' target='_blank'>YouTube</a>) for all place references and YouTube videos.
#         """

#         response = generate_groq_response(context, session['chat_chain']['memory'])
#         session['travel_chat'].append({"role": "user", "content": user_input})
#         session['travel_chat'].append({"role": "assistant", "content": response})
#         session.modified = True

#         return jsonify({
#             'response': response,
#             'chat_history': session['travel_chat']
#         })

#     except Exception as e:
#         return jsonify({'error': str(e)}), 500

# @app.route('/api/audio', methods=['POST'])
# def process_audio():
#     init_session_state()
#     try:
#         if 'audio' not in request.files:
#             return jsonify({'error': 'No audio file provided'}), 400
#         audio_file = request.files['audio']
#         audio_data = audio_file.read()
#         audio_queue.put(audio_data)
        
#         text = request.form.get('text', 'Thank you for your audio input')
#         audio_response = text_to_speech(text)
#         if audio_response:
#             return Response(
#                 audio_response,
#                 mimetype='audio/mp3',
#                 headers={'Content-Disposition': 'attachment; filename=response.mp3'}
#             )
#         else:
#             return jsonify({'error': 'Failed to generate audio response'}), 500
#     except Exception as e:
#         return jsonify({'error': str(e)}), 500

# @app.route('/api/speech', methods=['POST'])
# def get_speech():
#     init_session_state()
#     try:
#         data = request.get_json()
#         text = data.get('text')
#         if not text:
#             return jsonify({'error': 'No text provided'}), 400
#         audio_data = text_to_speech(text)
#         if audio_data:
#             return Response(
#                 audio_data,
#                 mimetype='audio/mp3',
#                 headers={'Content-Disposition': 'attachment; filename=speech.mp3'}
#             )
#         else:
#             return jsonify({'error': 'Failed to generate speech'}), 500
#     except Exception as e:
#         return jsonify({'error': str(e)}), 500

# if __name__ == '__main__':
#     app.run(debug=True, port=5000)