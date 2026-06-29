import { test, expect } from '../utils/base.js';
import { sendTestReport } from '../utils/reportHelper.js';
import { fillUserNamePassword, gotoLoginPage } from '../utils/authHelper.js';
import { validUsers } from '../test-data/users.js';
import { repoMonData } from '../test-data/report.js';
import * as fs from 'fs';
import * as path from 'path';

async function gotoReportMon(loginPage, reportMonPage, username, password) {
    await fillUserNamePassword(loginPage, username, password);
    await loginPage.clickSignIn();

    const expectedHomePattern = `/main/${username}-home`;
    await loginPage.page.waitForURL(`**${expectedHomePattern}`);
    await expect(loginPage.mainTitle).toBeVisible({ timeout: 3000 });

    await reportMonPage.clickReportMenu();
    await reportMonPage.page.waitForURL('**/main/manage-report');

    await reportMonPage.clickCreateMonthlyReport();
    await reportMonPage.page.waitForURL('**/main/create-report');
}

test.describe('Report-Monthly', () => {

    test.afterEach(async ({ page, request }, testInfo) => {
        await sendTestReport(page, request, testInfo, 'REPO-MON');
    });

    test(`REPO-MON-01 เข้าสู่หน้าจอ “สร้างรายงาน"`, async ({ loginPage, reportMonPage }) => {
        const adminUser = validUsers[0];

        await gotoReportMon(loginPage, reportMonPage, adminUser.username, adminUser.password);

        await expect(reportMonPage.reportTitle).toBeVisible();
    });

    test(`REPO-MON-02 สร้างหนังสือบันทึกข้อความ (กรอกเฉพาะช่องที่ไม่มีข้อความอัตโนมัติ)`, { timeout: 60000 }, async ({ loginPage, reportMonPage }) => {
        const adminUser = validUsers[0];
        const data = repoMonData.fillOnlyEmpty;
    
        await gotoReportMon(loginPage, reportMonPage, adminUser.username, adminUser.password);
    
        // กรอกเลขที่เอกสาร
        await reportMonPage.fillDocNumberInput(data.docNumber);
    
        // กรอกเนื้อเรื่อง
        await reportMonPage.fillContent(data.content);
    
        // กด Download PDF
        const downloadPromise = reportMonPage.page.waitForEvent('download', { timeout: 60000 });
        await reportMonPage.downloadPdfButton.click();
        const download = await downloadPromise;
    
        const fileName = download.suggestedFilename();
        console.log('Downloaded:', fileName);
        expect(fileName).toBeTruthy();
        expect(fileName.endsWith('.pdf')).toBe(true);
    });

    test(`REPO-MON-03 สร้างหนังสือบันทึกข้อความ (กรอกข้อมูลทุกช่อง)`, { timeout: 60000 }, async ({ loginPage, reportMonPage }) => {
        const adminUser = validUsers[0];
        const data = repoMonData.fillAll;
    
        await gotoReportMon(loginPage, reportMonPage, adminUser.username, adminUser.password);
    
        // clear default แล้วกรอกใหม่
        await reportMonPage.departmentInput.clear();
        await reportMonPage.fillDepartmentInput(data.department);
    
        await reportMonPage.fillDocNumberInput(data.docNumber);
    
        await reportMonPage.subjectInput.clear();
        await reportMonPage.fillSubjectInput(data.subject);
    
        await reportMonPage.monthDropdown.selectOption({ label: 'พฤษภาคม' });
    
        await reportMonPage.toInput.clear();
        await reportMonPage.fillTo(data.to);
    
        await reportMonPage.fillContent(data.content);
    
        // กด Download PDF
        const downloadPromise = reportMonPage.page.waitForEvent('download', { timeout: 60000 });
        await reportMonPage.downloadPdfButton.click();
        const download = await downloadPromise;
    
        const fileName = download.suggestedFilename();
        console.log('Downloaded:', fileName);
        expect(fileName).toBeTruthy();
        expect(fileName.endsWith('.pdf')).toBe(true);
    });

    test(`REPO-MON-04 ตรวจสอบไฟล์ PDF เปิดได้และเป็น PDF จริง`, { timeout: 60000 }, async ({ loginPage, reportMonPage }) => {
        const adminUser = validUsers[0];
    
        await gotoReportMon(loginPage, reportMonPage, adminUser.username, adminUser.password);
    
        await reportMonPage.fillDocNumberInput('0101/001');
        await reportMonPage.fillContent('ทดสอบตรวจสอบไฟล์ PDF');
    
        // Download
        const downloadPromise = reportMonPage.page.waitForEvent('download', { timeout: 60000 });
        await reportMonPage.downloadPdfButton.click();
        const download = await downloadPromise;
    
        // บันทึกไฟล์
        const savePath = path.join('test-results', download.suggestedFilename());
        await download.saveAs(savePath);
    
        // อ่าน 4 bytes แรก — PDF จริงต้องขึ้นต้นด้วย %PDF
        const buffer = fs.readFileSync(savePath);
        const header = buffer.toString('utf8', 0, 4);
    
        console.log('File header:', header);
        console.log('File size:', buffer.length, 'bytes');
    
        // Assert
        expect(header).toBe('%PDF');                // เป็น PDF จริง
        expect(buffer.length).toBeGreaterThan(0);   // ไฟล์ไม่ว่าง
    
        // Cleanup
        fs.unlinkSync(savePath);
    });

    test(`REPO-MON-05 ทดสอบการตรวจสอบข้อมูล ด้วยการกรอกข้อมูลที่ช่องบังคับกรอกไม่ครบ (ไม่กรอกเนื้อเรื่อง)`, async ({ loginPage, reportMonPage }) => {
        const adminUser = validUsers[0];
    
        await gotoReportMon(loginPage, reportMonPage, adminUser.username, adminUser.password);
    
        // กรอกเลขที่เอกสาร แต่ไม่กรอกเนื้อเรื่อง
        await reportMonPage.fillDocNumberInput('0101/001');
    
        // กดปุ่ม Download โดยไม่กรอกเนื้อเรื่อง
        await reportMonPage.downloadPdfButton.click();
    
        // Assert: แสดงข้อความแจ้งเตือน
        await expect(
            reportMonPage.page.getByText('กรุณากรอกเนื้อเรื่อง')
        ).toBeVisible();
    
        // Assert: ไม่มี download เกิดขึ้น
        let downloaded = false;
        reportMonPage.page.once('download', () => { downloaded = true; });
        await reportMonPage.page.waitForTimeout(2000);
        expect(downloaded).toBe(false);
    });

    test(`REPO-MON-06 ตรวจสอบการล้างข้อมูล (Clear Data) ที่กระทบกับค่า Default`, async ({ loginPage, reportMonPage }) => {
        const adminUser = validUsers[0];
    
        await gotoReportMon(loginPage, reportMonPage, adminUser.username, adminUser.password);
    
        // จำค่า default ก่อนที่จะแก้ไข
        const defaultDepartment = await reportMonPage.departmentInput.inputValue();
        const defaultSubject    = await reportMonPage.subjectInput.inputValue();
        const defaultTo         = await reportMonPage.toInput.inputValue();
    
        // กรอกข้อมูลใหม่ทับ default
        await reportMonPage.departmentInput.clear();
        await reportMonPage.fillDepartmentInput('แก้ไขส่วนราชการใหม่');
    
        await reportMonPage.subjectInput.clear();
        await reportMonPage.fillSubjectInput('แก้ไขหัวเรื่องใหม่');
    
        await reportMonPage.toInput.clear();
        await reportMonPage.fillTo('แก้ไขผู้รับใหม่');
    
        await reportMonPage.fillDocNumberInput('0101/001');
        await reportMonPage.fillContent('ทดสอบการล้างข้อมูล');
    
        // กดล้างข้อมูล
        await reportMonPage.clickClear();
    
        // Assert: ช่องที่กรอกเองต้องว่าง
        await expect(reportMonPage.docNumberInput).toHaveValue('');
        await expect(reportMonPage.contentTextarea).toHaveValue('');
    
        // Assert: ค่า default ต้องคืนกลับมาเหมือนเดิม
        await expect(reportMonPage.departmentInput).toHaveValue(defaultDepartment);
        await expect(reportMonPage.subjectInput).toHaveValue(defaultSubject);
        await expect(reportMonPage.toInput).toHaveValue(defaultTo);
    });
});