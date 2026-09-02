package com.itinerary.repository;

import com.itinerary.entity.ItineraryItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ItineraryItemRepository extends JpaRepository<ItineraryItem, Long> {
    List<ItineraryItem> findByItineraryDayIdOrderByDisplayOrderAsc(Long dayId);

    @org.springframework.data.jpa.repository.Query("""
        SELECT i FROM ItineraryItem i
        WHERE i.itineraryDay.trip.id = :tripId
        ORDER BY i.itineraryDay.dayNumber ASC, i.displayOrder ASC
        """)
    List<ItineraryItem> findAllByTripIdOrdered(Long tripId);
}