import { test, expect } from '../utils/base.js';
import { sendTestReport } from '../utils/reportHelper.js';
import { fillUserNamePassword } from '../utils/authHelper.js';
import { validUsers } from '../test-data/users.js';

async function gotoRepairInformation(loginPage, repairStatusPage, username, password, role) {
    await fillUserNamePassword(loginPage, username, password);
    await loginPage.clickSignIn();

    const expectedHomePattern = `/main/${role}-home`;
    await loginPage.page.waitForURL(`**${expectedHomePattern}`);
    await expect(loginPage.mainTitle).toBeVisible({ timeout: 3000 });


}

test.describe('Repair Request - Status and Information', () => {

    test.afterEach(async ({ page, request }, testInfo) => {
        await sendTestReport(page, request, testInfo, 'REPA-STA(I)');
    });

    // =========================================================================
    // Page Case
    // =========================================================================

    test(`REPA-STA(I)-01 เข้าสู่หน้าจอ "ตรวจสอบสถานะงานซ่อม"`, async ({ loginPage, repairStatusPage }) => {
        await repairStatusPage.goto();

        await expect(repairStatusPage.repairStatusCheckTitle).toBeVisible();
    });

    test(`REPA-STA(I)-02 แสดงผลรายละเอียด และสถานะของรายการแจ้งซ่อม`, async ({ loginPage, repairStatusPage }) => {
        await repairStatusPage.goto();

        const data = 'RF2026';

        await repairStatusPage.searchRepair(data);
        await expect(repairStatusPage.getSearchResultCard(data)).toBeVisible();
    });

    // =========================================================================
    // Admin Case
    // =========================================================================

    test(`REPA-STA(I)-03 ติดตามสถานะ และรายละเอียดงานซ่อมบนหน้าจอ "หลัก (Home)" ของผู้ดูแลระบบ`, async ({ loginPage, repairStatusPage }) => {
        const user = validUsers[0];
        await gotoRepairInformation(loginPage, repairStatusPage, user.username, user.password, user.role);
        
        const page = loginPage.page; 
        await expect(loginPage.mainTitle).toBeVisible();

        const statusCards = [
            'จำนวนงานซ่อมในเดือนนี้',
            'จำนวนงานซ่อมในวันนี้',
            'จำนวนงานซ่อมที่กำลังดำเนินการ',
            'จำนวนงานซ่อมที่เสร็จสิ้นภายใน 7 วัน'
        ];
        await repairStatusPage.statusCardCheck(statusCards);

        const repairId = 'RF2026';
        const repairRow = page.locator('table tbody tr').filter({ hasText: repairId });

        await expect(repairRow).toBeVisible({ timeout: 5000 });
        await expect(repairRow.getByText('ชื่อผู้แจ้ง : พชร ไพศรีสกุล')).toBeVisible();
        await expect(repairRow.getByText('เรื่องที่แจ้ง : ตรวจสอบซ่อมแซมไฟ')).toBeVisible();
        await expect(repairRow.locator('span', { hasText: 'ดำเนินการเสร็จสิ้น' })).toBeVisible();
    });
});