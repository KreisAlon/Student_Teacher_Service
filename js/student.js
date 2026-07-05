import { AccountManager } from "./services/AccountManager.js";
import { ExamService } from "./services/ExamService.js";

const accountManager = new AccountManager();
const examService = new ExamService();

// DOM Elements
const logoutBtn = document.getElementById("logoutBtn");
const searchInput = document.getElementById("searchInput");
const availableExamsContainer = document.getElementById("availableExams");
const examHistoryContainer = document.getElementById("examHistory");
const averageGradeDisplay = document.getElementById("averageGradeDisplay");
const studentNameGreeting = document.getElementById("studentNameGreeting");

// Fetch active user session to personalize the dashboard
const currentUser = accountManager.getActiveSession();
if (currentUser) {
    studentNameGreeting.textContent = `(שלום ${currentUser.name})`;
}

// --- Logout Logic ---
if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        accountManager.logoutUser();
        window.location.href = "login.html";
    });
}

// --- Render Available Exams & Handle Search ---
function renderAvailableExams(searchQuery = "") {
    const allExams = examService.getAllExams();

    // Filter exams based on the search query (matching title or exam code)
    const filteredExams = allExams.filter(exam => {
        const titleMatch = exam.title.toLowerCase().includes(searchQuery.toLowerCase());
        const codeMatch = exam.examCode ? exam.examCode.toLowerCase().includes(searchQuery.toLowerCase()) : false;
        return titleMatch || codeMatch;
    });

    // Display message if no exams match the criteria
    if (filteredExams.length === 0) {
        availableExamsContainer.innerHTML = "<p class='text-muted'>לא נמצאו מבחנים תואמים.</p>";
        return;
    }

    // Build the list of filtered exams
    let html = '<ul class="list-group">';
    filteredExams.forEach(exam => {
        const questionCount = exam.questions ? exam.questions.length : 0;
        const timeLimitText = exam.timeLimit > 0 ? `${exam.timeLimit} דק'` : "ללא הגבלת זמן";

        html += `
            <li class="list-group-item d-flex justify-content-between align-items-center">
                <div>
                    <h6 class="mb-0">${exam.title} <span class="badge bg-secondary ms-1">${exam.examCode || ""}</span></h6>
                    <small class="text-muted">שאלות: ${questionCount} | ${timeLimitText}</small>
                </div>
                <button class="btn btn-primary btn-sm start-exam-btn" data-id="${exam.id}">
                    התחל מבחן
                </button>
            </li>
        `;
    });
    html += '</ul>';

    availableExamsContainer.innerHTML = html;
    attachStartExamListeners();
}

// Attach click events to the dynamic "Start Exam" buttons
function attachStartExamListeners() {
    const startButtons = document.querySelectorAll(".start-exam-btn");
    startButtons.forEach(btn => {
        btn.addEventListener("click", (event) => {
            const examId = event.target.getAttribute("data-id");

            // Save the selected exam ID in sessionStorage to load it in the execution page
            sessionStorage.setItem("active_exam_id", examId);

            // Navigate to the test execution page (we will build this next)
            window.location.href = "take-exam.html";
        });
    });
}

// Listen for keystrokes in the search input to trigger live filtering
if (searchInput) {
    searchInput.addEventListener("input", (event) => {
        renderAvailableExams(event.target.value.trim());
    });
}

// --- Render Exam History & Calculate Average ---
function renderHistory() {
    // Retrieve the current user's specific grades from Local Storage
    // (Defaults to an empty array if the user hasn't taken any exams yet)
    const storageKey = `grades_${currentUser?.id}`;
    const studentGrades = JSON.parse(localStorage.getItem(storageKey)) || [];

    if (studentGrades.length === 0) {
        examHistoryContainer.innerHTML = "<p class='text-muted'>טרם ביצעת מבחנים, אין היסטוריית ציונים.</p>";
        averageGradeDisplay.textContent = "0";
        return;
    }

    let totalScore = 0;
    let html = '<ul class="list-group">';

    // Build the history list and sum the scores
    studentGrades.forEach(grade => {
        totalScore += grade.score;

        // Use Bootstrap color classes based on pass/fail
        const badgeColor = grade.score >= 60 ? 'bg-success' : 'bg-danger';

        html += `
            <li class="list-group-item d-flex justify-content-between align-items-center">
                <div>
                    <h6 class="mb-0">${grade.examTitle}</h6>
                    <small class="text-muted">${new Date(grade.date).toLocaleDateString()}</small>
                </div>
                <span class="badge ${badgeColor} rounded-pill fs-6">
                    ${grade.score}
                </span>
            </li>
        `;
    });

    html += '</ul>';
    examHistoryContainer.innerHTML = html;

    // Calculate and display the average grade (rounded to whole number)
    const average = Math.round(totalScore / studentGrades.length);
    averageGradeDisplay.textContent = average;
}

// Initial render calls when the page loads
renderAvailableExams();
renderHistory();