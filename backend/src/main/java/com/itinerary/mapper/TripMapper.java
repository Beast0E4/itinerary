package com.itinerary.mapper;

import com.itinerary.dto.response.TripResponse;
import com.itinerary.dto.response.TripSummaryResponse;
import com.itinerary.entity.Destination;
import com.itinerary.entity.Trip;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class TripMapper {

    public TripSummaryResponse toSummary(Trip trip) {
        return TripSummaryResponse.builder()
                .id(trip.getId())
                .title(trip.getTitle())
                .coverImageUrl(trip.getCoverImageUrl())
                .startDate(trip.getStartDate())
                .endDate(trip.getEndDate())
                .status(trip.getStatus())
                .primaryCurrency(trip.getPrimaryCurrency())
                .destinationCount(trip.getDestinations() != null ? trip.getDestinations().size() : 0)
                .daysCount(trip.getItineraryDays() != null ? trip.getItineraryDays().size() : 0)
                .build();
    }

    public TripResponse toResponse(Trip trip) {
        List<TripResponse.DestinationResponse> destinations = trip.getDestinations() == null
                ? List.of()
                : trip.getDestinations().stream().map(this::toDestinationResponse).collect(Collectors.toList());

        return TripResponse.builder()
                .id(trip.getId())
                .ownerId(trip.getOwner().getId())
                .ownerName(trip.getOwner().getFullName())
                .title(trip.getTitle())
                .description(trip.getDescription())
                .coverImageUrl(trip.getCoverImageUrl())
                .startDate(trip.getStartDate())
                .endDate(trip.getEndDate())
                .status(trip.getStatus())
                .primaryCurrency(trip.getPrimaryCurrency())
                .isPublic(trip.getIsPublic())
                .destinations(destinations)
                .createdAt(trip.getCreatedAt())
                .updatedAt(trip.getUpdatedAt())
                .build();
    }

    private TripResponse.DestinationResponse toDestinationResponse(Destination d) {
        return TripResponse.DestinationResponse.builder()
                .id(d.getId())
                .name(d.getName())
                .country(d.getCountry())
                .city(d.getCity())
                .latitude(d.getLatitude())
                .longitude(d.getLongitude())
                .arrivalDate(d.getArrivalDate())
                .departureDate(d.getDepartureDate())
                .displayOrder(d.getDisplayOrder())
                .build();
    }
}