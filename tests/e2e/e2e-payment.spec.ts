import {test, expect} from '@playwright/test';
import { baseURL } from '../../playwright.config';

test.describe.parallel("New Payment", () => {
    //Before hook
    test.beforeEach(async ({ page }) => {
        await page.goto(baseURL+'/login.html');       
        await page.locator('#user_login').fill('username');
        await page.locator('#user_password').fill('password');
        await page.locator('.btn-primary').click();
        await page.goto(baseURL + '/bank/transfer-funds.html');
        
    })
    
    test('Verify payment with valid data', async ({ page }) => {
        await page.click('#pay_bills_tab')
        await page.locator('#sp_payee').selectOption('apple')
        await page.locator('#sp_account').selectOption('6')
        await page.locator('#sp_amount').fill('1000')
        await page.locator('#sp_date').fill('2023-10-01')
        await page.locator('#sp_description').fill('Test payment')
        await page.click('#pay_saved_payees')
        const successMessage = await page.locator('.alert-success')
        await expect(await page.locator('#alert_content')).toHaveText('The payment was successfully submitted.')
        await expect(successMessage).toBeVisible()
    })
})
