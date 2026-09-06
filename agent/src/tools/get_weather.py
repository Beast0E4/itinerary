import requests

from src.config.api_config import WEATHER_API
from langchain_core.tools import tool

@tool
def get_weather(latitude: float, longitude: float, start_date: str, end_date: str) -> str:
    """
    Checks the weather forecast for a specific travel date or a range of dates. 
    
    REQUIREMENTS:
    The `start_date` and `end_date` must be in YYYY-MM-DD format.
    The target locations's `latitude` and `longitude`
    """
    
    params = {
        "latitude": latitude,
        "longitude": longitude,
        "daily": "temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code",
        "start_date": start_date,
        "end_date": end_date,
        "timezone": "auto"
    }
    
    response = requests.get(WEATHER_API, params=params)
    
    if response.status_code == 200:
        return response.json().get("daily", {})
        
    return {"error": f"Failed with status code {response.status_code}", "details": response.text}