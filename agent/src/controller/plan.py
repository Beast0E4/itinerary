from fastapi import APIRouter
from fastapi.responses import StreamingResponse

from src.models.plan import AiTripPlanRequest, AiTripPlanResponse
from src.service.plan import generate_trip_plan

router = APIRouter()

@router.post("/plan/stream")
async def plan_trip_stream(request: AiTripPlanRequest):
    return StreamingResponse (
        generate_trip_plan (request), 
        media_type="text/event-stream"
    )