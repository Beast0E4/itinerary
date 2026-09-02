package com.itinerary.entity;

import com.itinerary.entity.enums.CollaboratorRole;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "collaborators", uniqueConstraints = @UniqueConstraint(columnNames = {"trip_id", "user_id"}))
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Collaborator {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trip_id", nullable = false)
    private Trip trip;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    @Builder.Default
    private CollaboratorRole role = CollaboratorRole.VIEWER;

    @Column(name = "invited_at", updatable = false)
    private LocalDateTime invitedAt;

    @Column(nullable = false)
    @Builder.Default
    private Boolean accepted = false;

    @PrePersist
    protected void onCreate() {
        invitedAt = LocalDateTime.now();
    }
}