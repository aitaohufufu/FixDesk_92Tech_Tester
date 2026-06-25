import { test, expect } from '../utils/base.js';
import { sendTestReport } from '../utils/reportHelper.js';
import { fillUserNamePassword } from '../utils/authHelper.js';
import { validUsers } from '../test-data/users.js';

async function gotoEditRepair(loginPage, repairManagementPage, username, password, role) {
    await repairManagementPage.gotoHome(loginPage, username, password, role);
    await repairManagementPage.clickMyListMenu();
}

test.describe('Repair Request - REPA-MAN', () => {

    test.afterEach(async ({ page, request }, testInfo) => {
        await sendTestReport(page, request, testInfo, 'REPA-MAN');
    });

    // =========================================================================
    // Page Case
    // =========================================================================

    validUsers.forEach((user) => {
        test(`REPA-MAN-01 [${user.username}] เข้าสู่หน้าจอ "แก้ไขแบบฟอร์มแจ้งซ่อม" ด้วยบัญชีผู้ใช้ใดก็ได้`, async ({ loginPage, repairManagementPage }) => {
            await gotoEditRepair(loginPage, repairManagementPage, user.username, user.password, user.role);

            await repairManagementPage.clickEditRepair();
            await expect(repairManagementPage.repairDetailTitle).toBeVisible();
        });
    });

    validUsers.forEach((user) => {
        test(`REPA-MAN-02 [${user.username}] แสดงผลข้อมูลของแบบฟอร์มแจ้งซ่อมเดิม`, async ({ loginPage, repairManagementPage }) => {
            await gotoEditRepair(loginPage, repairManagementPage, user.username, user.password, user.role);

            const rawText = await repairManagementPage.getPendingRowDetails();

            const problemMatch = rawText.match(/เรื่องที่แจ้ง\s*:\s*(.*)/);
            const locationMatch = rawText.match(/สถานที่\s*:\s*(.*)/);

            const expectedProblem = problemMatch ? problemMatch[1].trim() : '';
            const rawLocation = locationMatch ? locationMatch[1].trim() : '';

            await repairManagementPage.clickEditRepair();
            await expect(repairManagementPage.repairDetailTitle).toBeVisible();

            await expect(repairManagementPage.problemInput).toHaveValue(expectedProblem);

            const selectedBuildingText = await repairManagementPage.buildingSelect.evaluate(el => el.options[el.selectedIndex].text);
            expect(rawLocation).toContain(selectedBuildingText.trim());

            const selectedRoomText = await repairManagementPage.roomSelect.evaluate(el => el.options[el.selectedIndex].text);
            expect(rawLocation).toContain(selectedRoomText.trim());
        });
    });

    // =========================================================================
    // Functional Case
    // =========================================================================

    validUsers.forEach((user) => {
        test(`REPA-MAN-03 [${user.username}] แก้ไขข้อมูลแต่ละช่อง และบันทึกการแก้ไขแบบฟอร์มแจ้งซ่อม`, async ({ loginPage, repairManagementPage }) => {
            await gotoEditRepair(loginPage, repairManagementPage, user.username, user.password, user.role);
            await repairManagementPage.clickEditRepair();
            await expect(repairManagementPage.repairDetailTitle).toBeVisible();

            await repairManagementPage.typeSelect.selectOption({ label: 'ทั่วไป' });
            await repairManagementPage.equipmentInput.fill('EQ-999-TEST');
            await repairManagementPage.problemInput.fill('แก้ไขรายละเอียดปัญหาทดสอบอัตโนมัติ');
            await repairManagementPage.buildingSelect.selectOption({ label: 'อาคารสำนักงาน' });
            await repairManagementPage.floorSelect.selectOption({ label: '1' });
            await repairManagementPage.roomSelect.selectOption({ label: 'ห้องธุรการ' });
            await repairManagementPage.causeTextarea.fill('พบอาการเสียหายจากการใช้งานปกติ ทดสอบระบบแก้ไขฟอร์ม');
            await repairManagementPage.selectUrgency('เร่งด่วน');

            await repairManagementPage.clickSaveButton();
            await repairManagementPage.clickConfirmAlert();

            const expectedPattern = '/main/my-list';
            await loginPage.page.waitForURL(`**${expectedPattern}`);
            expect(loginPage.isURL(expectedPattern)).toBe(true);
        });
    });

    validUsers.forEach((user) => {
        test(`REPA-MAN-04 [${user.username}] เพิ่มข้อมูลไฟล์ และบันทึกการแก้ไขแบบฟอร์มแจ้งซ่อม (มีไฟล์อยู่ไม่เกิน 4 ไฟล์)`, async ({ loginPage, repairManagementPage }) => {
            await gotoEditRepair(loginPage, repairManagementPage, user.username, user.password, user.role);
            await repairManagementPage.clickEditRepair();
            await expect(repairManagementPage.repairDetailTitle).toBeVisible();

            await repairManagementPage.deleteExistingFiles(2);

            const sampleImagePath = 'src/test-data/images/mouse-sample.jpg';
            await repairManagementPage.uploadFiles(sampleImagePath);

            await repairManagementPage.clickSaveButton();
            await repairManagementPage.clickConfirmAlert();

            const expectedPattern = '/main/my-list';
            await loginPage.page.waitForURL(`**${expectedPattern}`);
            expect(loginPage.isURL(expectedPattern)).toBe(true);
        });
    });

    validUsers.forEach((user) => {
        test(`REPA-MAN-05 [${user.username}] เพิ่มข้อมูลไฟล์ และบันทึกการแก้ไขแบบฟอร์มแจ้งซ่อม (มีไฟล์อยู่ 5 ไฟล์)`, async ({ loginPage, repairManagementPage }) => {
            await gotoEditRepair(loginPage, repairManagementPage, user.username, user.password, user.role);
            await repairManagementPage.clickEditRepair();
            await expect(repairManagementPage.repairDetailTitle).toBeVisible();

            await repairManagementPage.deleteExistingFiles(1);

            const sampleImagePath = 'src/test-data/images/mouse-sample.jpg';
            await repairManagementPage.uploadFiles(sampleImagePath);

            await repairManagementPage.clickSaveButton();
            await repairManagementPage.clickConfirmAlert();

            await expect(repairManagementPage.errorAlertTitle).toBeVisible();
        });
    });

    validUsers.forEach((user) => {
        test(`REPA-MAN-06 [${user.username}] ลบข้อมูลไฟล์ และบันทึกการแก้ไขแบบฟอร์มแจ้งซ่อม`, async ({ loginPage, repairManagementPage }) => {
            await gotoEditRepair(loginPage, repairManagementPage, user.username, user.password, user.role);
            await repairManagementPage.clickEditRepair();
            await expect(repairManagementPage.repairDetailTitle).toBeVisible();

            await repairManagementPage.deleteExistingFiles(1);

            await repairManagementPage.clickSaveButton();
            await repairManagementPage.clickConfirmAlert();

            const expectedPattern = '/main/my-list';
            await loginPage.page.waitForURL(`**${expectedPattern}`);
            expect(loginPage.isURL(expectedPattern)).toBe(true);
        });
    });

    validUsers.forEach((user) => {
        test(`REPA-MAN-07 [${user.username}] บันทึกการแก้ไขแบบฟอร์มแจ้งซ่อม โดยไม่แก้ไขข้อมูลใด ๆ`, async ({ loginPage, repairManagementPage }) => {
            await gotoEditRepair(loginPage, repairManagementPage, user.username, user.password, user.role);
            await repairManagementPage.clickEditRepair();
            await expect(repairManagementPage.repairDetailTitle).toBeVisible();

            await repairManagementPage.clickSaveButton();
            await repairManagementPage.clickConfirmAlert();

            const expectedPattern = '/main/my-list';
            await loginPage.page.waitForURL(`**${expectedPattern}`);
            expect(loginPage.isURL(expectedPattern)).toBe(true);
        });
    });

    validUsers.forEach((user) => {
        test(`REPA-MAN-08 [${user.username}] ลบแบบฟอร์มแจ้งซ่อม`, async ({ loginPage, repairManagementPage }) => {
            await gotoEditRepair(loginPage, repairManagementPage, user.username, user.password, user.role);

            await repairManagementPage.pendingRow.locator('button[title="เมนู"]').click();

            const deleteMenuButton = repairManagementPage.page.getByRole('button', { name: /ลบ|ยกเลิก/ }).first();
            await deleteMenuButton.click();

            await repairManagementPage.clickConfirmAlert();

            await expect(repairManagementPage.deleteSuccessToast).toBeVisible({ timeout: 5000 });

            const expectedPattern = '/main/my-list';
            expect(loginPage.isURL(expectedPattern)).toBe(true);
        });
    });

});