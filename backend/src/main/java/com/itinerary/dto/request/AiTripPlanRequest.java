package com.itinerary.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiTripPlanRequest {
    private Double startLatitude;
    private Double startLongitude;
    private String startLocationText;

    @Builder.Default
    private List<String> destinations = new ArrayList<>();

    // CHANGED: Use String instead of LocalDate to ensure safe JSON serialization
    private String startDate;
    private String endDate;

    @NotNull
    private BigDecimal budget;

    @Builder.Default
    private String currency = "USD";

    private String preferences;
}