package com.itinerary.controller;

import com.itinerary.dto.request.CollaboratorInviteRequest;
import com.itinerary.entity.Collaborator;
import com.itinerary.security.AuthenticatedUser;
import com.itinerary.service.CollaboratorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trips/{tripId}/collaborators")
@RequiredArgsConstructor
public class CollaboratorController {

    private final CollaboratorService collaboratorService;
    private final AuthenticatedUser authenticatedUser;

    @GetMapping
    public ResponseEntity<List<Collaborator>> getCollaborators(@PathVariable Long tripId) {
        return ResponseEntity.ok(collaboratorService.getCollaborators(authenticatedUser.getId(), tripId));
    }

    @PostMapping("/invite")
    public ResponseEntity<Collaborator> invite(@PathVariable Long tripId,
                                                @Valid @RequestBody CollaboratorInviteRequest request) {
        Collaborator collaborator = collaboratorService.invite(authenticatedUser.getId(), tripId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(collaborator);
    }

    @PostMapping("/accept")
    public ResponseEntity<Collaborator> acceptInvite(@PathVariable Long tripId) {
        return ResponseEntity.ok(collaboratorService.acceptInvite(authenticatedUser.getId(), tripId));
    }

    @DeleteMapping("/{collaboratorUserId}")
    public ResponseEntity<Void> removeCollaborator(@PathVariable Long tripId, @PathVariable Long collaboratorUserId) {
        collaboratorService.removeCollaborator(authenticatedUser.getId(), tripId, collaboratorUserId);
        return ResponseEntity.noContent().build();
    }
}