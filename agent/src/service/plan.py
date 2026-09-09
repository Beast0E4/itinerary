import json
from src.models.plan import AiTripPlanRequest, AiTripPlanResponse
from agent import run_agent

async def generate_trip_plan(request: AiTripPlanRequest):
    start_loc = request.startLocationText or "an unspecified location"
    if request.startLatitude is not None and request.startLongitude is not None:
        start_loc += f" (Coordinates: {request.startLatitude}, {request.startLongitude})"

    destinations = ", ".join(request.destinations) if request.destinations else "unspecified destinations"

    date_constraints = ""
    if request.startDate and request.endDate:
        date_constraints = f"""
    - Trip Dates: From {request.startDate} to {request.endDate}
    - CRITICAL REQUIREMENT: You MUST generate an itinerary day entry for EVERY single date from {request.startDate} to {request.endDate} inclusive. Day 1 is {request.startDate}, Day 2 is the next day, and so on until {request.endDate}. Do not skip any dates."""
    elif request.startDate:
        date_constraints = f"\n    - Starting Date: {request.startDate}"

    prompt = f"""
    Please create a trip itinerary with the following constraints:
    - Starting From: {start_loc}
    - Destinations: {destinations}{date_constraints}
    - Total Budget: {request.budget} {request.currency}
    - Preferences: {request.preferences or 'general sightseeing'}

    Use the available tools to gather real weather, route, and cost
    information before finalizing the plan. Ensure that every calendar day in the requested date range has a corresponding plan in the 'days' array.
    """

    try:
        async for event in run_agent({"input": prompt}):
            kind = event["event"]

            if kind == "on_tool_start":
                tool_name = event["name"]
                ui_message = f"Gathering data using {tool_name}..."

                if tool_name == "get_weather":
                    ui_message = "Checking local weather forecasts..."
                elif tool_name == "get_route":
                    ui_message = "Calculating travel routes and distances..."
                elif tool_name == "get_coordinates":
                    ui_message = "Locating coordinates..."

                chunk = json.dumps({"message": ui_message})
                yield f"event: progress\ndata: {chunk}\n\n"

            elif kind == "on_tool_end":
                # Immediately unblock UI from the tool spinner into synthesizing phase
                tool_name = event.get("name")
                if tool_name in ["get_weather", "get_route", "get_coordinates"]:
                    chunk = json.dumps({"message": "Synthesizing schedule and finalizing itinerary..."})
                    yield f"event: progress\ndata: {chunk}\n\n"

            elif kind == "on_chain_end" and event.get("name") == "TripPlanner":
                output_data = event.get("data", {}).get("output", {})
                
                structured = (
                    output_data.get("structured_response")
                    if isinstance(output_data, dict)
                    else None
                )

                if structured is None:
                    error_chunk = json.dumps({
                        "message": "The AI didn't return a valid itinerary. Please try again."
                    })
                    yield f"event: error\ndata: {error_chunk}\n\n"
                    continue

                try:
                    response_obj = (
                        structured
                        if isinstance(structured, AiTripPlanResponse)
                        else AiTripPlanResponse.model_validate(structured)
                    )

                    chunk = response_obj.model_dump_json(by_alias=True)
                    yield f"event: complete\ndata: {chunk}\n\n"
                except Exception as parse_error:
                    error_chunk = json.dumps({
                        "message": f"Failed to format itinerary: {str(parse_error)}"
                    })
                    yield f"event: error\ndata: {error_chunk}\n\n"

    except Exception as e:
        error_chunk = json.dumps({"message": f"Agent failed: {str(e)}"})
        yield f"event: error\ndata: {error_chunk}\n\n"