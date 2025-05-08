import {Page, expect, Locator} from '@playwright/test';
import { AbstractPage } from './AbstractPage';

export class TransferPage extends AbstractPage{
    
    readonly fromAccount: Locator;
    readonly toAccount: Locator;
    readonly amount: Locator;
    readonly description: Locator;
    readonly transferButton: Locator;
    readonly successMessage: Locator;
    readonly errorMessage: Locator;
    readonly transferFundsButton: Locator;

    constructor(page: Page) {
        super(page);
        this.fromAccount = page.locator('#tf_fromAccountId');
        this.toAccount = page.locator('#tf_toAccountId');
        this.amount = page.locator('#tf_amount');
        this.description = page.locator('#tf_description');
        this.transferButton = page.locator('#btn_submit');
        this.successMessage = page.locator('.alert-success');
        this.errorMessage = page.locator('.alert-error');
        this.transferFundsButton = page.locator('#transfer_funds_tab');
        }

    async transferFunds(fromAccount: string, toAccount: string, amount: string, description: string) {
        await this.fromAccount.selectOption(fromAccount); // Checking account
        await this.toAccount.selectOption(toAccount); // Savings account
        await this.amount.fill(amount);
        await this.description.fill(description);
        await this.transferButton.click();
        await this.transferButton.click();
    }
    async verifySuccessMessage() {
        await expect(this.successMessage).toContainText('You successfully submitted your transaction.');
    }
    async verifyErrorMessage() {
        await expect(this.errorMessage).toContainText('There was an error in your transaction. Please correct the error and try again.');
    }

}