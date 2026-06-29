import { test, expect } from '../utils/base.js';
import { sendTestReport } from '../utils/reportHelper.js';
import { fillUserNamePassword } from '../utils/authHelper.js';
import { validUsers } from '../test-data/users.js';


async function gotoTechAcc(loginPage, acceptJobPage, username, password) {
    await loginPage.page.goto('/');
    await fillUserNamePassword(loginPage, username, password);
    await loginPage.clickSignIn();
    await loginPage.page.waitForURL(/#\/main\/.+-home/);
    await expect(loginPage.mainTitle).toBeVisible();

    await acceptJobPage.clickAcceptJobMenu();
    await acceptJobPage.page.waitForURL('**/main/technician-repair-list');
}

test.describe('Technician Accept Job', () => {

    test.afterEach(async ({ page, request }, testInfo) => {
        await sendTestReport(page, request, testInfo, 'TECH-ACC');
    });

    // ─────────────────────────────────────────────
    test('TECH-ACC-01 เข้าสู่หน้าจอรายการงานซ่อมของช่าง', async ({ loginPage, acceptJobPage }) => {
        const techUser = validUsers[1];

        await gotoTechAcc(loginPage, acceptJobPage, techUser.username, techUser.password);

        await expect(acceptJobPage.techAccTitle).toBeVisible();
    });

    // ─────────────────────────────────────────────
    test('TECH-ACC-02 เลือกรับงานซ่อมแบบเดี่ยว', async ({ loginPage, acceptJobPage }) => {
        const techUser = validUsers[1];

        await gotoTechAcc(loginPage, acceptJobPage, techUser.username, techUser.password);

        // เปิด kebab แถวแรกที่ "รอดำเนินการ" → รับงาน
        await acceptJobPage.clickFirstPendingKebab();
        await acceptJobPage.clickKebabAccept();
        await expect(acceptJobPage.acceptModal).toBeVisible();

        // เลือกทำงานคนเดียว → ยืนยัน
        await acceptJobPage.selectAlone();
        await acceptJobPage.clickConfirm();

        // เข้ารายละเอียด row ที่เพิ่งรับ (กำลังดำเนินการ)
        await acceptJobPage.clickFirstInProgressKebab();
        await acceptJobPage.clickKebabDetail();
        await acceptJobPage.page.waitForURL(/#\/main\/repair-detail\/.+/, { timeout: 10000 });

        // ตรวจสอบสถานะ และ badge มอบหมายแล้ว
        await expect(
            acceptJobPage.page.locator('span.rounded-full', { hasText: 'กำลังดำเนินการ' }).first()
        ).toBeVisible();
        await expect(
            acceptJobPage.page.locator('span', { hasText: 'มอบหมายแล้ว' })
        ).toBeVisible();
    });

    // ─────────────────────────────────────────────
    test('TECH-ACC-03 เลือกรับงานซ่อมแบบกลุ่ม', async ({ loginPage, acceptJobPage }) => {
        const techUser = validUsers[1];

        await gotoTechAcc(loginPage, acceptJobPage, techUser.username, techUser.password);

        // เปิด kebab แถวแรกที่ "รอดำเนินการ" → รับงาน
        await acceptJobPage.clickFirstPendingKebab();
        await acceptJobPage.clickKebabAccept();
        await expect(acceptJobPage.acceptModal).toBeVisible();

        // เลือกทำงานเป็นทีม → เลือกช่างซ่อม → ยืนยัน
        await acceptJobPage.selectTeam();
        await acceptJobPage.selectFirstTech();
        await acceptJobPage.clickConfirm();

        // เข้ารายละเอียด row ที่เพิ่งรับ (กำลังดำเนินการ)
        await acceptJobPage.clickFirstInProgressKebab();
        await acceptJobPage.clickKebabDetail();
        await acceptJobPage.page.waitForURL(/#\/main\/repair-detail\/.+/, { timeout: 10000 });

        // ตรวจสอบสถานะ และ badge มอบหมายแล้ว
        await expect(
            acceptJobPage.page.locator('span.rounded-full', { hasText: 'กำลังดำเนินการ' }).first()
        ).toBeVisible();
        await expect(
            acceptJobPage.page.locator('span', { hasText: 'มอบหมายแล้ว' })
        ).toBeVisible();
    });

    // ─────────────────────────────────────────────
    test('TECH-ACC-04 ทดสอบการจ้างช่างภายนอก (หน้าจอรายการงานซ่อม)', async ({ loginPage, acceptJobPage }) => {
        const techUser = validUsers[1];

        await gotoTechAcc(loginPage, acceptJobPage, techUser.username, techUser.password);

        // เปิด kebab แถวแรกที่ "กำลังดำเนินการ" → จ้างช่างภายนอก
        await acceptJobPage.clickFirstInProgressKebab();
        await acceptJobPage.clickKebabOutsource();

        // ยืนยัน SweetAlert2
        await acceptJobPage.confirmOutsourceSwal();

        // ตรวจสอบ toast แจ้งเตือนสำเร็จ
        await expect(acceptJobPage.toastOutsourceSuccess).toBeVisible({ timeout: 8000 });

        // ตรวจสอบสถานะเปลี่ยนเป็น "จ้างช่างภายนอก"
        await expect(
            acceptJobPage.page.locator('span', { hasText: 'จ้างช่างภายนอก' }).first()
        ).toBeVisible();
    });

    // ─────────────────────────────────────────────
    test('TECH-ACC-05 ทดสอบการจ้างช่างภายนอก (หน้าจอรายละเอียดงานซ่อม)', async ({ loginPage, acceptJobPage }) => {
        const techUser = validUsers[1];

        await gotoTechAcc(loginPage, acceptJobPage, techUser.username, techUser.password);

        // เปิด kebab แถวแรกที่ "กำลังดำเนินการ" → รายละเอียด
        await acceptJobPage.clickFirstInProgressKebab();
        await acceptJobPage.clickKebabDetail();
        await acceptJobPage.page.waitForURL(/#\/main\/repair-detail\/.+/, { timeout: 10000 });

        // คลิก "เปลี่ยนสถานะ" → เลือก "จ้างช่างภายนอก"
        await acceptJobPage.clickChangeStatus();
        await acceptJobPage.clickStatusMenuOutsource();

        // ยืนยัน SweetAlert2
        await acceptJobPage.confirmOutsourceSwal();

        // ตรวจสอบ toast แจ้งเตือนสำเร็จ
        await expect(acceptJobPage.toastOutsourceSuccess).toBeVisible({ timeout: 8000 });

        // ตรวจสอบสถานะเปลี่ยนเป็น "จ้างช่างภายนอก"
        await expect(
            acceptJobPage.page.locator('span', { hasText: 'จ้างช่างภายนอก' }).first()
        ).toBeVisible();
    });


});