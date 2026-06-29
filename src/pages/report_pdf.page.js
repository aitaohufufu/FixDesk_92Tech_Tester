import { BasePage } from './base.page';

export class ReportPDFPage extends BasePage {

    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        super(page);

        // ════ เมนู ════
        this.reportMenu = page.locator('a[title="สร้างรายงาน"]');

        // ════ Dropdown ════
        this.monthSelect = page.locator('select').first();
        this.yearSelect  = page.locator('select').nth(1);

        // ════ ตาราง ════
        this.totalCount      = page.locator('span.text-sm.text-gray-500');
        this.tableRows       = page.locator('table tbody tr');

        // ════ ปุ่มหลัก ════
        this.downloadCsvButton = page.locator('button:has(span:text("ดาวน์โหลดสรุปรายงานประจำเดือน"))');
        this.downloadPDFButton = page.locator('button:has-text("ดาวน์โหลดใบแจ้งซ่อม")');

        // ════ Modal ════
        this.radioMerged           = page.locator('input[type="radio"][value="merged"]');
        this.radioZip              = page.locator('input[type="radio"][value="zip"]');
        this.cancelButton          = page.locator('button:has-text("ยกเลิก")');
        this.confirmDownloadButton = page.locator('button:has(span:text("ดาวน์โหลดไฟล์"))');

        this.totalCount = page.locator('span.text-sm.text-gray-500');
    }

    // ════ ACTIONS ════

    async clickReportMenu() {
        await this.reportMenu.waitFor({ state: 'visible', timeout: 3000 });
        await this.reportMenu.click();
    }

    async selectMonth(monthName) {
        await this.monthSelect.selectOption({ label: monthName });
    }

    async selectYear(value) {
        await this.yearSelect.selectOption(value);
    }

    // ════ Checkbox ════

    /** ติ๊ก checkbox ด้วย report ID เช่น 'RF20260227012' */
    async checkRowById(reportId) {
        await this.page
            .locator(`input[type="checkbox"][value="${reportId}"]`)
            .check();
    }

    /** ติ๊ก checkbox ด้วย index (เริ่มที่ 0) */
    async checkRowByIndex(index) {
        await this.tableRows
            .nth(index)
            .locator('input[type="checkbox"]')
            .check();
    }

    /** ติ๊กทุก row ในหน้าปัจจุบัน */
    async checkAllRows() {
        const rows = await this.tableRows.count();
        for (let i = 0; i < rows; i++) {
            await this.checkRowByIndex(i);
        }
    }

    // ════ Download CSV ════

    async clickDownloadCsv() {
        const [download] = await Promise.all([
            this.page.waitForEvent('download'),
            this.downloadCsvButton.click(),
        ]);
        return download;
    }

    // ════ Download PDF (เปิด Modal ก่อน) ════

    /** กดปุ่ม "ดาวน์โหลดใบแจ้งซ่อม" เพื่อเปิด modal */
    async clickDownloadPDF() {
        await this.downloadPDFButton.click();
        await this.radioMerged.waitFor({ state: 'visible', timeout: 3000 });
    }

    /** เลือก "รวมเป็นไฟล์เดียว" แล้ว download */
    async downloadAsMerged() {
        await this.radioMerged.check();
        const [download] = await Promise.all([
            this.page.waitForEvent('download'),
            this.confirmDownloadButton.click(),
        ]);
        return download;
    }

    /** เลือก "ดาวน์โหลดเป็นไฟล์แยก (ZIP)" แล้ว download */
    async downloadAsZip() {
        await this.radioZip.check();
        const [download] = await Promise.all([
            this.page.waitForEvent('download'),
            this.confirmDownloadButton.click(),
        ]);
        return download;
    }

    async clickCancel() {
        await this.cancelButton.click();
    }

    // ════ ข้อมูลตาราง ════

    async getRowCount() {
        return await this.tableRows.count();
    }

    async getRowData(index) {
        const row = this.tableRows.nth(index);
        return {
            date:     await row.locator('td').nth(1).textContent(),
            reportId: await row.locator('td').nth(2).textContent(),
            reporter: await row.locator('td').nth(3).textContent(),
            type:     await row.locator('td').nth(4).textContent(),
            unit:     await row.locator('td').nth(5).textContent(),
            status:   await row.locator('td').nth(6).textContent(),
        };
    }

    /** อ่านจำนวนที่เลือกจากปุ่ม เช่น "ดาวน์โหลดใบแจ้งซ่อม (2)" → 2 */
    async getSelectedCount() {
        const text = await this.downloadPDFButton.textContent();
        const match = text.match(/\((\d+)\)/);
        return match ? parseInt(match[1]) : 0;
    }

    /** อ่านจำนวนรายการทั้งหมด เช่น "43 รายการ" → 43 */
    async getTotalCount() {
        const text = await this.totalCount.textContent();
        return parseInt(text.match(/\d+/)[0]);
    }
}