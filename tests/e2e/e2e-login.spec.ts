import { test,expect } from "@playwright/test";
import { LoginPage } from "../../page-objects/LoginPage";
import * as dotenv from 'dotenv';
dotenv.config();
import * as testData from "../../test-data/login-data.json";

test.describe.parallel.only("Login-logout flow", {tag: ['@smoke', '@regression']}, () => {  
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
    await loginPage.login(testData.invalidCredentials[0].username, testData.invalidCredentials[0].password);
    await loginPage.assertErrorMessage();
})
});
test.describe.parallel("Security tests", { tag: ['@security'] }, () => {
    let loginPage: LoginPage;
    //Before hook
    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        await loginPage.navigate();
    })

    test('sql injection', async ({ page }) => {
       await loginPage.login(testData.sqlInjection[0].username, testData.sqlInjection[0].password);
       await loginPage.assertErrorMessage();
    })
    test('XSS attacks', async ({ page }) => {
        for (let i = 0; i < testData.xssAttack.length; i++) {
        await loginPage.login(testData.xssAttack[i].username, testData.xssAttack[i].password);
        await loginPage.assertErrorMessage();
    }    
})
});
