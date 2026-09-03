package com.itinerary.controller;

import com.itinerary.dto.request.ItineraryItemRequest;
import com.itinerary.dto.response.ItineraryDayResponse;
import com.itinerary.dto.response.ItineraryItemResponse;
import com.itinerary.security.AuthenticatedUser;
import com.itinerary.service.ItineraryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/trips/{tripId}/itinerary")
@RequiredArgsConstructor
public class ItineraryController {

    private final ItineraryService itineraryService;
    private final AuthenticatedUser authenticatedUser;

    @GetMapping
    public ResponseEntity<List<ItineraryDayResponse>> getItinerary(@PathVariable Long tripId) {
        return ResponseEntity.ok(itineraryService.getItineraryForTrip(authenticatedUser.getId(), tripId));
    }

    @PostMapping("/items")
    public ResponseEntity<ItineraryItemResponse> addItem(@PathVariable Long tripId,
                                                           @Valid @RequestBody ItineraryItemRequest request) {
        ItineraryItemResponse item = itineraryService.addItem(authenticatedUser.getId(), tripId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(item);
    }

    @PutMapping("/items/{itemId}")
    public ResponseEntity<ItineraryItemResponse> updateItem(@PathVariable Long tripId,
                                                              @PathVariable Long itemId,
                                                              @Valid @RequestBody ItineraryItemRequest request) {
        return ResponseEntity.ok(itineraryService.updateItem(authenticatedUser.getId(), tripId, itemId, request));
    }

    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<Void> deleteItem(@PathVariable Long tripId, @PathVariable Long itemId) {
        itineraryService.deleteItem(authenticatedUser.getId(), tripId, itemId);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/days/{dayId}/reorder")
    public ResponseEntity<Void> reorderItems(@PathVariable Long tripId,
                                              @PathVariable Long dayId,
                                              @RequestBody Map<String, List<Long>> body) {
        itineraryService.reorderItems(authenticatedUser.getId(), tripId, dayId, body.get("orderedItemIds"));
        return ResponseEntity.ok().build();
    }

    @PostMapping("/days/generate")
    public ResponseEntity<List<ItineraryDayResponse>> generateDays(@PathVariable Long tripId) {
        List<ItineraryDayResponse> days = itineraryService.generateDaysForTrip(authenticatedUser.getId(), tripId);
        return ResponseEntity.status(HttpStatus.CREATED).body(days);
    }
}