import { test, expect } from '@playwright/test';

test('homepage loads with Gobbldygook text', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await expect(page.locator('body')).toContainText('Gobbldygook', { ignoreCase: true });
});
