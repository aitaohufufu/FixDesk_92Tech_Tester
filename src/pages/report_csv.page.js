import { BasePage } from './base.page';

export class ReportCSVPage extends BasePage {

    /**
     * 
     * @param {import('@playwright/test').Page} page 
     */
    constructor(page) {
        super(page);

        // Locators

        this.reportTitle = page.getByRole('heading', { name: 'สร้างรายงาน' });

        this.reportMenu = page.locator('a[title="สร้างรายงาน"]');

        this.monthSelect   = page.locator('select').first()

        this.yearSelect    = page.locator('select').nth(1)

        this.downloadButton = page.locator('button:has(span:text("ดาวน์โหลดสรุปรายงานประจำเดือน"))')
    }

    /**
     * ฟังก์ชันคลิกเมนู "สร้างรายงาน"
     */
    async clickReportMenu() {
        await this.reportMenu.waitFor({ state: 'visible', timeout: 3000 });
        await this.reportMenu.click();
    }

    // ════ ACTIONS ════
    async selectMonth(monthValue) {
        await this.monthSelect.selectOption(monthValue)
      }
    
      async selectYear(yearValue) {
        await this.yearSelect.selectOption(yearValue)
      }
    
      async clickDownload() {
        const [download] = await Promise.all([
          this.page.waitForEvent('download'),
          this.downloadButton.click(),
        ])
        return download
      }

    
}