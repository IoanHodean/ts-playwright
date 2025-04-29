import {test, expect} from '@playwright/test';
import { baseURL } from '../../playwright.config';
import { FeedbackPage } from '../page-objects/FeedbackPage';

let feedbackPage: FeedbackPage;

test.describe.parallel("Feedback form", () => {
// Before hook
test.beforeEach(async ({ page }) => {
feedbackPage = new FeedbackPage(page);
feedbackPage.goto();    
})

test ('reset feedback form', async ({ page }) => {
    await feedbackPage.fillForm('John Doe', 'da@da.com', 'Test Subject', 'Test Comment');
   await feedbackPage.resetForm();
   await feedbackPage.verifyFormReset();
});

test ('Submit feedback form with valid data', async ({ page }) => {
    await feedbackPage.fillForm('John Doe', 'da@da.com', 'Test Subject', 'Test Comment');
    await feedbackPage.submitForm();
    await feedbackPage.verifyFormSubmission();  
});
});