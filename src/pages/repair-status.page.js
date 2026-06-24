import { BasePage } from './base.page.js';
import { expect } from '../utils/base.js';

export class RepairStatusPage extends BasePage {

    constructor(page) {
        super(page);
        this.repairStatusCheckTitle = page.getByRole('heading', { name: 'ตรวจสอบสถานะงานซ่อม' });
        this.searchInput = page.locator('input[type="text"]');
        this.searchButton = page.locator('button:has-text("ค้นหา")');
    }

    async searchRepair(data) {
        await this.searchInput.fill(data);
        await this.searchButton.click();
    }

    /**
     * ดึงข้อมูลที่ค้นหาจากในการ์ด
     */
    async getSearchResultCard(data) {
        return page.locator('div.bg-white').filter({ hasText: data }).first();
    }

    /**
     * ตรวจการ์ดแสดงสถานะของงานซ่อม
     * @param {string[]} statusType - อาร์เรย์ของหัวข้อสถานะงานซ่อม
     */
    async statusCardCheck(statusType) {
        for (const label of statusType) {
            const card = this.page.locator('div.bg-white').filter({ hasText: label });
            await expect(card).toBeVisible();
            await expect(card.locator('h2')).toHaveText(/\d+ งาน/);
        }
    }
}