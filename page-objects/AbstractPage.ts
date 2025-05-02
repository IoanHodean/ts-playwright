import { Page, expect } from '@playwright/test';
import { baseURL } from '../playwright.config';

export class AbstractPage {
    readonly page: Page;
    readonly url: string;

    constructor(page: Page) {
        this.page = page;
        this.url = baseURL;
    }

    
    }
