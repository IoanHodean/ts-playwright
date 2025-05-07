import {test, expect} from '@playwright/test';
import * as dotenv from 'dotenv';
import { HomePage } from '../../page-objects/HomePage';
import { dot } from 'node:test/reporters';
let homePage: HomePage;
dotenv.config();

test.describe.parallel("Search functionality", () => {
    //Before hook
    test.beforeEach(async ({ page }) => {
        homePage = new HomePage(page);
        await page.goto(process.env.BASE_URL+"");
    })

    // Test case 1: Search for a valid product
    test('Search for a valid product', async ({ page }) => {
       await homePage.inputSearchTerm('bank');
        await homePage.validSearchResult();        
    })   
})
