import { BasePage } from './base.page.js';

export class RepairManagementPage extends BasePage {

    /**
     * @param {import('@playwright/test').Page} page 
     */
    constructor(page) {
        super(page);

        this.repairDetailTitle = page.getByRole('heading', { name: 'แก้ไขแบบฟอร์มแจ้งซ่อม' });
        this.myListMenu = page.locator('a[title="รายการของฉัน"]');

        this.tableRows = page.locator('table tbody tr');
        this.pendingRow = this.tableRows.filter({ hasText: 'รอดำเนินการ' }).first();
        this.editButton = this.page.getByRole('button', { name: /แก้ไข/ }).first();

        this.typeSelect = page.locator('label:has-text("ประเภท") + p + select');
        this.problemInput = page.locator('label:has-text("ขอความอนุเคราะห์ตรวจสอบ/ซ่อมแซม") + p + input');
        this.buildingSelect = page.locator('label:has-text("อาคาร") + p + select');
        this.floorSelect = page.locator('label:has-text("ชั้น") + p + select');
        this.roomSelect = page.locator('label:has-text("ห้อง") + p + select');
        this.equipmentInput = page.locator('label:has-text("หมายเลขครุภัณฑ์") + p + input');
        this.causeTextarea = page.locator('textarea[placeholder="กรุณากรอกสาเหตุ / อาการที่เสีย"]');
        this.fileInput = page.locator('input[id="dropzone-file"]');

        this.deleteFileButtons = page.locator('button[title="ลบไฟล์"]');
        this.saveButton = page.getByRole('button', { name: 'บันทึกการแก้ไข' });
        this.confirmAlertButton = page.getByRole('button', { name: /^ยืนยัน/ });

        this.errorAlertTitle = page.locator('#swal2-title:has-text("แก้ไขข้อมูลไม่สำเร็จ")');
        this.deleteSuccessToast = page.locator('.swal2-toast.swal2-icon-success');
    }

    /**
     * ฟังก์ชันสำหรับดึงข้อความจากคอลัมน์ "รายละเอียดโดยย่อ"
     */
    async getPendingRowDetails() {
        const detailCell = this.pendingRow.locator('td').nth(2);
        return await detailCell.innerText();
    }

    /**
     * ฟังก์ชันสำหรับเลือกความเร่งด่วน
     * @param {string} level - 'เร่งด่วนมาก' | 'เร่งด่วน' | 'ไม่เร่งด่วน'
     */
    async selectUrgency(level) {
        await this.page.locator('div.cursor-pointer').filter({ hasText: new RegExp(`^${level}$`) }).click();
    }

    /**
     * ฟังก์ชันสำหรับอัปโหลดไฟล์
     * @param {string|string[]} filePath
     */
    async uploadFiles(filePath) {
        const filesArray = Array.isArray(filePath) ? filePath : [filePath];
        await this.fileInput.setInputFiles(filesArray);
    }

    /**
     * ฟังก์ชันสำหรับลบไฟล์เดิมออกตามจำนวนที่ระบุ
     * @param {number} count จำนวนไฟล์ที่ต้องการลบ
     */
    async deleteExistingFiles(count) {
        for (let i = 0; i < count; i++) {
            if (await this.deleteFileButtons.count() > 0) {
                await this.deleteFileButtons.first().click();
                await this.page.waitForTimeout(500);
            }
        }
    }

    /**
     * ฟังก์ชันสำหรับนับจำนวนไฟล์
     * @returns {Promise<number>} จำนวนไฟล์ทั้งหมด
     */
    async getExistingFilesCount() {
        return await this.deleteFileButtons.count();
    }

    /**
     * ฟังก์ชันกดปุ่มแก้ไขจากรายการที่รอดำเนินการ
     */
    async clickEditRepair() {
        await this.pendingRow.locator('button[title="เมนู"]').click();
        await this.editButton.waitFor({ state: 'visible', timeout: 5000 });
        await this.editButton.click();
    }

    /**
     * ฟังก์ชันคลิกเมนูรายการของฉัน
     */
    async clickMyListMenu() {
        await this.myListMenu.click();
    }

    /**
     * ฟังก์ชันคลิกปุ่ม "บันทึกการแก้ไข"
     */
    async clickSaveButton() {
        await this.saveButton.click();
    }

    /**
     * ฟังก์ชันคลิกปุ่ม "ยืนยัน" บน SweetAlert
     */
    async clickConfirmAlert() {
        await this.confirmAlertButton.waitFor({ state: 'visible', timeout: 5000 });
        await this.confirmAlertButton.click();
    }
}