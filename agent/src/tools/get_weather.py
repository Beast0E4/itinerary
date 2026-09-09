import requests
from src.config.api_config import WEATHER_API
from langchain_core.tools import tool

@tool
def get_weather(latitude: float, longitude: float, start_date: str, end_date: str) -> str:
    """
    Checks the weather forecast for a specific travel date or a range of dates. 
    
    REQUIREMENTS:
    The `start_date` and `end_date` must be in YYYY-MM-DD format.
    The target location's `latitude` and `longitude`.
    """
    params = {
        "latitude": latitude,
        "longitude": longitude,
        "daily": "temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code",
        "start_date": start_date,
        "end_date": end_date,
        "timezone": "auto"
    }
    
    try:
        response = requests.get(WEATHER_API, params=params, timeout=10)
        if response.status_code == 200:
            return str(response.json().get("daily", {}))
        return f"Weather forecast unavailable for {start_date} to {end_date} (status {response.status_code}). Proceed with seasonal climate estimates."
    except Exception as e:
        return f"Weather lookup failed: {str(e)}. Proceed with seasonal climate estimates."