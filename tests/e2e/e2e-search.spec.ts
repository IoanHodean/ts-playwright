import {test, expect} from '@playwright/test';
import { baseURL } from '../../playwright.config';
import { HomePage } from '../page-objects/HomePage';
let homePage: HomePage;

test.describe.parallel("Search functionality", () => {
    //Before hook
    test.beforeEach(async ({ page }) => {
        homePage = new HomePage(page);
        await page.goto(baseURL);
    })

    // Test case 1: Search for a valid product
    test('Search for a valid product', async ({ page }) => {
       await homePage.inputSearchTerm('bank');
        await homePage.validSearchResult();        
    })   
})
