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
    test('Element Snapshot', async () => {
        let moreServices= await page.$('id=online-banking'); // Replace with your element selector
        if (moreServices) {
            const screenshot = await moreServices.screenshot();
            await expect(screenshot).toMatchSnapshot(`${moreServices}.png`);
        } else {
           // throw new Error('Element not found');
        }
    })
})

