package com.itinerary.dto.request;

import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDate;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class TripCreateRequest {

    @NotBlank
    @Size(max = 200)
    private String title;

    private String description;

    private String coverImageUrl;

    @NotNull
    private LocalDate startDate;

    @NotNull
    private LocalDate endDate;

    @Builder.Default
    private String primaryCurrency = "USD";

    @Builder.Default
    private Boolean isPublic = false;
}