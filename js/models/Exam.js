import { Question } from './Question.js';

export class Exam {
    constructor(title, description = "", category = "", examCode = "", timeLimit = 0, id = null, createdAt = null) {
        // Generate a unique ID using the current time and a random string if one is not provided
        this.id = id || Date.now().toString() + Math.random().toString(36).substring(2, 9);
        this.title = title;
        this.description = description;
        this.category = category;
        this.examCode = examCode;
        this.timeLimit = timeLimit; // Time limit in minutes
        this.questions = [];

        // Save the creation date or restore it from existing data
        this.createdAt = createdAt || new Date().toISOString();
    }

    // Add a new Question object to the exam
    addQuestion(question) {
        this.questions.push(question);
    }

    // Return the total number of questions currently in the exam
    getQuestionCount() {
        return this.questions.length;
    }

    // Reconstruct the Exam instance and its inner Question instances from plain JSON data
    static fromJSON(data) {
        const exam = new Exam(
            data.title,
            data.description,
            data.category,
            data.examCode,
            data.timeLimit,
            data.id,
            data.createdAt
        );

        // If the data contains questions, map through them and restore each as a Question instance
        if (data.questions && Array.isArray(data.questions)) {
            exam.questions = data.questions.map(qData => Question.fromJSON(qData));
        }

        return exam;
    }
}