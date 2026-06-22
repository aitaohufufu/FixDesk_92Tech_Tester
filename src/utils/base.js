import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { EditPhoneModal } from '../modals/edit-phone.modal';
import { ReportCSVPage } from '../pages/report_csv.page';

/**
 * @typedef {Object} MyFixtures
 * @property {LoginPage} loginPage
 * @property {EditPhoneModal} editPhoneModal
 * @property {ReportCSVPage} reportCSVPage
 */

/** @type {import('@playwright/test').TestType<MyFixtures, {}>} */
export const test = base.extend({
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },

    editPhoneModal: async ({ page }, use) => {
        await use(new EditPhoneModal(page));
    },

    reportCSVPage: async ({ page }, use) => {
        await use(new ReportCSVPage(page));
    },

});

export { expect } from '@playwright/test';