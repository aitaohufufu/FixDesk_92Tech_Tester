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

test.describe('Report CSV', () => {

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
   
    test('REPO-CSV-02 ดาวน์โหลดรายงานประจำเดือนที่มีข้อมูล ชื่อไฟล์ถูกต้อง', async ({ loginPage, reportCSVPage }) => {
        const adminUser = validUsers[0];

        // Login + ไปหน้า report
        await gotoReportCSV(loginPage, reportCSVPage, adminUser.username, adminUser.password);
        await reportCSVPage.page.waitForURL('**/main/manage-report');

        // เลือกเดือน มิถุนายน และปี 2026
        await reportCSVPage.selectMonth('6');
        await reportCSVPage.selectYear('2026');

        // กด Download แล้วรอไฟล์
        const download = await reportCSVPage.clickDownload();
        const fileName = download.suggestedFilename();

        console.log('Downloaded:', fileName);

        // Assert
        expect(fileName).toBeTruthy();
        expect(fileName.endsWith('.csv') || fileName.endsWith('.xlsx')).toBe(true);
    });

    test('REPO-CSV-03 ดาวน์โหลดรายงานประจำเดือนที่ไม่มีข้อมูล แสดง alert แจ้งเตือน', async ({ loginPage, reportCSVPage }) => {
        const adminUser = validUsers[0];
    
        await gotoReportCSV(loginPage, reportCSVPage, adminUser.username, adminUser.password);
        await reportCSVPage.page.waitForURL('**/main/manage-report');
    
        await reportCSVPage.selectMonth('12');
        await reportCSVPage.selectYear('2026');
    
        // เก็บ message ไว้ใน variable
        let dialogMessage = '';
    
        // ผูก listener ก่อนกดปุ่ม — accept ทันทีเมื่อ dialog ขึ้น
        reportCSVPage.page.once('dialog', async (dialog) => {
            dialogMessage = dialog.message();
            await dialog.accept();
        });
    
        await reportCSVPage.downloadButton.click();
    
        // รอให้ listener ทำงานเสร็จก่อน assert
        await reportCSVPage.page.waitForTimeout(1000);
    
        // Assert
        expect(dialogMessage).toContain('ไม่มีข้อมูลสำหรับเดือนที่เลือก');
    });

});