import {Page, expect, Locator} from '@playwright/test';
import {baseURL} from '../playwright.config'
import {AbstractPage} from './AbstractPage';

export class HomePage extends AbstractPage {
    
    readonly transferFundsButton: Locator;
    readonly payBillsButton: Locator;
    readonly accountSummaryButton: Locator;
    readonly accountActivityButton: Locator;
    readonly logoutButton: Locator;
    readonly signInButton: Locator;
    readonly searchBox: Locator;

    constructor(page: Page) {
        super(page);
        this.transferFundsButton = page.locator(`text=Transfer Funds`);
        this.payBillsButton = page.locator(`text=Pay Bills`);
        this.accountSummaryButton = page.locator(`text=Account Summary`);
        this.accountActivityButton = page.locator(`text=Account Activity`);
        this.logoutButton = page.locator(`text=Logout`);
        this.signInButton = page.locator(`text=Sign In`);
        this.searchBox = page.locator(`#searchTerm`);
    }

    async goto() {
        await this.page.goto(baseURL + '/bank/transfer-funds.html');  
    }
    async clickSignInButton() {
        await this.signInButton.click();
    }
    async clickTransferFundsButton() {
        await this.transferFundsButton.click();
    }
    async clickPayBillsButton() {
        await this.payBillsButton.click();
    }
    async inputSearchTerm(searchTerm: string) {
        await this.searchBox.fill(searchTerm);
        await this.page.keyboard.press('Enter');
    }
    async validSearchResult() {
        await expect(this.page.locator('li>a')).toHaveCount(2);
    }
    async pageSnapshot() {
        const screenshot = await this.page.screenshot();
        await expect(screenshot).toMatchSnapshot('homepage.png');
    }
    async searchResultSnapshot() {
        const searchResult = await this.page.locator('h2').screenshot();
        await expect(searchResult).toMatchSnapshot('search-result.png');
    }

}