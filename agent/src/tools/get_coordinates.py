import requests

from src.config.api_config import COORDINATES_API
from langchain.tools import tool

@tool
def get_coordinates (location: str) -> dict:
    """
    Tool used to get the exact latitude and longitude of a give location
    
    REQUIREMENTS:
    The location can be a city or locality or anything, it should be a string WITHOUT andy special characters
    """
    
    headers = {
        "User-Agent": "LangChainItineraryAgent/1.0 (your.email@gmail.com)"
    }
    
    params = {
        "q": location,
        "format": "json",
        "limit": 1
    }
    
    response = requests.get (COORDINATES_API, headers=headers, params=params)
    
    response.raise_for_status ()
    
    return response.json ()