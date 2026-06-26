import { BasePage } from './base.page.js';
import { expect } from '../utils/base.js';

export class InventoryManagementPage extends BasePage {

    /**
     * @param {import('@playwright/test').Page} page 
     */
    constructor(page) {
        super(page);

        this.stockMenu = page.locator('a[title="จัดการคลังสินค้า"]');

        this.stockTitle = page.getByRole('heading', { name: 'รายการคลัง' });
        this.importExcelBtn = page.getByRole('button', { name: 'Import Excel' });
        this.addItemBtn = page.getByRole('button', { name: 'เพิ่มรายการ' });

        this.cardTotalItems = page.locator('div.grid > div').filter({ hasText: 'รายการของทั้งหมด' });
        this.cardWithdrawRequests = page.locator('div.grid > div').filter({ hasText: 'คำขอเบิกของ' });
        this.cardPendingApprovals = page.locator('div.grid > div').filter({ hasText: 'คำขอรออนุมัติ' });
        this.cardLowStock = page.locator('div.grid > div').filter({ hasText: 'ของใกล้หมด' });

        this.searchInput = page.getByPlaceholder('ค้นหารายการของ');
        this.statusFilterBtn = page.getByRole('button', { name: 'สถานะ' });
        this.categoryFilterBtn = page.getByRole('button', { name: 'หมวดหมู่' });

        this.stockTable = page.locator('table');
        this.tableRows = page.locator('table tbody tr');

        this.modalTitle = page.getByRole('heading', { name: 'เพิ่มรายการของ' });
        this.itemNameInput = page.getByPlaceholder('กรุณากรอกชื่อรายการ');
        this.equipmentNumInput = page.getByPlaceholder('กรุณากรอกเลขครุภัณฑ์');

        this.categorySelect = page.locator('xpath=//label[contains(normalize-space(.), "หมวดหมู่")]/following-sibling::select');
        this.statusSelect = page.locator('xpath=//label[contains(normalize-space(.), "สถานะ")]/following-sibling::select');

        this.quantityInput = page.getByPlaceholder('กรุณากรอกจำนวน');
        this.unitInput = page.getByPlaceholder('กรุณากรอกหน่วยนับ');
        this.imageFileInput = page.locator('input#dropzone-file');

        this.saveBtn = page.getByRole('button', { name: 'บันทึก' });
        this.cancelBtn = page.getByRole('button', { name: 'ยกเลิก', exact: true });
    }

    /**
     * กรอกฟอร์มเพิ่มรายการสินค้าในคลัง
     * @param {Object} data ข้อมูลสินค้า
     * @param {string} data.name ชื่อรายการ
     * @param {string} [data.equipmentNum] หมายเลขครุภัณฑ์ (ถ้ามี)
     * @param {string} data.category ตัวเลือกหมวดหมู่
     * @param {number} data.quantity จำนวนสินค้า
     * @param {string} data.unit หน่วยนับ
     * @param {'พร้อมใช้งาน' | 'ไม่พร้อมใช้งาน'} data.status สถานะการใช้งาน
     */
    async fillAddItemForm(data) {
        if (data.name) await this.itemNameInput.fill(data.name);
        if (data.equipmentNum) await this.equipmentNumInput.fill(data.equipmentNum);

        if (data.category) {
            await expect(this.categorySelect.locator('option').nth(1)).toBeAttached({ timeout: 5000 });
            await this.categorySelect.selectOption({ label: data.category });
        }

        if (data.unit) await this.unitInput.fill(data.unit);

        if (data.status) {
            await expect(this.statusSelect.locator('option').nth(1)).toBeAttached({ timeout: 5000 });
            await this.statusSelect.selectOption({ label: data.status });
        }
    }

    /**
     * ดึงตัวเลือกทั้งหมดใน Dropdown
     */
    async logCategoryOptions() {
        await this.categorySelect.waitFor({ state: 'attached', timeout: 5000 });

        const options = await this.categorySelect.locator('option').evaluateAll(elements => {
            return elements.map(el => ({
                text: el.textContent.trim(),
                value: el.value 
            }));
        });

        console.log('\n========================================');
        console.log('📋 รายการตัวเลือกใน Dropdown "หมวดหมู่":');
        console.table(options);
        console.log('========================================\n');
    }

    /**
     * คลิกเมนู "จัดการคลัง"
     */
    async clickStockManagementMenu() {
        await this.stockMenu.click();
    }

    /**
     * ค้นหารายการสินค้าในคลัง
     * @param {string} keyword 
     */
    async searchStockItem(keyword) {
        await this.searchInput.fill(keyword);
        await this.page.waitForTimeout(500);
    }

    /**
     * ดึงข้อมูลแถวของสินค้าจากชื่อรายการ
     * @param {string} itemName 
     */
    getRowByItemName(itemName) {
        return this.tableRows.filter({
            has: this.page.locator('td').nth(1).filter({ hasText: itemName })
        });
    }

    /**
     * คลิกปุ่มเมนูสัญลักษณ์สามจุด (Kebab Menu) ของแถวสินค้าที่ต้องการ
     * @param {string} itemName 
     */
    async clickActionMenuOfItem(itemName) {
        const row = this.getRowByItemName(itemName);
        await row.locator('button[title="เมนู"]').click();
    }
}