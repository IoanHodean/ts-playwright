import { Given, When, Then } from '@cucumber/cucumber';
import { LoginPage } from '../../page-objects/LoginPage.js';
import { expect } from '@playwright/test';

Given('I am on the login page', async function () {
    const loginPage = new LoginPage(global.page);
    await loginPage.navigate();
});

When('I enter valid credentials', async function () {
    const loginPage = new LoginPage(global.page);
    await loginPage.login();
});

When('I enter invalid credentials', async function () {
    const loginPage = new LoginPage(global.page);
    await loginPage.login('invalid_user', 'invalid_password');
});

Then('I should be logged in successfully', async function () {
    const loginPage = new LoginPage(global.page);
    await expect(global.page).toHaveURL(/.*\/bank\/account-summary.html/);
});

Then('I should see an error message', async function () {
    const loginPage = new LoginPage(global.page);
    await loginPage.assertErrorMessage();
});

Then('I should not be logged in', async function () {
    const loginPage = new LoginPage(global.page);
    await expect(global.page).toHaveURL(/.*\/login.html/);
});



