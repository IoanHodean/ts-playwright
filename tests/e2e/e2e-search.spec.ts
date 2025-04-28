import {test, expect} from '@playwright/test';
import { baseURL } from '../../playwright.config';

test.describe.parallel("Search functionality", () => {
    //Before hook
    test.beforeEach(async ({ page }) => {
        await page.goto(baseURL);
    })

    // Test case 1: Search for a valid product
    test('Search for a valid product', async ({ page }) => {
        await page.locator('#searchTerm').fill('bank');
        await page.keyboard.press('Enter');
        await expect(page.locator('li>a')).toHaveCount(2);
    })   
})
