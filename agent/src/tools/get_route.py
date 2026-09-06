import requests
from src.config.api_config import INTER_LOCATION_API
from langchain.tools import tool

@tool
def get_route(lon1: float, lat1: float, lon2: float, lat2: float) -> dict:
    """
    Tool used to get the driving distance and estimated travel time between two coordinates.
    
    Starting coordinates => latitude: lat1, longitude: lon1
    Destination coordinates => latitude: lat2, longitude: lon2 
    """

    coordinate_string = f"{lon1},{lat1};{lon2},{lat2}"
    url = f"{INTER_LOCATION_API}{coordinate_string}"
    
    params = {"overview": "false"} 
    
    response = requests.get (url, params=params)
    response.raise_for_status ()
    
    data = response.json ()
    
    if data.get("code") != "Ok":
        return {"error": f"Routing failed with code: {data.get('code')}"}
        
    return data