import {test, expect} from '@playwright/test';
import { LoginPage } from '../../page-objects/LoginPage';

test.describe.only('Login Page Visual Testing', () => {
    let loginPage: LoginPage;

    test.beforeEach(async ({page}) => {
        loginPage = new LoginPage(page);
        await loginPage.navigate();
    });

    test('Login Form Snapshot', async () => {
        await loginPage.snapshotLoginForm();
    });

    test('Login Error Message Snapshot', async () => {
        await loginPage.login('invalidUser', 'invalidPassword');       
        await loginPage.snapshotErrorMessage();
    });

})
