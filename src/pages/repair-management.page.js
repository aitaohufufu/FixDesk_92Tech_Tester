import { BasePage } from './base.page.js';

export class RepairManagementPage extends BasePage {

    /**
     * @param {import('@playwright/test').Page} page 
     */
    constructor(page) {
        super(page);

        this.repairDetailTitle = page.getByRole('heading', { name: 'แก้ไขแบบฟอร์มแจ้งซ่อม'});
        this.myListMenu = page.locator('a[title="รายการของฉัน"]');

        this.tableRows = page.locator('table tbody tr');
        this.pendingRow = this.tableRows.filter({ hasText: 'รอดำเนินการ' }).first();
        this.editButton = this.page.getByRole('button', { name: /แก้ไข/ }).first();

        this.typeSelect = page.locator('label:has-text("ประเภท") + p + select');
        this.problemInput = page.locator('label:has-text("ขอความอนุเคราะห์ตรวจสอบ/ซ่อมแซม") + p + input');
        this.buildingSelect = page.locator('label:has-text("อาคาร") + p + select');
        this.floorSelect = page.locator('label:has-text("ชั้น") + p + select');
        this.roomSelect = page.locator('label:has-text("ห้อง") + p + select');
    }

    /**
     * ฟังก์ชันสำหรับดึงข้อความจากคอลัมน์ "รายละเอียดโดยย่อ"
     * @returns {Promise<string>}
     */
    async getPendingRowDetails() {
        const detailCell = this.pendingRow.locator('td').nth(2);
        return await detailCell.innerText();
    }

    /**
     * ฟังก์ชันกดปุ่มแก้ไข
     */
    async clickEditRepair() {
        await this.pendingRow.locator('button[title="เมนู"]').click();
        await this.editButton.waitFor({ state: 'visible', timeout: 5000 });
        await this.editButton.click();
    }

    async clickMyListMenu() {
        await this.myListMenu.click();
    }
}