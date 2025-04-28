import {test, expect} from '@playwright/test';
import { baseURL } from '../playwright.config';


test ('Simple basic test', async ({page}) => {
    await page.goto(`https://example.com`);
  const pageTitle=page.locator('h1');
  await expect(pageTitle).toContainText('Example Domain');
})

test.only ('Clicking on Elements @myTag', async ({page}) => {
   await page.goto(baseURL+`/login.html`);
  await page.locator('text=Sign in').click();
  const alertError=page.locator('.alert-error');
  await expect(alertError).toContainText('Login and/or password are wrong.');
})

test ('Filling out a form',{tag:'@fast'},  async ({page}) => {
   await page.goto(`http://zero.webappsecurity.com/login.html`);
  await page.locator('#user_login').fill('username');
  await page.locator('#user_password').fill('password');
  await page.pause();
  await page.locator('.btn-primary').click();
  const alertError=page.locator('.alert-error');
  await expect(alertError).toContainText('Login and/or password are wrong.');
  
   })
