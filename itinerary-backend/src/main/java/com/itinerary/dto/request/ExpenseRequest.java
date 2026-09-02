package com.itinerary.dto.request;

import com.itinerary.entity.enums.ExpenseCategory;
import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ExpenseRequest {

    @NotNull
    private ExpenseCategory category;

    @NotBlank
    @Size(max = 300)
    private String description;

    @NotNull
    @Positive
    private BigDecimal amount;

    @Builder.Default
    private String currency = "USD";

    @NotNull
    private LocalDate expenseDate;

    private Long paidByUserId;
    private String receiptUrl;
}