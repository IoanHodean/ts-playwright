 import { PlaywrightTestConfig } from "@playwright/test";
 
 const config: PlaywrightTestConfig = {
     testDir: "tests/api",
     retries: 0,
     timeout: 60000,
     expect: {
         timeout: 5000,
     },
     fullyParallel: true,
     reporter: "html",
     use: {
         actionTimeout: 10000,
         baseURL: "http://zero.webappsecurity.com",
         trace:"retain-on-failure",
         video: "retain-on-failure",
         screenshot: "only-on-failure",
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
        export const baseURL = (config.use?.baseURL ?? "http://default.url") as string;