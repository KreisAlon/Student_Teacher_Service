import { Exam } from "../models/Exam.js";

export class ExamService {
    constructor() {
        this.storageKey = "exams";
    }

    getAllExams() {
        const data = localStorage.getItem(this.storageKey);

        if (!data) {
            return [];
        }

        const plainExams = JSON.parse(data);

        // Look how clean this is! We delegate the reconstruction logic to the Exam class.
        // It handles restoring both the Exam and its nested Questions automatically.
        return plainExams.map(examData => Exam.fromJSON(examData));
    }

    saveExam(exam) {
        const exams = this.getAllExams();
        const existingExamIndex = exams.findIndex(e => e.id === exam.id);

        if (existingExamIndex >= 0) {
            // Update an already existing exam
            exams[existingExamIndex] = exam;
        } else {
            // Add a completely new exam
            exams.push(exam);
        }

        localStorage.setItem(this.storageKey, JSON.stringify(exams));
    }

    deleteExam(examId) {
        const exams = this.getAllExams();
        // Filter out the exam we want to delete
        const filteredExams = exams.filter(exam => String(exam.id) !== String(examId));

        localStorage.setItem(this.storageKey, JSON.stringify(filteredExams));
    }

    getExamById(examId) {
        const exams = this.getAllExams();
        return exams.find(exam => String(exam.id) === String(examId));
    }

    clearAllExams() {
        localStorage.removeItem(this.storageKey);
    }
}