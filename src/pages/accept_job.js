import { BasePage } from './base.page';

export class AcceptJobPage extends BasePage {

    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        super(page);

        // ════ MENU ════
        this.acceptJobMenu              = page.locator('a[title="รายการงานแจ้งซ่อม"]');

        // ════ PAGE TITLE ════
        this.techAccTitle               = page.locator('h1', { hasText: 'รายการงานซ่อมของฉัน' });

        // ════ KEBAB DROPDOWN (List) ════
        this.kebabMenuDetailBtn         = page.locator('button', { hasText: 'รายละเอียด' }).first();
        this.kebabAcceptBtn             = page.locator('button', { hasText: 'รับงาน' }).first();
        this.kebabCloseJobBtn           = page.locator('button', { hasText: 'ปิดงาน' }).first();
        this.kebabOutsourceBtn          = page.locator('button', { hasText: 'จ้างช่างภายนอก' }).first();
        this.kebabRequisitionBtn        = page.locator('button', { hasText: 'เบิกวัสดุอุปกรณ์' }).first();

        // ════ ACCEPT MODAL ════
        this.acceptModal                = page.locator('h2', { hasText: 'รับงาน / มอบหมายทีม' });
        this.radioAlone                 = page.locator('input[type="radio"][value="alone"]');
        this.radioTeam                  = page.locator('input[type="radio"][value="team"]');
        this.techTypeDropdown           = page.locator('button', { hasText: 'ประเภทช่างทั้งหมด' });
        this.techSearchInput            = page.locator('input[placeholder="ค้นหา"]');
        this.techCheckboxList           = page.locator('input[type="checkbox"]');
        this.acceptConfirmBtn           = page.locator('button', { hasText: 'ยืนยัน' });
        this.acceptCancelBtn            = page.locator('button', { hasText: 'ยกเลิก' });

        // ════ DETAIL PAGE — เปลี่ยนสถานะ ════
        this.changeStatusBtn            = page.locator('button', { hasText: 'เปลี่ยนสถานะ' });
        this.statusMenuOutsourceBtn     = page.locator('p.text-sm.font-bold', { hasText: 'จ้างช่างภายนอก' });
        this.statusMenuCloseJobBtn      = page.locator('p.text-sm.font-bold', { hasText: 'ปิดงาน' });

        // ════ OUTSOURCE CONFIRM (SweetAlert2) ════
        this.swalOutsourceTitle         = page.locator('h2.swal2-title', { hasText: 'จ้างช่างภายนอก' });
        this.swalConfirmBtn             = page.locator('button.swal2-confirm');
        this.swalCancelBtn              = page.locator('button.swal2-cancel');

       // ════ CLOSE JOB MODAL — ส่วนที่ 1: วิธีการซ่อม ════
        this.closeJobModal          = page.locator('h3', { hasText: 'รายละเอียดการดำเนินการ' });
        this.radioInHouse           = page.locator('input[type="radio"][value="in_house"]');
        this.radioRepairOther       = page.locator('input[type="radio"][value="other"]').first();
        this.repairOtherInput       = page.locator('input[placeholder="ระบุเหตุผลอื่นๆ..."]');

        // ════ CLOSE JOB MODAL — ส่วนที่ 2: รายละเอียดการซ่อม ════
        this.repairDetailTextarea   = page.locator('textarea[placeholder="กรอกรายละเอียด..."]');

        // ════ CLOSE JOB MODAL — ส่วนที่ 3: สรุปผล ════
        this.radioCompleted         = page.locator('input[type="radio"][value="completed"]');
        this.radioIncomplete        = page.locator('input[type="radio"][value="incomplete"]');
        this.radioResultOther       = page.locator('input[type="radio"][value="other"]').last();
        this.resultIncompleteInput  = page.locator('input[placeholder="ระบุสาเหตุที่ไม่เรียบร้อย..."]');
        this.resultOtherInput       = page.locator('input[placeholder="ระบุอื่นๆ..."]'); // ← ลบตัวซ้ำออก

        // ════ CLOSE JOB MODAL — ปุ่ม ════
        this.closeJobConfirmBtn = page.locator('button', { hasText: 'ยืนยันปิดงาน' })
        .or(page.locator('button', { hasText: 'ยืนยันการปิดงาน' }));        
        this.closeJobCancelBtn          = page.locator('button', { hasText: 'ยกเลิก' }).filter({ hasNot: page.locator('.swal2-cancel') });

        // ════ TOAST / SUCCESS ════
        this.toastOutsourceSuccess      = page.locator('text=ส่งงานให้ช่างภายนอกเรียบร้อย');
        this.toastCloseJobSuccess = page.getByText('ปิดงานเรียบร้อยแล้ว', { exact: false });
    }

    // ════ NAVIGATION ════

    async clickAcceptJobMenu() {
        await this.acceptJobMenu.waitFor({ state: 'visible' });
        await this.acceptJobMenu.click();
    }

    // ════ KEBAB — LIST PAGE ════

    /** คลิก kebab ของ row แรกที่สถานะ "รอดำเนินการ" */
    async clickFirstPendingKebab() {
        const badge = this.page.locator('span', { hasText: 'รอดำเนินการ' }).first();
        await badge.waitFor({ state: 'visible' });
        const row = badge.locator('xpath=ancestor::tr');
        await row.locator('button[title="เมนู"]').click();
    }

    /** คลิก kebab ของ row แรกที่สถานะ "กำลังดำเนินการ" */
    async clickFirstInProgressKebab() {
        const badge = this.page.locator('span', { hasText: 'กำลังดำเนินการ' }).first();
        await badge.waitFor({ state: 'visible' });
        const row = badge.locator('xpath=ancestor::tr');
        await row.locator('button[title="เมนู"]').click();
    }

    async clickKebabDetail() {
        await this.kebabMenuDetailBtn.waitFor({ state: 'visible' });
        await this.kebabMenuDetailBtn.click();
    }

    async clickKebabAccept() {
        await this.kebabAcceptBtn.waitFor({ state: 'visible' });
        await this.kebabAcceptBtn.click();
    }

    async clickKebabCloseJob() {
        await this.kebabCloseJobBtn.waitFor({ state: 'visible' });
        await this.kebabCloseJobBtn.click();
    }

    async clickKebabOutsource() {
        await this.kebabOutsourceBtn.waitFor({ state: 'visible' });
        await this.kebabOutsourceBtn.click();
    }

    async clickKebabRequisition() {
        await this.kebabRequisitionBtn.waitFor({ state: 'visible' });
        await this.kebabRequisitionBtn.click();
    }

    // ════ ACCEPT MODAL ════

    async selectAlone() {
        await this.radioAlone.waitFor({ state: 'visible' });
        await this.radioAlone.click();
    }

    async selectTeam() {
        await this.radioTeam.waitFor({ state: 'visible' });
        await this.radioTeam.click();
    }

    async selectFirstTech() {
        await this.techCheckboxList.first().waitFor({ state: 'visible' });
        await this.techCheckboxList.first().click();
    }

    async searchTech(name) {
        await this.techSearchInput.waitFor({ state: 'visible' });
        await this.techSearchInput.fill(name);
    }

    async clickConfirm() {
        await this.acceptConfirmBtn.waitFor({ state: 'visible' });
        await this.acceptConfirmBtn.click();
    }

    async clickCancel() {
        await this.acceptCancelBtn.waitFor({ state: 'visible' });
        await this.acceptCancelBtn.click();
    }

    // ════ DETAIL PAGE — เปลี่ยนสถานะ ════

    async clickChangeStatus() {
        await this.changeStatusBtn.waitFor({ state: 'visible' });
        await this.changeStatusBtn.click();
    }

    async clickStatusMenuOutsource() {
        await this.statusMenuOutsourceBtn.waitFor({ state: 'visible' });
        await this.statusMenuOutsourceBtn.click();
    }

    async clickStatusMenuCloseJob() {
        await this.statusMenuCloseJobBtn.waitFor({ state: 'visible' });
        await this.statusMenuCloseJobBtn.click();
    }

    // ════ OUTSOURCE SWAL ════

    async confirmOutsourceSwal() {
        await this.swalOutsourceTitle.waitFor({ state: 'visible' });
        await this.swalConfirmBtn.click();
    }

    // ════ CLOSE JOB MODAL ════

    async waitForCloseJobModal() {
        await this.closeJobModal.waitFor({ state: 'visible' });
    }

    /** เลือก "สามารถแก้ไข/ซ่อมบำรุงได้" */
    async selectRepairInHouse() {
        await this.radioInHouse.waitFor({ state: 'visible' });
        await this.radioInHouse.click();
    }

    /** เลือก "อื่นๆ" พร้อมระบุเหตุผล */
    async selectRepairOther(reason = 'เหตุผลอื่นๆ') {
        await this.radioRepairOther.waitFor({ state: 'visible' });
        await this.radioRepairOther.click();
        await this.repairOtherInput.waitFor({ state: 'visible' });
        await this.repairOtherInput.fill(reason);
    }

    async fillRepairDetail(detail = 'ซ่อมเสร็จเรียบร้อย') {
        await this.repairDetailTextarea.waitFor({ state: 'visible' });
        await this.repairDetailTextarea.fill(detail);
    }

    /** สรุปผล: เรียบร้อย */
    async selectResultCompleted() {
        await this.radioCompleted.waitFor({ state: 'visible' });
        await this.radioCompleted.click();
    }

    async selectResultIncomplete(reason = 'ยังซ่อมไม่เสร็จ') {
        await this.radioIncomplete.waitFor({ state: 'visible' });
        await this.radioIncomplete.click();
        await this.resultIncompleteInput.waitFor({ state: 'visible' }); // ← ใช้ตัวใหม่
        await this.resultIncompleteInput.fill(reason);
    }
    
    async selectResultOther(reason = 'สาเหตุอื่นๆ') {
        await this.radioResultOther.waitFor({ state: 'visible' });
        await this.radioResultOther.click();
        await this.resultOtherInput.waitFor({ state: 'visible' }); // ← ใช้ตัวใหม่
        await this.resultOtherInput.fill(reason);
    }

    async clickCloseJobConfirm() {
        await this.closeJobConfirmBtn.waitFor({ state: 'visible', timeout: 10000 });
        await this.closeJobConfirmBtn.click();
                
    }

    async clickCloseJobCancel() {
        await this.closeJobCancelBtn.waitFor({ state: 'visible' });
        await this.closeJobCancelBtn.click();
    }
}