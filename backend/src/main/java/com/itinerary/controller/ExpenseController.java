package com.itinerary.controller;

import com.itinerary.dto.request.ExpenseRequest;
import com.itinerary.dto.response.ExpenseResponse;
import com.itinerary.security.AuthenticatedUser;
import com.itinerary.service.ExpenseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trips/{tripId}/expenses")
@RequiredArgsConstructor
public class ExpenseController {

    private final ExpenseService expenseService;
    private final AuthenticatedUser authenticatedUser;

    @GetMapping
    public ResponseEntity<List<ExpenseResponse>> getExpenses(@PathVariable Long tripId) {
        return ResponseEntity.ok(expenseService.getExpensesForTrip(authenticatedUser.getId(), tripId));
    }

    @PostMapping
    public ResponseEntity<ExpenseResponse> addExpense(@PathVariable Long tripId,
                                                        @Valid @RequestBody ExpenseRequest request) {
        ExpenseResponse expense = expenseService.addExpense(authenticatedUser.getId(), tripId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(expense);
    }

    @PutMapping("/{expenseId}")
    public ResponseEntity<ExpenseResponse> updateExpense(@PathVariable Long tripId,
                                                           @PathVariable Long expenseId,
                                                           @Valid @RequestBody ExpenseRequest request) {
        return ResponseEntity.ok(expenseService.updateExpense(authenticatedUser.getId(), tripId, expenseId, request));
    }

    @DeleteMapping("/{expenseId}")
    public ResponseEntity<Void> deleteExpense(@PathVariable Long tripId, @PathVariable Long expenseId) {
        expenseService.deleteExpense(authenticatedUser.getId(), tripId, expenseId);
        return ResponseEntity.noContent().build();
    }
}