package com.itinerary.service;

import com.itinerary.dto.request.BudgetRequest;
import com.itinerary.dto.response.BudgetSummaryResponse;

public interface BudgetService {
    BudgetSummaryResponse getBudgetSummary(Long userId, Long tripId);
    BudgetSummaryResponse updateBudget(Long userId, Long tripId, BudgetRequest request);
}