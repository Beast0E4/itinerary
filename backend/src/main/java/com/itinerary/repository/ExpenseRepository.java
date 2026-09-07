package com.itinerary.repository;

import com.itinerary.entity.Expense;
import com.itinerary.entity.enums.ExpenseCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.math.BigDecimal;
import java.util.List;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    List<Expense> findByTripIdOrderByExpenseDateDesc(Long tripId);

    List<Expense> findByTripIdAndCategory(Long tripId, ExpenseCategory category);

    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM Expense e WHERE e.trip.id = :tripId")
    BigDecimal sumByTripId(Long tripId);

    @Query("""
        SELECT e.category as category, COALESCE(SUM(e.amount), 0) as total
        FROM Expense e
        WHERE e.trip.id = :tripId
        GROUP BY e.category
        """)
    List<CategoryTotal> sumByTripIdGroupedByCategory(Long tripId);

    interface CategoryTotal {
        ExpenseCategory getCategory();
        BigDecimal getTotal();
    }
}