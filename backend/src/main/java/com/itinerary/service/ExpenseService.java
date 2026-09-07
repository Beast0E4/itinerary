package com.itinerary.service;

import com.itinerary.dto.request.ExpenseRequest;
import com.itinerary.dto.response.ExpenseResponse;

import java.util.List;

public interface ExpenseService {
    List<ExpenseResponse> getExpensesForTrip(Long userId, Long tripId);
    ExpenseResponse addExpense(Long userId, Long tripId, ExpenseRequest request);
    ExpenseResponse updateExpense(Long userId, Long tripId, Long expenseId, ExpenseRequest request);
    void deleteExpense(Long userId, Long tripId, Long expenseId);
}