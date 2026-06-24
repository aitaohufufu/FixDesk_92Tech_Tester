import { BasePage } from './base.page.js';
import { expect } from '../utils/base.js';

export class RepairStatusPage extends BasePage {

    constructor(page) {
        super(page);
        this.repairStatusCheckTitle = page.getByRole('heading', { name: 'ตรวจสอบสถานะงานซ่อม' });
        this.myListTitle = page.getByRole('heading', { name: 'รายการแจ้งซ่อมของฉัน' });
        this.requestTitle = page.getByRole('heading', { name: 'รายการคำร้องแจ้งซ่อม' });
        this.repairHistoryTitle = page.getByRole('heading', { name: 'ประวัติการแจ้งซ่อมที่ดำเนินการเสร็จสิ้น' });
        this.myRepairHistoryTitle = page.getByRole('heading', { name: 'ประวัติการซ่อมของฉัน' });
        this.myRepairRequestTitle = page.getByRole('heading', { name: 'รายการงานซ่อมของฉัน' });

        this.myListMenu = page.locator('a[title="รายการของฉัน"]');
        this.requestMenu = page.locator('a[title="ตรวจสอบคำร้อง"]');
        this.repairHistoryMenu = page.locator('a[title="ประวัติการแจ้งซ่อม"]');
        this.myRepairHistoryMenu = page.locator('a[title="ประวัติของฉัน"]');
        this.myRepairRequestMenu = page.locator('a[title="รายการงานแจ้งซ่อม"]');

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
        return this.page.locator('div.bg-white').filter({ hasText: data }).first();
    }

    /**
     * ดึง Element การ์ดแต่ละใบ
     * @param {string} label - ข้อความอธิบายด้านล่างของการ์ด
     */
    getStatusCard(label) {
        const cardDescription = this.page.locator('p.text-gray-600').getByText(label, { exact: true });
        return this.page.locator('div.cursor-pointer', { has: cardDescription });
    }

    /**
     * ตรวจการ์ดแสดงสถานะของงานซ่อมทั้งหมด
     * @param {string[]} statusTitle - หัวข้อสถานะงานซ่อม
     */
    async adminHomeCardCheck(statusTitle) {
        for (const label of statusTitle) {
            const card = this.getStatusCard(label);

            await expect(card).toBeVisible();
            await expect(card.locator('h2')).toHaveText(/\d+ งาน/);
        }
    }

    /**
     * ตรวจสอบแถวข้อมูลงานซ่อมในตาราง
     * @param {string} repairId -หมายเลขแจ้งซ่อม
     * @param {object} details - ข้อมูลที่ต้องการตรวจสอบ
     */
    async repairRowCheck(repairId, details) {
        const repairRow = this.page.locator('table tbody tr').filter({ hasText: repairId }).first();

        await expect(repairRow).toBeVisible({ timeout: 5000 });

        // --- ตรวจสอบ details.reporter ต้องไม่เป็นค่าว่าง ---
        if (details.reporter && details.reporter !== '') {
            const hasReporterPrefix = await repairRow.getByText('ชื่อผู้แจ้ง :').count() > 0;

            if (hasReporterPrefix) {
                await expect(repairRow.getByText(`ชื่อผู้แจ้ง : ${details.reporter}`)).toBeVisible();
            } else {
                await expect(repairRow.getByText(details.reporter)).toBeVisible();
            }
        }

        await expect(repairRow.getByText(`เรื่องที่แจ้ง : ${details.subject}`)).toBeVisible();

        await expect(repairRow.locator('.rounded-full').getByText(details.status, { exact: true })).toBeVisible();
    }


    /**
     * ตรวจสอบข้อมูลในรายละเอียดงานซ่อม
    */
    async checkRepairDetail() {
        // หมายเลขแจ้งซ่อม
        await expect(this.page.locator('h1', { hasText: /งานซ่อม RF\d+/ })).toBeVisible();

        // สถานะงานซ่อม
        const textBadges = this.page.locator('span.rounded-full');
        await expect(textBadges.first()).not.toBeEmpty();

        // รายละเอียดงานซ่อม
        await expect(this.page.getByRole('heading', { name: 'รายละเอียดจากผู้แจ้ง' })).toBeVisible();

        // "อาการที่แจ้งซ่อม" และ "สถานที่"
        await expect(this.page.locator('h3:has-text("อาการที่แจ้งซ่อม") + h1')).not.toBeEmpty();
        await expect(this.page.locator('span:has-text("สถานที่") + span')).not.toBeEmpty();

        // "ผู้ส่งคำขอแจ้งซ่อม"
        const reporterCard = this.page.locator('div.bg-\\[\\#3b60e4\\]');
        await expect(reporterCard.locator('h2')).not.toBeEmpty();

        // "การดำเนินงานของช่าง"
        await expect(this.page.getByRole('heading', { name: 'การดำเนินงานของช่าง' })).toBeVisible();

        const technicianName = this.page.locator('p.text-gray-800', { hasText: /(นาย|นาง|นางสาว)/ }).first();
        const assignButton = this.page.locator('span:has-text("คลิกเพื่อมอบหมายงานให้ช่าง")');

        if (await technicianName.isVisible({ timeout: 2000 })) {
            await expect(technicianName).toBeVisible();
        } else {
            await expect(assignButton).toBeVisible();
        }

        // Timeline
        const timeLog = this.page.locator('p.text-gray-400').first();
        const monthsRegex = /(มกราคม|กุมภาพันธ์|มีนาคม|เมษายน|พฤษภาคม|มิถุนายน|กรกฎาคม|สิงหาคม|กันยายน|ตุลาคม|พฤศจิกายน|ธันวาคม)/;

        const timeLogText = await timeLog.innerText();

        if (monthsRegex.test(timeLogText)) {
            await expect(timeLog).toContainText(monthsRegex);
        } else {
            await expect(timeLog).toContainText('ยังไม่มีการเพิ่มรายการวัสดุ');
        }
    }

    /**
     * ตรวจสอบหน้าจอหลักของช่างซ่อม
     */
    async technicianHomeCheck() {
        // จำนวนงานซ่อม
        const statCards = this.page.locator('.grid-cols-1 .text-center h2');

        // การ์ดสถานะงานซ่อม
        await expect(statCards.first()).toHaveText(/\d+\s*งาน/);

        // ส่วนหัวตาราง "งานซ่อมที่ได้รับมอบหมายล่าสุด"
        await expect(this.page.getByRole('heading', { name: 'งานซ่อมที่ได้รับมอบหมายล่าสุด' })).toBeVisible();

        // ตาราง
        const firstRow = this.page.locator('table tbody tr').first();
        await expect(firstRow).toBeVisible();

        // "เรื่องที่แจ้ง" และ "สถานที่" 
        await expect(firstRow.locator('td').nth(1).locator('span')).not.toBeEmpty();
        await expect(firstRow.locator('td').nth(3).locator('span')).not.toBeEmpty();

        // กราฟ
        const chartValue = this.page.locator('.apexcharts-datalabel-value');
        await expect(chartValue).not.toBeEmpty();
    }

    /**
     * รายละเอียดงานซ่อม Timeline
     */
    async checkUserRepairTimeline() {
        await expect(this.page.getByRole('heading', { name: 'ตรวจสอบสถานะ' })).toBeVisible();
        
        await expect(this.page.locator('p:has-text("หมายเลขแจ้งซ่อม :")')).toBeVisible();
        await expect(this.page.locator('p:has-text("ประเภท :")')).toBeVisible();
        await expect(this.page.locator('p:has-text("สถานที่ :")')).toBeVisible();
        await expect(this.page.locator('p:has-text("เรื่องที่แจ้ง :")')).toBeVisible();
        await expect(this.page.locator('p:has-text("สาเหตุ/อาการ :")')).toBeVisible();

        const timelineTimes = this.page.locator('.flex-1 p.text-gray-400');
        const count = await timelineTimes.count();
        
        const monthsRegex = /(มกราคม|กุมภาพันธ์|มีนาคม|เมษายน|พฤษภาคม|มิถุนายน|กรกฎาคม|สิงหาคม|กันยายน|ตุลาคม|พฤศจิกายน|ธันวาคม)/;

        for (let i = 0; i < count; i++) {
            const timeText = await timelineTimes.nth(i).innerText();
            
            if (timeText.trim() !== '') {
                expect(timeText).toMatch(monthsRegex);
            }
        }

        await expect(this.page.locator('.flex-1 p.text-gray-800').first()).not.toBeEmpty();
    }

    /**
     * คลิกเลือกงานซ่อม
     */
    async clickFirstDashboardJob() {
        const firstJobLink = this.page.locator('table tbody tr').first().locator('span.underline');
        await expect(firstJobLink).toBeVisible({ timeout: 5000 });
        await firstJobLink.click();
    }

    /**
     * คลิกหมายเลขแจ้งซ่อม
     */
    async clickFirstRepairId() {
        const firstIdLink = this.page.locator('table tbody tr').first().locator('span.underline');

        await expect(firstIdLink).toBeVisible({ timeout: 5000 });
        await firstIdLink.click();
    }

    /**
     * คลิกเมนู "รายการของฉัน"
    */
    async clickMyListMenu() {
        await this.myListMenu.click();
    }

    /**
     * คลิกเมนู "ตรวจสอบคำร้อง"
    */
    async clickRequestMenu() {
        await this.requestMenu.click();
    }

    /**
     * คลิกเมนู "ประวัติการแจ้งซ่อม"
    */
    async clickRepairHistoryMenu() {
        await this.repairHistoryMenu.click();
    }

    /**
     * คลิกเมนู "ประวัติของฉัน"
    */
    async clickMyRepairHistoryMenu() {
        await this.myRepairHistoryMenu.click();
    }

    /**
     * คลิกเมนู "รายการงานซ่อมของฉัน"
    */
    async clickMyRepairRequestMenu() {
        await this.myRepairRequestMenu.click();
    }

}