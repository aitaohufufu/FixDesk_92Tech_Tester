import { BasePage } from "./base.page";

export class ReportMonPage extends BasePage {

    /**
     * 
     * @param {import('@playwright/test').Page} page 
     */
        constructor(page) {
            super(page);
        
        // Locators
        
        this.reportTitle = page.locator('h2').filter({ hasText: 'กรอกข้อมูลเอกสาร' });

        this.reportMenu = page.locator('a[title="สร้างรายงาน"]');

        this.clickButton = page.locator('button:has(span:text("สร้างหนังสือบันทึกข้อความ"))');

        // Locators Form Input

        // ส่วนราชการ
        this.departmentInput = page.locator('input[placeholder="กรอกส่วนราชการ"]');

        // ที่ (เลขที่เอกสาร)
        this.docNumberInput = page.locator('input[placeholder="กรอกเลขที่เอกสาร"]');

        // วันที่ (แสดงอัตโนมัติ ไม่ต้องกรอก)
        this.docDateText     = page.locator('input[placeholder="กรอกเลขที่เอกสาร"]')

        // เรื่อง 
        this.subjectInput = page.locator('input[placeholder="กรอกหัวเรื่อง"]');
        
        // ประจำเดือน (dropdown)
        this.monthDropdown = page.locator('select').first();

        // เรียน
        this.toInput = page.locator('input[placeholder="กรอกชื่อผู้รับหนังสือ"]');

        // เนื้อเรื่อง (textarea)
        this.contentTextarea = page.locator('textarea[placeholder="กรอกเนื้อเรื่อง"]');

        // ปุ่มดาวน์โหลด PDF
        this.downloadPdfButton = page.locator('button:has-text("ดาวน์โหลด PDF")');

        // ปุ่มล้างข้อมูล
        this.clearButton     = page.locator('button:has-text("ล้างข้อมูล")');
        }

    /**
     * ฟังก์ชันคลิกเมนู "สร้างรายงาน"
     */
    async clickReportMenu() {
        await this.reportMenu.waitFor({ state: 'visible', timeout: 3000 });
        await this.reportMenu.click();
    }

    /**
     * ฟังก์ชันคลิกปุ่ม "สร้างหนังสือบันทึกข้อความประจำเดือน"
     */
    async clickCreateMonthlyReport() {
        await this.clickButton.waitFor({ state: 'visible', timeout: 3000 });
        await this.clickButton.click();
    }

    // ==== Actions ====
    async fillDepartmentInput(text){
        await this.departmentInput.fill(text);
    }
    async fillDocNumberInput(text){
        await this.docNumberInput.fill(text);
    }
    async fillSubjectInput(text){
        await this.subjectInput.fill(text);
    }

    async selectMonth(value) {
    await this.monthDropdown.selectOption(value);
    }

    async fillTo(text) {
        await this.toInput.fill(text);
    }

    async fillContent(text) {
        await this.contentTextarea.fill(text);
    }
    async clickDownloadPdf() {
        const [download] = await Promise.all([
            this.page.waitForEvent('download'),
            this.downloadPdfButton.click(),
        ]);
        return download;
    }

    async clickClear() {
        await this.clearButton.click();
    }


    /** กรอกฟอร์มทั้งหมดในครั้งเดียว */
    async fillForm({ department, docNumber, subject, month, to, content}) {
        await this.fillDepartment(department);
        await this.fillDocNumber(docNumber);
        await this.fillSubject(subject);
        await this.selectMonth(month);
        await this.fillTo(to);
        await this.fillContent(content);

    }


}