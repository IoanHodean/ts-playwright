import {Page, expect, Locator} from '@playwright/test';
import {AbstractPage} from './AbstractPage';

export class FeedbackPage extends AbstractPage {
  
    readonly nameField: Locator;
    readonly emailField: Locator;
    readonly subjectField: Locator;
    readonly commentField: Locator;
    readonly submitButton: Locator;
    readonly resetButton: Locator;
    readonly feedbackTitle: Locator;

    constructor(page: Page) {
        super(page);
        this.nameField = page.locator('#name');
        this.emailField = page.locator('#email');
        this.subjectField = page.locator('#subject');
        this.commentField = page.locator('#comment');
        this.submitButton = page.locator('.btn-primary');
        this.resetButton = page.locator('input[value=Clear]');
        this.feedbackTitle = page.locator('h2');
    }
    async goto() {
        await this.page.goto(this.url + '/index.html');
        await this.page.click('#feedback');
    }
    async fillForm(name: string, email: string, subject: string, comment: string) {
        await this.nameField.fill(name);
        await this.emailField.fill(email);
        await this.subjectField.fill(subject);
        await this.commentField.fill(comment);
    }
    async submitForm() {
        await this.submitButton.click();
    }
    async resetForm() {
        await this.resetButton.click();
    }
    async verifyFormReset() {
        await expect(this.nameField).toHaveValue('');
        await expect(this.emailField).toHaveValue('');
        await expect(this.subjectField).toHaveValue('');
        await expect(this.commentField).toHaveValue('');
    }
    async verifyFormSubmission() {
        await expect(this.page.url()).toContain('/sendFeedback.html');
        await expect(this.feedbackTitle).toHaveText('Feedback');
    }

}