import {Locator, expect, Page} from '@playwright/test';
import {AbstractPage} from './AbstractPage';
import { snapshot } from 'node:test';
import * as dotenv from 'dotenv';
dotenv.config();
const baseURL = process.env.BASE_URL || 'http://zero.webappsecurity.com';

export class LoginPage extends AbstractPage {
    
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;
    readonly errorMessage: Locator;
    readonly loginForm: Locator;

    constructor(page: Page) {
        super(page);
        this.usernameInput = page.locator(`#user_login`);
        this.passwordInput = page.locator(`#user_password`);
        this.loginButton = page.locator(`.btn-primary`);
        this.errorMessage = page.locator(`.alert-error`);
        this.loginForm = page.locator(`#login_form`);
    }

    async navigate() {
        await this.page.goto(`${baseURL}/login.html`);
    }

    async login(username?: string, password?: string) {
        const finalUsername = username || process.env.TEST_USER || 'default_username';
        const finalPassword = password || process.env.TEST_PASSWORD || 'default_password';
        
        await this.usernameInput.fill(finalUsername);
        await this.passwordInput.fill(finalPassword);
        await this.loginButton.click();
    }

    async assertErrorMessage() {
         await expect (this.errorMessage).toContainText('Login and/or password are wrong.');
    }
    async snapshotLoginForm() {
        const loginFormSnapshot = await this.loginForm.screenshot();
        await expect(loginFormSnapshot).toMatchSnapshot('login-form.png');
    }
    
    async snapshotErrorMessage() {
        const errorMessageSnapshot = await this.errorMessage.screenshot();
        await expect(errorMessageSnapshot).toMatchSnapshot('error-message.png');
    }
}
//some comment