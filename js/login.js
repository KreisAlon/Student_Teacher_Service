import { AccountManager } from "./services/AccountManager.js";

const accountManager = new AccountManager();

const loginForm = document.getElementById("loginForm");
const usernameInput = document.getElementById("usernameInput");
const passwordInput = document.getElementById("passwordInput");
const messageBox = document.getElementById("messageBox");

loginForm.addEventListener("submit", (event) => {
    // Prevent the default form submission (page reload)
    event.preventDefault();

    const usernameOrId = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    // Attempt to authenticate the user using the updated AccountManager method
    const user = accountManager.loginUser(usernameOrId, password);

    if (!user) {
        // Display an error if credentials do not match any record
        messageBox.innerHTML = `<div class="alert alert-danger mt-3">פרטי ההתחברות שגויים, אנא נסה שוב</div>`;
        return;
    }

    // Redirect the authenticated user to their respective dashboard based on role
    if (user.role === "teacher") {
        window.location.href = "teacher.html";
    } else {
        window.location.href = "student.html";
    }
});