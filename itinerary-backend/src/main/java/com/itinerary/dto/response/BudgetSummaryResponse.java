package com.itinerary.dto.response;

import lombok.*;
import java.math.BigDecimal;
import java.util.Map;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class BudgetSummaryResponse {
    private BigDecimal totalBudget;
    private String currency;
    private BigDecimal totalSpent;
    private BigDecimal remaining;
    private double percentUsed;
    private Map<String, CategoryBreakdown> categoryBreakdown;

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class CategoryBreakdown {
        private BigDecimal limit;
        private BigDecimal spent;
        private double percentUsed;
    }
}