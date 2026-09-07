package com.itinerary.dto.request;

import com.itinerary.entity.enums.CollaboratorRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CollaboratorInviteRequest {

    @NotBlank
    @Email
    private String email;

    @NotNull
    private CollaboratorRole role;
}