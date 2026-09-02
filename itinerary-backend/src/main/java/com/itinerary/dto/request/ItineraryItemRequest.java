package com.itinerary.dto.request;

import com.itinerary.entity.enums.ItemType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalTime;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ItineraryItemRequest {

    @NotNull
    private Long itineraryDayId;

    @NotNull
    private ItemType itemType;

    @NotBlank
    private String title;

    private String description;
    private String locationName;
    private Double latitude;
    private Double longitude;
    private LocalTime startTime;
    private LocalTime endTime;
    private Integer displayOrder;
    private BigDecimal cost;
    private String currency;
    private String bookingRef;
    private String externalUrl;
}