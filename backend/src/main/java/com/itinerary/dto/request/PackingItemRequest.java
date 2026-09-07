package com.itinerary.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Min;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PackingItemRequest {

    @Builder.Default
    private String category = "General";

    @NotBlank
    private String itemName;

    @Min(1)
    @Builder.Default
    private Integer quantity = 1;

    private Boolean isPacked;
}