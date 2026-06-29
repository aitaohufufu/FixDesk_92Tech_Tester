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

test.describe('Technician Close Job (REPA-N)', () => {

    test.afterEach(async ({ page, request }, testInfo) => {
        await sendTestReport(page, request, testInfo, 'TECH-REPA');
    });

    // ─────────────────────────────────────────────
    test('TECH-REPA-01 เข้าสู่หน้าต่างลอย “บันทึกผล”', async ({ loginPage, acceptJobPage }) => {
        const techUser = validUsers[1];

        await gotoTechAcc(loginPage, acceptJobPage, techUser.username, techUser.password);

        // วิธีที่ 1 — ผ่านเคบับเมนู "ปิดงาน" จากหน้ารายการ
        await acceptJobPage.clickFirstInProgressKebab();
        await acceptJobPage.clickKebabCloseJob();

        await acceptJobPage.waitForCloseJobModal();
        await expect(acceptJobPage.closeJobModal).toBeVisible();
    });

    test('TECH-REPA-02 เข้าสู่หน้าต่างลอย "บันทึกผล" ผ่านหน้ารายละเอียด → เปลี่ยนสถานะ', async ({ loginPage, acceptJobPage }) => {
        const techUser = validUsers[1];

        await gotoTechAcc(loginPage, acceptJobPage, techUser.username, techUser.password);

        // วิธีที่ 2 — ผ่านหน้ารายละเอียด → เปลี่ยนสถานะ → ปิดงาน
        await acceptJobPage.clickFirstInProgressKebab();
        await acceptJobPage.clickKebabDetail();
        await acceptJobPage.page.waitForURL(/#\/main\/repair-detail\/.+/, { timeout: 10000 });

        await acceptJobPage.clickChangeStatus();
        await acceptJobPage.clickStatusMenuCloseJob();

        await acceptJobPage.waitForCloseJobModal();
        await expect(acceptJobPage.closeJobModal).toBeVisible();
    });

    // ─────────────────────────────────────────────
    test('TECH-REPA-03 ปิดงานซ่อม (จากหน้ารายการ) — เลือก "สามารถแก้ไข/ซ่อมบำรุงได้" + "เรียบร้อย"', async ({ loginPage, acceptJobPage }) => {
        const techUser = validUsers[1];

        await gotoTechAcc(loginPage, acceptJobPage, techUser.username, techUser.password);

        await acceptJobPage.clickFirstInProgressKebab();
        await acceptJobPage.clickKebabCloseJob();
        await acceptJobPage.waitForCloseJobModal();

        // 1. วิธีการซ่อม: สามารถแก้ไข/ซ่อมบำรุงได้
        await acceptJobPage.selectRepairInHouse();

        // 2. รายละเอียดการซ่อม
        await acceptJobPage.fillRepairDetail('ตรวจสอบและซ่อมบำรุงเรียบร้อย');

        // 3. สรุปผล: เรียบร้อย
        await acceptJobPage.selectResultCompleted();
        
        // ยืนยันปิดงาน
        await acceptJobPage.clickCloseJobConfirm();

    });

    test('TECH-REPA-04 ปิดงานซ่อม (จากหน้ารายการ) — เลือก "อื่นๆ" + "ไม่เรียบร้อย"', async ({ loginPage, acceptJobPage }) => {
        const techUser = validUsers[1];

        await gotoTechAcc(loginPage, acceptJobPage, techUser.username, techUser.password);

        await acceptJobPage.clickFirstInProgressKebab();
        await acceptJobPage.clickKebabCloseJob();
        await acceptJobPage.waitForCloseJobModal();

        // 1. วิธีการซ่อม: อื่นๆ พร้อมระบุเหตุผล
        await acceptJobPage.selectRepairOther('อุปกรณ์ไม่พอ ต้องสั่งเพิ่ม');

        // 2. รายละเอียดการซ่อม
        await acceptJobPage.fillRepairDetail('ตรวจสอบแล้ว พบว่าอุปกรณ์ไม่เพียงพอ');

        // 3. สรุปผล: ไม่เรียบร้อย พร้อมระบุสาเหตุ
        await acceptJobPage.selectResultIncomplete('รอสั่งอุปกรณ์เพิ่มเติม');
        
        // ยืนยันปิดงาน
        await acceptJobPage.clickCloseJobConfirm();

    });

    test('TECH-REPA-05 ปิดงานซ่อม (จากหน้ารายการ) — เลือก "สามารถแก้ไข/ซ่อมบำรุงได้" + "อื่นๆ"', async ({ loginPage, acceptJobPage }) => {
        const techUser = validUsers[1];

        await gotoTechAcc(loginPage, acceptJobPage, techUser.username, techUser.password);

        await acceptJobPage.clickFirstInProgressKebab();
        await acceptJobPage.clickKebabCloseJob();
        await acceptJobPage.waitForCloseJobModal();

        // 1. วิธีการซ่อม: สามารถแก้ไข/ซ่อมบำรุงได้
        await acceptJobPage.selectRepairInHouse();

        // 2. รายละเอียดการซ่อม
        await acceptJobPage.fillRepairDetail('ซ่อมเสร็จแล้ว แต่มีข้อสังเกต');

        // 3. สรุปผล: อื่นๆ พร้อมระบุสาเหตุ
        await acceptJobPage.selectResultOther('ต้องติดตามผลอีกครั้ง');

        // ยืนยันปิดงาน
        await acceptJobPage.clickCloseJobConfirm();


    });

    // ─────────────────────────────────────────────
    test('TECH-REPA-06 ปิดงานซ่อม (จากหน้ารายละเอียด) — เลือก "สามารถแก้ไข/ซ่อมบำรุงได้" + "เรียบร้อย"', async ({ loginPage, acceptJobPage }) => {
        const techUser = validUsers[1];

        await gotoTechAcc(loginPage, acceptJobPage, techUser.username, techUser.password);

        // เข้าหน้ารายละเอียด
        await acceptJobPage.clickFirstInProgressKebab();
        await acceptJobPage.clickKebabDetail();
        await acceptJobPage.page.waitForURL(/#\/main\/repair-detail\/.+/, { timeout: 10000 });

        // เปลี่ยนสถานะ → ปิดงาน
        await acceptJobPage.clickChangeStatus();
        await acceptJobPage.clickStatusMenuCloseJob();
        await acceptJobPage.waitForCloseJobModal();

        // 1. วิธีการซ่อม
        await acceptJobPage.selectRepairInHouse();

        // 2. รายละเอียดการซ่อม
        await acceptJobPage.fillRepairDetail('ตรวจสอบและซ่อมบำรุงเรียบร้อย');

        // 3. สรุปผล: เรียบร้อย
        await acceptJobPage.selectResultCompleted();
        
        // ยืนยันปิดงาน
        await acceptJobPage.clickCloseJobConfirm();


    });

    test('TECH-REPA-07 ปิดงานซ่อม (จากหน้ารายละเอียด) — เลือก "อื่นๆ" + "ไม่เรียบร้อย"', async ({ loginPage, acceptJobPage }) => {
        const techUser = validUsers[1];

        await gotoTechAcc(loginPage, acceptJobPage, techUser.username, techUser.password);

        await acceptJobPage.clickFirstInProgressKebab();
        await acceptJobPage.clickKebabDetail();
        await acceptJobPage.page.waitForURL(/#\/main\/repair-detail\/.+/, { timeout: 10000 });

        await acceptJobPage.clickChangeStatus();
        await acceptJobPage.clickStatusMenuCloseJob();
        await acceptJobPage.waitForCloseJobModal();

        // 1. วิธีการซ่อม: อื่นๆ
        await acceptJobPage.selectRepairOther('ส่งต่อให้ทีมอื่น');

        // 2. รายละเอียดการซ่อม
        await acceptJobPage.fillRepairDetail('ไม่สามารถซ่อมได้ด้วยตนเอง');

        // 3. สรุปผล: ไม่เรียบร้อย
        await acceptJobPage.selectResultIncomplete('ต้องใช้ผู้เชี่ยวชาญเฉพาะทาง');

        // ยืนยันปิดงาน
        await acceptJobPage.clickCloseJobConfirm();

   
    });

    test('TECH-REPA-08 ปิดงานซ่อม (จากหน้ารายละเอียด) — เลือก "สามารถแก้ไข/ซ่อมบำรุงได้" + "อื่นๆ"', async ({ loginPage, acceptJobPage }) => {
        const techUser = validUsers[1];

        await gotoTechAcc(loginPage, acceptJobPage, techUser.username, techUser.password);

        await acceptJobPage.clickFirstInProgressKebab();
        await acceptJobPage.clickKebabDetail();
        await acceptJobPage.page.waitForURL(/#\/main\/repair-detail\/.+/, { timeout: 10000 });

        await acceptJobPage.clickChangeStatus();
        await acceptJobPage.clickStatusMenuCloseJob();
        await acceptJobPage.waitForCloseJobModal();

        // 1. วิธีการซ่อม: สามารถแก้ไข/ซ่อมบำรุงได้
        await acceptJobPage.selectRepairInHouse();

        // 2. รายละเอียดการซ่อม
        await acceptJobPage.fillRepairDetail('ซ่อมเสร็จแล้ว มีข้อสังเกตเพิ่มเติม');

        // 3. สรุปผล: อื่นๆ
        await acceptJobPage.selectResultOther('ต้องติดตามผลภายใน 7 วัน');

        // ยืนยันปิดงาน
        await acceptJobPage.clickCloseJobConfirm();


    });

});