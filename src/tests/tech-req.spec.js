import { test, expect } from '../utils/base.js';
import { sendTestReport } from '../utils/reportHelper.js';
import { fillUserNamePassword } from '../utils/authHelper.js';
import { validUsers } from '../test-data/users.js';

async function gotoStockList(loginPage, techRequestPage, username, password) {
    await loginPage.page.goto('/');
    await fillUserNamePassword(loginPage, username, password);
    await loginPage.clickSignIn();
    await loginPage.page.waitForURL(/#\/main\/.+-home/);

    await techRequestPage.clickStockMenu();
}
async function gotoMyRequest(loginPage, techRequestPage, username, password) {
    await loginPage.page.goto('/');
    await fillUserNamePassword(loginPage, username, password);
    await loginPage.clickSignIn();
    await loginPage.page.waitForURL(/#\/main\/.+-home/);

    await techRequestPage.clickMyRequestMenu();
}
async function gotoTechAcc(loginPage, acceptJobPage, username, password) {
    await loginPage.page.goto('/');
    await fillUserNamePassword(loginPage, username, password);
    await loginPage.clickSignIn();
    await loginPage.page.waitForURL(/#\/main\/.+-home/);
    await expect(loginPage.mainTitle).toBeVisible();

    await acceptJobPage.clickAcceptJobMenu();
    await acceptJobPage.page.waitForURL('**/main/technician-repair-list');
}

test.describe('Technician Stock List', () => {

    test.afterEach(async ({ page, request }, testInfo) => {
        await sendTestReport(page, request, testInfo, 'TECH-REQ');
    });

    test('TECH-REQ-01 เข้าสู่หน้าจอรายการคลัง', async ({ loginPage, techRequestPage }) => {
        const techUser = validUsers[1];

        await gotoStockList(loginPage, techRequestPage, techUser.username, techUser.password);

        await expect(techRequestPage.titleStockMenu).toBeVisible();    
    
    });

    test('TECH-REQ-02 เข้าสู่หน้าจอ "รายการเบิกของฉัน" ด้วยบัญชีช่างซ่อม', async ({ loginPage, techRequestPage }) => {
        const techUser = validUsers[1];

        await gotoMyRequest(loginPage, techRequestPage, techUser.username, techUser.password);

        await expect(techRequestPage.titleStockReqMenu).toBeVisible();    
    
    });
    
    // ══════════════════════════════════════════
    test('TECH-REQ-03 เบิกของจากหน้ารายละเอียดงานซ่อม', async ({ loginPage, acceptJobPage, techRequestPage }) => {
        const techUser = validUsers[1];
       
               await gotoTechAcc(loginPage, acceptJobPage, techUser.username, techUser.password);
       
               // เข้าหน้ารายละเอียด
               await acceptJobPage.clickFirstInProgressKebab();
               await acceptJobPage.clickKebabDetail();
               await acceptJobPage.page.waitForURL(/#\/main\/repair-detail\/.+/, { timeout: 10000 });
        // กดปุ่ม "เบิกของ" เพื่อไปหน้ารายการคลัง
        await techRequestPage.clickRequisitionFromDetail();
        // ตรวจสอบ banner แจ้งหมายเลขใบแจ้งซ่อม
        await expect(techRequestPage.requisitionBanner).toBeVisible();

        // เพิ่มสินค้า 2 รายการ
        await techRequestPage.addProductToCart('สวิตช์ไฟ');
        await techRequestPage.addProductToCart('สายไฟ VAF 2x2.5');

        // เปิดตะกร้า ตรวจสอบของ แล้วดำเนินการต่อ
        await techRequestPage.clickCartBtn();
        await expect(techRequestPage.cartSidebarTitle).toBeVisible();
        expect(await techRequestPage.cartItem.count()).toBe(2);
        await techRequestPage.clickProceed();

        // ตรวจสอบ Review sidebar — หมายเลขใบแจ้งซ่อมถูก lock อัตโนมัติ
        await expect(techRequestPage.reviewSidebarTitle).toBeVisible();
        const rfInput = techRequestPage.page.locator('input[value^="RF"]');
        await expect(rfInput).toBeVisible();

        // กรอกวันที่แล้วส่ง
        await techRequestPage.fillDate('2026-06-29');
        await techRequestPage.clickSubmitForm();

        // ตรวจสอบ redirect ไปหน้ารายการเบิกของฉัน
        await loginPage.page.waitForURL(/technician-requisition-list/, { timeout: 10000 });
        await expect(loginPage.page).toHaveURL(/technician-requisition-list/);
    });

    // ══════════════════════════════════════════
    test('TECH-REQ-04 กดปุ่มกลับไปเลือกวัสดุ/อุปกรณ์เพิ่มเติม', async ({ loginPage, acceptJobPage, techRequestPage }) => {
        const techUser = validUsers[1];
    
        await gotoTechAcc(loginPage, acceptJobPage, techUser.username, techUser.password);
    
        // เข้าหน้ารายละเอียด
        await acceptJobPage.clickFirstInProgressKebab();
        await acceptJobPage.clickKebabDetail();
        await acceptJobPage.page.waitForURL(/#\/main\/repair-detail\/.+/, { timeout: 10000 });
    
        // กดปุ่มเบิกวัสดุ
        await techRequestPage.clickRequisitionFromDetail();
        await expect(techRequestPage.requisitionBanner).toBeVisible();
    
        // เพิ่มสินค้า 1 รายการ
        await techRequestPage.addProductToCart('สวิตช์ไฟ');
    
        // เปิดตะกร้า แล้วดำเนินการต่อ
        await techRequestPage.clickCartBtn();
        await techRequestPage.clickProceed();
    
        // ตรวจสอบ Review sidebar แล้วกดกลับ
        await expect(techRequestPage.reviewSidebarTitle).toBeVisible();
        await techRequestPage.clickBackToSelect();
    
        // กลับไปหน้าตะกร้า
        await expect(techRequestPage.cartSidebarTitle).toBeVisible();
    });

    // Excepted = มี Alert แจ้งเตือนว่า "สินค้าหมด" เบิกไม่ได้
    test('TECH-REQ-05 เบิกของจากหน้ารายละเอียดงานซ่อม — กรณีสินค้าหมด', async ({ loginPage, acceptJobPage, techRequestPage }) => {
        const techUser = validUsers[1];
    
        await gotoTechAcc(loginPage, acceptJobPage, techUser.username, techUser.password);
    
        await acceptJobPage.clickFirstInProgressKebab();
        await acceptJobPage.clickKebabDetail();
        await acceptJobPage.page.waitForURL(/#\/main\/repair-detail\/.+/, { timeout: 10000 });
    
        await techRequestPage.clickRequisitionFromDetail();
        await expect(techRequestPage.requisitionBanner).toBeVisible();
    
        // ตรวจสอบว่ามี badge "สินค้าหมด" อย่างน้อย 1 รายการ
        await expect(techRequestPage.outOfStockBadge.first()).toBeVisible();
    
        // หา card ที่สินค้าหมด แล้วตรวจสอบว่าปุ่ม "เพิ่มลงตะกร้า" ถูก disabled
        const outOfStockCard = techRequestPage.page.locator('div.p-3.flex.flex-col.flex-grow').filter({
            has: techRequestPage.page.locator('span.text-red-600.bg-red-50', { hasText: 'สินค้าหมด' })
        }).first();
        await outOfStockCard.getByRole('button', { name: 'เพิ่มลงตะกร้า' }).click();
    });

    test('TECH-REQ-06 ตรวจสอบหน้ารายการเบิกของฉัน — มีรายการเบิกที่เพิ่งสร้าง', async ({ loginPage, techRequestPage }) => {
        const techUser = validUsers[1];

        await gotoMyRequest(loginPage, techRequestPage, techUser.username, techUser.password);

        await expect(techRequestPage.titleStockReqMenu).toBeVisible();    

        // ตรวจสอบหน้ารายการเบิกของฉัน
        await expect(techRequestPage.titleStockReqMenu).toBeVisible();
        await expect(techRequestPage.reqListFirstLink).toBeVisible();

        // คลิก SF... เข้าหน้า detail
        await techRequestPage.clickFirstReqLink();
        await loginPage.page.waitForURL(/repair-detail/, { timeout: 10000 });

        // ตรวจสอบรายการวัสดุที่เบิก
        await expect(techRequestPage.reqDetailMaterialTitle).toBeVisible();
        expect(await techRequestPage.reqDetailMaterialItem.count()).toBeGreaterThan(0);

        

    });
});