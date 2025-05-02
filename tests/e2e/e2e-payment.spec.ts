import {test, expect} from '@playwright/test';
import { baseURL } from '../../playwright.config';
import {LoginPage} from '../../page-objects/LoginPage';
import { PaymentPage} from '../../page-objects/PaymentPage';
import {Navbar} from '../../page-objects/components/Navbar';

let loginPage: LoginPage;
let paymentPage: PaymentPage;
let navbar: Navbar;


test.describe.only("New Payment", () => {
    //Before hook
    test.beforeEach(async ({ page }) => {
        paymentPage = new PaymentPage(page);
        loginPage = new LoginPage(page);
        navbar = new Navbar(page);
        await loginPage.navigate();
        await loginPage.login('username', 'password');
        //this is needed because the webpage has SSH certificate issues 
        await page.goto(baseURL + '/bank/transfer-funds.html');
        
    })
    
    test('Verify payment with valid data', async ({ page }) => {
        await navbar.clickOnTab('Pay Bills');
        await paymentPage.submitForm('Apple', '6', '1000', '2023-10-01', 'Test payment');
        await paymentPage.verifySuccessMessage();
        
    })
})
