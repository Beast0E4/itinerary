package com.itinerary.service.impl;

import com.itinerary.dto.request.BudgetRequest;
import com.itinerary.dto.response.BudgetSummaryResponse;
import com.itinerary.entity.Budget;
import com.itinerary.entity.Trip;
import com.itinerary.entity.enums.ExpenseCategory;
import com.itinerary.exception.ResourceNotFoundException;
import com.itinerary.repository.BudgetRepository;
import com.itinerary.repository.ExpenseRepository;
import com.itinerary.repository.TripRepository;
import com.itinerary.service.BudgetService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.EnumMap;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class BudgetServiceImpl implements BudgetService {

    private final BudgetRepository budgetRepository;
    private final ExpenseRepository expenseRepository;
    private final TripRepository tripRepository;

    private static final Map<ExpenseCategory, String> CATEGORY_LABELS = Map.of(
            ExpenseCategory.ACCOMMODATION, "accommodation",
            ExpenseCategory.TRANSPORT, "transport",
            ExpenseCategory.FOOD, "food",
            ExpenseCategory.ACTIVITIES, "activities",
            ExpenseCategory.SHOPPING, "misc",
            ExpenseCategory.MISC, "misc"
    );

    @Override
    public BudgetSummaryResponse getBudgetSummary(Long userId, Long tripId) {
        assertAccessible(tripId, userId);

        Budget budget = budgetRepository.findByTripId(tripId)
                .orElseThrow(() -> new ResourceNotFoundException("Budget not found for trip"));

        BigDecimal totalSpent = expenseRepository.sumByTripId(tripId);
        BigDecimal remaining = budget.getTotalBudget().subtract(totalSpent);
        double percentUsed = percent(totalSpent, budget.getTotalBudget());

        Map<ExpenseCategory, BigDecimal> spentByCategory = new EnumMap<>(ExpenseCategory.class);
        for (ExpenseRepository.CategoryTotal ct : expenseRepository.sumByTripIdGroupedByCategory(tripId)) {
            spentByCategory.put(ct.getCategory(), ct.getTotal());
        }

        Map<String, BudgetSummaryResponse.CategoryBreakdown> breakdown = new HashMap<>();
        breakdown.put("accommodation", buildBreakdown(budget.getAccommodationLimit(), sumFor(spentByCategory, ExpenseCategory.ACCOMMODATION)));
        breakdown.put("transport", buildBreakdown(budget.getTransportLimit(), sumFor(spentByCategory, ExpenseCategory.TRANSPORT)));
        breakdown.put("food", buildBreakdown(budget.getFoodLimit(), sumFor(spentByCategory, ExpenseCategory.FOOD)));
        breakdown.put("activities", buildBreakdown(budget.getActivitiesLimit(), sumFor(spentByCategory, ExpenseCategory.ACTIVITIES)));
        breakdown.put("misc", buildBreakdown(budget.getMiscLimit(),
                spentByCategory.getOrDefault(ExpenseCategory.SHOPPING, BigDecimal.ZERO)
                        .add(spentByCategory.getOrDefault(ExpenseCategory.MISC, BigDecimal.ZERO))));

        return BudgetSummaryResponse.builder()
                .totalBudget(budget.getTotalBudget())
                .currency(budget.getCurrency())
                .totalSpent(totalSpent)
                .remaining(remaining)
                .percentUsed(percentUsed)
                .categoryBreakdown(breakdown)
                .build();
    }

    @Override
    @Transactional
    public BudgetSummaryResponse updateBudget(Long userId, Long tripId, BudgetRequest request) {
        assertEditable(tripId, userId);

        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found"));

        Budget budget = budgetRepository.findByTripId(tripId).orElseGet(() ->
                Budget.builder().trip(trip).build());

        budget.setTotalBudget(request.getTotalBudget());
        if (request.getCurrency() != null) budget.setCurrency(request.getCurrency());
        if (request.getAccommodationLimit() != null) budget.setAccommodationLimit(request.getAccommodationLimit());
        if (request.getTransportLimit() != null) budget.setTransportLimit(request.getTransportLimit());
        if (request.getFoodLimit() != null) budget.setFoodLimit(request.getFoodLimit());
        if (request.getActivitiesLimit() != null) budget.setActivitiesLimit(request.getActivitiesLimit());
        if (request.getMiscLimit() != null) budget.setMiscLimit(request.getMiscLimit());

        budgetRepository.save(budget);
        return getBudgetSummary(userId, tripId);
    }

    private BigDecimal sumFor(Map<ExpenseCategory, BigDecimal> map, ExpenseCategory cat) {
        return map.getOrDefault(cat, BigDecimal.ZERO);
    }

    private BudgetSummaryResponse.CategoryBreakdown buildBreakdown(BigDecimal limit, BigDecimal spent) {
        return BudgetSummaryResponse.CategoryBreakdown.builder()
                .limit(limit == null ? BigDecimal.ZERO : limit)
                .spent(spent)
                .percentUsed(percent(spent, limit))
                .build();
    }

    private double percent(BigDecimal spent, BigDecimal limit) {
        if (limit == null || limit.compareTo(BigDecimal.ZERO) == 0) return 0.0;
        return spent.divide(limit, 4, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100))
                .doubleValue();
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