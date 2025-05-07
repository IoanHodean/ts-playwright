import {test, expect} from '@playwright/test';
import {LoginPage} from '../../page-objects/LoginPage';
import { PaymentPage} from '../../page-objects/PaymentPage';
import {Navbar} from '../../page-objects/components/Navbar';
import * as dotenv from 'dotenv';
dotenv.config();

let loginPage: LoginPage;
let paymentPage: PaymentPage;
let navbar: Navbar;


test.describe.only("New Payment", {tag: [`@smoke`, `@regression`]}, () => {
    //Before hook
    test.beforeEach(async ({ page }) => {
        paymentPage = new PaymentPage(page);
        loginPage = new LoginPage(page);
        navbar = new Navbar(page);
        await loginPage.navigate();
        await loginPage.login();
        //this is needed because the webpage has SSH certificate issues 
        await page.goto(`${process.env.BASE_URL}/bank/transfer-funds.html`);
        
    })
    
    test('Verify payment with valid data', async ({ page }) => {
        await navbar.clickOnTab('Pay Bills');
        await paymentPage.submitForm('Apple', '6', '1000', '2023-10-01', 'Test payment');
        await paymentPage.verifySuccessMessage();
        
    })
})
