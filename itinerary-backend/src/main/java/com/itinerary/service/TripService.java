package com.itinerary.service;

import com.itinerary.dto.request.TripCreateRequest;
import com.itinerary.dto.request.TripUpdateRequest;
import com.itinerary.dto.response.TripResponse;
import com.itinerary.dto.response.TripSummaryResponse;

import java.util.List;

public interface TripService {
    TripResponse createTrip(Long userId, TripCreateRequest request);
    TripResponse getTrip(Long userId, Long tripId);
    List<TripSummaryResponse> getAllTripsForUser(Long userId);
    TripResponse updateTrip(Long userId, Long tripId, TripUpdateRequest request);
    void deleteTrip(Long userId, Long tripId);
}