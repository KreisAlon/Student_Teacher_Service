import { AccountManager } from "./services/AccountManager.js";
import { ExamService } from "./services/ExamService.js";

const accountManager = new AccountManager();
const examService = new ExamService();

// 1. Verify user is logged in
const currentUser = accountManager.getActiveSession();
if (!currentUser || currentUser.role !== "student") {
    window.location.href = "login.html";
}

// 2. Extract Exam ID from URL Query Parameters (The technique from class)
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const currentExamId = urlParams.get('examId');

// 3. DOM Elements
const examTitleDisplay = document.getElementById("examTitleDisplay");
const examDescDisplay = document.getElementById("examDescDisplay");
const questionsContainer = document.getElementById("questionsContainer");
const examForm = document.getElementById("examForm");

// 4. Fetch the specific exam
const currentExam = examService.getExamById(currentExamId);

if (!currentExam) {
    examTitleDisplay.textContent = "שגיאה: המבחן לא נמצא";
    questionsContainer.innerHTML = "<p class='text-danger fw-bold'>המבחן שביקשת לא קיים או שנמחק על ידי המורה.</p>";
    examForm.querySelector("button").style.display = "none";
} else {
    renderExam(currentExam);
}

// --- Render Exam Questions ---
function renderExam(exam) {
    examTitleDisplay.textContent = exam.title;
    examDescDisplay.textContent = exam.description || "ללא תיאור";

    let html = "";

    // Loop through each Question object in the exam
    exam.questions.forEach((question, qIndex) => {
        html += `
            <div class="mb-4 p-4 border rounded bg-white shadow-sm">
                <h5 class="mb-3">שאלה ${qIndex + 1}: ${question.text}</h5>
                <div class="ps-2">
        `;

        // Render the 4 possible answers as radio buttons
        question.answers.forEach((answer, aIndex) => {
            html += `
                <div class="form-check mb-2">
                    <input class="form-check-input" type="radio" name="question_${question.id}" id="q${question.id}_a${aIndex}" value="${aIndex}" required>
                    <label class="form-check-label w-100" style="cursor: pointer;" for="q${question.id}_a${aIndex}">
                        ${answer}
                    </label>
                </div>
            `;
        });

        html += `
                </div>
            </div>
        `;
    });

    questionsContainer.innerHTML = html;
}

// --- Handle Exam Submission ---
examForm.addEventListener("submit", (event) => {
    // Prevent the form from refreshing the page
    event.preventDefault();

    let correctAnswersCount = 0;
    const totalQuestions = currentExam.questions.length;

    // Check each question
    currentExam.questions.forEach(question => {
        // Find which radio button the user selected for this specific question's ID
        const selectedOption = document.querySelector(`input[name="question_${question.id}"]:checked`);

        if (selectedOption) {
            const selectedAnswerIndex = parseInt(selectedOption.value);

            // Use the OOP method 'isCorrect' from the Question class to verify
            if (question.isCorrect(selectedAnswerIndex)) {
                correctAnswersCount++;
            }
        }
    });

    // Calculate final score as a percentage
    const score = Math.round((correctAnswersCount / totalQuestions) * 100);

    // Save the grade to Local Storage
    saveGrade(currentExam, score);

    // Provide immediate feedback to the student and redirect to dashboard
    alert(`המבחן הוגש בהצלחה!\nענית נכונה על ${correctAnswersCount} מתוך ${totalQuestions} שאלות.\nהציון הסופי שלך: ${score}`);
    window.location.href = "student.html";
});

// --- Save Grade Logic ---
function saveGrade(exam, score) {
    // Unique key for this specific student's grades
    const storageKey = `grades_${currentUser.id}`;
    let studentGrades = JSON.parse(localStorage.getItem(storageKey)) || [];

    // Create a new grade record
    const gradeRecord = {
        examId: exam.id,
        examTitle: exam.title,
        score: score,
        date: new Date().toISOString()
    };

    // Add to history and save back to local storage
    studentGrades.unshift(gradeRecord); // unshift adds to the beginning of the array
    localStorage.setItem(storageKey, JSON.stringify(studentGrades));
}