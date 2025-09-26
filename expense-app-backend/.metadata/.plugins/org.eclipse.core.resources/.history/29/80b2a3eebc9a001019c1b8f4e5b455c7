package com.example.expenseshare.controller;

import com.example.expenseshare.model.User;
import com.example.expenseshare.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

/**
 * This controller handles all API requests related to users,
 * such as registration and login.
 */
@RestController
@RequestMapping("/api")
// This annotation is crucial. It gives permission to your frontend (running on localhost:5173)
// to make API calls to this backend. Without it, you will get CORS errors.
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    /**
     * Endpoint for user registration.
     * It checks if the email is already in use before creating a new user.
     */
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        // Check if a user with the same email already exists in the database
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return new ResponseEntity<>("Email is already taken!", HttpStatus.BAD_REQUEST);
        }

        // WARNING: In a real-world application, you MUST hash the password here before saving.
        // For example: user.setPassword(passwordEncoder.encode(user.getPassword()));

        User savedUser = userRepository.save(user);
        return new ResponseEntity<>(savedUser, HttpStatus.CREATED);
    }

    /**
     * Endpoint for user login.
     * It finds the user by email and checks if the provided password matches.
     */
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");

        Optional<User> userOptional = userRepository.findByEmail(email);

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            // WARNING: This is for demonstration only. NEVER compare plain-text passwords in production.
            // Always use a secure hashing algorithm like BCrypt.
            if (password.equals(user.getPassword())) {
                // If login is successful, return the user's data
                return ResponseEntity.ok(user);
            }
        }

        // If the user is not found or the password does not match, return an "Unauthorized" error.
        return new ResponseEntity<>("Invalid email or password", HttpStatus.UNAUTHORIZED);
    }
}
