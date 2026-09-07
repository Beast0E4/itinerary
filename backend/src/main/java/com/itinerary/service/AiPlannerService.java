package com.itinerary.service;

import com.itinerary.dto.request.AiTripPlanRequest;
import com.itinerary.dto.response.AiTripPlanResponse;
import com.itinerary.dto.response.TripResponse;

public interface AiPlannerService {

    /**
     * Sends the trip context to the external Python agent and returns
     * its proposed plan, WITHOUT saving anything yet — this is the
     * "preview" step so the person can review before committing.
     */
    AiTripPlanResponse requestPlan(Long userId, Long tripId, AiTripPlanRequest request);

    /**
     * Persists a previously-returned (and person-approved) plan into
     * the trip's itinerary days/items and budget.
     */
    TripResponse applyPlan(Long userId, Long tripId, AiTripPlanResponse plan);
}