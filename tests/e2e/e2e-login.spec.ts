import { test,expect } from "@playwright/test";
import { baseURL } from '../../playwright.config';



test.describe.parallel("Login-logout flow", () => {  
    //Before hook
    test.beforeEach(async ({ page }) => {
        await page.goto(baseURL);
    })

    // Test case 1: Login with valid credentials
    test('Login with valid credentials', async ({ page }) => {
        await page.click(`#signin_button`);
        await page.locator('#user_login').fill('username');
        await page.locator('#user_password').fill('password');
        await page.locator('.btn-primary').click();
        await page.goto(baseURL + '/bank/transfer-funds.html');
        await expect(page.url()).toContain('/bank/transfer-funds.html');      
    })

    
// Test case 2: Login with invalid credentials
test('Login with invalid credentials', async ({ page }) => {
    await page.click(`#signin_button`);
    await page.locator('#user_login').fill('username');
    await page.locator('#user_password').fill('wrongpassword');
    await page.locator('.btn-primary').click();
    await expect(page.locator('.alert-error')).toBeVisible();
})
});
