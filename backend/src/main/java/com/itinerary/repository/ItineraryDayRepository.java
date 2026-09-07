package com.itinerary.repository;

import com.itinerary.entity.ItineraryDay;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ItineraryDayRepository extends JpaRepository<ItineraryDay, Long> {
    List<ItineraryDay> findByTripIdOrderByDayNumberAsc(Long tripId);
    Optional<ItineraryDay> findByTripIdAndDayNumber(Long tripId, Integer dayNumber);
    long countByTripId(Long tripId);
    void deleteByTripId(Long tripId);
}