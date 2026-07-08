Exam System (Client-Side)

Author: Alon Kreisberger (ID: 314950064)
Computer Science, Tel-Hai College (2026)

About the Project

This project is a client-side exam management system built using Vanilla JavaScript, HTML, and CSS. The entire application runs in the browser without a backend.

It uses Object-Oriented Programming (OOP) principles and ES6 Modules to keep the code organized. All data, including users, exams, and grades, is saved locally using the browser's localStorage. SessionStorage is used to manage the active logged-in user.

Teacher Features

The system allows teachers to easily create, edit, and delete exams. When creating an exam, a teacher can add multiple-choice questions, set a specific category, and define a time limit.

The system enforces data separation. This means teachers can only see and manage the exams they created themselves.

Teachers also have a dedicated section to view the grades of students who have taken their specific exams.

Student Features

Students have their own dashboard where they can search for available exams by title or course code.

A student is allowed to take an exam only once. Once they submit their answers, the exam gets locked to prevent multiple attempts.

The dashboard also provides a personal grade history, showing past exam results and an automatically calculated average score.

Technical Structure

The code is heavily based on OOP classes such as User, Exam, and Question.

One of the main challenges with localStorage is that it only saves plain text, which causes objects to lose their class methods when retrieved.

To solve this, I implemented static fromJSON methods in the classes. These methods take the plain text data and reconstruct it back into proper class instances, ensuring that all internal functions (like checking the correct answer) work perfectly after a page reload.