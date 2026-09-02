package com.itinerary.service.impl;

import com.itinerary.dto.request.ItineraryItemRequest;
import com.itinerary.dto.response.ItineraryDayResponse;
import com.itinerary.dto.response.ItineraryItemResponse;
import com.itinerary.entity.ItineraryDay;
import com.itinerary.entity.ItineraryItem;
import com.itinerary.exception.ResourceNotFoundException;
import com.itinerary.mapper.ItineraryMapper;
import com.itinerary.repository.ItineraryDayRepository;
import com.itinerary.repository.ItineraryItemRepository;
import com.itinerary.repository.TripRepository;
import com.itinerary.service.ItineraryService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ItineraryServiceImpl implements ItineraryService {

    private final ItineraryDayRepository dayRepository;
    private final ItineraryItemRepository itemRepository;
    private final TripRepository tripRepository;
    private final ItineraryMapper itineraryMapper;

    @Override
    public List<ItineraryDayResponse> getItineraryForTrip(Long userId, Long tripId) {
        assertAccessible(tripId, userId);
        return dayRepository.findByTripIdOrderByDayNumberAsc(tripId).stream()
                .map(itineraryMapper::toDayResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ItineraryItemResponse addItem(Long userId, Long tripId, ItineraryItemRequest request) {
        assertEditable(tripId, userId);

        ItineraryDay day = dayRepository.findById(request.getItineraryDayId())
                .orElseThrow(() -> new ResourceNotFoundException("Itinerary day not found"));

        if (!day.getTrip().getId().equals(tripId)) {
            throw new AccessDeniedException("Day does not belong to this trip");
        }

        int order = request.getDisplayOrder() != null
                ? request.getDisplayOrder()
                : itemRepository.findByItineraryDayIdOrderByDisplayOrderAsc(day.getId()).size();

        ItineraryItem item = ItineraryItem.builder()
                .itineraryDay(day)
                .itemType(request.getItemType())
                .title(request.getTitle())
                .description(request.getDescription())
                .locationName(request.getLocationName())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .displayOrder(order)
                .cost(request.getCost())
                .currency(request.getCurrency())
                .bookingRef(request.getBookingRef())
                .externalUrl(request.getExternalUrl())
                .build();

        return itineraryMapper.toItemResponse(itemRepository.save(item));
    }

    @Override
    @Transactional
    public ItineraryItemResponse updateItem(Long userId, Long tripId, Long itemId, ItineraryItemRequest request) {
        assertEditable(tripId, userId);

        ItineraryItem item = itemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Itinerary item not found"));

        if (!item.getItineraryDay().getTrip().getId().equals(tripId)) {
            throw new AccessDeniedException("Item does not belong to this trip");
        }

        item.setItemType(request.getItemType());
        item.setTitle(request.getTitle());
        item.setDescription(request.getDescription());
        item.setLocationName(request.getLocationName());
        item.setLatitude(request.getLatitude());
        item.setLongitude(request.getLongitude());
        item.setStartTime(request.getStartTime());
        item.setEndTime(request.getEndTime());
        if (request.getDisplayOrder() != null) item.setDisplayOrder(request.getDisplayOrder());
        item.setCost(request.getCost());
        item.setCurrency(request.getCurrency());
        item.setBookingRef(request.getBookingRef());
        item.setExternalUrl(request.getExternalUrl());

        return itineraryMapper.toItemResponse(itemRepository.save(item));
    }

    @Override
    @Transactional
    public void deleteItem(Long userId, Long tripId, Long itemId) {
        assertEditable(tripId, userId);

        ItineraryItem item = itemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Itinerary item not found"));

        if (!item.getItineraryDay().getTrip().getId().equals(tripId)) {
            throw new AccessDeniedException("Item does not belong to this trip");
        }

        itemRepository.delete(item);
    }

    @Override
    @Transactional
    public void reorderItems(Long userId, Long tripId, Long dayId, List<Long> orderedItemIds) {
        assertEditable(tripId, userId);

        List<ItineraryItem> items = itemRepository.findByItineraryDayIdOrderByDisplayOrderAsc(dayId);
        Map<Long, ItineraryItem> byId = items.stream()
                .collect(Collectors.toMap(ItineraryItem::getId, i -> i));

        for (int i = 0; i < orderedItemIds.size(); i++) {
            ItineraryItem item = byId.get(orderedItemIds.get(i));
            if (item != null) {
                item.setDisplayOrder(i);
            }
        }
        itemRepository.saveAll(items);
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