const { test, expect } = require('@playwright/test');

const setNames = [
    'Numbers',
    'Emoji',
    'Super Smash Bros.',
    'Pokemon',
    'Mammals',
    'Birds',
    'Reptiles',
    'Flags of the World',
    'US State Flags',
];

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
        await page.locator('div.sets > div > h2', { hasText: setNames[0] }).click();
        await expect(page.locator('.board')).toBeVisible();
        const cards = page.locator('.board > div');
        await expect(cards).toHaveCount(24);
        for (const card of await cards.all()) {
            await expect(card.locator('.front')).toContainText('?');
        }
    });
});
