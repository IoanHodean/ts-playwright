import { Page } from '@playwright/test';

export async function loadHomePage(page: Page) {
  await page.goto("http://zero.webappsecurity.com");
  await page.locator("#signin_button").click();
}
export async function assertTitle(page: Page) {
  await page.waitForSelector("h3");  
}
