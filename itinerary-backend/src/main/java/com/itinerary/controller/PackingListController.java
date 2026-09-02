package com.itinerary.controller;

import com.itinerary.dto.request.PackingItemRequest;
import com.itinerary.entity.PackingListItem;
import com.itinerary.security.AuthenticatedUser;
import com.itinerary.service.PackingListService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trips/{tripId}/packing-list")
@RequiredArgsConstructor
public class PackingListController {

    private final PackingListService packingListService;
    private final AuthenticatedUser authenticatedUser;

    @GetMapping
    public ResponseEntity<List<PackingListItem>> getItems(@PathVariable Long tripId) {
        return ResponseEntity.ok(packingListService.getPackingList(authenticatedUser.getId(), tripId));
    }

    @PostMapping
    public ResponseEntity<PackingListItem> addItem(@PathVariable Long tripId,
                                                     @Valid @RequestBody PackingItemRequest request) {
        PackingListItem item = packingListService.addItem(authenticatedUser.getId(), tripId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(item);
    }

    @PatchMapping("/{itemId}")
    public ResponseEntity<PackingListItem> updateItem(@PathVariable Long tripId,
                                                        @PathVariable Long itemId,
                                                        @RequestBody PackingItemRequest request) {
        return ResponseEntity.ok(packingListService.updateItem(authenticatedUser.getId(), tripId, itemId, request));
    }

    @DeleteMapping("/{itemId}")
    public ResponseEntity<Void> deleteItem(@PathVariable Long tripId, @PathVariable Long itemId) {
        packingListService.deleteItem(authenticatedUser.getId(), tripId, itemId);
        return ResponseEntity.noContent().build();
    }
}