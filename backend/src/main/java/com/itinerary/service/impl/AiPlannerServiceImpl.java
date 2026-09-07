package com.itinerary.service.impl;

import com.itinerary.dto.request.AiTripPlanRequest;
import com.itinerary.dto.response.AiTripPlanResponse;
import com.itinerary.dto.response.TripResponse;
import com.itinerary.entity.*;
import com.itinerary.entity.enums.ItemType;
import com.itinerary.exception.BadRequestException;
import com.itinerary.exception.ResourceNotFoundException;
import com.itinerary.mapper.TripMapper;
import com.itinerary.repository.*;
import com.itinerary.service.AiPlannerService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AiPlannerServiceImpl implements AiPlannerService {

    private final RestTemplate aiRestTemplate;
    private final TripRepository tripRepository;
    private final DestinationRepository destinationRepository;
    private final ItineraryDayRepository dayRepository;
    private final ItineraryItemRepository itemRepository;
    private final BudgetRepository budgetRepository;
    private final TripMapper tripMapper;

    @Value("${ai.agent.url}")
    private String aiAgentUrl;

    @Override
    public AiTripPlanResponse requestPlan(Long userId, Long tripId, AiTripPlanRequest request) {
        Trip trip = findTripOrThrow(tripId);
        assertEditable(tripId, userId);

        try {
            return aiRestTemplate.postForObject(aiAgentUrl + "/plan", request, AiTripPlanResponse.class);
        } catch (RestClientException ex) {
            throw new BadRequestException(
                    "Could not reach the AI planning service. Is it running at " + aiAgentUrl + "?");
        }
    }

    @Override
    @Transactional
    public TripResponse applyPlan(Long userId, Long tripId, AiTripPlanResponse plan) {
        Trip trip = findTripOrThrow(tripId);
        assertEditable(tripId, userId);

        // Replace any existing destinations for a clean slate.
        List<Destination> existingDestinations = destinationRepository.findByTripIdOrderByDisplayOrderAsc(tripId);
        destinationRepository.deleteAll(existingDestinations);

        if (plan.getDestinations() != null) {
            int destOrder = 0;
            for (AiTripPlanResponse.ProposedDestination proposedDestination : plan.getDestinations()) {
                Destination destination = Destination.builder()
                        .trip(trip)
                        .name(proposedDestination.getName())
                        .country(proposedDestination.getCountry())
                        .city(proposedDestination.getCity())
                        .latitude(proposedDestination.getLatitude())
                        .longitude(proposedDestination.getLongitude())
                        .arrivalDate(proposedDestination.getArrivalDate())
                        .departureDate(proposedDestination.getDepartureDate())
                        .displayOrder(destOrder++)
                        .build();
                destinationRepository.save(destination);
            }
        }

        // Replace any existing itinerary days for a clean slate.
        List<ItineraryDay> existingDays = dayRepository.findByTripIdOrderByDayNumberAsc(tripId);
        dayRepository.deleteAll(existingDays);

        if (plan.getDays() != null) {
            for (AiTripPlanResponse.ProposedDay proposedDay : plan.getDays()) {
                ItineraryDay day = ItineraryDay.builder()
                        .trip(trip)
                        .dayNumber(proposedDay.getDayNumber())
                        .date(proposedDay.getDate())
                        .title(proposedDay.getTitle())
                        .build();
                ItineraryDay savedDay = dayRepository.save(day);

                if (proposedDay.getItems() != null) {
                    int order = 0;
                    for (AiTripPlanResponse.ProposedItem proposedItem : proposedDay.getItems()) {
                        ItineraryItem item = ItineraryItem.builder()
                                .itineraryDay(savedDay)
                                .itemType(parseItemType(proposedItem.getItemType()))
                                .title(proposedItem.getTitle())
                                .description(proposedItem.getDescription())
                                .locationName(proposedItem.getLocationName())
                                .latitude(proposedItem.getLatitude())
                                .longitude(proposedItem.getLongitude())
                                .startTime(proposedItem.getStartTime())
                                .endTime(proposedItem.getEndTime())
                                .displayOrder(order++)
                                .cost(proposedItem.getEstimatedCost())
                                .currency(proposedItem.getCurrency() != null
                                        ? proposedItem.getCurrency() : trip.getPrimaryCurrency())
                                .build();
                        itemRepository.save(item);
                    }
                }
            }
        }

        if (plan.getBudgetSuggestion() != null) {
            AiTripPlanResponse.BudgetSuggestion suggestion = plan.getBudgetSuggestion();
            Budget budget = budgetRepository.findByTripId(tripId).orElseGet(() ->
                    Budget.builder().trip(trip).build());

            budget.setTotalBudget(nonNullOr(suggestion.getTotalBudget(), budget.getTotalBudget()));
            budget.setAccommodationLimit(nonNullOr(suggestion.getAccommodationLimit(), budget.getAccommodationLimit()));
            budget.setTransportLimit(nonNullOr(suggestion.getTransportLimit(), budget.getTransportLimit()));
            budget.setFoodLimit(nonNullOr(suggestion.getFoodLimit(), budget.getFoodLimit()));
            budget.setActivitiesLimit(nonNullOr(suggestion.getActivitiesLimit(), budget.getActivitiesLimit()));
            budget.setMiscLimit(nonNullOr(suggestion.getMiscLimit(), budget.getMiscLimit()));
            budgetRepository.save(budget);
        }

        return tripMapper.toResponse(tripRepository.findById(tripId).orElseThrow());
    }

    private BigDecimal nonNullOr(BigDecimal value, BigDecimal fallback) {
        return value != null ? value : fallback;
    }

    private ItemType parseItemType(String raw) {
        if (raw == null) return ItemType.OTHER;
        try {
            return ItemType.valueOf(raw.trim().toUpperCase());
        } catch (IllegalArgumentException ex) {
            return ItemType.OTHER;
        }
    }

    private Trip findTripOrThrow(Long tripId) {
        return tripRepository.findById(tripId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found: " + tripId));
    }

    private void assertEditable(Long tripId, Long userId) {
        if (!tripRepository.isEditableByUser(tripId, userId)) {
            throw new AccessDeniedException("You do not have edit permission for this trip");
        }
    }
}