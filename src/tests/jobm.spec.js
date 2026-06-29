import { test, expect } from '../utils/base.js';
import { sendTestReport } from '../utils/reportHelper.js';
import { fillUserNamePassword } from '../utils/authHelper.js';
import { validUsers } from '../test-data/users.js';


async function gotoJobAssign(loginPage, jobManagePage, username, password) {
    await loginPage.page.goto('/');

    await fillUserNamePassword(loginPage, username, password);
    await loginPage.clickSignIn();

    await loginPage.page.waitForURL(/#\/main\/.+-home/);
    await expect(loginPage.mainTitle).toBeVisible();

    await Promise.all([
        jobManagePage.page.waitForURL(/#\/main\/admin-check-request/),
        jobManagePage.clickJobAssignMenu()
    ]);
}


test.describe('Job Management', () => {
    test.describe.configure({ mode: 'serial' });

    test.afterEach(async ({ page, request }, testInfo) => {
        await sendTestReport(page, request, testInfo, 'JOBM');
    });

    test('JOBM-01 เข้าสู่หน้าจอมอบหมายงานให้ช่างซ่อม', async ({ loginPage, jobManagePage }) => {
        const adminUser = validUsers[0];

        await gotoJobAssign(loginPage, jobManagePage, adminUser.username, adminUser.password);

        await expect(jobManagePage.page).toHaveURL(/#\/main\/admin-check-request/);
    });

    test('JOBM-02 ตรวจสอบรายการแจ้งซ่อมสถานะรอดำเนินการ แล้วมอบหมายงาน', async ({ loginPage, jobManagePage }) => {
        const adminUser = validUsers[0];

        await gotoJobAssign(loginPage, jobManagePage, adminUser.username, adminUser.password);
        await expect(jobManagePage.page).toHaveURL(/#\/main\/admin-check-request/);

        await jobManagePage.clickFirstUnassignedKebab();
        await jobManagePage.clickKebabAssign();

        await expect(jobManagePage.assignModal).toBeVisible();

        await jobManagePage.selectFirstTech();
        await jobManagePage.clickConfirm();
    });

    test('JOBM-03 เข้าดูรายละเอียดแล้วมอบหมายงานจากหน้า Detail', async ({ loginPage, jobManagePage }) => {
        const adminUser = validUsers[0];

        await gotoJobAssign(loginPage, jobManagePage, adminUser.username, adminUser.password);
        await expect(jobManagePage.page).toHaveURL(/#\/main\/admin-check-request/);

        await jobManagePage.clickFirstUnassignedKebab();
        await jobManagePage.clickKebabDetail();

        await jobManagePage.page.waitForURL(/#\/main\/repair-detail\/.+/, { timeout: 10000 });

        await jobManagePage.clickDetailAssignCard();

        await expect(jobManagePage.assignModal).toBeVisible();

        await jobManagePage.selectFirstTech();
        await jobManagePage.clickConfirm();
    });

    test('JOBM-04 มอบหมายงานซ่อมให้ช่างซ่อม (ค้นหาชื่อช่างซ่อม)', async ({ loginPage, jobManagePage }) => {
        const adminUser = validUsers[0];

        await gotoJobAssign(loginPage, jobManagePage, adminUser.username, adminUser.password);
        await expect(jobManagePage.page).toHaveURL(/#\/main\/admin-check-request/);

        await jobManagePage.clickFirstUnassignedKebab();
        await jobManagePage.clickKebabAssign();

        await expect(jobManagePage.assignModal).toBeVisible();

        await jobManagePage.searchTech('วันทอง สองใจ');

        await jobManagePage.selectFirstTech();
        await jobManagePage.clickConfirm();
    });

    test('JOBM-05 ตรวจสอบรายการแจ้งซ่อมที่ถูกมอบหมายงานแล้ว', async ({ loginPage, jobManagePage }) => {
        const adminUser = validUsers[0];

        await gotoJobAssign(loginPage, jobManagePage, adminUser.username, adminUser.password);
        await expect(jobManagePage.page).toHaveURL(/#\/main\/admin-check-request/);

        await jobManagePage.clickFirstAssignedKebab();

        await expect(jobManagePage.kebabAssignedLabel).toBeVisible();
    });
});