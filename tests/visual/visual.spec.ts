import {test, expect, Page} from '@playwright/test';
import { baseURL } from '../../visual.config';

test.describe('Visual Testing', () => {
    let page: Page;
    test.beforeEach(async ({browser}) => {
        page = await browser.newPage();
        await page.goto(`${baseURL}/index.html`);
    });

    test('Full Page Snapshot', async () => {
        const screenshot = await page.screenshot();
        await expect(screenshot).toMatchSnapshot('homepage.png');
   
    });
})

