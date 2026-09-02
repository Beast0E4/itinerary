package com.itinerary.service;

import com.itinerary.dto.request.ItineraryItemRequest;
import com.itinerary.dto.response.ItineraryDayResponse;
import com.itinerary.dto.response.ItineraryItemResponse;

import java.util.List;

public interface ItineraryService {
    List<ItineraryDayResponse> getItineraryForTrip(Long userId, Long tripId);
    ItineraryItemResponse addItem(Long userId, Long tripId, ItineraryItemRequest request);
    ItineraryItemResponse updateItem(Long userId, Long tripId, Long itemId, ItineraryItemRequest request);
    void deleteItem(Long userId, Long tripId, Long itemId);
    void reorderItems(Long userId, Long tripId, Long dayId, List<Long> orderedItemIds);
}