from flask import Flask, render_template, request, jsonify, send_file, session
from flask_cors import CORS
from gtts import gTTS
import speech_recognition as sr
import os
import time
import pygame
from groq import Groq
from langchain.chains import ConversationChain
from langchain.memory import ConversationBufferMemory
from langchain.schema import AIMessage, HumanMessage, SystemMessage
from langdetect import detect
import requests
import json
from fpdf import FPDF
from datetime import datetime, timedelta
import tempfile
import unicodedata
from PIL import Image
import io
import re
import uuid

app = Flask(__name__, static_folder='static', static_url_path='/static')
CORS(app, supports_credentials=True)  # Enable CORS for all routes with credentials
app.secret_key = 'your_secret_key_here'  # Replace with a secure secret key

# ==== Step 1: API KEYS ====
AMADEUS_API_KEY = "KcJe1Ef160GbCmAurWO2ieApdYJnUgKG"
AMADEUS_API_SECRET = "8Axu4TAQGgvWpm0D"
GOOGLE_API_KEY = "AIzaSyBF_X-pCPrgGDDT_0XK1ObF7lR1MkEsTl0"
GROQ_API_KEY = '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'
WEATHERAPI_KEY = "AIzaSyBF_X-pCPrgGDDT_0XK1ObF7lR1MkEsTl0"
AQI_TOKEN = "AIzaSyBF_X-pCPrgGDDT_0XK1ObF7lR1MkEsTl0"
UNSPLASH_ACCESS_KEY = "FlKz5N26NpYD6MloqmzV-taJRCAf_zYX5O-EAt-XGn4"

# Initialize Groq client
groq_client = Groq(api_key=GROQ_API_KEY)

# ==== Helper: Geocode a location ====
def geocode_location(location):
    url = f"https://maps.googleapis.com/maps/api/geocode/json?address={location}&key={GOOGLE_API_KEY}"
    try:
        response = requests.get(url)
        response.raise_for_status()
        results = response.json().get('results', [])
        if not results:
            print(f"No geocoding results for {location}")
            return None, None
        lat = results[0]['geometry']['location']['lat']
        lon = results[0]['geometry']['location']['lng']
        return lat, lon
    except Exception as e:
        print(f"Couldn't geocode {location}: {str(e)}")
        return None, None

# ==== Helper: Fetch diverse images from Unsplash ====
def get_unsplash_images(city, count=7):
    queries = [
        f"{city} landmarks",
        f"{city} culture",
        f"{city} scenery",
        f"{city} architecture",
        f"{city} hidden gems",
        f"{city} landmarks",
        f"{city} landmarks",
    ]
    image_urls = []
    for query in queries[:count]:
        url = f"https://api.unsplash.com/search/photos?query={query}&per_page=1&client_id={UNSPLASH_ACCESS_KEY}"
        try:
            response = requests.get(url)
            if response.status_code == 403:
                print("Unsplash API rate limit exceeded.")
                break
            response.raise_for_status()
            results = response.json().get('results', [])
            if results:
                image_urls.append(results[0]['urls']['regular'])
        except Exception as e:
            print(f"Couldn't fetch image for {query}: {str(e)}")
    print(f"Found {len(image_urls)} diverse Unsplash images for '{city}'")
    return image_urls[:count]

# ==== Step 2: Initialize Amadeus token ====
def get_amadeus_token():
    url = "https://test.api.amadeus.com/v1/security/oauth2/token"
    data = {"grant_type": "client_credentials", "client_id": AMADEUS_API_KEY, "client_secret": AMADEUS_API_SECRET}
    try:
        response = requests.post(url, data=data)
        response.raise_for_status()
        return response.json().get("access_token")
    except Exception as e:
        print(f"Failed to get Amadeus token: {str(e)}")
        return None

# ==== Step 3: Fetch hotels by budget ====
def get_hotels(city_code, budget=500):
    token = get_amadeus_token()
    if not token:
        return []
    url = f"https://test.api.amadeus.com/v1/reference-data/locations/hotels/by-city?cityCode={city_code}"
    headers = {"Authorization": f"Bearer {token}"}
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        hotels = response.json().get("data", [])
        hotel_list = []
        for hotel in hotels[:5]:
            name = hotel['name']
            rating = hotel.get('rating', 'N/A')
            lat, lon = geocode_location(f"{name}, {city_code}")
            google_url = f"https://www.google.com/maps/search/?api=1&query={lat},{lon}" if lat and lon else ""
            hotel_list.append({"name": name, "rating": rating, "google_url": google_url})
        return hotel_list
    except Exception as e:
        print(f"Couldn't fetch hotels: {str(e)}")
        return []

# ==== Step 4: Fetch flights ====
def get_flights(origin, destination, departure_date, return_date=None, budget=500):
    token = get_amadeus_token()
    if not token:
        return []
    url = f"https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode={origin}&destinationLocationCode={destination}&departureDate={departure_date}&adults=1"
    if return_date:
        url += f"&returnDate={return_date}"
    headers = {"Authorization": f"Bearer {token}"}
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        flights = response.json().get("data", [])
        flight_details = []
        for f in flights[:3]:
            try:
                departure = f['itineraries'][0]['segments'][0]['departure']['at']
                carrier = f['itineraries'][0]['segments'][0]['carrierCode']
                price = float(f['price']['total'])
                if price <= budget:
                    flight_details.append({
                        "carrier": carrier,
                        "departure": departure,
                        "price": price,
                        "currency": f['price']['currency']
                    })
            except (KeyError, IndexError):
                continue
        return flight_details
    except Exception as e:
        print(f"Couldn't fetch flights: {str(e)}")
        return []

# ==== Step 5: Fetch attractions with Google Places ====
def get_attractions(city):
    search_url = f"https://maps.googleapis.com/maps/api/place/textsearch/json?query=top+attractions+in+{city}&key={GOOGLE_API_KEY}"
    try:
        search_response = requests.get(search_url)
        search_response.raise_for_status()
        results = search_response.json().get("results", [])
        attractions = []
        for place in results[:8]:
            try:
                place_id = place['place_id']
                details_url = f"https://maps.googleapis.com/maps/api/place/details/json?place_id={place_id}&fields=name,rating,formatted_address,photos,website,url,types&key={GOOGLE_API_KEY}"
                details_response = requests.get(details_url)
                details_response.raise_for_status()
                details = details_response.json().get('result', {})
                photo_url = None
                if 'photos' in details and details['photos']:
                    photo_ref = details['photos'][0]['photo_reference']
                    photo_url = f"https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference={photo_ref}&key={GOOGLE_API_KEY}"
                attractions.append({
                    "name": details.get("name", place.get("name", "N/A")),
                    "rating": details.get("rating", "N/A"),
                    "address": details.get("formatted_address", "N/A"),
                    "type": details.get("types", ["attraction"])[0].replace("_", " ").title(),
                    "website": details.get("website", ""),
                    "google_url": details.get("url", ""),
                    "photo_url": photo_url
                })
            except Exception as e:
                print(f"Couldn't fetch details for attraction: {str(e)}")
                continue
        return attractions
    except Exception as e:
        print(f"Couldn't fetch attractions: {str(e)}")
        return []

# ==== Step 6: Fetch events using Google Places ====
def get_events(city, start_date, end_date):
    query = f"event venues in {city}"
    search_url = f"https://maps.googleapis.com/maps/api/place/textsearch/json?query={query}&key={GOOGLE_API_KEY}"
    try:
        search_response = requests.get(search_url)
        search_response.raise_for_status()
        venues = search_response.json().get("results", [])[:5]
        events = []
        for venue in venues:
            try:
                place_id = venue['place_id']
                details_url = f"https://maps.googleapis.com/maps/api/place/details/json?place_id={place_id}&fields=name,formatted_address,url,photos,website&key={GOOGLE_API_KEY}"
                details_response = requests.get(details_url)
                details_response.raise_for_status()
                details = details_response.json().get('result', {})
                event_date = start_date + timedelta(days=len(events))
                name = details.get('name', 'Local Venue')
                lat, lon = geocode_location(f"{name}, {city}")
                google_url = f"https://www.google.com/maps/search/?api=1&query={lat},{lon}" if lat and lon else ""
                events.append({
                    "name": f"Event at {name}",
                    "date": event_date.strftime("%Y-%m-%d"),
                    "venue": name,
                    "url": details.get('website', details.get('url', '')),
                    "address": details.get('formatted_address', ''),
                    "google_url": google_url
                })
                if len(events) >= 3:
                    break
            except Exception as e:
                print(f"Couldn't process venue: {str(e)}")
                continue
        return events
    except Exception as e:
        print(f"Couldn't fetch events: {str(e)}")
        return []

# ==== Step 7: Fetch weather forecast with WeatherAPI ====
def get_weather_forecast(city, start_date, end_date):
    lat, lon = geocode_location(city)
    if not lat or not lon:
        return None
    try:
        weather_url = f"https://api.weatherapi.com/v1/forecast.json?key={WEATHERAPI_KEY}&q={lat},{lon}&days=10"
        weather_response = requests.get(weather_url)
        weather_response.raise_for_status()
        weather_data = weather_response.json().get('forecast', {}).get('forecastday', [])
        if not weather_data:
            print(f"No weather data available for {city}")
            return None
        trip_forecasts = []
        current_date = start_date
        while current_date <= end_date:
            date_str = current_date.strftime("%Y-%m-%d")
            daily_forecast = next((f for f in weather_data if f['date'] == date_str), None)
            if daily_forecast:
                trip_forecasts.append({
                    "date": date_str,
                    "temp": daily_forecast['day']['avgtemp_c'],
                    "description": daily_forecast['day']['condition']['text'],
                    "icon": daily_forecast['day']['condition']['icon'].split('/')[-1],
                    "humidity": daily_forecast['day']['avghumidity'],
                    "wind_speed": daily_forecast['day']['maxwind_kph'] / 3.6
                })
            current_date += timedelta(days=1)
        return trip_forecasts
    except Exception as e:
        print(f"Couldn't fetch weather: {str(e)}")
        return None

# ==== Step 8: Fetch AQI ====
def get_aqi(city):
    lat, lon = geocode_location(city)
    if not lat or not lon:
        return 'N/A'
    try:
        aqi_url = f"https://api.waqi.info/feed/geo:{lat};{lon}/?token={AQI_TOKEN}"
        aqi_response = requests.get(aqi_url)
        aqi_response.raise_for_status()
        return aqi_response.json().get('data', {}).get('aqi', 'N/A')
    except Exception as e:
        print(f"Couldn't fetch AQI: {str(e)}")
        return 'N/A'

# ==== Step 9: Route Optimization with Google Directions API ====
def get_route(origin, destination):
    url = f"https://maps.googleapis.com/maps/api/directions/json?origin={origin}&destination={destination}&key={GOOGLE_API_KEY}"
    try:
        response = requests.get(url)
        response.raise_for_status()
        routes = response.json().get('routes', [])
        if not routes:
            return {"distance": "N/A", "duration": "N/A", "url": ""}
        route = routes[0]['legs'][0]
        return {
            "distance": route['distance']['text'],
            "duration": route['duration']['text'],
            "url": f"https://www.google.com/maps/dir/?api=1&origin={origin}&destination={destination}"
        }
    except Exception as e:
        print(f"Couldn't fetch route: {str(e)}")
        return {"distance": "N/A", "duration": "N/A", "url": ""}

# ==== Step 10: Time Zone with Google Time Zone API ====
def get_time_zone(city):
    lat, lon = geocode_location(city)
    if not lat or not lon:
        return 'N/A'
    try:
        timestamp = int(time.time())
        url = f"https://maps.googleapis.com/maps/api/timezone/json?location={lat},{lon}&timestamp={timestamp}&key={GOOGLE_API_KEY}"
        response = requests.get(url)
        response.raise_for_status()
        return response.json().get('timeZoneName', 'N/A')
    except Exception as e:
        print(f"Couldn't fetch time zone: {str(e)}")
        return 'N/A'

# ==== Step 11: YouTube Links ====
def get_youtube_links(query):
    url = f"https://www.googleapis.com/youtube/v3/search?part=snippet&q={query}&type=video&maxResults=1&key={GOOGLE_API_KEY}"
    try:
        response = requests.get(url)
        response.raise_for_status()
        items = response.json().get('items', [])
        if not items:
            return ""
        video_id = items[0]['id']['videoId']
        return f"https://www.youtube.com/watch?v={video_id}"
    except Exception as e:
        print(f"Couldn't fetch YouTube link: {str(e)}")
        return ""

# ==== Step 12: Generate Enhanced PDF ====
def generate_pdf(itinerary, destination, trip_details, attractions, itinerary_number=1):
    class UnicodePDF(FPDF):
        def header(self):
            self.set_font("Arial", "B", 20)
            self.set_text_color(0, 0, 0)
            self.set_xy(10, 10)
            self.cell(0, 10, f"Travel Itinerary {itinerary_number}: {destination}", 0, 1, "C")

        def footer(self):
            self.set_y(-15)
            self.set_font("Arial", "I", 8)
            self.set_text_color(100, 100, 100)
            self.cell(0, 10, f"Page {self.page_no()} | Generated by AI Travel Planner on {datetime.now().strftime('%Y-%m-%d')}", 0, 0, "C")

    pdf = UnicodePDF()
    pdf.set_auto_page_break(auto=True, margin=15)
    
    # Fetch diverse images
    city_images = get_unsplash_images(destination, count=5)
    
    # Cover Page
    if city_images:
        pdf.add_page()
        try:
            response = requests.get(city_images[0], timeout=10)
            img = Image.open(io.BytesIO(response.content))
            img_path = os.path.join(tempfile.gettempdir(), f"cover_{destination}_{itinerary_number}.jpg")
            img.save(img_path)
            pdf.image(img_path, x=(210-190)/2, y=30, w=190)
            pdf.set_font("Arial", "I", 12)
            pdf.set_xy(10, 100)
            pdf.set_text_color(0, 51, 102)
            pdf.cell(0, 10, "A Journey Awaits", 0, 1, "C")
            os.remove(img_path)
        except Exception as e:
            print(f"Failed to add cover image: {str(e)}")
    else:
        pdf.add_page()

    # Trip Details
    pdf.add_page()
    pdf.set_fill_color(245, 247, 250)
    pdf.rect(0, 0, 210, 297, 'F')
    pdf.set_font("Arial", "B", 16)
    pdf.set_text_color(0, 51, 102)
    pdf.cell(0, 10, "Trip Overview", 0, 1, "L")
    pdf.ln(5)
    pdf.set_font("Arial", "", 11)
    pdf.set_text_color(0, 0, 0)
    pdf.cell(0, 8, f"Duration: {trip_details['duration']} days", 0, 1)
    pdf.cell(0, 8, f"Dates: {trip_details['departure_date']} to {trip_details['return_date']}", 0, 1)
    pdf.cell(0, 8, f"Budget: ${trip_details['budget']}", 0, 1)
    pdf.cell(0, 8, f"Interests: {trip_details['interests']}", 0, 1)
    
    if trip_details.get('weather'):
        pdf.ln(10)
        pdf.set_font("Arial", "B", 14)
        pdf.cell(0, 10, "Weather Forecast", 0, 1)
        pdf.set_font("Arial", "", 10)
        for day in trip_details['weather']:
            pdf.cell(50, 6, day['date'], border=1)
            pdf.cell(100, 6, f"{day['description'].title()}, {day['temp']}°C", border=1)
            pdf.ln(6)

    # Attractions
    if attractions:
        pdf.add_page()
        pdf.set_fill_color(245, 247, 250)
        pdf.rect(0, 0, 210, 297, 'F')
        pdf.set_font("Arial", "B", 16)
        pdf.set_text_color(0, 51, 102)
        pdf.cell(0, 10, "Recommended Attractions", 0, 1)
        pdf.ln(5)
        for attraction in attractions[:5]:
            pdf.set_font("Arial", "B", 12)
            pdf.cell(0, 8, attraction['name'], 0, 1)
            pdf.set_font("Arial", "", 10)
            pdf.cell(0, 6, f"Type: {attraction['type']} | Rating: {attraction['rating']}", 0, 1)
            pdf.cell(0, 6, f"Address: {attraction['address']}", 0, 1)
            if attraction.get('google_url'):
                pdf.set_text_color(0, 0, 255)
                pdf.set_font("Arial", "U", 10)
                pdf.cell(0, 6, "Google Maps", ln=1, link=attraction['google_url'])
                pdf.set_text_color(0, 0, 0)
                pdf.set_font("Arial", "", 10)
            pdf.ln(8)

    # Itinerary
    pdf.add_page()
    pdf.set_fill_color(245, 247, 250)
    pdf.rect(0, 0, 210, 297, 'F')
    pdf.set_font("Arial", "B", 16)
    pdf.set_text_color(0, 51, 102)
    pdf.cell(0, 10, f"Your Personalized Itinerary {itinerary_number}", 0, 1)
    pdf.ln(5)
    
    clean_itinerary = unicodedata.normalize('NFKD', itinerary).encode('ascii', 'ignore').decode('ascii')
    paragraphs = clean_itinerary.split('\n\n')
    image_index = 1

    for para in paragraphs:
        if not para.strip():
            continue
        lines = para.strip().split('\n')
        if lines and "Day" in lines[0]:
            day_title = re.sub(r'\*\*(.*?)\*\*', r'\1', lines[0]).strip()
            pdf.set_font("Arial", "B", 13)
            pdf.set_text_color(0, 51, 102)
            pdf.cell(0, 10, day_title, 0, 1)
            if image_index < len(city_images) and pdf.get_y() + 60 < pdf.h - 15:
                try:
                    response = requests.get(city_images[image_index])
                    img = Image.open(io.BytesIO(response.content))
                    img_path = os.path.join(tempfile.gettempdir(), f"day_{image_index}_{itinerary_number}.jpg")
                    img.save(img_path)
                    pdf.image(img_path, x=(210-60)/2, w=60, h=60)
                    pdf.set_font("Arial", "I", 8)
                    pdf.cell(0, 5, f"Scene {image_index}: {destination}", 0, 1, "C")
                    os.remove(img_path)
                    image_index += 1
                except Exception as e:
                    print(f"Failed to add image {image_index}: {str(e)}")
            pdf.ln(5)
            lines = lines[1:]
        
        pdf.set_font("Arial", "", 11)
        pdf.set_text_color(0, 0, 0)
        for line in lines:
            line = re.sub(r'\*\*(.*?)\*\*', r'\1', line).strip()
            if '<a href="' in line:
                parts = line.split('<a href="')
                for i, part in enumerate(parts):
                    if i == 0:
                        pdf.multi_cell(0, 8, part, 0, 0)
                    else:
                        url, rest = part.split('">')
                        text, remainder = rest.split('</a>')
                        pdf.set_text_color(0, 0, 255)
                        pdf.set_font("Arial", "U", 11)
                        pdf.multi_cell(0, 8, text, 0, 0, link=url)
                        pdf.set_text_color(0, 0, 0)
                        pdf.set_font("Arial", "", 11)
                        pdf.multi_cell(0, 8, remainder, 0, 0)
                pdf.ln(8)
            elif line.startswith("- "):
                pdf.multi_cell(0, 8, f"• {line.lstrip('- ').strip()}", 0, 1)
            else:
                pdf.multi_cell(0, 8, line.strip(), 0, 1)
        pdf.ln(5)

    pdf_filename = f"{destination.replace(' ', '_')}_itinerary_{itinerary_number}.pdf"
    pdf_path = os.path.join(tempfile.gettempdir(), pdf_filename)
    pdf.output(pdf_path)
    return pdf_path, pdf_filename

# ==== Initialize Chat Chain with Groq ====
def initialize_chat_chain():
    return {
        "client": groq_client,
        "memory": ConversationBufferMemory()
    }

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
    
    try:
        chat_completion = groq_client.chat.completions.create(
            messages=messages,
            model="llama3-70b-8192",
            temperature=0.5,
            max_tokens=4000,
            stream=False
        )
        memory.save_context({"input": prompt}, {"output": chat_completion.choices[0].message.content})
        return chat_completion.choices[0].message.content
    except Exception as e:
        print(f"Couldn't generate response: {str(e)}")
        return "Sorry, I couldn't generate a response at this time."

# Text-to-Speech
def speak(text):
    try:
        lang = detect(text) if detect(text) != "un" else "en"
        with tempfile.NamedTemporaryFile(suffix=".mp3", delete=False) as temp_audio:
            tts = gTTS(text=text[:500], lang=lang)
            tts.save(temp_audio.name)
            return temp_audio.name
    except Exception as e:
        print(f"Couldn't generate speech: {str(e)}")
        return None

# Initialize session data
@app.before_request
def initialize_session():
    if 'initialized' not in session:
        session['chat_chain'] = {}
        session['conversation_history'] = []
        session['itineraries'] = []
        session['trip_details'] = {}
        session['travel_chat'] = []
        session['pdf_paths'] = []
        session['attractions'] = []
        session['initialized'] = True
        session['user_id'] = str(uuid.uuid4())

# Import and register blueprints
from api.chat_routes import chat_bp
app.register_blueprint(chat_bp)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/text_to_speech', methods=['POST'])
def text_to_speech():
    data = request.json
    text = data.get('text', '')
    
    if not text:
        return jsonify({'error': 'No text provided'}), 400
    
    audio_path = speak(text)
    if not audio_path:
        return jsonify({'error': 'Failed to generate speech'}), 500
    
    # Generate a unique filename for this audio
    audio_filename = f"speech_{session['user_id']}_{int(time.time())}.mp3"
    
    # Move the file to a location accessible by the web server
    permanent_path = os.path.join('static', 'audio', audio_filename)
    os.makedirs(os.path.dirname(permanent_path), exist_ok=True)
    os.rename(audio_path, permanent_path)
    
    return jsonify({
        'success': True,
        'audio_url': f"/static/audio/{audio_filename}"
    })

if __name__ == '__main__':
    app.run(debug=True)

