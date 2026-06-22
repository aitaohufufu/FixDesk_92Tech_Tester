import { test, expect } from '../utils/base.js';
import { sendTestReport } from '../utils/reportHelper.js';
import { fillUserNamePassword, gotoLoginPage } from '../utils/authHelper.js';
import { validUsers } from '../test-data/users.js';

async function gotoReportCSV(loginPage, reportCSVPage, username, password) {
    await fillUserNamePassword(loginPage, username, password);
    await loginPage.clickSignIn();

    const expectedHomePattern = `/main/${username}-home`;
    await loginPage.page.waitForURL(`**${expectedHomePattern}`);
    await expect(loginPage.mainTitle).toBeVisible({ timeout: 3000 });

    await reportCSVPage.clickReportMenu(); 
}

test.describe('Reporting and Dashboard', () => {

    test.afterEach(async ({ page, request }, testInfo) => {
        await sendTestReport(page, request, testInfo, 'REPO-CSV');
    });

    // =========================================================================
    // Page Case
    // =========================================================================

    test(`REPO-CSV-01 เข้าสู่หน้าจอ “สร้างรายงาน"`, async ({ loginPage, reportCSVPage }) => {
        const adminUser = validUsers[0];

        await gotoReportCSV(loginPage, reportCSVPage, adminUser.username, adminUser.password);

        await reportCSVPage.page.waitForURL('**/main/manage-report');
        expect(reportCSVPage.isURL('/main/manage-report')).toBe(true);

        await expect(reportCSVPage.reportTitle).toBeVisible();
    });
});