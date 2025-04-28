import {test, expect} from '@playwright/test';
import { baseURL } from '../../playwright.config';

test.describe.parallel("Transfer Funds and Make Payments", () => {
    //Before hook
    test.beforeEach(async ({ page }) => {
        await page.goto(baseURL+'/login.html');
        await page.click(`#signin_button`);
        await page.locator('#user_login').fill('username');
        await page.locator('#user_password').fill('password');
        await page.locator('.btn-primary').click();
        await page.goto(baseURL + '/bank/transfer-funds.html');
        await expect(page.url()).toContain('/bank/transfer-funds.html'); 

    })

    })