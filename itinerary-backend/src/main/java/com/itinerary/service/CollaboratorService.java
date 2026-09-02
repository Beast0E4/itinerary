package com.itinerary.service;

import com.itinerary.dto.request.CollaboratorInviteRequest;
import com.itinerary.entity.Collaborator;

import java.util.List;

public interface CollaboratorService {
    List<Collaborator> getCollaborators(Long userId, Long tripId);
    Collaborator invite(Long userId, Long tripId, CollaboratorInviteRequest request);
    void removeCollaborator(Long userId, Long tripId, Long collaboratorUserId);
    Collaborator acceptInvite(Long userId, Long tripId);
}