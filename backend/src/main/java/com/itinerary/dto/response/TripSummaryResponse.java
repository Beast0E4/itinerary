package com.itinerary.dto.response;

import com.itinerary.entity.enums.TripStatus;
import lombok.*;
import java.time.LocalDate;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class TripSummaryResponse {
    private Long id;
    private String title;
    private String coverImageUrl;
    private LocalDate startDate;
    private LocalDate endDate;
    private TripStatus status;
    private String primaryCurrency;
    private long destinationCount;
    private int daysCount;
}