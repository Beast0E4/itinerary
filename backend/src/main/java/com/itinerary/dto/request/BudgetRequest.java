package com.itinerary.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.*;
import java.math.BigDecimal;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class BudgetRequest {

    @NotNull @PositiveOrZero
    private BigDecimal totalBudget;

    private String currency;

    @PositiveOrZero private BigDecimal accommodationLimit;
    @PositiveOrZero private BigDecimal transportLimit;
    @PositiveOrZero private BigDecimal foodLimit;
    @PositiveOrZero private BigDecimal activitiesLimit;
    @PositiveOrZero private BigDecimal miscLimit;
}