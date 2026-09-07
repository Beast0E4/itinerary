package com.itinerary.controller;

import com.itinerary.dto.request.AiTripPlanRequest;
import com.itinerary.dto.response.AiTripPlanResponse;
import com.itinerary.dto.response.TripResponse;
import com.itinerary.security.AuthenticatedUser;
import com.itinerary.service.AiPlannerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/trips/{tripId}/ai")
@RequiredArgsConstructor
public class AiPlannerController {

    private final AiPlannerService aiPlannerService;
    private final AuthenticatedUser authenticatedUser;

    /** Preview only — nothing is saved. Frontend shows this plan and lets the person approve or discard it. */
    @PostMapping("/plan")
    public AiTripPlanResponse planTrip(@PathVariable Long tripId, @Valid @RequestBody AiTripPlanRequest request) {
        return aiPlannerService.requestPlan(authenticatedUser.getId(), tripId, request);
    }

    /** Commits a previously-returned plan into the trip's real itinerary + budget. */
    @PostMapping("/plan/apply")
    public TripResponse applyPlan(@PathVariable Long tripId, @RequestBody AiTripPlanResponse plan) {
        return aiPlannerService.applyPlan(authenticatedUser.getId(), tripId, plan);
    }
}