package com.itinerary.repository;

import com.itinerary.entity.Accommodation;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AccommodationRepository extends JpaRepository<Accommodation, Long> {
    List<Accommodation> findByTripIdOrderByCheckInDateAsc(Long tripId);
}