import { test, expect } from '@playwright/test';
import { getTranslation } from '../helpers/translationHelpers';
import { doLogin } from '../helpers/loginHelpers';

const validUsername = process.env.VALID_USERNAME as string;
const validPassword = process.env.VALID_PASSWORD as string;

test.use({ storageState: { cookies: [], origins: [] } });

test.beforeEach(async ({ page }) => {
  await test.step('Navigate to web page', async () => {
    await page.goto('/');
  });
});

test('Valid login', { tag: '@TC-1.1' }, async ({ page }) => {
  await test.step('Enter valid username and password', async () => {
    await doLogin(page, validUsername, validPassword);
  });

  await test.step('User logs in and lands on the products page', async () => {
    await page.evaluate(() => {
      // Get all inventory items
      const inventoryItems = document.querySelectorAll('[data-test="inventory-item"]');

      // Loop through each inventory item and apply the changes, but only for the first 3 items
      inventoryItems.forEach((item: Element, index: number) => {
        const htmlItem = item as HTMLElement; // Cast to HTMLElement

        if (index >= 5) {
          htmlItem.style.display = 'none'; // Hide the items beyond the first 3
        } else {
          // Modify image to broken image
          const img = item.querySelector('img') as HTMLImageElement | null;
          if (img) {
            img.src = 'invalid-image.jpg'; // Set broken image
            img.setAttribute('alt', `Test Alt Text ${index + 1}`); // Update alt text with unique value
          }

          // Modify the title text
          const title = item.querySelector(
            '[data-test="inventory-item-name"]'
          ) as HTMLElement | null;
          if (title) {
            title.textContent = `Product Test Title ${index + 1}`; // Update title with unique value
          }

          // Modify the description text
          const desc = item.querySelector(
            '[data-test="inventory-item-desc"]'
          ) as HTMLElement | null;
          if (desc) {
            desc.textContent =
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod ' +
              'tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim ' +
              'veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea ' +
              'commodo consequat.'; // Update description with unique value
          }

          // Modify the price
          const price = item.querySelector(
            '[data-test="inventory-item-price"]'
          ) as HTMLElement | null;
          if (price) {
            price.textContent = '$99.99'; // Update price
          }
        }
      });
    });

    await expect(page, 'User should be logged into the landing page').toHaveURL(
      '/inventory.html'
    );

    await expect(page, 'Visual issue with landing page').toHaveScreenshot({
      fullPage: true,
    });
  });
});

[
  { title: 'username', username: 'invalid_user', password: validPassword },
  { title: 'password', username: validUsername, password: 'bad_sauce' },
].forEach(({ title, username, password }) => {
  test(`Invalid ${title} login`, { tag: '@TC-1.2' }, async ({ page }) => {
    await test.step('Enter invalid username or password', async () => {
      await doLogin(page, username, password);
    });

    await test.step('Error message is displayed', async () => {
      await expect(
        page.locator('.error_icon'),
        'Both username and password should have error icons'
      ).toHaveCount(2);

      await expect(
        page.getByTestId('error'),
        'Error message mismatch or not displayed'
      ).toContainText(await getTranslation('loginError'));
    });
  });
});
