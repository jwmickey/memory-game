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

test.describe('Play Game', () => {
    test.beforeEach(async ({ page }) => {
        await page.addInitScript(() => {
            window.localStorage.setItem('cardflip_timeout', '50');
        });
        await page.goto('/');
    });

    test('Wins impressively', async ({ page }) => {
        await page.locator('div.sets > div > h2', { hasText: setNames[0] }).click();
        await expect(page.locator('.board')).toBeVisible();

        // cheat!
        const cardElements = page.locator('.board > div');
        const count = await cardElements.count();
        const pairs = new Map();

        for (let i = 0; i < count; i++) {
            const text = await cardElements.nth(i).locator('.back').textContent();
            if (pairs.has(text)) {
                pairs.get(text).push(i);
            } else {
                pairs.set(text, [i]);
            }
        }

        for (const pair of pairs.values()) {
            await cardElements.nth(pair[0]).click();
            await expect(cardElements.nth(pair[0]).locator('.back')).toBeVisible();
            await cardElements.nth(pair[1]).click();
            await expect(cardElements.nth(pair[1]).locator('.back')).toBeVisible();
        }

        await expect(page.locator('.results')).toBeVisible();
        await expect(page.locator('.results')).toContainText('SUCCESS!');

        await page.getByRole('button', { name: 'Play Again!' }).click();
        await expect(page.locator('div.sets')).toBeVisible();
    });
});
