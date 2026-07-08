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

// Fetch active user session to display greeting
const currentUser = accountManager.getActiveSession();
if (currentUser) {
    studentNameGreeting.textContent = `(שלום ${currentUser.name})`;
}

// Handle logout
if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        accountManager.logoutUser();
        window.location.href = "login.html";
    });
}

// Render exams and handle live search filtering
function renderAvailableExams(searchQuery = "") {
    const allExams = examService.getAllExams();

    // Get the current student's grade history to find exams they already took
    const storageKey = `grades_${currentUser?.id}`;
    const studentGrades = JSON.parse(localStorage.getItem(storageKey)) || [];

    // Extract just the exam IDs the student has already completed
    const takenExamIds = studentGrades.map(grade => grade.examId);

    // Filter by search query (title or exam code)
    const filteredExams = allExams.filter(exam => {
        const titleMatch = exam.title.toLowerCase().includes(searchQuery.toLowerCase());
        const codeMatch = exam.examCode ? exam.examCode.toLowerCase().includes(searchQuery.toLowerCase()) : false;
        return titleMatch || codeMatch;
    });

    if (filteredExams.length === 0) {
        availableExamsContainer.innerHTML = "<p class='text-muted'>לא נמצאו מבחנים תואמים.</p>";
        return;
    }

    let html = '<ul class="list-group">';
    filteredExams.forEach(exam => {
        const questionCount = exam.questions ? exam.questions.length : 0;
        const timeLimitText = exam.timeLimit > 0 ? `${exam.timeLimit} דק'` : "ללא הגבלת זמן";

        // Check if this specific exam ID is in the student's taken exams array
        const hasTaken = takenExamIds.includes(exam.id);

        // If the exam was already taken, show a disabled button. Otherwise, show active start button.
        const buttonHtml = hasTaken
            ? `<button class="btn btn-secondary btn-sm" disabled>בוצע</button>`
            : `<button class="btn btn-primary btn-sm start-exam-btn" data-id="${exam.id}">התחל מבחן</button>`;

        html += `
            <li class="list-group-item d-flex justify-content-between align-items-center">
                <div>
                    <h6 class="mb-0">${exam.title} <span class="badge bg-secondary ms-1">${exam.examCode || ""}</span></h6>
                    <small class="text-muted">שאלות: ${questionCount} | ${timeLimitText}</small>
                </div>
                ${buttonHtml}
            </li>
        `;
    });
    html += '</ul>';

    availableExamsContainer.innerHTML = html;

    // Bind click events only after rendering the dynamic HTML
    attachStartExamListeners();
}

// Attach click events only to active start buttons
function attachStartExamListeners() {
    const startButtons = document.querySelectorAll(".start-exam-btn");
    startButtons.forEach(btn => {
        btn.addEventListener("click", (event) => {
            const examId = event.target.getAttribute("data-id");
            window.location.href = 'take-exam.html?examId=' + encodeURIComponent(examId);
        });
    });
}

// Live filtering event listener
if (searchInput) {
    searchInput.addEventListener("input", (event) => {
        renderAvailableExams(event.target.value.trim());
    });
}

// Render past exams and update the average score display
function renderHistory() {
    const storageKey = `grades_${currentUser?.id}`;
    const studentGrades = JSON.parse(localStorage.getItem(storageKey)) || [];

    if (studentGrades.length === 0) {
        examHistoryContainer.innerHTML = "<p class='text-muted'>טרם ביצעת מבחנים, אין היסטוריית ציונים.</p>";
        averageGradeDisplay.textContent = "0";
        return;
    }

    let totalScore = 0;
    let html = '<ul class="list-group">';

    studentGrades.forEach(grade => {
        totalScore += grade.score;
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

    const average = Math.round(totalScore / studentGrades.length);
    averageGradeDisplay.textContent = average;
}

// Initialization calls
renderAvailableExams();
renderHistory();