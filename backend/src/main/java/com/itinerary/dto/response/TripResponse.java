package com.itinerary.dto.response;

import com.itinerary.entity.enums.TripStatus;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class TripResponse {
    private Long id;
    private Long ownerId;
    private String ownerName;
    private String title;
    private String description;
    private String coverImageUrl;
    private LocalDate startDate;
    private LocalDate endDate;
    private TripStatus status;
    private String primaryCurrency;
    private Boolean isPublic;
    private List<DestinationResponse> destinations;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class DestinationResponse {
        private Long id;
        private String name;
        private String country;
        private String city;
        private Double latitude;
        private Double longitude;
        private LocalDate arrivalDate;
        private LocalDate departureDate;
        private Integer displayOrder;
    }
}