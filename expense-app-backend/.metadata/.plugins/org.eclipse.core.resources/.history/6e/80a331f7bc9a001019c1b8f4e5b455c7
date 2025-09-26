package com.example.expenseshare.controller;

import com.example.expenseshare.dto.CreateExpenseRequest;
import com.example.expenseshare.model.Expense;
import com.example.expenseshare.model.ExpenseShare;
import com.example.expenseshare.model.User;
import com.example.expenseshare.repository.ExpenseRepository;
import com.example.expenseshare.repository.ExpenseShareRepository;
import com.example.expenseshare.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class ExpenseController {

    @Autowired
    private ExpenseRepository expenseRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ExpenseShareRepository expenseShareRepository;

    /**
     * Fetches all expenses relevant to a specific user.
     * @param userId The ID of the user whose expenses are being requested.
     * @return A list of expenses.
     */
    @GetMapping("/expenses")
    public List<Expense> getAllExpenses(@RequestParam Long userId) {
        return expenseRepository.findExpensesForUser(userId);
    }

    /**
     * Creates a new expense and splits the cost among the participants.
     * @param request A DTO containing the expense details.
     * @return The newly created Expense object with all its shares.
     */
    @PostMapping("/expenses")
    @Transactional // Ensures the entire operation succeeds or fails together
    public ResponseEntity<Expense> createExpense(@RequestBody CreateExpenseRequest request) {
        // 1. Find the user who paid for the expense
        User paidBy = userRepository.findById(request.getPaidById())
                .orElseThrow(() -> new RuntimeException("User who paid not found with id: " + request.getPaidById()));

        // 2. Create the main Expense object
        Expense expense = new Expense();
        expense.setDescription(request.getDescription());
        expense.setAmount(request.getAmount());
        expense.setPaidBy(paidBy);
        // Save it once to generate an ID, which is needed for the shares
        Expense savedExpense = expenseRepository.save(expense);

        // 3. Determine all unique participants for the split
        List<User> participants = new ArrayList<>();
        participants.add(paidBy); // The payer is always included in the split

        if (request.getSharedWithIds() != null && !request.getSharedWithIds().isEmpty()) {
            List<User> sharedWithUsers = userRepository.findAllById(request.getSharedWithIds());
            participants.addAll(sharedWithUsers);
        }
        
        // Use stream().distinct() to remove duplicates (e.g., if payer is also in sharedWithIds)
        List<User> distinctParticipants = participants.stream().distinct().toList();
        int totalParticipants = distinctParticipants.size();

        if (totalParticipants == 0) { 
            throw new RuntimeException("Expense must have at least one participant."); 
        }

        // 4. Calculate the amount each person owes
        BigDecimal shareAmount = request.getAmount().divide(new BigDecimal(totalParticipants), 2, RoundingMode.HALF_UP);

        // 5. Create an ExpenseShare record for each participant
        List<ExpenseShare> shares = new ArrayList<>();
        for (User participant : distinctParticipants) {
            shares.add(new ExpenseShare(savedExpense, participant, shareAmount));
        }

        // 6. Save all the individual share records to the database
        expenseShareRepository.saveAll(shares);
        
        // 7. Set the shares list on the object that will be returned to the frontend
        savedExpense.setShares(shares);

        return new ResponseEntity<>(savedExpense, HttpStatus.CREATED);
    }
}

