package com.itinerary.service.impl;

import com.itinerary.dto.request.PackingItemRequest;
import com.itinerary.entity.PackingListItem;
import com.itinerary.entity.Trip;
import com.itinerary.exception.ResourceNotFoundException;
import com.itinerary.repository.PackingListItemRepository;
import com.itinerary.repository.TripRepository;
import com.itinerary.service.PackingListService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PackingListServiceImpl implements PackingListService {

    private final PackingListItemRepository packingRepository;
    private final TripRepository tripRepository;

    @Override
    public List<PackingListItem> getPackingList(Long userId, Long tripId) {
        assertAccessible(tripId, userId);
        return packingRepository.findByTripIdOrderByCategoryAsc(tripId);
    }

    @Override
    @Transactional
    public PackingListItem addItem(Long userId, Long tripId, PackingItemRequest request) {
        assertEditable(tripId, userId);
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found"));

        PackingListItem item = PackingListItem.builder()
                .trip(trip)
                .category(request.getCategory())
                .itemName(request.getItemName())
                .quantity(request.getQuantity())
                .isPacked(request.getIsPacked() != null ? request.getIsPacked() : false)
                .build();

        return packingRepository.save(item);
    }

    @Override
    @Transactional
    public PackingListItem updateItem(Long userId, Long tripId, Long itemId, PackingItemRequest request) {
        assertEditable(tripId, userId);
        PackingListItem item = packingRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Packing item not found"));

        if (!item.getTrip().getId().equals(tripId)) {
            throw new AccessDeniedException("Item does not belong to this trip");
        }

        if (request.getCategory() != null) item.setCategory(request.getCategory());
        if (request.getItemName() != null) item.setItemName(request.getItemName());
        if (request.getQuantity() != null) item.setQuantity(request.getQuantity());
        if (request.getIsPacked() != null) item.setIsPacked(request.getIsPacked());

        return packingRepository.save(item);
    }

    @Override
    @Transactional
    public void deleteItem(Long userId, Long tripId, Long itemId) {
        assertEditable(tripId, userId);
        PackingListItem item = packingRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Packing item not found"));

        if (!item.getTrip().getId().equals(tripId)) {
            throw new AccessDeniedException("Item does not belong to this trip");
        }
        packingRepository.delete(item);
    }

    private void assertAccessible(Long tripId, Long userId) {
        if (!tripRepository.isAccessibleByUser(tripId, userId)) {
            throw new AccessDeniedException("You do not have access to this trip");
        }
    }

    private void assertEditable(Long tripId, Long userId) {
        if (!tripRepository.isEditableByUser(tripId, userId)) {
            throw new AccessDeniedException("You do not have edit permission for this trip");
        }
    }
}