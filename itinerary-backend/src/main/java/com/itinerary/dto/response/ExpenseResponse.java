package com.itinerary.dto.response;

import com.itinerary.entity.enums.ExpenseCategory;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ExpenseResponse {
    private Long id;
    private ExpenseCategory category;
    private String description;
    private BigDecimal amount;
    private String currency;
    private LocalDate expenseDate;
    private String receiptUrl;
    private Long paidByUserId;
    private String paidByName;
}