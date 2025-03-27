import { test as setup, expect } from '@playwright/test';
import { doLogin } from '../helpers/loginHelpers';
import { getTranslation } from '../helpers/translationHelpers';
import path from 'path';

const authFile = path.join(__dirname, '../.auth/user.json');

const validUsername = process.env.VALID_USERNAME as string;
const validPassword = process.env.VALID_PASSWORD as string;

setup('Authenticate', async ({ page }) => {
  await page.goto('');
  await doLogin(page, validUsername, validPassword);

  await expect(page, 'User should be logged into the landing page').toHaveURL(
    '/inventory.html'
  );

  await page.context().storageState({ path: authFile });
});
