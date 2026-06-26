import { BasePage } from './base.page.js';

export class InventoryManagementPage extends BasePage {

    /**
     * @param {import('@playwright/test').Page} page 
     */
    constructor(page) {
        super(page);

        this.stockMenu = page.locator('a[title="จัดการคลังสินค้า"]');

        this.stockTitle = page.getByRole('heading', { name: 'รายการคลัง' });

        this.requesterName = page.locator('p:has-text("ผู้ทำรายการ") + p');
        this.departmentName = page.locator('p:has-text("หน่วยงาน") + p');
        this.repairNumber = page.locator('p:has-text("หมายเลขแจ้งซ่อม") + p');
        this.progressText = page.locator('p:has-text("จำนวนรายการที่ตรวจสอบแล้ว") + p');

        this.visibleTableRows = page.locator('table tbody tr').filter({ has: page.locator('span:not(.invisible)') });

        this.selectAllCheckbox = page.locator('label:has-text("เลือกทั้งหมด") input[type="checkbox"]');
        this.itemCheckboxes = page.locator('div.items-stretch input[type="checkbox"]');

        this.firstRowActionCellButton = this.visibleTableRows.first().locator('td').last().locator('button');
        this.approveButton = page.getByRole('button', { name: 'อนุมัติ', exact: true });
        this.rejectButton = page.getByRole('button', { name: 'ไม่อนุมัติ', exact: true });
        this.confirmAllButton = page.getByRole('button', { name: 'ยืนยันการทำรายการทั้งหมด' });
        this.submitButton = page.getByRole('button', { name: 'ยืนยัน' });
    }

    /**
     * คลิกเมนู "จัดการคลัง"
     */
    async clickStockManagementMenu() {
        await this.stockMenu.click();
    }

}