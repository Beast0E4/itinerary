from fastapi import APIRouter
from src.models.plan import AiTripPlanRequest, AiTripPlanResponse
from src.service.plan import generate_trip_plan

router = APIRouter()

@router.post("/plan", response_model=AiTripPlanResponse)
async def plan_trip(request: AiTripPlanRequest):
    response = generate_trip_plan (request)
    return response