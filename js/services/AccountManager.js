import { User } from "../models/User.js";

export class AccountManager {
    constructor() {
        // All users data stays in localStorage permanently
        this.storageKey = "app_users_data";
        // Active user session goes to sessionStorage (cleared when tab closes)
        this.sessionKey = "active_user_session";
    }

    getAllUsers() {
        const storedData = localStorage.getItem(this.storageKey);

        if (!storedData) {
            return [];
        }

        const parsedData = JSON.parse(storedData);

        // Utilize the static method from the User class to reconstruct objects
        return parsedData.map(userData => User.fromJSON(userData));
    }

    // Updated to include userId (Teudat Zehut) and password
    registerUser(userId, username, role, password) {
        const usersList = this.getAllUsers();

        // Check if ID or Username already exists
        const isUserExists = usersList.some(user =>
            user.id === userId || user.name.toLowerCase() === username.toLowerCase()
        );

        if (isUserExists) {
            return null; // Registration failed - user exists
        }

        // Create new user and push to list
        const newUser = new User(userId, username, role, password);
        usersList.push(newUser);

        localStorage.setItem(this.storageKey, JSON.stringify(usersList));
        return newUser;
    }

    // Updated to check for password verification
    loginUser(usernameOrId, password) {
        const usersList = this.getAllUsers();

        // Find user by either Name or ID, AND verify the password matches
        const foundUser = usersList.find(user =>
            (user.name.toLowerCase() === usernameOrId.toLowerCase() || user.id === usernameOrId)
            && user.password === password
        );

        if (!foundUser) {
            return null; // Login failed
        }

        // Save the active session in sessionStorage instead of localStorage
        sessionStorage.setItem(this.sessionKey, JSON.stringify(foundUser));
        return foundUser;
    }

    logoutUser() {
        // Clear only the active session
        sessionStorage.removeItem(this.sessionKey);
    }

    getActiveSession() {
        // Retrieve from sessionStorage
        const sessionData = sessionStorage.getItem(this.sessionKey);

        if (!sessionData) {
            return null;
        }

        // Reconstruct the User object
        return User.fromJSON(JSON.parse(sessionData));
    }
}