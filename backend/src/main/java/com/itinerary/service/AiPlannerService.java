package com.itinerary.service;

import reactor.core.publisher.Flux;
import org.springframework.http.codec.ServerSentEvent;
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
     * Streams live progress from the Python agent straight through to
     * the caller as Server-Sent Events, ending in exactly one terminal
     * "complete" (payload = AiTripPlanResponse JSON) or "error" event.
     * Nothing is persisted here -- this is still just the preview step.
     */
    Flux<ServerSentEvent<String>> streamPlan(Long userId, Long tripId, AiTripPlanRequest request);

    /**
     * Persists a previously-returned (and person-approved) plan into
     * the trip's itinerary days/items and budget.
     */
    TripResponse applyPlan(Long userId, Long tripId, AiTripPlanResponse plan);
}