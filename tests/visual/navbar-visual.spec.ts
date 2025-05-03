import {test} from '@playwright/test';
import {Navbar} from '../../page-objects/components/Navbar';
import { LoginPage } from '../../page-objects/LoginPage';
import { baseURL } from '../../playwright.config';

let navbar: Navbar;
let loginPage: LoginPage;

test.describe('Visual Testing for Navbar', () => {
    test.beforeEach(async ({page}) => {
        navbar = new Navbar(page);
        loginPage = new LoginPage(page);
        await loginPage.navigate();
        await loginPage.login('username', 'password'); // Replace with actual credentials
        await page.goto(`${baseURL}/bank/transfer-funds.html`); // Adjust the URL as needed
    });

    test('Capture Navbar State for All Tabs', async () => {
        await navbar.compareAllNavStates();
    });
});    
