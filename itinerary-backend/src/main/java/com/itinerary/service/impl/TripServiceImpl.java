package com.itinerary.service.impl;

import com.itinerary.dto.request.TripCreateRequest;
import com.itinerary.dto.request.TripUpdateRequest;
import com.itinerary.dto.response.TripResponse;
import com.itinerary.dto.response.TripSummaryResponse;
import com.itinerary.entity.Budget;
import com.itinerary.entity.Trip;
import com.itinerary.entity.User;
import com.itinerary.exception.ResourceNotFoundException;
import com.itinerary.mapper.TripMapper;
import com.itinerary.repository.TripRepository;
import com.itinerary.repository.UserRepository;
import com.itinerary.service.TripService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TripServiceImpl implements TripService {

    private final TripRepository tripRepository;
    private final UserRepository userRepository;
    private final TripMapper tripMapper;

    @Override
    @Transactional
    public TripResponse createTrip(Long userId, TripCreateRequest request) {
        User owner = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (request.getEndDate().isBefore(request.getStartDate())) {
            throw new com.itinerary.exception.BadRequestException("End date must be after start date");
        }

        Trip trip = Trip.builder()
                .owner(owner)
                .title(request.getTitle())
                .description(request.getDescription())
                .coverImageUrl(request.getCoverImageUrl())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .primaryCurrency(request.getPrimaryCurrency())
                .isPublic(request.getIsPublic())
                .build();

        Trip saved = tripRepository.save(trip);

        Budget budget = Budget.builder()
                .trip(saved)
                .totalBudget(BigDecimal.ZERO)
                .currency(request.getPrimaryCurrency())
                .build();
        saved.setBudget(budget);

        return tripMapper.toResponse(tripRepository.save(saved));
    }

    @Override
    public TripResponse getTrip(Long userId, Long tripId) {
        Trip trip = findTripOrThrow(tripId);
        assertAccessible(tripId, userId);
        return tripMapper.toResponse(trip);
    }

    @Override
    public List<TripSummaryResponse> getAllTripsForUser(Long userId) {
        return tripRepository.findAllAccessibleByUser(userId).stream()
                .map(tripMapper::toSummary)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public TripResponse updateTrip(Long userId, Long tripId, TripUpdateRequest request) {
        Trip trip = findTripOrThrow(tripId);
        assertEditable(tripId, userId);

        if (request.getTitle() != null) trip.setTitle(request.getTitle());
        if (request.getDescription() != null) trip.setDescription(request.getDescription());
        if (request.getCoverImageUrl() != null) trip.setCoverImageUrl(request.getCoverImageUrl());
        if (request.getStartDate() != null) trip.setStartDate(request.getStartDate());
        if (request.getEndDate() != null) trip.setEndDate(request.getEndDate());
        if (request.getStatus() != null) trip.setStatus(request.getStatus());
        if (request.getPrimaryCurrency() != null) trip.setPrimaryCurrency(request.getPrimaryCurrency());
        if (request.getIsPublic() != null) trip.setIsPublic(request.getIsPublic());

        return tripMapper.toResponse(tripRepository.save(trip));
    }

    @Override
    @Transactional
    public void deleteTrip(Long userId, Long tripId) {
        Trip trip = findTripOrThrow(tripId);
        if (!trip.getOwner().getId().equals(userId)) {
            throw new AccessDeniedException("Only the trip owner can delete this trip");
        }
        tripRepository.delete(trip);
    }

    private Trip findTripOrThrow(Long tripId) {
        return tripRepository.findById(tripId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found: " + tripId));
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