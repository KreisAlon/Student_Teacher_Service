import { Exam } from "./models/Exam.js";
import { Question } from "./models/Question.js";
import { ExamService } from "./services/ExamService.js";
import { ExamUI } from "./ui/ExamUI.js";
import { AccountManager } from "./services/AccountManager.js";

const examService = new ExamService();
const examUI = new ExamUI(examService);
const accountManager = new AccountManager();

let currentExam = null;

// DOM Elements - Added new fields
const examTitleInput = document.getElementById("examTitle");
const examDescInput = document.getElementById("examDescription");
const examCatInput = document.getElementById("examCategory");
const examCodeInput = document.getElementById("examCode");
const examTimeInput = document.getElementById("examTime");

const questionTextInput = document.getElementById("questionText");
const answer1Input = document.getElementById("answer1");
const answer2Input = document.getElementById("answer2");
const answer3Input = document.getElementById("answer3");
const answer4Input = document.getElementById("answer4");
const correctAnswerInput = document.getElementById("correctAnswer");

const addQuestionBtn = document.getElementById("addQuestionBtn");
const saveExamBtn = document.getElementById("saveExamBtn");
const examListElement = document.getElementById("examList");

addQuestionBtn.addEventListener("click", () => {
    // Pull all values from the DOM
    const title = examTitleInput.value.trim();
    const description = examDescInput.value.trim();
    const category = examCatInput.value.trim();
    const examCode = examCodeInput.value.trim();
    const timeLimit = parseInt(examTimeInput.value) || 0;

    const questionText = questionTextInput.value.trim();

    const answers = [
        answer1Input.value.trim(),
        answer2Input.value.trim(),
        answer3Input.value.trim(),
        answer4Input.value.trim()
    ];

    const correctAnswerNumber = Number(correctAnswerInput.value);

    // Validation
    if (!title) {
        examUI.showBuilderMessage("Please enter exam title.", "danger");
        return;
    }

    if (!questionText) {
        examUI.showBuilderMessage("Please enter question text.", "danger");
        return;
    }

    if (answers.some(answer => answer === "")) {
        examUI.showBuilderMessage("Please fill all 4 answers.", "danger");
        return;
    }

    if (correctAnswerNumber < 1 || correctAnswerNumber > 4) {
        examUI.showBuilderMessage("Correct answer must be a number from 1 to 4.", "danger");
        return;
    }

    // Create exam if it doesn't exist, now with all details
    if (!currentExam) {
        currentExam = new Exam(title, description, category, examCode, timeLimit);
    }

    const correctAnswerIndex = correctAnswerNumber - 1;

    const question = new Question(
        questionText,
        answers,
        correctAnswerIndex
    );

    currentExam.addQuestion(question);

    examUI.showBuilderMessage(
        `Question added. Current exam has ${currentExam.getQuestionCount()} question(s).`,
        "success"
    );

    clearQuestionInputs();
});

saveExamBtn.addEventListener("click", () => {
    if (!currentExam) {
        examUI.showBuilderMessage("Create an exam and add at least one question first.", "danger");
        return;
    }

    if (currentExam.getQuestionCount() === 0) {
        examUI.showBuilderMessage("Cannot save exam without questions.", "danger");
        return;
    }

    // In case the user updated the exam details before hitting save
    currentExam.title = examTitleInput.value.trim();
    currentExam.description = examDescInput.value.trim();
    currentExam.category = examCatInput.value.trim();
    currentExam.examCode = examCodeInput.value.trim();
    currentExam.timeLimit = parseInt(examTimeInput.value) || 0;

    examService.saveExam(currentExam);

    examUI.showBuilderMessage("Exam saved successfully.", "success");

    currentExam = null;

    // Clear all exam fields
    examTitleInput.value = "";
    examDescInput.value = "";
    examCatInput.value = "";
    examCodeInput.value = "";
    examTimeInput.value = "";

    examUI.renderExamList();
});

examListElement.addEventListener("click", event => {
    const examId = event.target.dataset.id;

    if (event.target.classList.contains("run-btn")) {
        const exam = examService.getExamById(examId);
        examUI.renderExamRunner(exam);
    }

    if (event.target.classList.contains("delete-btn")) {
        const confirmed = confirm("Are you sure you want to delete this exam?");

        if (!confirmed) {
            return;
        }

        examService.deleteExam(examId);
        examUI.renderExamList();
    }
});

function clearQuestionInputs() {
    questionTextInput.value = "";
    answer1Input.value = "";
    answer2Input.value = "";
    answer3Input.value = "";
    answer4Input.value = "";
    correctAnswerInput.value = "";
}

examUI.renderExamList();

// --- Logout & Return Home ---
const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        // Remove the current user's session using AccountManager
        accountManager.logoutUser();

        // Redirect the user to the main login page
        window.location.href = "login.html";
    });
}