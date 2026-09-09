package com.itinerary.controller;

import com.itinerary.dto.request.AiTripPlanRequest;
import com.itinerary.dto.response.AiTripPlanResponse;
import com.itinerary.dto.response.TripResponse;
import com.itinerary.security.AuthenticatedUser;
import com.itinerary.service.AiPlannerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.codec.ServerSentEvent;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;

@RestController
@RequestMapping("/api/trips/{tripId}/ai")
@RequiredArgsConstructor
public class AiPlannerController {

    private final AiPlannerService aiPlannerService;
    private final AuthenticatedUser authenticatedUser;

    /**
     * Live progress stream while the AI agent works. Nothing is saved --
     * the frontend renders each "progress" event as it arrives, then
     * either shows the plan preview (on "complete") or an error message
     * (on "error"). See AiPlannerServiceImpl.streamPlan() for the relay
     * and timeout/error-handling logic.
     */
    @PostMapping(value = "/plan/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<ServerSentEvent<String>> streamPlan(@PathVariable Long tripId,
                                                      @Valid @RequestBody AiTripPlanRequest request) {
        return aiPlannerService.streamPlan(authenticatedUser.getId(), tripId, request);
    }

    /**
     * Legacy synchronous preview endpoint -- blocks until the agent
     * returns a full plan. Kept for non-UI callers; the AI plan modal
     * uses /plan/stream instead.
     */
    @PostMapping("/plan")
    public AiTripPlanResponse planTrip(@PathVariable Long tripId, @Valid @RequestBody AiTripPlanRequest request) {
        return aiPlannerService.requestPlan(authenticatedUser.getId(), tripId, request);
    }

    /** Commits a previously-returned (and person-approved) plan into the trip's real itinerary + budget. */
    @PostMapping("/plan/apply")
    public TripResponse applyPlan(@PathVariable Long tripId, @RequestBody AiTripPlanResponse plan) {
        return aiPlannerService.applyPlan(authenticatedUser.getId(), tripId, plan);
    }
}