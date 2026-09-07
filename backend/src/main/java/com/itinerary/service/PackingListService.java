package com.itinerary.service;

import com.itinerary.dto.request.PackingItemRequest;
import com.itinerary.entity.PackingListItem;

import java.util.List;

public interface PackingListService {
    List<PackingListItem> getPackingList(Long userId, Long tripId);
    PackingListItem addItem(Long userId, Long tripId, PackingItemRequest request);
    PackingListItem updateItem(Long userId, Long tripId, Long itemId, PackingItemRequest request);
    void deleteItem(Long userId, Long tripId, Long itemId);
}