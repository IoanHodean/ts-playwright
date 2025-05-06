import { test,expect } from "@playwright/test";
import { LoginPage } from "../../page-objects/LoginPage";
import * as dotenv from 'dotenv';
dotenv.config();

test.describe.parallel.only("Login-logout flow", () => {  
    let loginPage: LoginPage;

    //Before hook
    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        await loginPage.navigate();
    })

    // Test case 1: Login with valid credentials
    test('Login with valid credentials', async ({ page }) => {
       await loginPage.login();    
        await page.goto(process.env.BASE_URL + '/bank/transfer-funds.html');
        await expect(page.url()).toContain('/bank/transfer-funds.html');      
    })

    
// Test case 2: Login with invalid credentials
test('Login with invalid credentials', async ({ page }) => {
    await loginPage.login("invalidUser", "invalidPassword");    
    await loginPage.assertErrorMessage();
})
});
