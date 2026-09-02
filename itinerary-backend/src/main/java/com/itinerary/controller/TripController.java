package com.itinerary.controller;

import com.itinerary.dto.request.TripCreateRequest;
import com.itinerary.dto.request.TripUpdateRequest;
import com.itinerary.dto.response.TripResponse;
import com.itinerary.dto.response.TripSummaryResponse;
import com.itinerary.security.AuthenticatedUser;
import com.itinerary.service.TripService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trips")
@RequiredArgsConstructor
public class TripController {

    private final TripService tripService;
    private final AuthenticatedUser authenticatedUser;

    @PostMapping
    public ResponseEntity<TripResponse> createTrip(@Valid @RequestBody TripCreateRequest request) {
        TripResponse trip = tripService.createTrip(authenticatedUser.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(trip);
    }

    @GetMapping
    public ResponseEntity<List<TripSummaryResponse>> getAllTrips() {
        return ResponseEntity.ok(tripService.getAllTripsForUser(authenticatedUser.getId()));
    }

    @GetMapping("/{tripId}")
    public ResponseEntity<TripResponse> getTrip(@PathVariable Long tripId) {
        return ResponseEntity.ok(tripService.getTrip(authenticatedUser.getId(), tripId));
    }

    @PatchMapping("/{tripId}")
    public ResponseEntity<TripResponse> updateTrip(@PathVariable Long tripId,
                                                     @RequestBody TripUpdateRequest request) {
        return ResponseEntity.ok(tripService.updateTrip(authenticatedUser.getId(), tripId, request));
    }

    @DeleteMapping("/{tripId}")
    public ResponseEntity<Void> deleteTrip(@PathVariable Long tripId) {
        tripService.deleteTrip(authenticatedUser.getId(), tripId);
        return ResponseEntity.noContent().build();
    }
}