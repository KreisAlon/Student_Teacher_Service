export class User {
    constructor(id, name, role) {
        this.id = id || crypto.randomUUID();
        this.name = name;
        this.role = role; // 'teacher' or 'student'
        this.createdAt = new Date().toISOString();
    }
}