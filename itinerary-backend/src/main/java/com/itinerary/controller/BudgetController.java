package com.itinerary.controller;

import com.itinerary.dto.request.BudgetRequest;
import com.itinerary.dto.response.BudgetSummaryResponse;
import com.itinerary.security.AuthenticatedUser;
import com.itinerary.service.BudgetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/trips/{tripId}/budget")
@RequiredArgsConstructor
public class BudgetController {

    private final BudgetService budgetService;
    private final AuthenticatedUser authenticatedUser;

    @GetMapping
    public BudgetSummaryResponse getBudget(@PathVariable Long tripId) {
        return budgetService.getBudgetSummary(authenticatedUser.getId(), tripId);
    }

    @PutMapping
    public BudgetSummaryResponse updateBudget(@PathVariable Long tripId, @Valid @RequestBody BudgetRequest request) {
        return budgetService.updateBudget(authenticatedUser.getId(), tripId, request);
    }
}