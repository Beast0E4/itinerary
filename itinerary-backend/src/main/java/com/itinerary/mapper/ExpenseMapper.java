package com.itinerary.mapper;

import com.itinerary.dto.response.ExpenseResponse;
import com.itinerary.entity.Expense;
import org.springframework.stereotype.Component;

@Component
public class ExpenseMapper {

    public ExpenseResponse toResponse(Expense expense) {
        return ExpenseResponse.builder()
                .id(expense.getId())
                .category(expense.getCategory())
                .description(expense.getDescription())
                .amount(expense.getAmount())
                .currency(expense.getCurrency())
                .expenseDate(expense.getExpenseDate())
                .receiptUrl(expense.getReceiptUrl())
                .paidByUserId(expense.getPaidBy() != null ? expense.getPaidBy().getId() : null)
                .paidByName(expense.getPaidBy() != null ? expense.getPaidBy().getFullName() : null)
                .build();
    }
}