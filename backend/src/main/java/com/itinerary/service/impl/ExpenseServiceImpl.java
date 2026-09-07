package com.itinerary.service.impl;

import com.itinerary.dto.request.ExpenseRequest;
import com.itinerary.dto.response.ExpenseResponse;
import com.itinerary.entity.Expense;
import com.itinerary.entity.Trip;
import com.itinerary.entity.User;
import com.itinerary.exception.ResourceNotFoundException;
import com.itinerary.mapper.ExpenseMapper;
import com.itinerary.repository.ExpenseRepository;
import com.itinerary.repository.TripRepository;
import com.itinerary.repository.UserRepository;
import com.itinerary.service.ExpenseService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExpenseServiceImpl implements ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final TripRepository tripRepository;
    private final UserRepository userRepository;
    private final ExpenseMapper expenseMapper;

    @Override
    public List<ExpenseResponse> getExpensesForTrip(Long userId, Long tripId) {
        assertAccessible(tripId, userId);
        return expenseRepository.findByTripIdOrderByExpenseDateDesc(tripId).stream()
                .map(expenseMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ExpenseResponse addExpense(Long userId, Long tripId, ExpenseRequest request) {
        assertEditable(tripId, userId);

        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found"));

        User paidBy = request.getPaidByUserId() != null
                ? userRepository.findById(request.getPaidByUserId()).orElse(null)
                : null;

        Expense expense = Expense.builder()
                .trip(trip)
                .paidBy(paidBy)
                .category(request.getCategory())
                .description(request.getDescription())
                .amount(request.getAmount())
                .currency(request.getCurrency())
                .expenseDate(request.getExpenseDate())
                .receiptUrl(request.getReceiptUrl())
                .build();

        return expenseMapper.toResponse(expenseRepository.save(expense));
    }

    @Override
    @Transactional
    public ExpenseResponse updateExpense(Long userId, Long tripId, Long expenseId, ExpenseRequest request) {
        assertEditable(tripId, userId);

        Expense expense = expenseRepository.findById(expenseId)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found"));

        if (!expense.getTrip().getId().equals(tripId)) {
            throw new AccessDeniedException("Expense does not belong to this trip");
        }

        expense.setCategory(request.getCategory());
        expense.setDescription(request.getDescription());
        expense.setAmount(request.getAmount());
        expense.setCurrency(request.getCurrency());
        expense.setExpenseDate(request.getExpenseDate());
        expense.setReceiptUrl(request.getReceiptUrl());

        if (request.getPaidByUserId() != null) {
            userRepository.findById(request.getPaidByUserId()).ifPresent(expense::setPaidBy);
        }

        return expenseMapper.toResponse(expenseRepository.save(expense));
    }

    @Override
    @Transactional
    public void deleteExpense(Long userId, Long tripId, Long expenseId) {
        assertEditable(tripId, userId);

        Expense expense = expenseRepository.findById(expenseId)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found"));

        if (!expense.getTrip().getId().equals(tripId)) {
            throw new AccessDeniedException("Expense does not belong to this trip");
        }

        expenseRepository.delete(expense);
    }

    private void assertAccessible(Long tripId, Long userId) {
        if (!tripRepository.isAccessibleByUser(tripId, userId)) {
            throw new AccessDeniedException("You do not have access to this trip");
        }
    }

    private void assertEditable(Long tripId, Long userId) {
        if (!tripRepository.isEditableByUser(tripId, userId)) {
            throw new AccessDeniedException("You do not have edit permission for this trip");
        }
    }
}