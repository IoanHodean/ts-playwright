import {test, expect} from '@playwright/test';
import { baseURL } from '../../playwright.config';
import {LoginPage} from '../page-objects/LoginPage';

let loginPage: LoginPage;

test.describe.parallel("Transfer Funds and Make Payments", () => {
    //Before hook
    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
              await loginPage.navigate();
              await loginPage.login('username', 'password');
              //this is needed because the webpage has SSH certificate issues
              await page.goto(baseURL + '/bank/transfer-funds.html');

    })
    test('Transfer Funds', async ({ page }) => {
        await page.locator('#tf_fromAccountId').selectOption('2'); // Checking account
        await page.locator('#tf_toAccountId').selectOption('3'); // Savings account
        await page.locator('#tf_amount').fill('1000');
        await page.locator('#tf_description').fill('Test transfer funds');
        await page.locator('#btn_submit').click();
        await page.locator('#btn_submit').click();
        await expect(page.locator('.alert')).toContainText('You successfully submitted your transaction.');
        })
})