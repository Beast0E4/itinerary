from src.tools.get_coordinates import get_coordinates
from src.tools.get_route import get_route
from src.tools.get_weather import get_weather

ALL_TOOLS = [
    get_weather,
    get_route,
    get_coordinates
]

def tool_catalog () -> list[dict[str, str]]:
     """
     Name + Description of all tools
     """
     
     return [{"name": tool.name, "description": tool.description} for tool in ALL_TOOLS]