import {test, expect} from '@playwright/test';
import { baseURL } from '../../playwright.config';
import {LoginPage} from '../page-objects/LoginPage';
import {TransferPage} from '../page-objects/TransferPage';
import {Navbar} from '../page-objects/components/Navbar';


let loginPage: LoginPage;
let transferPage: TransferPage;
let navbar: Navbar;

test.describe.parallel("Transfer Funds and Make Payments", () => {
    //Before hook
    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        transferPage = new TransferPage(page);
        navbar = new Navbar(page);

              await loginPage.navigate();
              await loginPage.login('username', 'password');
              //this is needed because the webpage has SSH certificate issues
              await page.goto(baseURL + '/bank/transfer-funds.html');

    })
    test('Transfer Funds', async ({ page }) => {
        await navbar.clickOnTab('Transfer Funds');
        await transferPage.transferFunds('2', '3', '1000', 'Test transfer funds');
        await transferPage.verifySuccessMessage();
        })
})