export class User {
    constructor(id, name, role) {
        this.id = id;
        this.name = name;
        this.role = role; // 'teacher' or 'student'
        this.createdAt = new Date().toISOString();
    }
}