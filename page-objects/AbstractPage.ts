import { Page, expect } from '@playwright/test';
import * as dotenv from 'dotenv';
dotenv.config();

export class AbstractPage {
    readonly page: Page;
    readonly url: string;

    constructor(page: Page) {
        this.page = page;
        this.url = process.env.BASE_URL || 'http://zero.webappsecurity.com';
    }

    
    }
