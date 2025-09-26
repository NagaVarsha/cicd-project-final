package com.example.expenseshare.repository;

import com.example.expenseshare.model.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    /**
     * Finds all expenses for a user.
     * The "LEFT JOIN FETCH e.shares" is the crucial part. It tells the database
     * to load the associated shares at the same time, fixing the lazy loading issue.
     * "DISTINCT" prevents duplicate expenses from appearing in the result.
     */
    @Query("SELECT DISTINCT e FROM Expense e LEFT JOIN FETCH e.shares WHERE e.id IN (SELECT s.expense.id FROM ExpenseShare s WHERE s.user.id = :userId)")
    List<Expense> findExpensesForUser(@Param("userId") Long userId);
}

