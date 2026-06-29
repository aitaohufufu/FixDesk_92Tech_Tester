import { BasePage } from './base.page';

export class JobManagePage extends BasePage {

    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        super(page);

        // ════ MENU ════
        this.jobAssignMenu       = page.locator('a[title="ตรวจสอบคำร้อง"]');

        // ════ KEBAB DROPDOWN ════
        this.kebabMenuAssignBtn  = page.locator('button', { hasText: 'มอบหมายงาน' }).first();
        this.kebabMenuDetailBtn  = page.locator('button', { hasText: 'รายละเอียด' }).first();
        this.kebabAssignedLabel  = page.locator('text=งานนี้ถูกมอบหมายแล้ว').first();

        // ════ ASSIGN MODAL ════
        this.assignModal         = page.locator('h2', { hasText: 'มอบหมายงานให้ผู้รับผิดชอบหลัก' });
        this.assignTechList      = page.locator('[name="selectedTech"]');
        this.assignSearchInput   = page.locator('input[placeholder="ค้นหา"]');
        this.assignConfirmBtn    = page.locator('button', { hasText: 'ยืนยัน' });
        this.assignCancelBtn     = page.locator('button', { hasText: 'ยกเลิก' });
        this.assignTypeDropdown  = page.locator('button', { hasText: 'ประเภทช่างทั้งหมด' });

        // ════ DETAIL PAGE ════
        this.detailAssignCardBtn = page.locator('div.border-dashed', { hasText: 'คลิกเพื่อมอบหมายงานให้ช่าง' });
    }

    // ════ ACTIONS ════

    async clickJobAssignMenu() {
        await this.jobAssignMenu.waitFor({ state: 'visible' });
        await this.jobAssignMenu.click();
    }

    async clickFirstUnassignedKebab() {
        const badge = this.page.locator('span', { hasText: 'รอดำเนินการ' }).first();
        await badge.waitFor({ state: 'visible' });
        const row = badge.locator('xpath=ancestor::tr');
        await row.locator('button[title="เมนู"]').click();
    }

    async clickFirstAssignedKebab() {
        const badge = this.page.locator('span', { hasText: 'กำลังดำเนินการ' }).first();
        await badge.waitFor({ state: 'visible' });
        const row = badge.locator('xpath=ancestor::tr');
        await row.locator('button[title="เมนู"]').click();
    }

    async clickKebabAssign() {
        await this.kebabMenuAssignBtn.waitFor({ state: 'visible' });
        await this.kebabMenuAssignBtn.click();
    }

    async clickKebabDetail() {
        await this.kebabMenuDetailBtn.waitFor({ state: 'visible' });
        await this.kebabMenuDetailBtn.click();
    }

    async clickDetailAssignCard() {
        await this.detailAssignCardBtn.waitFor({ state: 'visible' });
        await this.detailAssignCardBtn.click();
    }

    async selectFirstTech() {
        await this.assignTechList.first().waitFor({ state: 'visible' });
        await this.assignTechList.first().click();
    }

    async searchTech(name) {
        await this.assignSearchInput.waitFor({ state: 'visible' });
        await this.assignSearchInput.fill(name);
    }

    async clickConfirm() {
        await this.assignConfirmBtn.waitFor({ state: 'visible' });
        await this.assignConfirmBtn.click();
    }

    async clickCancel() {
        await this.assignCancelBtn.waitFor({ state: 'visible' });
        await this.assignCancelBtn.click();
    }
}