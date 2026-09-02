package com.itinerary.repository;

import com.itinerary.entity.Trip;
import com.itinerary.entity.enums.TripStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface TripRepository extends JpaRepository<Trip, Long> {

    List<Trip> findByOwnerIdOrderByStartDateDesc(Long ownerId);

    List<Trip> findByOwnerIdAndStatus(Long ownerId, TripStatus status);

    @Query("""
        SELECT DISTINCT t FROM Trip t
        LEFT JOIN t.owner o
        WHERE t.owner.id = :userId
           OR t.id IN (SELECT c.trip.id FROM Collaborator c WHERE c.user.id = :userId AND c.accepted = true)
        ORDER BY t.startDate DESC
        """)
    List<Trip> findAllAccessibleByUser(@Param("userId") Long userId);

    @Query("""
        SELECT CASE WHEN COUNT(t) > 0 THEN true ELSE false END
        FROM Trip t
        WHERE t.id = :tripId
          AND (t.owner.id = :userId
               OR t.id IN (SELECT c.trip.id FROM Collaborator c WHERE c.user.id = :userId AND c.accepted = true))
        """)
    boolean isAccessibleByUser(@Param("tripId") Long tripId, @Param("userId") Long userId);

    @Query("""
        SELECT CASE WHEN COUNT(t) > 0 THEN true ELSE false END
        FROM Trip t
        WHERE t.id = :tripId
          AND (t.owner.id = :userId
               OR t.id IN (SELECT c.trip.id FROM Collaborator c
                           WHERE c.user.id = :userId AND c.accepted = true AND c.role = 'EDITOR'))
        """)
    boolean isEditableByUser(@Param("tripId") Long tripId, @Param("userId") Long userId);
}