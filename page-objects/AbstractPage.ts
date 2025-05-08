import { Page, expect } from '@playwright/test';
import { config } from '../config/environment';

export class AbstractPage {
    readonly page: Page;
    readonly url: string;

    constructor(page: Page) {
        this.page = page;
        this.url = config.baseURL;
    }

    
    }
