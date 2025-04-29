import {Locator, expect, Page} from '@playwright/test';
import {baseURL} from '../../playwright.config';
import {AbstractPage} from './AbstractPage';

export class LoginPage extends AbstractPage {
    
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;
    readonly errorMessage: Locator;

    constructor(page: Page) {
        super(page);
        this.usernameInput = page.locator(`#user_login`);
        this.passwordInput = page.locator(`#user_password`);
        this.loginButton = page.locator(`.btn-primary`);
        this.errorMessage = page.locator(`.alert-error`);
    }

    async navigate() {
        await this.page.goto(`${baseURL}/login.html`);
    }

    async login(username: string, password: string) {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }

    async assertErrorMessage() {
         await expect (this.errorMessage).toContainText('Login and/or password are wrong.');
    }
}