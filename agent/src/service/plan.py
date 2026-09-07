from fastapi import HTTPException

from langchain_core.output_parsers import PydanticOutputParser
from src.models.plan import AiTripPlanRequest, AiTripPlanResponse

from agent import run_agent

def generate_trip_plan(request: AiTripPlanRequest) -> AiTripPlanResponse:
    parser = PydanticOutputParser(pydantic_object=AiTripPlanResponse)
    
    start_loc = request.startLocationText or "an unspecified location"
    if request.startLatitude is not None and request.startLongitude is not None:
        start_loc += f" (Coordinates: {request.startLatitude}, {request.startLongitude})"
        
    destinations = ", ".join(request.destinations) if request.destinations else "unspecified destinations"
    
    prompt = f"""
    Please create a trip itinerary with the following constraints:
    - Starting From: {start_loc}
    - Destinations: {destinations}
    - Total Budget: {request.budget} {request.currency}
    - Preferences: {request.preferences or 'general sightseeing'}
    
    {parser.get_format_instructions()}
    """
    
    agent_input_dict = {"input": prompt}
    
    try:
        agent_result = run_agent(agent_input_dict)
        
        response_obj = parser.parse(agent_result["output"])
        response_obj.status = "SUCCESS"
        
        print(response_obj, flush=True)
        
        return response_obj
        
    except Exception as e:        
        raise HTTPException(status_code=500, detail=f"Parse Error: {str(e)}")