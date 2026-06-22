import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/login.page';

/**
 * @typedef {Object} MyFixtures
 * @property {LoginPage} loginPage
 */

/** @type {import('@playwright/test').TestType<MyFixtures, {}>} */
export const test = base.extend({
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    }

});

export { expect } from '@playwright/test';