package com.itinerary.repository;

import com.itinerary.entity.Activity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ActivityRepository extends JpaRepository<Activity, Long> {
    List<Activity> findByTripId(Long tripId);
    List<Activity> findByTripIdAndBooked(Long tripId, Boolean booked);
}