from flask import Blueprint, request, jsonify, session
from datetime import datetime, timedelta
import os
import tempfile

from final_c_flask import generate_groq_response, generate_pdf


chat_bp = Blueprint('chat', __name__)

@chat_bp.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    user_input = data.get('message', '')
    
    if not user_input:
        return jsonify({'error': 'No message provided'}), 400
    
    # Add user message to chat history
    if 'travel_chat' not in session:
        session['travel_chat'] = []
    
    session['travel_chat'].append({"role": "user", "content": user_input})
    
    # Check if we have trip details
    if 'trip_details' not in session or not session['trip_details']:
        # No trip details yet, ask for destination
        if "destination" in user_input.lower():
            # Extract destination (simplified - in production use NLP)
            words = user_input.lower().split()
            idx = words.index("destination") if "destination" in words else -1
            destination = words[idx + 1] if idx >= 0 and idx + 1 < len(words) else "unknown"
            
            session['trip_details'] = {"destination": destination}
            response = f"Great! I see you're planning a trip to {destination}. When are you planning to visit? And what's your budget?"
        else:
            response = "I'd be happy to help plan your trip! Could you tell me your destination?"
    else:
        # We have some trip details, process the chat
        weather_str = ", ".join([f"{w['date']}: {w['description']}, {w['temp']}°C" for w in session['trip_details'].get('weather', [])]) if session['trip_details'].get('weather') else "Weather data not available"
        context = f"""
        Current itinerary details:
        Destination: {session['trip_details'].get('destination', 'Not specified')}
        Dates: {session['trip_details'].get('departure_date', 'Not specified')} to {session['trip_details'].get('return_date', 'Not specified')}
        Budget: ${session['trip_details'].get('budget', 'Not specified')}
        Interests: {session['trip_details'].get('interests', 'Not specified')}
        Special Requests: {session['trip_details'].get('special_requests', 'None')}
        Weather: {weather_str}
        AQI: {session['trip_details'].get('aqi', 'N/A')}
        Route: {session['trip_details'].get('route', 'Not specified')}
        Time Zone: {session['trip_details'].get('time_zone', 'Not specified')}
        
        User question/request: {user_input}
        Please provide a helpful response considering all above details.
        Use hyperlinks (<a href='url' target='_blank'>Google Maps</a> or <a href='url' target='_blank'>YouTube</a>) for all place references and YouTube videos.
        """
        
        # Initialize chat chain if not already done
        if 'chat_chain' not in session:
            from final_c_flask import initialize_chat_chain
            session['chat_chain'] = initialize_chat_chain()
        
        response = generate_groq_response(context, session['chat_chain']['memory'])
    
    # Add bot response to chat history
    session['travel_chat'].append({"role": "assistant", "content": response})
    
    return jsonify({
        'success': True,
        'response': response,
        'timestamp': datetime.now().isoformat()
    })

@chat_bp.route('/api/generate_itinerary', methods=['POST'])
def generate_itinerary():
    data = request.json
    destination = data.get('destination', '')
    departure_date_str = data.get('departureDate', '')
    return_date_str = data.get('returnDate', '')
    budget = int(data.get('budget', 500))
    travelers = int(data.get('travelers', 1))
    interests = data.get('interests', '')
    special_requests = data.get('specialRequests', '')
    
    if not destination or not departure_date_str:
        return jsonify({'error': 'Missing required fields'}), 400
    
    try:
        from final_c_flask import (get_hotels, get_flights, get_attractions, get_events, 
                        get_weather_forecast, get_aqi, get_route, get_time_zone, 
                        get_youtube_links, generate_groq_response)
        
        departure_date = datetime.strptime(departure_date_str, '%Y-%m-%d')
        return_date = datetime.strptime(return_date_str, '%Y-%m-%d') if return_date_str else departure_date + timedelta(days=3)
        
        city_code = destination[:3].upper()
        origin = data.get('origin', 'NYC').upper()
        
        hotels = get_hotels(city_code, budget)
        flights = get_flights(origin, city_code, departure_date.strftime("%Y-%m-%d"), return_date.strftime("%Y-%m-%d"), budget)
        attractions = get_attractions(destination)
        events = get_events(destination, departure_date, return_date)
        weather = get_weather_forecast(destination, departure_date, return_date)
        aqi = get_aqi(destination)
        route = get_route(origin, destination)
        time_zone = get_time_zone(destination)
        youtube_link = get_youtube_links(f"{destination} travel highlights")
        
        # Store attractions for PDF generation
        session['attractions'] = attractions
        
        # Ensure all place and YouTube references use hyperlinks
        hotels_text = "\n".join([f"- {h['name']} (Rating: {h['rating']}) <a href='{h['google_url']}' target='_blank'>Google Maps</a>" if h['google_url'] else f"- {h['name']} (Rating: {h['rating']})" for h in hotels]) if hotels else "No hotels found"
        flights_text = "\n".join([f"- {f['carrier']} at {f['departure']} ({f['price']} {f['currency']})" for f in flights]) if flights else "No flights found"
        attractions_text = "\n".join([f"- {a['name']} ({a['type']}, Rating: {a['rating']}) <a href='{a['google_url']}' target='_blank'>Google Maps</a>" if a['google_url'] else f"- {a['name']} ({a['type']}, Rating: {a['rating']})" for a in attractions]) if attractions else "No attractions found"
        events_text = "\n".join([f"- {e['name']} at {e['venue']} on {e['date']} <a href='{e['google_url']}' target='_blank'>Google Maps</a>" if e['google_url'] else f"- {e['name']} at {e['venue']} on {e['date']}" for e in events]) if events else "No events found"
        weather_text = "\n".join([f"- {w['date']}: {w['description']}, {w['temp']}°C" for w in weather]) if weather else "Weather data not available"
        youtube_text = f"<a href='{youtube_link}' target='_blank'>YouTube</a>" if youtube_link else "No YouTube link available"
        route_text = f"{route['distance']} in {route['duration']} <a href='{route['url']}' target='_blank'>Route</a>" if route['url'] else f"{route['distance']} in {route['duration']}"
        
        session['trip_details'] = {
            "destination": destination,
            "origin": origin,
            "departure_date": departure_date.strftime("%Y-%m-%d"),
            "return_date": return_date.strftime("%Y-%m-%d"),
            "duration": (return_date - departure_date).days,
            "budget": budget,
            "travelers": travelers,
            "interests": interests,
            "special_requests": special_requests,
            "weather": weather,
            "aqi": aqi,
            "route": route_text,
            "time_zone": time_zone,
            "youtube_link": youtube_text
        }
        
        prompt_base = f"""
        Create a detailed {(return_date - departure_date).days}-day itinerary for {destination} with:
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
        Route: {route_text}
        Time Zone: {time_zone}
        YouTube Highlight: {youtube_text}
        
        Important Instructions:
        1. Structure the itinerary day-by-day with time slots
        2. Include weather-appropriate activities if weather data is available
        3. Suggest relevant events from the events list
        4. Recommend restaurants based on budget and interests
        5. Include transportation tips with <a href='url' target='_blank'>Google Maps</a> hyperlinks
        6. Provide estimated costs where possible
        7. Adjust activities based on weather, AQI, and time zone if data is available
        8. Include the YouTube link provided above using <a href='url' target='_blank'>YouTube</a>
        9. Use hyperlinks (<a href='url' target='_blank'>Google Maps</a> or <a href='url' target='_blank'>YouTube</a>) for all place references (hotels, attractions, events, routes) and YouTube videos
        10. Always provide links when relevant and available
        """
        
        # Initialize chat chain if not already done
        if 'chat_chain' not in session:
            from final_c_flask import initialize_chat_chain
            session['chat_chain'] = initialize_chat_chain()
        
        # Generate itinerary
        itinerary = generate_groq_response(prompt_base, session['chat_chain']['memory'])
        
        # Generate PDF
        pdf_path, pdf_filename = generate_pdf(itinerary, destination, session['trip_details'], attractions)
        
        # Store PDF path for download
        if 'pdf_paths' not in session:
            session['pdf_paths'] = []
            session['pdf_filenames'] = []
        
        session['pdf_paths'].append(pdf_path)
        session['pdf_filenames'].append(pdf_filename)
        
        return jsonify({
            'success': True,
            'itinerary': itinerary,
            'pdfUrl': f"/api/download_pdf/{len(session['pdf_paths']) - 1}",
            'pdfFilename': pdf_filename,
            'tripDetails': {
                'destination': destination,
                'departureDate': departure_date.strftime("%Y-%m-%d"),
                'returnDate': return_date.strftime("%Y-%m-%d"),
                'budget': budget,
                'travelers': travelers
            },
            'attractions': [
                {
                    'name': a['name'],
                    'type': a['type'],
                    'rating': a['rating'],
                    'address': a['address'],
                    'googleUrl': a['google_url'],
                    'photoUrl': a['photo_url']
                } for a in attractions[:5]
            ] if attractions else []
        })
    
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

@chat_bp.route('/api/download_pdf/<int:pdf_index>')
def download_pdf(pdf_index):
    from flask import send_file
    
    if 'pdf_paths' not in session or pdf_index >= len(session['pdf_paths']):
        return jsonify({'error': 'PDF not found'}), 404
    
    pdf_path = session['pdf_paths'][pdf_index]
    pdf_filename = session['pdf_filenames'][pdf_index]
    
    return send_file(pdf_path, as_attachment=True, download_name=pdf_filename)

