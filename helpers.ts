export async function loadHomePage(page) {
  await page.goto("http://zero.webappsecurity.com");
  await page.locator("#signin_button").click();
}
export async function assertTitle(page) {
  await page.waitForSelector("h3");  
}
