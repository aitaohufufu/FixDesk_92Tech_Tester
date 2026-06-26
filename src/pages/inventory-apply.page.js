import { BasePage } from './base.page.js';
import { expect } from '../utils/base.js';

export class InventoryApplyPage extends BasePage {

    /**
     * @param {import('@playwright/test').Page} page 
     */
    constructor(page) {
        super(page);

        this.requisitionListMenu = page.locator('a[title="รายการเบิกของ"]');
        this.requisitionHistoryMenu = page.locator('a[title="ประวัติการเบิกของ"]');

        this.requisitionListTitle = page.getByRole('heading', { name: 'รายการเบิกของทั้งหมด' });
        this.requisitionHistoryTitle = page.getByRole('heading', { name: 'ประวัติการเบิกของทั้งหมด' });
        this.detailPageTitle = page.getByRole('heading', { name: 'รายละเอียดการขอเบิก' });

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
     * คลิกเมนู "รายการเบิกของ"
     */
    async clickRequisitionListMenu() {
        await this.requisitionListMenu.click();
    }

    /**
     * คลิกเมนู "ประวตัิการเบิกของ"
     */
    async clickRequisitionHistoryMenu() {
        await this.requisitionHistoryMenu.click();
    }

    /**
     * ตรวจสอบข้อมูลในตาราง
     */
    async checkRequisitionRow() {
        const rowCount = await this.visibleTableRows.count();
        expect(rowCount).toBeGreaterThan(0);

        const firstRowIdCell = this.visibleTableRows.first().locator('td').first();
        await expect(firstRowIdCell).toHaveText(/^SF/);
    }

    /**
     * คลิกปุ่ม "ดูรายละเอียด (i)"
     */
    async clickFirstRowDetailButton() {
        await expect(this.firstRowActionCellButton).toBeVisible();
        await this.firstRowActionCellButton.click();
    }

    /**
     * ตรวจสอบหน้าจอรายละเอียด
     */
    async checkRequistionDetail() {
        await expect(this.detailPageTitle).toBeVisible();

        await expect(this.requesterName).toHaveText(/.+/);
        await expect(this.departmentName).toHaveText(/.+/);
        await expect(this.repairNumber).toHaveText(/.+/);

        await expect(this.page.locator('span:has-text("รออนุมัติ")').first()).toBeVisible();
    }

    /**
     * อนุมัติทุกรายการ
     */
    async approveAllRequisitions() {
        await this.selectAllCheckbox.check();

        await expect(this.approveButton).toBeEnabled();
        await this.approveButton.click();

        await expect(this.confirmAllButton).toBeEnabled();
        await this.confirmAllButton.click();
    }

    /**
     * ไม่อนุมัติทุกรายการ
     */
    async rejectAllRequisitions() {
        await this.selectAllCheckbox.check();

        await expect(this.rejectButton).toBeEnabled();
        await this.rejectButton.click();

        await expect(this.confirmAllButton).toBeEnabled();
        await this.confirmAllButton.click();
    }

    /**
     * เลือกอนุมัติรายการของเบิก
     */
    async managePartialRequisitions() {
        const checkboxCount = await this.itemCheckboxes.count();

        for (let i = 0; i < checkboxCount; i++) {
            await this.itemCheckboxes.nth(i).check();

            if (i === 0) {
                await expect(this.approveButton).toBeEnabled();
                await this.approveButton.click();
            } else {
                await expect(this.rejectButton).toBeEnabled();
                await this.rejectButton.click();
            }
        }

        await expect(this.confirmAllButton).toBeEnabled();
        await this.confirmAllButton.click();
    }

    /**
     * คลิกปุ่ม "ยืนยัน"
     */
    async clickSubmitConfirm() {
        await expect(this.submitButton).toBeVisible();
        await this.submitButton.click();
    }

    /**
     * ตรวจสอบ URL หน้าจอประวัติการเบิกของ
     */
    async checkHistoryURL() {
        await expect(this.page).toHaveURL(/.*\/main\/stock-withdraw-history/);
    }
}