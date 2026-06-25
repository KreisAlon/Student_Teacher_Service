import { ExamService } from "./services/ExamService.js";

const examService = new ExamService();

// Get the exam ID from the URL (e.g., ?id=12345)
const urlParams = new URLSearchParams(window.location.search);
const examId = urlParams.get("id");

const editExamTitle = document.getElementById("editExamTitle");
const editQuestionsList = document.getElementById("editQuestionsList");
const saveChangesBtn = document.getElementById("saveChangesBtn");
const editMessage = document.getElementById("editMessage");

// Fetch the exam from localStorage
const currentExam = examService.getExamById(examId);

if (!currentExam) {
    editMessage.innerHTML = `<div class="alert alert-danger">Exam not found!</div>`;
} else {
    // Fill the input with the current title
    editExamTitle.value = currentExam.title;

    // Show how many questions are in this exam
    editQuestionsList.innerHTML = `<p class="text-secondary">This exam has <strong>${currentExam.questions.length}</strong> questions.</p>`;
}

// Handle the save button click
saveChangesBtn.addEventListener("click", () => {
    const newTitle = editExamTitle.value.trim();

    if (!newTitle) {
        editMessage.innerHTML = `<div class="alert alert-danger">Title cannot be empty.</div>`;
        return;
    }

    // Update the exam object
    currentExam.title = newTitle;

    // Save back to localStorage (Assuming saveExam updates if it exists)
    examService.saveExam(currentExam);

    editMessage.innerHTML = `<div class="alert alert-success">Exam updated successfully!</div>`;

    // Go back to teacher dashboard after 1 second
    setTimeout(() => {
        window.location.href = "teacher.html";
    }, 1000);
});