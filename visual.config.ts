import { PlaywrightTestConfig } from "@playwright/test";

const config: PlaywrightTestConfig = {
    testDir: "tests/visual",
    retries: 0,
    timeout: 60000,
    expect: {
        timeout: 5000,
        toMatchSnapshot: {
            maxDiffPixels: 100,
            threshold: 0.3
        }
    },
    fullyParallel: true,
    reporter: "html",
    use: {
        actionTimeout: 10000,
        baseURL: "http://zero.webappsecurity.com",
        trace: "retain-on-failure",
        video: "off",
        screenshot: "off",
        headless: true,
        viewport: { width: 1280, height: 720 },
        ignoreHTTPSErrors: true,
        launchOptions: {
            slowMo: 50,
        },
    },
    projects: [
        {
            name: "Firefox",
            use: { 
                browserName: "firefox",
                viewport: { width: 1280, height: 720 }
            },
        },
        {
            name: "Webkit",
            use: { 
                browserName: "webkit",
                viewport: { width: 1280, height: 720 }
            },
        },
        {
            name: "Chrome",
            use: { 
                browserName: "chromium",
                viewport: { width: 1280, height: 720 }
            },
        },
    ],
};

export default config;
export const baseURL = (config.use?.baseURL ?? "http://default.url") as string;