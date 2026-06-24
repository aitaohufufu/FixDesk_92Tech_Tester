import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { EditPhoneModal } from '../modals/edit-phone.modal';
import { EditPasswordModal } from '../modals/edit-password.modal';
import { RepairFormPage } from '../pages/repair-form.page';
import { RepairStatusPage } from '../pages/repair-status.page';
import { ReportCSVPage } from '../pages/report-csv.page';

/**
 * @typedef {Object} MyFixtures
 * @property {LoginPage} loginPage
 * @property {EditPhoneModal} editPhoneModal
 * @property {EditPasswordModal} editPasswordModal
 * @property {RepairFormPage} repairFormPage
 * @property {RepairStatusPage} repairStatusPage
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

    editPasswordModal: async ({ page }, use) => {
        await use(new EditPasswordModal(page));
    },

    repairFormPage: async ({ page }, use) => {
        await use(new RepairFormPage(page));
    },

    repairStatusPage: async ({ page }, use) => {
        await use(new RepairStatusPage(page));
    },

    reportCSVPage: async ({ page }, use) => {
        await use(new ReportCSVPage(page));
    },

});

export { expect } from '@playwright/test';