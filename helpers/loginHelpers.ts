import { Page } from '@playwright/test';
import { getTranslation } from '../helpers/translationHelpers';

export async function doLogin(page: Page, siteUsername: string, sitePassword: string) {
  await page.getByPlaceholder(await getTranslation('username')).fill(siteUsername);
  await page.getByPlaceholder(await getTranslation('password')).fill(sitePassword);
  await page.getByRole('button', { name: await getTranslation('login') }).click();
}
