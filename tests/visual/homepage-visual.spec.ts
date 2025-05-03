import {test, expect} from '@playwright/test';
import { HomePage } from '../../page-objects/HomePage';
import { LoginPage } from '../../page-objects/LoginPage';

let homePage: HomePage;
let loginPage: LoginPage;

test.describe('Home Page Visual Testing', () => {
    test.beforeAll(async ({page}) => {
        loginPage = new LoginPage(page);
        homePage = new HomePage(page);
        await loginPage.navigate();
        await loginPage.login('username', 'password'); // Replace with actual credentials
        await homePage.goto();
    });

    test('Home Page Snapshot', async () => {
        await homePage.pageSnapshot();
    });

    test('Search Box Snapshot', async () => {
        await homePage.inputSearchTerm('Test Search');
        await homePage.searchResultSnapshot();        
    });
});