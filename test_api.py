import requests
import os
from dotenv import load_dotenv

# Load environment variables from .env.local
load_dotenv('.env.local')

# Get your API keys
openai_key = os.getenv('OPENAI_API_KEY')
google_maps_key = os.getenv('NEXT_PUBLIC_GOOGLE_MAPS_API')
irctc_key = os.getenv('IRCtc_API_KEY')
rapidapi_host = os.getenv('RAPIDAPI_HOST')

print("Testing API Keys...\n")

# Test OpenAI API
print("1. Testing OpenAI API...")
try:
    response = requests.get(
        "https://api.openai.com/v1/models",
        headers={"Authorization": f"Bearer {openai_key}"}
    )
    if response.status_code == 200:
        print("✓ OpenAI API key is VALID!\n")
    elif response.status_code == 401:
        print("✗ OpenAI API key is INVALID or EXPIRED\n")
    else:
        print(f"✗ OpenAI Error: {response.status_code}\n")
except Exception as e:
    print(f"✗ OpenAI Connection error: {e}\n")

# Test Google Maps API
print("2. Testing Google Maps API...")
try:
    response = requests.get(
        f"https://maps.googleapis.com/maps/api/geocode/json?address=Delhi&key={google_maps_key}"
    )
    if response.status_code == 200:
        result = response.json()
        if result.get('status') == 'OK':
            print("✓ Google Maps API key is VALID!\n")
        else:
            print(f"✗ Google Maps Error: {result.get('status')}\n")
    else:
        print(f"✗ Google Maps Error: {response.status_code}\n")
except Exception as e:
    print(f"✗ Google Maps Connection error: {e}\n")

# Test IRCCT API (RapidAPI)
print("3. Testing IRCCT API (RapidAPI)...")
try:
    headers = {
        "X-RapidAPI-Key": irctc_key,
        "X-RapidAPI-Host": rapidapi_host
    }
    
    response = requests.get(
        "https://irctc-indian-railway.p.rapidapi.com/getPNRStatus",
        params={"pnrNumber": "1234567890"},
        headers=headers
    )
    
    if response.status_code == 200:
        print("✓ IRCCT API key is VALID!\n")
        print(response.json())
    elif response.status_code == 401:
        print("✗ IRCCT API key is INVALID or EXPIRED\n")
    else:
        print(f"✗ IRCCT Error: {response.status_code}\n")
except Exception as e:
    print(f"✗ IRCCT Connection error: {e}\n")