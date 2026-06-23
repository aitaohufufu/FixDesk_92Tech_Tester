import { BasePage } from './base.page.js';
import { expect } from '../utils/base.js';

export class RepairFormPage extends BasePage {

    /**
     * 
     * @param {import('@playwright/test').Page} page 
     */
    constructor(page) {
        super(page);

        this.repairFormTitle = page.getByRole('heading', { name: 'แบบฟอร์มแจ้งซ่อม' });

        this.repairMenu = page.locator('a[title="แจ้งซ่อม"]');

        this.nameInput = page.locator('div:has(> label:has-text("ลงชื่อผู้แจ้ง"))').locator('input');
        this.phoneInput = page.locator('div:has(> label:has-text("หมายเลขโทรศัพท์"))').locator('input');
        this.departmentInput = page.locator('div:has(> label:has-text("หน่วยงาน"))').locator('input');

        this.repairTypeSelect = page.locator('div:has(> label:has-text("ประเภท"))').locator('select');
        this.assetCodeInput = page.locator('div:has(> label:has-text("หมายเลขครุภัณฑ์"))').locator('input');
        this.topicInput = page.locator('div:has(> label:has-text("ขอความอนุเคราะห์ตรวจสอบ/ซ่อมแซม"))').locator('input');
        this.buildingSelect = page.locator('div:has(> label:has-text("อาคาร"))').locator('select');
        this.floorSelect = page.locator('div:has(> label:has-text("ชั้น"))').locator('select');
        this.roomSelect = page.locator('div:has(> label:has-text("ห้อง"))').locator('select');
        this.detailInput = page.getByPlaceholder('กรุณาอธิบายสาเหตุ/อาการเสียที่พบ');
        this.fileInput = page.locator('input#dropzone-file');

        this.submitFormButton = page.locator('button:has-text("ส่งแบบฟอร์มแจ้งซ่อม")');
        this.submitButton = page.locator('button:has-text("ยืนยัน")');

        this.alertMessage = page.locator('.text-red-500');

        this.toastAlert = page.locator('.swal2-popup');
    }

    /**
     * กรอกแบบฟอร์มแจ้งซ่อม
     * @param {string} type - ประเภทของงานซ่อม        
     * @param {string} assetCode - หมายเลขครุภัณฑ์
     * @param {string} topic - ปัญหาที่ต้องการแจ้ง
     * @param {string} building - อาคาร
     * @param {string} floor - ชั้น
     * @param {string} room - ห้อง
     * @param {string} detail - สาเหตุ/อาการ
    */
    async fillFormInput(type, assetCode, topic, building, floor, room, detail) {
        if (type) await this.repairTypeSelect.selectOption({ label: type });

        if (building) {
            await this.buildingSelect.selectOption({ label: building });
        }

        if (floor) {
            await expect(this.floorSelect.locator(`option:has-text("${floor}")`)).toBeAttached({ timeout: 3000 });
            await this.floorSelect.selectOption({ label: floor });
        }

        if (room) {
            await expect(this.roomSelect.locator(`option:has-text("${room}")`)).toBeAttached({ timeout: 3000 });
            await this.roomSelect.selectOption({ label: room });
        }

        await this.assetCodeInput.fill(assetCode || '');
        await this.topicInput.fill(topic || '');
        await this.detailInput.fill(detail || '');
    }

    /**
     * อัปโหลดไฟล์รูปภาพ หรือวิดีโอ
     * @param {string|string[]} file - พาธของไฟล์ หรือเซ็ตของไฟล์
    */
    async uploadFile(file) {
        const filesArray = Array.isArray(file) ? file : [file];
        await this.fileInput.setInputFiles(filesArray);
    }

    /**
     * ฟังก์ชันเลือกระดับความเร่งด่วน
     * @param {string} urgency - ระดับความเร่งด่วน 'เร่งด่วนมาก' 'เร่งด่วน' 'ไม่เร่งด่วน'
    */
    async selectUrgency(urgency) {
        await this.page.locator('div.cursor-pointer').filter({ hasText: new RegExp(`^${urgency}$`) }).click();
    }

    /**
     * คลิกปุ่ม "ส่งแบบฟอร์มแจ้งซ่อม"
    */
    async clickSubmitForm() {
        await this.submitFormButton.click();
    }

    /**
     * คลิกปุ่ม "ยืนยัน"
    */
    async clickConfirm() {
        await this.submitButton.click();
    }

    /**
     * คลิกเมนู "แจ้งซ่อม"
    */
    async clickRepairMenu() {
        await this.repairMenu.click();
    }
}