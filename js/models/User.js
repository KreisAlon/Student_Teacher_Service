export class User {
    constructor(id, name, role, password, createdAt = null) {
        this.id = id; // Usually the user's ID number (Teudat Zehut)
        this.name = name;
        this.role = role; // Defines permissions: 'teacher' or 'student'
        this.password = password;

        // Set creation date once, or load it from memory
        this.createdAt = createdAt || new Date().toISOString();
    }

    // Rebuild a User instance from plain object
    static fromJSON(data) {
        return new User(data.id, data.name, data.role, data.password, data.createdAt);
    }
}