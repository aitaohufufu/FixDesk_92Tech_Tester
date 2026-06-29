import { test, expect }         from '../utils/base.js';
import { sendTestReport }       from '../utils/reportHelper.js';
import { fillUserNamePassword }  from '../utils/authHelper.js';
import { validUsers }           from '../test-data/users.js';

async function gotoReportPDF(loginPage, reportPDFPage, username, password) {
    await fillUserNamePassword(loginPage, username, password);
    await loginPage.clickSignIn();

    const expectedHomePattern = `/main/${username}-home`;
    await loginPage.page.waitForURL(`**${expectedHomePattern}`);
    await expect(loginPage.mainTitle).toBeVisible({ timeout: 3000 });

    await reportPDFPage.clickReportMenu();
    await reportPDFPage.page.waitForURL('**/main/manage-report');
}

test.describe('Report - ใบแจ้งซ่อม PDF', () => {

    test.afterEach(async ({ page, request }, testInfo) => {
        await sendTestReport(page, request, testInfo, 'REPO-PDF');
    });
    test('REPO-PDF-01 เข้าสู่หน้าจอ “สร้างรายงาน"', async ({ loginPage, reportPDFPage }) => {
        const adminUser = validUsers[0];

        await gotoReportPDF(loginPage, reportPDFPage, adminUser.username, adminUser.password);

        expect(reportPDFPage.isURL('/main/manage-report')).toBe(true);
        await expect(reportPDFPage.tableRows.first()).toBeVisible();
    });

    // ══════════════════════════════════════════
    // REPO-PDF-02: เลือกเดือน-ปีที่มีข้อมูล แล้วตรวจว่ามีรายการในตาราง แสดงผลรายการแจ้งซ่อมที่ดำเนินการเสร็จสิ้นแล้ว
    // ══════════════════════════════════════════
    test('REPO-PDF-02 เลือกเดือน-ปีที่มีข้อมูล แสดงรายการในตาราง', async ({ loginPage, reportPDFPage }) => {
        const adminUser = validUsers[0];

        await gotoReportPDF(loginPage, reportPDFPage, adminUser.username, adminUser.password);

        // เลือกเดือนก่อนหน้าที่มีข้อมูล
        await reportPDFPage.selectMonth('กุมภาพันธ์');
        await reportPDFPage.selectYear('2026');

        // Assert: มีรายการในตาราง
        const rowCount = await reportPDFPage.getRowCount();
        console.log('Row count:', rowCount);
        expect(rowCount).toBeGreaterThan(0);

        // Assert: จำนวนรายการตรงกับที่แสดงใน "X รายการ"
        const totalCount = await reportPDFPage.getTotalCount();
        expect(rowCount).toBeLessThanOrEqual(totalCount);
    });

    // ══════════════════════════════════════════
    // REPO-PDF-03: เลือก 1 รายการ แล้ว download รวมเป็นไฟล์เดียว
    // ══════════════════════════════════════════
    test('REPO-PDF-03 ดาวน์โหลดรวมเป็นไฟล์เดียว (PDF)', async ({ loginPage, reportPDFPage }) => {
        const adminUser = validUsers[0];
    
        await gotoReportPDF(loginPage, reportPDFPage, adminUser.username, adminUser.password);
    
        await reportPDFPage.selectMonth('กุมภาพันธ์');
        await reportPDFPage.selectYear('2026');
    
        await reportPDFPage.checkRowByIndex(0);
    
        expect(await reportPDFPage.getSelectedCount()).toBe(1);
    
        await reportPDFPage.clickDownloadPDF();
    
        const download = await reportPDFPage.downloadAsMerged();
        const fileName = download.suggestedFilename();
    
        console.log('Downloaded:', fileName);
        expect(fileName).toBeTruthy();
    });

    // ══════════════════════════════════════════
    // REPO-PDF-04: เลือก 2 รายการ แล้ว download แยกไฟล์ ZIP
    // ══════════════════════════════════════════
    test('REPO-PDF-04 เลือก 2 รายการ แล้วดาวน์โหลดแยกไฟล์ (ZIP)', async ({ loginPage, reportPDFPage }) => {
        const adminUser = validUsers[0];

        await gotoReportPDF(loginPage, reportPDFPage, adminUser.username, adminUser.password);

        await reportPDFPage.selectMonth('กุมภาพันธ์');
        await reportPDFPage.selectYear('2026');

        // ติ๊ก 2 row แรก
        await reportPDFPage.checkRowByIndex(0);
        await reportPDFPage.checkRowByIndex(1);

        // Assert: ปุ่มแสดง (2)
        expect(await reportPDFPage.getSelectedCount()).toBe(2);

        // กดปุ่ม download → modal เปิด
        await reportPDFPage.clickDownloadPDF();

        // เลือก "แยกไฟล์ ZIP" แล้ว download
        const download = await reportPDFPage.downloadAsZip();
        const fileName = download.suggestedFilename();

        console.log('Downloaded:', fileName);
        expect(fileName).toBeTruthy();
        expect(fileName.endsWith('.zip')).toBe(true);
    });

    // ══════════════════════════════════════════
    // REPO-PDF-05: เลือกเดือนที่ไม่มีข้อมูล ตารางต้องว่าง
    // ══════════════════════════════════════════
    test('REPO-PDF-05 เลือกเดือนที่ไม่มีข้อมูล ตารางไม่แสดงรายการ', async ({ loginPage, reportPDFPage }) => {
        const adminUser = validUsers[0];
    
        await gotoReportPDF(loginPage, reportPDFPage, adminUser.username, adminUser.password);
    
        await reportPDFPage.selectMonth('ธันวาคม');
        await reportPDFPage.selectYear('2026');
    
        await reportPDFPage.page.waitForLoadState('networkidle');
    
        // Assert: แสดง "0 รายการ"
        const totalCount = await reportPDFPage.getTotalCount();
        console.log('Total count:', totalCount);
        expect(totalCount).toBe(0);
    });

    // ══════════════════════════════════════════
    // REPO-PDF-06: กดยกเลิกใน Modal
    // ══════════════════════════════════════════
    test('REPO-PDF-06 กดยกเลิกใน Modal ไม่มีการ download', async ({ loginPage, reportPDFPage }) => {
        const adminUser = validUsers[0];

        await gotoReportPDF(loginPage, reportPDFPage, adminUser.username, adminUser.password);

        await reportPDFPage.selectMonth('กุมภาพันธ์');
        await reportPDFPage.selectYear('2026');

        await reportPDFPage.checkRowByIndex(0);
        await reportPDFPage.clickDownloadPDF();

        // กดยกเลิก
        await reportPDFPage.clickCancel();

        // Assert: modal ปิด (radio button หายไป)
        await expect(reportPDFPage.radioMerged).not.toBeVisible();

        // Assert: ไม่มี download เกิดขึ้น
        let downloaded = false;
        reportPDFPage.page.once('download', () => { downloaded = true; });
        await reportPDFPage.page.waitForTimeout(2000);
        expect(downloaded).toBe(false);
    });

});