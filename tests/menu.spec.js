const { test, expect } = require('@playwright/test');
const { setNames } = require('./fixtures');

test.describe('Main Menu', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('Displays each set on the menu page', async ({ page }) => {
        for (const name of setNames) {
            await expect(page.locator('div.sets > div > h2', { hasText: name })).toBeVisible();
        }
    });

    test('Loads a set', async ({ page }) => {
        await page.locator('div.sets > div > h2', { hasText: 'Numbers' }).click();
        await expect(page.locator('.board')).toBeVisible();
        const cards = page.locator('.board > div');
        await expect(cards).toHaveCount(24);
        for (const card of await cards.all()) {
            await expect(card.locator('.front')).toContainText('?');
        }
    });

    test('Loads the Dogs set', async ({ page }) => {
        await page.locator('div.sets > div > h2', { hasText: 'Dogs' }).click();
        await expect(page.locator('.board')).toBeVisible();
        await expect(page.locator('.board > div')).toHaveCount(24);
    });
});
