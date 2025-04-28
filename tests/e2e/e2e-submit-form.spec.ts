import {test, expect} from '@playwright/test';
import { baseURL } from '../../playwright.config';

test.describe.parallel("Feedback form", () => {
// Before hook
test.beforeEach(async ({ page }) => {
    await page.goto(baseURL + '/index.html');
    await page.click('#feedback');
})
test ('reset feedback form', async ({ page }) => {
    await page.locator('#name').fill('John Doe');
    await page.locator('#email').fill('da@da.com');
    await page.locator('#subject').fill('Test Subject');    
    await page.locator('#comment').fill('Test Comment');   
    await page.click('input[value=Clear]');
    await expect(page.locator('#name')).toHaveValue('');
    page.pause();
    await expect(page.locator('#email')).toHaveValue('');
    await expect(page.locator('#subject')).toHaveValue('');
    await expect(page.locator('#comment')).toHaveValue('');    

});

test ('Submit feedback form with valid data', async ({ page }) => {
    await page.locator('#name').fill('John Doe');
    await page.locator('#email').fill('da@da.com');
    await page.locator('#subject').fill('Test Subject');    
    await page.locator('#comment').fill('Test Comment');
    await page.locator('.btn-primary').click();
    await expect(page.url()).toContain('/sendFeedback.html');
});
});