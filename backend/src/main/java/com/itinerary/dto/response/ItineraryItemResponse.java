package com.itinerary.dto.response;

import com.itinerary.entity.enums.ItemType;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalTime;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ItineraryItemResponse {
    private Long id;
    private Long itineraryDayId;
    private ItemType itemType;
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