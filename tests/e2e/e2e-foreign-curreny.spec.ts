import {test, expect} from '@playwright/test';
import { baseURL } from '../../playwright.config';
import {LoginPage} from '../../tests/page-objects/LoginPage';

let loginPage: LoginPage;

test.describe.parallel("Foreign Currency", () => {
    //Before hook
    test.beforeEach(async ({ page }) => {
       loginPage = new LoginPage(page);
             await loginPage.navigate();
             await loginPage.login('username', 'password');
             //this is needed because the webpage has SSH certificate issues
             await page.goto(baseURL + '/bank/transfer-funds.html');
    })
    test('Verify foreign currency exchange rate', async ({ page }) => {
         await page.click('#pay_bills_tab');
         await page.click('text=Purchase Foreign Currency');
         await page.locator('#pc_currency').selectOption('EUR');
         const sum=500.00.toFixed(2).toString();
         await page.locator('id=pc_amount').fill(sum);
         await page.locator('#pc_inDollars_true').check();
         await page.locator('#pc_calculate_costs').click();
         await expect(page.locator('#pc_conversion_amount')).toBeVisible();
         const amount= 500/1.3862;
         const mount= amount.toFixed(2).toString();
         await expect(page.locator('#pc_conversion_amount')).toContainText(`${mount} euro (EUR) = ${sum} U.S. dollar (USD)`);
         await page.click('id=purchase_cash');
         await expect(page.locator('#alert_content')).toBeVisible();
         await expect(page.locator('#alert_content')).toContainText('Foreign currency cash was successfully purchased.');   
          })
})