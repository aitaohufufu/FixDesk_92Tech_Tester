import { BasePage } from './base.page';
import { expect } from '@playwright/test';
export class BuildingPage extends BasePage {

     /**
     * @param {import('@playwright/test').Page} page
     */
     constructor(page) {
        super(page);

        // Locators
        this.buildingMenu = page.locator('a[title="จัดการสถานที่"]');

        this.searchInput = page.locator(
            'input[placeholder="ค้นหารายการสถานที่"]'
        );

        this.buildingDropdown = page.locator('button:has-text("อาคาร")');
        this.floorDropdown = page.locator('button:has-text("ชั้น")');

        this.addLocationBtn = page.locator('button:has-text("เพิ่มสถานที่")');
        this.importExcelBtn = page.locator('button:has-text("Import Excel")');

        // Kebab menu 
        this.kebabMenuBtn    = page.locator('button[title="เมนู"]');
        this.detailBtn = page.locator('button:has-text("รายละเอียด")').first();
        this.modalTitle      = page.locator('h2:has-text("รายละเอียดห้อง")');
        this.modalCloseBtn   = page.locator('button:has-text("ปิด")');  

        // เพิ่มใน constructor
        this.addLocationBtn     = page.locator('button.bg-blue-700:has-text("เพิ่มสถานที่")');

        /* 
        *  Modal เพิ่มสถานที่
        */

        this.modalAddTitle      = page.locator('h2:has-text("เพิ่มสถานที่")');
        this.tableRows = page.locator('tbody tr');
        // อาคาร
        this.radioBuildingNew      = page.locator('input[type="radio"][value="new"]').first();
        this.radioBuildingExisting = page.locator('input[type="radio"][value="existing"]').first();
        this.buildingSelect        = page.locator('select').first();
        this.newBuildingInput      = page.locator('input[placeholder*="ชื่ออาคาร"]');

        // ชั้น
        this.radioFloorNew         = page.locator('input[type="radio"][value="new"]').nth(1);
        this.radioFloorExisting    = page.locator('input[type="radio"][value="existing"]').nth(1);
        this.newFloorInput         = page.locator('input[placeholder*="ชื่อชั้น"]');

        // ห้อง
        this.roomInput             = page.locator('input[placeholder="ชื่อห้อง (ต้องระบุ)"]');

        // ปุ่มใน Modal
        this.confirmAddBtn         = page.locator('button:has-text("เพิ่มสถานที่")').last();
        this.cancelAddBtn          = page.locator('button:has-text("ยกเลิก")');   
        
        /*
        / Modal แก้ไขสถานที่
        */
        this.editModalTitle  = page.locator('h2:has-text("แก้ไขข้อมูลสถานที่")');
        this.editBuildingInput = page.locator('input[placeholder="ระบุชื่ออาคาร"]');
        this.editFloorInput    = page.locator('input[placeholder="ระบุชื่อชั้น (เช่น 1, 2, 3)"]');
        this.editRoomInput     = page.locator('input[placeholder="ระบุชื่อห้อง"]');
        this.saveEditBtn       = page.locator('button:has-text("บันทึกการแก้ไข")');

        this.swalConfirmBtn = page.locator('button.swal2-confirm');
        this.swalCancelBtn  = page.locator('button.swal2-cancel');
        this.swalTitle      = page.locator('h2.swal2-title');
     }

    /**
     * Function to click the "Building" menu
     */
    async clickBuildingMenu() {
        await this.buildingMenu.waitFor({ state: 'visible' });
        await this.buildingMenu.click();
    }
    async searchLocation(text) {
        await this.searchInput.fill(text);
    }
    async selectBuilding(name) {
        await this.buildingDropdown.click();
        // คลิก radio ที่มี span text ตรงกัน
        await this.page
            .locator('input[type="radio"]')
            .filter({ has: this.page.locator(`span:text-is("${name}")`) })
            .click();
    }
    
    async selectFloor(floor) {
        await this.floorDropdown.click();
        await this.page
            .locator('input[type="radio"]')
            .filter({ has: this.page.locator(`span:text-is("${floor}")`) })
            .click();
    }
    
    async clearFilters() {
        await this.clearFilterBtn.waitFor({ state: 'visible' });
        await this.clearFilterBtn.click();
        await this.page.waitForTimeout(300);
    }

    

    async clickAddLocation() {
        await this.addLocationBtn.click();
    }

    async validateRowsContain(text) {
    const rows = this.tableRows;
    const count = await rows.count();

    if (count === 0) {
        throw new Error(`No rows found for: ${text}`);
    }

    for (let i = 0; i < count; i++) {
        const rowText = await rows.nth(i).textContent();
        
        // ข้าม row ที่ว่าง
        if (!rowText || rowText.trim() === '') continue;

        await expect(rows.nth(i)).toContainText(text);
    }
}
async clickKebabMenu(index = 0) {
    // hover row ก่อนโดยใช้ locator ตรงๆ
    await this.page.locator('tbody tr').nth(index).hover();
    await this.page.locator('button[title="เมนู"]').nth(index).waitFor({ state: 'visible' });
    await this.page.locator('button[title="เมนู"]').nth(index).click();
}

async clickDetail() {
    await this.page.locator('button:has-text("รายละเอียด")').first().click();
}

    async closeModal() {
        await this.modalCloseBtn.click();
    }
    

    // เพิ่ม methods
    async clickAddLocation() {
        await this.addLocationBtn.click();
        await this.modalAddTitle.waitFor({ state: 'visible' });
    }

    async selectExistingBuilding(name) {
        await this.radioBuildingExisting.check();
        await this.buildingSelect.selectOption({ label: name });
    }

    async createNewBuilding(name) {
        await this.radioBuildingNew.check();
        await this.newBuildingInput.waitFor({ state: 'visible' });
        await this.newBuildingInput.fill(name);
    }

    async createNewFloor(name) {
        await this.radioFloorNew.check();
        await this.newFloorInput.waitFor({ state: 'visible' });
        await this.newFloorInput.fill(name);
    }

    async fillRoomName(name) {
        await this.roomInput.fill(name);
    }

    async confirmAdd() {
        await this.confirmAddBtn.click();
    }

    /**
     * Function แก้ไข สถานที่
     */
    // เพิ่ม methods
    async clickEdit() {
        await this.page.locator('button:has-text("แก้ไข")').first().click();
        await this.editModalTitle.waitFor({ state: 'visible' });
    }

    async editBuilding(name) {
        await this.editBuildingInput.clear();
        await this.editBuildingInput.fill(name);
    }

    async editFloor(name) {
        await this.editFloorInput.clear();
        await this.editFloorInput.fill(name);
    }

    async editRoom(name) {
        await this.editRoomInput.clear();
        await this.editRoomInput.fill(name);
    }

    async saveEdit() {
        await this.saveEditBtn.click();
    }

    async confirmSwal() {
        await this.swalConfirmBtn.waitFor({ state: 'visible' });
        await this.swalConfirmBtn.click();
    }

    async clickDelete() {
        await this.page.locator('button:has-text("ลบ")').first().click();
        await this.swalConfirmBtn.waitFor({ state: 'visible' });
    }

    async confirmSwal() {
        await this.swalConfirmBtn.waitFor({ state: 'visible' });
        // รอให้ปุ่ม enabled ก่อนกด
        await this.swalConfirmBtn.waitFor({ state: 'attached' });
        await expect(this.swalConfirmBtn).toBeEnabled({ timeout: 5000 });
        await this.swalConfirmBtn.click();
    }
}
