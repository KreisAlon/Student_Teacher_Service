import { AccountManager } from "./services/AccountManager.js";

const accountManager = new AccountManager();

const registerForm = document.getElementById("registerForm");
const idInput = document.getElementById("idInput");
const usernameInput = document.getElementById("usernameInput");
const passwordInput = document.getElementById("passwordInput");
const roleInput = document.getElementById("roleInput");
const messageBox = document.getElementById("messageBox");

registerForm.addEventListener("submit", (event) => {
    // Prevent the default form submission (page reload)
    event.preventDefault();

    const id = idInput.value.trim();
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();
    const role = roleInput.value;

    // Attempt to register the new user with all required fields
    const newUser = accountManager.registerUser(id, username, role, password);

    if (!newUser) {
        // If the return value is null, the ID or username is already taken
        messageBox.innerHTML = `<div class="alert alert-danger mt-3">שם המשתמש או תעודת הזהות כבר קיימים במערכת</div>`;
        return;
    }

    // Display success message and provide a link to the login page
    messageBox.innerHTML = `
        <div class="alert alert-success mt-3">
            הרשמה בוצעה בהצלחה! 
            <br>
            <a href="login.html" class="alert-link">לחץ כאן כדי לעבור להתחברות</a>
        </div>
    `;

    // Optional: Clear the form fields after successful registration
    registerForm.reset();
});