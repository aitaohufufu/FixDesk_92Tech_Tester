import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { ReportCSVPage } from '../pages/report_csv.page';
import { ReportMonPage } from '../pages/report_mon.page';
import { ReportPDFPage } from '../pages/report_pdf.page';
import { ReportDasPage } from '../pages/report_das.page';
import { BuildingPage } from '../pages/building.page';
import { AcceptJobPage } from '../pages/accept_job.js';
import { JobManagePage } from '../pages/job_manage.js';
import { TechRequestPage } from '../pages/tech_req.js';
/**
 * @typedef {Object} MyFixtures
 * @property {LoginPage} loginPage
 */

/** @type {import('@playwright/test').TestType<MyFixtures, {}>} */
export const test = base.extend({
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },

    reportCSVPage: async ({ page }, use) => {
        await use(new ReportCSVPage(page));
    },
    reportMonPage: async ({ page }, use) => {
        await use(new ReportMonPage(page));
    },

    reportPDFPage: async ({ page }, use) => {
        await use(new ReportPDFPage(page));
    },

    reportDasPage: async ({ page }, use) => {
        await use(new ReportDasPage(page));
    },

    buildingPage: async ({ page }, use) => {
        await use(new BuildingPage(page));
    },

    acceptJobPage: async ({ page }, use) => {
        await use(new AcceptJobPage(page));
    },

    jobManagePage: async ({ page }, use) => {
        await use(new JobManagePage(page));
    },
    techRequestPage: async ({ page }, use) => {
        await use(new TechRequestPage(page));
    },

});

export { expect } from '@playwright/test';
