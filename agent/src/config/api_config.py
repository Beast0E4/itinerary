import os
from dotenv import load_dotenv

load_dotenv ()

COORDINATES_API = os.getenv ('COORDINATES_API')

INTER_LOCATION_API = os.getenv ('INTER_LOCATION_API')

RADIUS_SEARCH_API = os.getenv ('RADIUS_SEARCH_API')

WEATHER_API = os.getenv ('WEATHER_API')

FLIGHTS_API = os.getenv ('FLIGHTS_API')