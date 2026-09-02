package com.itinerary.dto.request;

import com.itinerary.entity.enums.TripStatus;
import jakarta.validation.constraints.Size;
import lombok.*;
import java.time.LocalDate;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class TripUpdateRequest {

    @Size(max = 200)
    private String title;

    private String description;
    private String coverImageUrl;
    private LocalDate startDate;
    private LocalDate endDate;
    private TripStatus status;
    private String primaryCurrency;
    private Boolean isPublic;
}