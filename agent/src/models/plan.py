from pydantic import BaseModel, Field
from typing import List, Optional
from decimal import Decimal
from datetime import date, time

# --- REQUEST MODEL ---

class AiTripPlanRequest(BaseModel):
    startLatitude: Optional[float] = None
    startLongitude: Optional[float] = None
    startLocationText: Optional[str] = None
    destinations: List[str] = Field(default_factory=list)
    budget: Decimal  # Maps to Java BigDecimal (@NotNull)
    currency: str = "USD"
    preferences: Optional[str] = None


# --- RESPONSE MODELS ---

class ProposedDestination(BaseModel):
    name: Optional[str] = None
    country: Optional[str] = None
    city: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    arrivalDate: Optional[date] = None  # Maps to Java LocalDate (YYYY-MM-DD)
    departureDate: Optional[date] = None

class ProposedItem(BaseModel):
    itemType: Optional[str] = None  # FLIGHT, ACTIVITY, MEAL, etc.
    title: Optional[str] = None
    description: Optional[str] = None
    locationName: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    startTime: Optional[time] = None  # Maps to Java LocalTime (HH:MM:SS)
    endTime: Optional[time] = None
    estimatedCost: Optional[Decimal] = None
    currency: Optional[str] = None

class ProposedDay(BaseModel):
    dayNumber: Optional[int] = None
    date: Optional[date] = None
    title: Optional[str] = None
    items: List[ProposedItem] = Field(default_factory=list)

class BudgetSuggestion(BaseModel):
    totalBudget: Optional[Decimal] = None
    accommodationLimit: Optional[Decimal] = None
    transportLimit: Optional[Decimal] = None
    foodLimit: Optional[Decimal] = None
    activitiesLimit: Optional[Decimal] = None
    miscLimit: Optional[Decimal] = None

class AiTripPlanResponse(BaseModel):
    status: Optional[str] = None
    summary: Optional[str] = None
    destinations: List[ProposedDestination] = Field(default_factory=list)
    days: List[ProposedDay] = Field(default_factory=list)
    budgetSuggestion: Optional[BudgetSuggestion] = None