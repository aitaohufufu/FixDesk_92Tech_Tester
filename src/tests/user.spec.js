import { test, expect } from '../utils/base.js';
import { sendTestReport } from '../utils/reportHelper.js';
import { validUsers } from '../test-data/users.js';

async function gotoUserPage(loginPage, userManagementPage, username, password, role) {
    await userManagementPage.gotoHome(loginPage, username, password, role);
    await userManagementPage.clickUserMenu();
    await expect(userManagementPage.userTitle).toBeVisible();
}

test.describe('User Management', () => {

    test.afterEach(async ({ page, request }, testInfo) => {
        await sendTestReport(page, request, testInfo, 'USER');
    });

    // =========================================================================
    // Page Case
    // =========================================================================

    test(`USER-01 เข้าสู่หน้าจอ "จัดการผู้ใช้งาน" ด้วยบัญชีผู้ดูแลระบบ`, async ({ loginPage, userManagementPage }) => {
        const user = validUsers[0];
        await gotoUserPage(loginPage, userManagementPage, user.username, user.password, user.role);
    });

    test(`USER-02 แสดงผลรายการข้อมูลผู้ใช้ในระบบ`, async ({ loginPage, userManagementPage }) => {
        const user = validUsers[0];
        await gotoUserPage(loginPage, userManagementPage, user.username, user.password, user.role);

        const rowCount = await userManagementPage.tableRows.count();
        expect(rowCount).toBeGreaterThan(0);

        const firstRow = userManagementPage.tableRows.first();
        await expect(firstRow).not.toBeEmpty();

        await expect(firstRow.locator('button[title="เมนู"]')).toBeVisible();
    });

    test(`USER-03 ดูรายละเอียดของบัญชีผู้ใช้ใดก็ได้`, async ({ loginPage, userManagementPage }) => {
        const user = validUsers[0];
        await gotoUserPage(loginPage, userManagementPage, user.username, user.password, user.role);
        await expect(userManagementPage.tableRows.first()).toBeVisible();

        await userManagementPage.kebabButton.first().click();
        await userManagementPage.detailButton.first().click();

        await expect(userManagementPage.detailModalTitle).toBeVisible();

        const usernameInput = userManagementPage.page.locator('input[value="stock"]');
        await expect(usernameInput).toBeDisabled();
    });

    test(`USER-04 เพิ่มบัญชีผู้ใช้ใหม่ ด้วยการกรอกข้อมูล (กรณีชื่อผู้ใช้ไม่ซ้ำกัน)`, async ({ loginPage, userManagementPage }) => {
        const user = validUsers[0];
        await gotoUserPage(loginPage, userManagementPage, user.username, user.password, user.role);

        await userManagementPage.createButton.click();
        await expect(userManagementPage.modalTitle).toBeVisible();

        const uniqueUsername = `testuser_${Date.now()}`;

        await userManagementPage.usernameInput.fill(uniqueUsername);
        await userManagementPage.prefixSelect.selectOption('1');
        await userManagementPage.positionInput.fill('เจ้าหน้าที่ทดสอบระบบ');
        await userManagementPage.firstNameThInput.fill('สมศักดิ์');
        await userManagementPage.lastNameThInput.fill('ดีเลิศ');
        await userManagementPage.firstNameEnInput.fill('Somsak');
        await userManagementPage.lastNameEnInput.fill('Deelert');
        await userManagementPage.phoneInput.fill('0812345678');
        await userManagementPage.departmentInput.fill('แผนกไอทีทดสอบ');
        await userManagementPage.roleSelect.selectOption('3');

        await userManagementPage.submitCreateButton.click();
        await userManagementPage.submitButton.click();

        await expect(userManagementPage.modalTitle).not.toBeVisible();
    });

    test(`USER-05 เพิ่มบัญชีผู้ใช้ใหม่ ด้วยการกรอกข้อมูล (กรณีชื่อผู้ใช้ซ้ำกัน)`, async ({ loginPage, userManagementPage }) => {
        const user = validUsers[0];
        await gotoUserPage(loginPage, userManagementPage, user.username, user.password, user.role);

        await userManagementPage.createButton.click();
        await expect(userManagementPage.modalTitle).toBeVisible();

        await userManagementPage.usernameInput.fill(user.username);
        await userManagementPage.prefixSelect.selectOption('1');
        await userManagementPage.positionInput.fill('เจ้าหน้าที่ทดสอบระบบ');
        await userManagementPage.firstNameThInput.fill('สมศักดิ์');
        await userManagementPage.lastNameThInput.fill('ดีเลิศ');
        await userManagementPage.firstNameEnInput.fill('Somsak');
        await userManagementPage.lastNameEnInput.fill('Deelert');
        await userManagementPage.phoneInput.fill('0812345678');
        await userManagementPage.departmentInput.fill('แผนกไอทีทดสอบ');
        await userManagementPage.roleSelect.selectOption('3');

        await userManagementPage.submitCreateButton.click();
        await userManagementPage.submitButton.click();

        await expect(userManagementPage.modalTitle).toBeVisible();
    });

    test.skip(`USER-06 เพิ่มบัญชีผู้ใช้ใหม่ ด้วยการนำเข้าข้อมูลจากไฟล์นามสกุล .xlsx`, async ({ loginPage, userManagementPage }) => {
        const user = validUsers[0];
        await gotoUserPage(loginPage, userManagementPage, user.username, user.password, user.role);

    });

    test(`USER-07 ลบข้อมูลของบัญชีผู้ใช้ใดก็ได้ (กรณีไม่มีรายการแจ้งซ่อมใช้งานอยู่)`, async ({ loginPage, userManagementPage }) => {
        const user = validUsers[0];
        await gotoUserPage(loginPage, userManagementPage, user.username, user.password, user.role);

        const targetUsernameToDelete = 'testuser_';

        await userManagementPage.searchInput.fill(targetUsernameToDelete);

        await userManagementPage.kebabButton.first().click();
        await userManagementPage.deleteButton.first().click();

        const confirmButton = userManagementPage.page.getByRole('button', { name: 'ยืนยัน' });
        if (await confirmButton.isVisible()) {
            await confirmButton.click();
        }

        const deletedUserText = userManagementPage.page.locator('table tbody').getByText(targetUsernameToDelete);

        await expect(deletedUserText).not.toBeVisible();
    });

    test(`USER-08 ลบข้อมูลของบัญชีผู้ใช้ใดก็ได้ (กรณีมีรายการแจ้งซ่อมใช้งานอยู่)`, async ({ loginPage, userManagementPage }) => {
        const targetUser = validUsers.find(u => u.role === 'technician' || u.role === 'user') || validUsers[1];

        const adminUser = validUsers[0];
        await gotoUserPage(loginPage, userManagementPage, adminUser.username, adminUser.password, adminUser.role);

        await userManagementPage.searchInput.fill(targetUser.username);

        await userManagementPage.kebabButton.first().click();
        await userManagementPage.deleteButton.first().click();

        const confirmButton = userManagementPage.page.getByRole('button', { name: 'ยืนยัน' });
        if (await confirmButton.isVisible()) {
            await confirmButton.click();
        }

        const toastTitle = userManagementPage.page.locator('.swal2-toast .swal2-title');
        await expect(toastTitle).toBeVisible();
    });
});