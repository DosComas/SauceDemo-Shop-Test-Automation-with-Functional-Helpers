import { test, expect } from '@playwright/test';
import { getTranslation } from '../helpers/translationHelpers';

test.beforeEach(async ({ page }) => {
  await test.step('Navigate to web page', async () => {
    await page.goto('/inventory.html');
  });
});

test('Logout', { tag: '@TC-6.1' }, async ({ page }) => {
  await test.step('Do Logout', async () => {
    await page.getByRole('button', { name: await getTranslation('openMenu') }).click();
    await page.getByRole('link', { name: await getTranslation('logout') }).click();
  });

  await test.step('User is logged out and redirected to the login page,', async () => {
    await expect(page, 'User should be redirected into the landing page').toHaveURL('/');

    await expect(page, 'Visual issue with login page').toHaveScreenshot({
      fullPage: true,
    });
  });
});
