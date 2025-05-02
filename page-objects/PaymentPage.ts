import {Page, expect, Locator} from '@playwright/test';
import { AbstractPage } from './AbstractPage';


export class PaymentPage extends AbstractPage{

    readonly payee: Locator;
    readonly account: Locator;
    readonly amount: Locator;
    readonly date: Locator;
    readonly description: Locator;
    readonly payButton: Locator;
    readonly successMessage: Locator;
    readonly errorMessage: Locator;

    constructor(page: Page) {
        super(page);
        this.payee = page.locator('#sp_payee');
        this.account = page.locator('#sp_account');
        this.amount = page.locator('#sp_amount');
        this.date = page.locator('#sp_date');
        this.description = page.locator('#sp_description');
        this.payButton = page.locator('#pay_saved_payees');
        this.successMessage = page.locator('.alert-success');
        this.errorMessage = page.locator('.alert-error');
    }

    
    async submitForm(payeeName: string, accountNumber: string, amountValue: string, dateValue: string, descriptionValue: string) {
        await this.payee.selectOption(payeeName);
        await this.account.selectOption(accountNumber);
        await this.amount.fill(amountValue);
        await this.date.fill(dateValue);
        await this.description.fill(descriptionValue);
        await this.payButton.click();
        }
    async verifySuccessMessage() {
        await expect(this.successMessage).toBeVisible();
        await expect(this.successMessage).toContainText('The payment was successfully submitted.');
    }
    async verifyErrorMessage() {
        await expect(this.errorMessage).toBeVisible();
        await expect(this.errorMessage).toContainText('The payment was not successfully submitted.');
    }



}