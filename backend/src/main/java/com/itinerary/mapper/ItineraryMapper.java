package com.itinerary.mapper;

import com.itinerary.dto.response.ItineraryDayResponse;
import com.itinerary.dto.response.ItineraryItemResponse;
import com.itinerary.entity.ItineraryDay;
import com.itinerary.entity.ItineraryItem;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class ItineraryMapper {

    public ItineraryItemResponse toItemResponse(ItineraryItem item) {
        return ItineraryItemResponse.builder()
                .id(item.getId())
                .itineraryDayId(item.getItineraryDay().getId())
                .itemType(item.getItemType())
                .title(item.getTitle())
                .description(item.getDescription())
                .locationName(item.getLocationName())
                .latitude(item.getLatitude())
                .longitude(item.getLongitude())
                .startTime(item.getStartTime())
                .endTime(item.getEndTime())
                .displayOrder(item.getDisplayOrder())
                .cost(item.getCost())
                .currency(item.getCurrency())
                .bookingRef(item.getBookingRef())
                .externalUrl(item.getExternalUrl())
                .build();
    }

    public ItineraryDayResponse toDayResponse(ItineraryDay day) {
        List<ItineraryItemResponse> items = day.getItems() == null
                ? List.of()
                : day.getItems().stream().map(this::toItemResponse).collect(Collectors.toList());

        return ItineraryDayResponse.builder()
                .id(day.getId())
                .dayNumber(day.getDayNumber())
                .date(day.getDate())
                .title(day.getTitle())
                .notes(day.getNotes())
                .items(items)
                .build();
    }
}