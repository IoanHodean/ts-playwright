import {test, expect} from '@playwright/test';
import { baseURL } from '../../playwright.config';

test.describe.parallel("Filter Transactions", () => {
    //Before hook
    test.beforeEach(async ({ page }) => {
        await page.goto(baseURL+'/login.html');       
        await page.locator('#user_login').fill('username');
        await page.locator('#user_password').fill('password');
        await page.locator('.btn-primary').click();
        await page.goto(baseURL + '/bank/transfer-funds.html');
        
    })
    test('Verify results for each account', async ({ page }) => {
         await page.click('#account_activity_tab')
            await page.selectOption('#aa_accountId', '2')
            const checkingAccount = await page.locator(
              '#all_transactions_for_account tbody tr'
            )
            await expect(checkingAccount).toHaveCount(3)
        
            await page.selectOption('#aa_accountId', '4')
            const loanAccount = await page.locator(
              '#all_transactions_for_account tbody tr'
            )
            await expect(loanAccount).toHaveCount(2)
        
            await page.selectOption('#aa_accountId', '6')
            const noResults = await page.locator('.well')
            await expect(noResults).toBeVisible()
            await expect(noResults).toHaveText('No results.')
    })
})