package com.itinerary.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.math.BigDecimal;
import java.util.List;

/**
 * What Atlas sends to the external AI planning service. The starting
 * location can come from the browser's geolocation (lat/lng) or a typed
 * fallback (startLocationText) -- exactly one of the two is ever
 * populated, never both.
 *
 * destinations is a wishlist of places the person definitely wants
 * included in the trip (e.g. ["Manali", "Shimla"]). It may be empty,
 * meaning "you (the AI) choose the destination(s) that fit my budget
 * and starting point" -- fully open trip discovery. When non-empty, the
 * AI service should build an itinerary that visits all listed places
 * (in whatever order makes sense) rather than substituting alternatives.
 */
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AiTripPlanRequest {

    private Double startLatitude;
    private Double startLongitude;
    private String startLocationText;

    @Builder.Default
    private List<String> destinations = List.of();

    @NotNull
    private BigDecimal budget;

    @Builder.Default
    private String currency = "USD";

    /** Free-text hints: "relaxed pace, food-focused, avoid long hikes" etc. */
    private String preferences;
}