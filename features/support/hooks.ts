import { chromium } from 'playwright';
import type { Browser, BrowserContext, Page } from '@playwright/test';
import { Before, After, BeforeAll, AfterAll, Status } from '@cucumber/cucumber';
import { logger } from './logger.js';
import { retry } from './retry.js';
import path from 'path';
import fs from 'fs';

declare global {
    var browser: Browser;
    var context: BrowserContext;
    var page: Page;
}

const SCREENSHOTS_DIR = path.join(process.cwd(), 'reports', 'screenshots');

// Ensure screenshots directory exists
if (!fs.existsSync(SCREENSHOTS_DIR)) {
    fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

BeforeAll(async function () {
    try {
        logger.info("Launching browser");
        global.browser = await retry(
            () => chromium.launch({
                headless: false
            })
        );
    } catch (error) {
        logger.error("Failed to launch browser: %s", error);
        throw error;
    }
});

AfterAll(async function () {
    try {
        logger.info("Closing browser");
        await global.browser.close();
    } catch (error) {
        logger.error("Error while closing browser: %s", error);
    }
});

Before(async function () {
    try {
        logger.info("Creating new browser context and page");
        global.context = await retry(() => global.browser.newContext());
        global.page = await retry(() => global.context.newPage());
    } catch (error) {
        logger.error("Failed to create browser context or page: %s", error);
        throw error;
    }
});

After(async function (scenario) {
    try {
        // Take screenshot if scenario failed
        if (scenario.result?.status === Status.FAILED) {
            const screenshotPath = path.join(
                SCREENSHOTS_DIR,
                `${scenario.pickle.name.replace(/\s+/g, '_')}_${Date.now()}.png`
            );
            await global.page.screenshot({ path: screenshotPath, fullPage: true });
            logger.info("Screenshot saved: %s", screenshotPath);
            
            // Attach screenshot to the report
            const screenshot = await global.page.screenshot({ type: 'png' });
            this.attach(screenshot.toString('base64'), 'image/png');
        }

        logger.info("Closing browser context and page");
        await global.page?.close();
        await global.context?.close();
    } catch (error) {
        logger.error("Error in after hook: %s", error);
    }
});

