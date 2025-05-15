import { faker } from "@faker-js/faker";

export class User {
    private firstName: string;
    private lastName: string;
    private username: string;
    private password: string;
    private email: string;
    private jobTitle: string;
    constructor() {
        this.username = faker.internet.username();
        this.password = faker.internet.password();
        this.firstName = faker.person.firstName();
        this.lastName = faker.person.lastName();
        this.email = faker.internet.email();
        this.jobTitle = faker.person.jobTitle();
    }
    
    getFullName() {
        return `${this.firstName} ${this.lastName}`;
    }
    getUsername() {
        return this.username;
    }
    getPassword() {
        return this.password;
    }
    getFirstName() {
        return this.firstName;
    }
    getLastName() {
        return this.lastName;
    }
    getEmail() {
        return this.email;
    }
    getJobTitle() {
        return this.jobTitle;
    }
}
