import { PlaywrightTestConfig } from "@playwright/test";
import * as dotenv from "dotenv";
dotenv.config();

const config: PlaywrightTestConfig = {
    testDir: "tests/api",
    retries: 0,
    timeout: 60000,
    expect: {
        timeout: 5000,
    },
    fullyParallel: true,
    reporter: [
        ['line'],
        ['allure-playwright', {
            detail: true,
            outputFolder: 'allure-results',
            suiteTitle: false
        }]
    ],
    use: {
        actionTimeout: 10000,
        baseURL: "https://reqres.in/api",
        trace: "retain-on-failure",
        video: "retain-on-failure",
        screenshot: "only-on-failure",
        headless: true,
        viewport: { width: 1280, height: 720 },
        ignoreHTTPSErrors: true,
        extraHTTPHeaders: {
            'x-api-key': (process.env.API_KEY) as string,
            'Accept': 'application/json'
        },
        launchOptions: {
            slowMo: 50,
        },
    },
    projects: [
        {                    
            name: "API",
            use: { browserName: "chromium" },
        },
    ],
};

export default config;
export const baseURL = (config.use?.baseURL ?? "http://default.url") as string;