import { PlaywrightTestConfig } from "@playwright/test";
import * as dotenv from 'dotenv';
dotenv.config();

const config: PlaywrightTestConfig = {
    testDir: "./tests",
    retries: 0,
    timeout: 60000,
    expect: {
        timeout: 5000,
    },
    fullyParallel: true,
    reporter: "html",
    use: {
        actionTimeout: 10000,
        baseURL: process.env.BASE_URL || "http://zero.webappsecurity.com",
        trace:"retain-on-failure",
        video: "retain-on-failure",
        screenshot: "only-on-failure",
        headless: true,
        viewport: { width: 1280, height: 720 },
        ignoreHTTPSErrors: true,
        launchOptions: {
        slowMo: 50,
        },
        extraHTTPHeaders: {
            'Authorization': `Basic ${process.env.TEST_USER}:${process.env.TEST_PASSWORD}`
        }
    },
    projects: [
        {
            name: "Firefox",
            use: { browserName: "firefox" },
        },
        {
            name: "Webkit",
            use: { browserName: "webkit" },
        },
        {
            name: "Chrome",
            use: { browserName: "chromium" },
        },
    ],
};
export default config;
