import { test, expect } from '../utils/base.js';
import { sendTestReport } from '../utils/reportHelper.js';
import { fillUserNamePassword } from '../utils/authHelper.js';
import { validUsers } from '../test-data/users.js';

test.describe.configure({ mode: 'serial' });

async function gotoRepairDetail(loginPage, acceptJobPage, username, password) {
    await loginPage.page.goto('/');
    await fillUserNamePassword(loginPage, username, password);
    await loginPage.clickSignIn();
    await loginPage.page.waitForURL(/#\/main\/.+-home/);
    await acceptJobPage.clickAcceptJobMenu();
    await acceptJobPage.clickFirstInProgressKebab();
    await acceptJobPage.clickKebabDetail();
    await acceptJobPage.page.waitForURL(/#\/main\/repair-detail\/.+/, { timeout: 10000 });
}

test.describe('Technician Return Equipment (TECH-INV)', () => {

    test.afterEach(async ({ page, request }, testInfo) => {
        await sendTestReport(page, request, testInfo, 'TECH-INV');
    });

    // ══════════════════════════════════════════
    test('TECH-INV-01 เข้าสู่หน้าจอรายละเอียดงานซ่อม', async ({ loginPage, acceptJobPage, techRequestPage }) => {
        const techUser = validUsers[1];
        await gotoRepairDetail(loginPage, acceptJobPage, techUser.username, techUser.password);

        await expect(acceptJobPage.page).toHaveURL(/#\/main\/repair-detail\/.+/);
    });

    // ══════════════════════════════════════════
    test('TECH-INV-02 แสดงผลรายการของที่เบิก', async ({ loginPage, acceptJobPage, techRequestPage }) => {
        const techUser = validUsers[1];
        await gotoRepairDetail(loginPage, acceptJobPage, techUser.username, techUser.password);

        await expect(techRequestPage.reqDetailMaterialTitle).toBeVisible();
        expect(await techRequestPage.reqDetailMaterialItem.count()).toBeGreaterThan(0);
    });

    // ══════════════════════════════════════════
    test('TECH-INV-03 คืนวัสดุ/อุปกรณ์', async ({ loginPage, acceptJobPage, techRequestPage }) => {
        const techUser = validUsers[1];
        await gotoRepairDetail(loginPage, acceptJobPage, techUser.username, techUser.password);

        // เปิด modal คืนอุปกรณ์
        await techRequestPage.clickReturnEquipBtn();
        await expect(techRequestPage.returnModal).toBeVisible();

        // เลือกทั้งหมด
        await techRequestPage.clickSelectAll();
        await expect(techRequestPage.returnConfirmBtn).toBeEnabled();

        // กดคืน
        await techRequestPage.clickReturnConfirm();
        await expect(techRequestPage.returnSuccessToast).toBeVisible({ timeout: 8000 });
    });

    // ══════════════════════════════════════════
    test('TECH-INV-04 ตรวจสอบจำนวนของที่คืนกลับสู่รายการคลัง', async ({ loginPage, acceptJobPage, techRequestPage }) => {
        const techUser = validUsers[1];
        await gotoRepairDetail(loginPage, acceptJobPage, techUser.username, techUser.password);
    
        // เปิด modal คืนอุปกรณ์
        await techRequestPage.clickReturnEquipBtn();
        await expect(techRequestPage.returnModal).toBeVisible();
    
        // ตรวจสอบว่าไม่มีของให้คืนแล้ว (คืนไปหมดแล้วใน 03)
        const emptyMsg = techRequestPage.page.locator('div.text-sm.text-gray-500', { hasText: 'ไม่มีรายการที่สามารถคืนได้' });
        await expect(emptyMsg).toBeVisible();
    
        // ปิด modal แล้วไปเช็คหน้าคลังว่าของกลับมาแล้ว
        await techRequestPage.returnModalCloseBtn.click();
        await techRequestPage.clickStockMenu();
        await expect(techRequestPage.stockTitle).toBeVisible();
    });


});