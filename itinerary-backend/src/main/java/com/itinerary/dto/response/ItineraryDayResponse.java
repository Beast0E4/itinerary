package com.itinerary.dto.response;

import lombok.*;
import java.time.LocalDate;
import java.util.List;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ItineraryDayResponse {
    private Long id;
    private Integer dayNumber;
    private LocalDate date;
    private String title;
    private String notes;
    private List<ItineraryItemResponse> items;
}