import { User } from "../models/User.js";

// This class handles all the user logic (register, login, session).
// We use localStorage to save everything so data isn't lost on refresh.
export class AccountManager {
    // I used private fields (#) here so these keys won't be changed by mistake outside the class
    #storageKey;
    #sessionKey;

    constructor() {
        this.#storageKey = "app_users_data";
        this.#sessionKey = "active_user_session";
    }

    // Gets all users from localStorage and returns them as an array of User objects
    getAllUsers() {
        try {
            const storedData = localStorage.getItem(this.#storageKey);
            if (!storedData) {
                return []; // Return an empty array if no users exist yet
            }

            const parsedData = JSON.parse(storedData);

            // I need to map over the plain JSON objects and turn them back into real User instances.
            // This is important so we don't lose the class methods if we add any later.
            return parsedData.map(data => {
                const user = new User(data.id, data.name, data.role);
                user.createdAt = data.createdAt;
                return user;
            });
        } catch (error) {
            console.error("Error loading users:", error);
            return []; // Fallback to empty array if JSON is broken
        }
    }

    // Registers a new student or teacher
    registerUser(username, role) {
        const usersList = this.getAllUsers();

        // Check if username already exists.
        // I used toLowerCase() to ignore case (e.g., 'Alon' and 'alon' will be treated as the same user).
        const isUserExists = usersList.some(user =>
            user.name.toLowerCase() === username.toLowerCase()
        );

        if (isUserExists) {
            // Throwing an error here so the UI file can catch it and show a nice message to the user
            throw new Error("Username already taken!");
        }

        // Create the new user and add to our list
        const newUser = new User(null, username, role);
        usersList.push(newUser);

        // Save the updated list back to localStorage
        localStorage.setItem(this.#storageKey, JSON.stringify(usersList));

        return newUser;
    }

    // Simple login just by username (no passwords required for this project)
    loginUser(username) {
        const usersList = this.getAllUsers();

        // Find the user, again ignoring case
        const foundUser = usersList.find(user =>
            user.name.toLowerCase() === username.toLowerCase()
        );

        if (!foundUser) {
            throw new Error("User not found! Please register first.");
        }

        // Save the currently logged-in user to localStorage to keep the session alive
        localStorage.setItem(this.#sessionKey, JSON.stringify(foundUser));
        return foundUser;
    }

    // Clears the session (Logout)
    logoutUser() {
        localStorage.removeItem(this.#sessionKey);
    }

    // Helper method to know who is currently using the app
    getActiveSession() {
        const sessionData = localStorage.getItem(this.#sessionKey);
        if (!sessionData) {
            return null; // No one is logged in right now
        }

        try {
            const data = JSON.parse(sessionData);
            // Rebuilding the User object here too, just like in getAllUsers()
            const user = new User(data.id, data.name, data.role);
            user.createdAt = data.createdAt;
            return user;
        } catch (error) {
            console.error("Session error, logging out just in case:", error);
            this.logoutUser(); // Clear the bad data
            return null;
        }
    }
}