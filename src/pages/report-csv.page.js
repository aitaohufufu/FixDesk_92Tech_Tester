import { BasePage } from './base.page.js';

export class ReportCSVPage extends BasePage {

    /**
     * 
     * @param {import('@playwright/test').Page} page 
     */
    constructor(page) {
        super(page);

        this.reportTitle = page.getByRole('heading', { name: 'สร้างรายงาน' });

        this.reportMenu = page.locator('a[title="สร้างรายงาน"]');
    }

    /**
     * ฟังก์ชันคลิกเมนู "สร้างรายงาน"
     */
    async clickReportMenu() {
        await this.reportMenu.waitFor({ state: 'visible', timeout: 3000 });
        await this.reportMenu.click();
    }
}