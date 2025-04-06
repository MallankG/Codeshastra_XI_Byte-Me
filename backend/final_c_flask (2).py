from flask import Flask, request, Response, send_file, jsonify
from flask_cors import CORS
import os
import json
from datetime import datetime, timedelta
import tempfile
import re
import requests
from groq import Groq
from langchain.memory import ConversationBufferMemory
from langchain.schema import AIMessage, HumanMessage, SystemMessage
from langdetect import detect
from gtts import gTTS
from fpdf import FPDF
from PIL import Image
import io
import unicodedata
import threading
import queue
from geopy.geocoders import Nominatim
import random

app = Flask(__name__)
CORS(app)

# API Keys
AMADEUS_API_KEY = "KcJe1Ef160GbCmAurWO2ieApdYJnUgKG"
AMADEUS_API_SECRET = "8Axu4TAQGgvWpm0D"
GOOGLE_API_KEY = "AIzaSyBF_X-pCPrgGDDT_0XK1ObF7lR1MkEsTl0"  # Replace with your actual Google API key
GROQ_API_KEY = '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'
WEATHERAPI_KEY = "AIzaSyBF_X-pCPrgGDDT_0XK1ObF7lR1MkEsTl0"  # Replace with your actual WeatherAPI key if different
AQI_TOKEN = "AIzaSyBF_X-pCPrgGDDT_0XK1ObF7lR1MkEsTl0"  # Replace with your actual AQI token if different
UNSPLASH_ACCESS_KEY = "FlKz5N26NpYD6MloqmzV-taJRCAf_zYX5O-EAt-XGn4"

# Initialize Groq client
groq_client = Groq(api_key=GROQ_API_KEY)

# Initialize geopy geocoder
geolocator = Nominatim(user_agent="travel_planner_app")

# Global conversation state
conversation_state = {
    "memory": ConversationBufferMemory(),
    "history": [SystemMessage(content="""
        You are a professional travel planner assistant with expertise in creating personalized itineraries.
        When given a city, dates, budget, and interests, generate a highly detailed travel plan that includes:
        - Day-by-day structure with time slots
        - Hotel recommendations with Google Maps hyperlinks where available
        - Attraction visits with Google Maps hyperlinks
        - Dining suggestions
        - Transportation tips with route optimization
        - Estimated costs
        - Local events with Google Maps hyperlinks where available
        - Weather, AQI, and time zone considerations
        - YouTube links for destination highlights
        
        Important guidelines:
        1. Use hyperlinks (e.g., <a href='url' target='_blank'>text</a>) instead of bracketed links.
        2. Only provide links when relevant and available.
        3. Adjust recommendations based on weather, AQI, and time zone if data is available.
        4. Include YouTube links for destination highlights using <a href='url' target='_blank'>YouTube</a>.
        5. Do not use emojis in your responses.
        6. If weather or other data is unavailable, note it and proceed with the itinerary.
    """)],
    "trip_details": {},
    "itineraries": [],
    "pdf_paths": [],
    "attractions": []
}

audio_queue = queue.Queue()

# Helper Functions
def geocode_location(location):
    try:
        location = geolocator.geocode(location)
        if location:
            return location.latitude, location.longitude
        return None, None
    except Exception as e:
        print(f"Geocode error: {str(e)}")
        return None, None

def get_unsplash_images(city, count=5):
    queries = [f"{city} landmarks", f"{city} culture", f"{city} scenery", f"{city} architecture", f"{city} hidden gems"]
    image_urls = []
    for query in queries[:count]:
        url = f"https://api.unsplash.com/search/photos?query={query}&per_page=1&client_id={UNSPLASH_ACCESS_KEY}"
        try:
            response = requests.get(url)
            response.raise_for_status()
            results = response.json().get('results', [])
            if results:
                image_urls.append(results[0]['urls']['regular'])
        except Exception as e:
            print(f"Unsplash error: {str(e)}")
    return image_urls

def get_amadeus_token():
    url = "https://test.api.amadeus.com/v1/security/oauth2/token"
    data = {"grant_type": "client_credentials", "client_id": AMADEUS_API_KEY, "client_secret": AMADEUS_API_SECRET}
    try:
        response = requests.post(url, data=data)
        response.raise_for_status()
        return response.json().get("access_token")
    except Exception as e:
        print(f"Amadeus token error: {str(e)}")
        return None

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
        return [{"name": h['name'], 
                 "rating": h.get('rating', 'N/A'), 
                 "google_url": (lat := lat_lon[0], lon := lat_lon[1], f"https://www.google.com/maps/search/?api=1&query={lat},{lon}")[2] 
                               if (lat_lon := geocode_location(f"{h['name']}, {city_code}")) and 
                                  lat_lon[0] is not None and 
                                  lat_lon[1] is not None 
                               else ""} 
                for h in hotels[:5]]
    except Exception as e:
        print(f"Hotels error: {str(e)}")
        return []

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
        return [{"carrier": f['itineraries'][0]['segments'][0]['carrierCode'], 
                 "departure": f['itineraries'][0]['segments'][0]['departure']['at'], 
                 "price": float(f['price']['total']), 
                 "currency": f['price']['currency']} 
                for f in flights[:3] if float(f['price']['total']) <= budget]
    except Exception as e:
        print(f"Flights error: {str(e)}")
        return []

def get_attractions(city):
    url = f"https://maps.googleapis.com/maps/api/place/textsearch/json?query=top+attractions+in+{city}&key={GOOGLE_API_KEY}"
    try:
        response = requests.get(url)
        response.raise_for_status()
        results = response.json().get("results", [])
        attractions = []
        for place in results[:8]:
            details_url = f"https://maps.googleapis.com/maps/api/place/details/json?place_id={place['place_id']}&fields=name,rating,formatted_address,photos,website,url,types&key={GOOGLE_API_KEY}"
            details_response = requests.get(details_url)
            details = details_response.json().get('result', {})
            photo_url = f"https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference={details['photos'][0]['photo_reference']}&key={GOOGLE_API_KEY}" if details.get('photos') else None
            attractions.append({
                "name": details.get("name", place.get("name")),
                "rating": details.get("rating", "N/A"),
                "address": details.get("formatted_address", "N/A"),
                "type": details.get("types", ["attraction"])[0].replace("_", " ").title(),
                "website": details.get("website", ""),
                "google_url": details.get("url", ""),
                "photo_url": photo_url
            })
        return attractions
    except Exception as e:
        print(f"Attractions error: {str(e)}")
        return []

def get_events(city, start_date, end_date):
    query = f"event venues in {city}"
    url = f"https://maps.googleapis.com/maps/api/place/textsearch/json?query={query}&key={GOOGLE_API_KEY}"
    try:
        response = requests.get(url)
        venues = response.json().get("results", [])[:5]
        events = []
        current_date = start_date
        for i, venue in enumerate(venues):
            details_url = f"https://maps.googleapis.com/maps/api/place/details/json?place_id={venue['place_id']}&fields=name,formatted_address,url,photos,website&key={GOOGLE_API_KEY}"
            details = requests.get(details_url).json().get('result', {})
            lat, lon = geocode_location(f"{details.get('name', 'Local Venue')}, {city}")
            events.append({
                "name": f"Event at {details.get('name', 'Local Venue')}",
                "date": (current_date + timedelta(days=i)).strftime("%Y-%m-%d"),
                "venue": details.get('name', 'Local Venue'),
                "url": details.get('website', details.get('url', '')),
                "address": details.get('formatted_address', ''),
                "google_url": f"https://www.google.com/maps/search/?api=1&query={lat},{lon}" if lat and lon else ""
            })
        return events
    except Exception as e:
        print(f"Events error: {str(e)}")
        return []

def get_weather_forecast(city, start_date, end_date):
    lat, lon = geocode_location(city)
    if not lat or not lon:
        return None
    url = f"https://api.weatherapi.com/v1/forecast.json?key={WEATHERAPI_KEY}&q={lat},{lon}&days=10"
    try:
        response = requests.get(url)
        weather_data = response.json().get('forecast', {}).get('forecastday', [])
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
        print(f"Weather error: {str(e)}")
        return None

def get_aqi(city):
    lat, lon = geocode_location(city)
    if not lat or not lon:
        return 'N/A'
    url = f"https://api.waqi.info/feed/geo:{lat};{lon}/?token={AQI_TOKEN}"
    try:
        response = requests.get(url)
        return response.json().get('data', {}).get('aqi', 'N/A')
    except Exception as e:
        print(f"AQI error: {str(e)}")
        return 'N/A'

def get_route(origin, destination):
    url = f"https://maps.googleapis.com/maps/api/directions/json?origin={origin}&destination={destination}&key={GOOGLE_API_KEY}"
    try:
        response = requests.get(url)
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
        print(f"Route error: {str(e)}")
        return {"distance": "N/A", "duration": "N/A", "url": ""}

def get_time_zone(city):
    lat, lon = geocode_location(city)
    if not lat or not lon:
        return 'N/A'
    timestamp = int(datetime.now().timestamp())
    url = f"https://maps.googleapis.com/maps/api/timezone/json?location={lat},{lon}&timestamp={timestamp}&key={GOOGLE_API_KEY}"
    try:
        response = requests.get(url)
        return response.json().get('timeZoneName', 'N/A')
    except Exception as e:
        print(f"Time zone error: {str(e)}")
        return 'N/A'

def get_youtube_links(query):
    url = f"https://www.googleapis.com/youtube/v3/search?part=snippet&q={query}&type=video&maxResults=1&key={GOOGLE_API_KEY}"
    try:
        response = requests.get(url)
        items = response.json().get('items', [])
        if not items:
            return ""
        video_id = items[0]['id']['videoId']
        return f"https://www.youtube.com/watch?v={video_id}"
    except Exception as e:
        print(f"YouTube error: {str(e)}")
        return ""

def generate_groq_response(prompt, memory):
    history = memory.load_memory_variables({})["history"]
    messages = [{"role": "system" if isinstance(m, SystemMessage) else "user" if isinstance(m, HumanMessage) else "assistant", "content": m.content} for m in history]
    messages.append({"role": "user", "content": prompt})
    try:
        chat_completion = groq_client.chat.completions.create(
            messages=messages,
            model="llama3-70b-8192",
            temperature=0.5,
            max_tokens=4000,
            stream=False
        )
        response = chat_completion.choices[0].message.content
        memory.save_context({"input": prompt}, {"output": response})
        return response
    except Exception as e:
        print(f"Groq error: {str(e)}")
        return "Sorry, I couldn't generate a response at this time."

def extract_locations_from_city(destination):
    try:
        # First geocode the destination to get its coordinates
        location = geolocator.geocode(destination)
        if not location:
            print(f"Could not geocode {destination}")
            return []

        # Use geopy's reverse geocoding with a bounding box to find nearby points of interest
        from geopy.distance import distance
        
        # Create a bounding box around the location (50km radius)
        north = distance(kilometers=50).destination((location.latitude, location.longitude), bearing=0)
        east = distance(kilometers=50).destination((location.latitude, location.longitude), bearing=90)
        south = distance(kilometers=50).destination((location.latitude, location.longitude), bearing=180)
        west = distance(kilometers=50).destination((location.latitude, location.longitude), bearing=270)
        
        # Get nearby points of interest using Nominatim
        from geopy.extra.rate_limiter import RateLimiter
        reverse = RateLimiter(geolocator.reverse, min_delay_seconds=1)
        
        # Sample points in the bounding box (simplified approach)
        locations = []
        for i in range(10):  # Limit to 10 places
            # Create a point within the bounding box
            lat = location.latitude + (0.5 - random.random()) * 0.5
            lon = location.longitude + (0.5 - random.random()) * 0.5
            
            try:
                # Reverse geocode to get place information
                place = reverse((lat, lon), exactly_one=True)
                if place and hasattr(place, 'raw'):
                    name = place.raw.get('display_name', 'Unknown').split(',')[0]
                    place_type = place.raw.get('type', 'attraction')
                    
                    locations.append({
                        "day": (i % 5) + 1,  # Distribute across days 1-5
                        "name": name,
                        "type": place_type.replace('_', ' ').title(),
                        "lat": lat,
                        "lng": lon
                    })
            except Exception as e:
                print(f"Error getting place info: {str(e)}")
                continue
        
        print(locations)
        return locations
    
    except Exception as e:
        print(f"Geopy error: {str(e)}")
        return []
# extract_locations_from_city("Tokyo")

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
                    response = requests.get(city_images[image_index])
                    img = Image.open(io.BytesIO(response.content))
                    img_path = os.path.join(tempfile.gettempdir(), f"day_{image_index}_{itinerary_number}.jpg")
                    img.save(img_path)
                    pdf.image(img_path, x=(210-60)/2, w=60, h=60)
                    pdf.set_font("Arial", "I", 8)
                    pdf.cell(0, 5, f"Scene {image_index}: {destination}", 0, 1, "C")
                    os.remove(img_path)
                    image_index += 1
                
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

    with tempfile.NamedTemporaryFile(delete=False, suffix=f"_itinerary_{itinerary_number}.pdf") as temp_file:
        pdf_path = temp_file.name
        pdf.output(pdf_path)
    return pdf_path

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

# API Endpoints
@app.route('/api/itineraries', methods=['POST'])
def create_itineraries():
    try:
        data = request.get_json()
        origin = data.get('origin', '').upper()
        destination = data.get('destination', '')
        departure_date = datetime.strptime(data.get('departure_date', ''), '%Y-%m-%d')
        trip_length = int(data.get('trip_length', 3))
        budget = int(data.get('budget', 500))
        travelers = int(data.get('travelers', 1))
        interests = data.get('interests', '')
        special_requests = data.get('special_requests', '')

        if not all([destination, origin, departure_date]):
            return jsonify({'error': 'Missing required fields'}), 400

        return_date = departure_date + timedelta(days=trip_length)
        city_code = destination[:3].upper()

        hotels = get_hotels(city_code, budget)
        flights = get_flights(origin, city_code, departure_date.strftime("%Y-%m-%d"), return_date.strftime("%Y-%m-%d"), budget)
        attractions = get_attractions(destination)
        events = get_events(destination, departure_date, return_date)
        weather = get_weather_forecast(destination, departure_date, return_date)
        aqi = get_aqi(destination)
        route = get_route(origin, destination)
        time_zone = get_time_zone(destination)
        youtube_link = get_youtube_links(f"{destination} travel highlights")

        conversation_state["attractions"] = attractions
        conversation_state["trip_details"] = {
            "destination": destination,
            "origin": origin,
            "departure_date": departure_date.strftime("%Y-%m-%d"),
            "return_date": return_date.strftime("%Y-%m-%d"),
            "duration": trip_length,
            "budget": budget,
            "travelers": travelers,
            "interests": interests,
            "special_requests": special_requests,
            "weather": weather,
            "aqi": aqi,
            "route": route,
            "time_zone": time_zone,
            "youtube_link": youtube_link
        }

        hotels_text = "\n".join([f"- {h['name']} (Rating: {h['rating']}) <a href='{h['google_url']}' target='_blank'>Google Maps</a>" if h['google_url'] else f"- {h['name']} (Rating: {h['rating']})" for h in hotels]) if hotels else "No hotels found"
        flights_text = "\n".join([f"- {f['carrier']} at {f['departure']} ({f['price']} {f['currency']})" for f in flights]) if flights else "No flights found"
        attractions_text = "\n".join([f"- {a['name']} ({a['type']}, Rating: {a['rating']}) <a href='{a['google_url']}' target='_blank'>Google Maps</a>" if a['google_url'] else f"- {a['name']} ({a['type']}, Rating: {a['rating']})" for a in attractions]) if attractions else "No attractions found"
        events_text = "\n".join([f"- {e['name']} at {e['venue']} on {e['date']} <a href='{e['google_url']}' target='_blank'>Google Maps</a>" if e['google_url'] else f"- {e['name']} at {e['venue']} on {e['date']}" for e in events]) if events else "No events found"
        weather_text = "\n".join([f"- {w['date']}: {w['description']}, {w['temp']}°C" for w in weather]) if weather else "Weather data not available"
        youtube_text = f"<a href='{youtube_link}' target='_blank'>YouTube</a>" if youtube_link else "No YouTube link available"

        prompt_base = f"""
        Create a detailed {trip_length}-day itinerary for {destination} with:
        - Budget: ${budget}
        - Travelers: {travelers}
        - Interests: {interests}
        - Special requests: {special_requests if special_requests else 'None'}
        
        Available Hotels:
        {hotels_text}
        
        Flight Options:
        {flights_text}
        
        Top Attractions:
        {attractions_text}
        
        Local Events During Stay:
        {events_text}
        
        Weather Forecast:
        {weather_text}
        
        AQI: {aqi}
        Route: {route['distance']} in {route['duration']} <a href='{route['url']}' target='_blank'>Route</a>
        Time Zone: {time_zone}
        YouTube Highlight: {youtube_text}
        
        Important Instructions:
        1. Structure the itinerary day-by-day with time slots
        2. Include weather-appropriate activities if weather data is available
        3. Suggest relevant events from the events list
        4. Recommend restaurants based on budget and interests
        5. Include transportation tips with Google Maps hyperlinks
        6. Provide estimated costs where possible
        7. Adjust activities based on weather, AQI, and time zone if data is available
        8. Include the YouTube link provided above using <a href='url' target='_blank'>YouTube</a>
        9. Use hyperlinks (<a href='url' target='_blank'>text</a>) instead of bracketed links
        10. Only provide links when relevant
        """

        itineraries = []
        pdf_paths = []
        locations_list = []
        for i in range(3):
            variation_prompt = prompt_base + f"\n\nGenerate a unique itinerary (Option {i+1}) with a different focus or style (e.g., relaxed pace, adventure-focused, or budget-optimized)."
            itinerary = generate_groq_response(variation_prompt, conversation_state["memory"])
            locations = extract_locations_from_city(destination)
            pdf_path = generate_pdf(itinerary, destination, conversation_state["trip_details"], attractions, i+1)
            itineraries.append(itinerary)
            pdf_paths.append(pdf_path)
            locations_list.append(locations)

        conversation_state["itineraries"] = itineraries
        conversation_state["pdf_paths"] = pdf_paths

        return jsonify({
            "itineraries": itineraries,
            "locations": locations_list,
            "trip_details": conversation_state["trip_details"],
            "attractions": attractions
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
    

@app.route('/api/itinerary/pdf/<int:option>', methods=['GET'])
def get_itinerary_pdf(option):
    if option < 1 or option > len(conversation_state["pdf_paths"]) or not os.path.exists(conversation_state["pdf_paths"][option-1]):
        return jsonify({'error': 'Invalid option or no PDF available'}), 404
    return send_file(
        conversation_state["pdf_paths"][option-1],
        mimetype='application/pdf',
        as_attachment=True,
        download_name=f"{conversation_state['trip_details']['destination']}_itinerary_option_{option}.pdf"
    )

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        user_input = data.get('message')
        if not user_input:
            return jsonify({'error': 'No message provided'}), 400

        weather_str = ", ".join([f"{w['date']}: {w['description']}, {w['temp']}°C" for w in conversation_state["trip_details"].get("weather", [])]) if conversation_state["trip_details"].get("weather") else "Weather data not available"
        context = f"""
        Current itinerary details:
        Destination: {conversation_state["trip_details"].get("destination", "N/A")}
        Dates: {conversation_state["trip_details"].get("departure_date", "N/A")} to {conversation_state["trip_details"].get("return_date", "N/A")}
        Budget: ${conversation_state["trip_details"].get("budget", "N/A")}
        Interests: {conversation_state["trip_details"].get("interests", "N/A")}
        Special Requests: {conversation_state["trip_details"].get("special_requests", "None")}
        Weather: {weather_str}
        AQI: {conversation_state["trip_details"].get("aqi", "N/A")}
        Route: {conversation_state["trip_details"]["route"]["distance"]} in {conversation_state["trip_details"]["route"]["duration"]}
        Time Zone: {conversation_state["trip_details"]["time_zone"]}
        
        User question/request: {user_input}
        Please provide a helpful response considering all above details.
        Use hyperlinks (<a href='url' target='_blank'>text</a>) where relevant.
        """
        response = generate_groq_response(context, conversation_state["memory"])
        return jsonify({'response': response})
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
            return Response(audio_data, mimetype='audio/mp3', headers={'Content-Disposition': 'attachment; filename=speech.mp3'})
        return jsonify({'error': 'Failed to generate speech'}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def process_audio_stream():
    while True:
        try:
            audio_data = audio_queue.get()
            if audio_data is None:
                break
        except Exception as e:
            print(f"Audio processing error: {str(e)}")

audio_thread = threading.Thread(target=process_audio_stream, daemon=True)
audio_thread.start()

if __name__ == '__main__':
    app.run(debug=True, port=5000)