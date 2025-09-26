// This is the base URL where your Spring Boot backend is running.
const API_BASE_URL = 'http://localhost:8081/api';

/**
 * A helper function to handle the response from the backend.
 * It checks if the request was successful and parses the JSON data.
 * If the request failed, it throws an error with the message from the server.
 */
const handleResponse = async (response) => {
    if (!response.ok) {
        // Try to get the error message from the backend, otherwise use a default message.
        const error = await response.text();
        throw new Error(error || 'An unknown server error occurred');
    }
    // If the response is successful but has no content (like a 204 status), return null.
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
        return response.json();
    }
    return null; 
};

/**
 * Registers a new user.
 * POSTs the new user's details to the /register endpoint.
 */
export const signup = async (name, email, password, currency) => {
    const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            fullName: name,
            email: email,
            password: password,
            defaultCurrency: currency,
        }),
    });
    return handleResponse(response);
};

/**
 * Logs in an existing user.
 * POSTs the user's credentials to the /login endpoint.
 */
export const login = async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });
    return handleResponse(response);
};

/**
 * Fetches all expenses for a specific user.
 * GETs data from the /expenses endpoint, passing the userId as a URL parameter.
 */
export const getExpenses = async (userId) => {
    const response = await fetch(`${API_BASE_URL}/expenses?userId=${userId}`);
    return handleResponse(response);
};

/**
 * Adds a new expense and splits it.
 * POSTs the expense data to the /expenses endpoint in the format expected by the DTO.
 */
export const addExpense = async (expenseData) => {
    const response = await fetch(`${API_BASE_URL}/expenses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(expenseData), // The data should match the CreateExpenseRequest DTO
    });
    return handleResponse(response);
};

