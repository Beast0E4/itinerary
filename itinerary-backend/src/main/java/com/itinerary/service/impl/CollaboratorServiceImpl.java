package com.itinerary.service.impl;

import com.itinerary.dto.request.CollaboratorInviteRequest;
import com.itinerary.entity.Collaborator;
import com.itinerary.entity.Trip;
import com.itinerary.entity.User;
import com.itinerary.exception.BadRequestException;
import com.itinerary.exception.ResourceNotFoundException;
import com.itinerary.repository.CollaboratorRepository;
import com.itinerary.repository.TripRepository;
import com.itinerary.repository.UserRepository;
import com.itinerary.service.CollaboratorService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CollaboratorServiceImpl implements CollaboratorService {

    private final CollaboratorRepository collaboratorRepository;
    private final TripRepository tripRepository;
    private final UserRepository userRepository;

    @Override
    public List<Collaborator> getCollaborators(Long userId, Long tripId) {
        assertAccessible(tripId, userId);
        return collaboratorRepository.findByTripId(tripId);
    }

    @Override
    @Transactional
    public Collaborator invite(Long userId, Long tripId, CollaboratorInviteRequest request) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found"));

        if (!trip.getOwner().getId().equals(userId)) {
            throw new AccessDeniedException("Only the trip owner can invite collaborators");
        }

        User invitee = userRepository.findByEmail(request.getEmail().toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("No user found with that email"));

        if (invitee.getId().equals(trip.getOwner().getId())) {
            throw new BadRequestException("Trip owner is already a collaborator");
        }

        collaboratorRepository.findByTripIdAndUserId(tripId, invitee.getId())
                .ifPresent(c -> { throw new BadRequestException("User is already invited to this trip"); });

        Collaborator collaborator = Collaborator.builder()
                .trip(trip)
                .user(invitee)
                .role(request.getRole())
                .accepted(false)
                .build();

        return collaboratorRepository.save(collaborator);
    }

    @Override
    @Transactional
    public void removeCollaborator(Long userId, Long tripId, Long collaboratorUserId) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found"));

        if (!trip.getOwner().getId().equals(userId)) {
            throw new AccessDeniedException("Only the trip owner can remove collaborators");
        }

        collaboratorRepository.deleteByTripIdAndUserId(tripId, collaboratorUserId);
    }

    @Override
    @Transactional
    public Collaborator acceptInvite(Long userId, Long tripId) {
        Collaborator collaborator = collaboratorRepository.findByTripIdAndUserId(tripId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Invitation not found"));

        collaborator.setAccepted(true);
        return collaboratorRepository.save(collaborator);
    }

    private void assertAccessible(Long tripId, Long userId) {
        if (!tripRepository.isAccessibleByUser(tripId, userId)) {
            throw new AccessDeniedException("You do not have access to this trip");
        }
    }
}