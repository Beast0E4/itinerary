package com.itinerary.repository;

import com.itinerary.entity.Collaborator;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface CollaboratorRepository extends JpaRepository<Collaborator, Long> {
    List<Collaborator> findByTripId(Long tripId);
    List<Collaborator> findByUserIdAndAccepted(Long userId, Boolean accepted);
    Optional<Collaborator> findByTripIdAndUserId(Long tripId, Long userId);
    void deleteByTripIdAndUserId(Long tripId, Long userId);
}