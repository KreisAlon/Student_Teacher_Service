export class Question {
    constructor(text, answers, correctAnswerIndex, id = null) {
        // Use existing ID if provided (from JSON), otherwise generate a new one using timestamp and random string
        this.id = id || Date.now().toString() + Math.random().toString(36).substring(2, 9);
        this.text = text;
        this.answers = answers; // Array of possible answers
        this.correctAnswerIndex = correctAnswerIndex; // Index of the correct answer in the array
    }

    // Check if the student's selected answer matches the correct one
    isCorrect(userAnswerIndex) {
        return userAnswerIndex === this.correctAnswerIndex;
    }

    // Static method to reconstruct a Question instance from a plain object (retrieved from localStorage)
    static fromJSON(data) {
        return new Question(data.text, data.answers, data.correctAnswerIndex, data.id);
    }
}