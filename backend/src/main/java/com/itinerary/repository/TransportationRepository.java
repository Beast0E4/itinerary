package com.itinerary.repository;

import com.itinerary.entity.Transportation;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TransportationRepository extends JpaRepository<Transportation, Long> {
    List<Transportation> findByTripIdOrderByDepartureDatetimeAsc(Long tripId);
}