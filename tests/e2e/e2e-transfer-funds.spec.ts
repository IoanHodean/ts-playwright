import {test, expect} from '@playwright/test';
import { baseURL } from '../../playwright.config';

test.describe.parallel("Transfer Funds and Make Payments", () => {
    //Before hook
    test.beforeEach(async ({ page }) => {
        await page.goto(baseURL+'/login.html');       
        await page.locator('#user_login').fill('username');
        await page.locator('#user_password').fill('password');
        await page.locator('.btn-primary').click();
        await page.goto(baseURL + '/bank/transfer-funds.html');
        await expect(page.url()).toContain('/bank/transfer-funds.html'); 

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