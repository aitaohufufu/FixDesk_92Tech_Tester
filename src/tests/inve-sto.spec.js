import { test, expect } from '../utils/base.js';
import { sendTestReport } from '../utils/reportHelper.js';
import { validUsers } from '../test-data/users.js';

async function gotoStock(loginPage, inventoryManagementPage, username, password, role) {
    await inventoryManagementPage.gotoHome(loginPage, username, password, role);
    await inventoryManagementPage.clickStockManagementMenu();
    await expect(inventoryManagementPage.stockTitle).toBeVisible();
}

test.describe('Inventory Management - Stock Management [05: failed, 06: disabled]', () => {

    test.afterEach(async ({ page, request }, testInfo) => {
        await sendTestReport(page, request, testInfo, 'INVE-STO');
    });

    // =========================================================================
    // Page Case
    // =========================================================================

    test(`INVE-STO-01 เข้าสู่หน้าจอ “รายการคลัง" ของผู้ดูแลคลัง`, async ({ loginPage, inventoryManagementPage }) => {
        const user = validUsers[3];
        await gotoStock(loginPage, inventoryManagementPage, user.username, user.password, user.role);

        await expect(inventoryManagementPage.stockTitle).toBeVisible();
        await expect(inventoryManagementPage.addItemBtn).toBeVisible();
    });

    test(`INVE-STO-02 แสดงผล Card จำนวนสรุปผลของรายการคลัง`, async ({ loginPage, inventoryManagementPage }) => {
        const user = validUsers[3];
        await gotoStock(loginPage, inventoryManagementPage, user.username, user.password, user.role);

        await expect(inventoryManagementPage.cardTotalItems).toContainText(/\d+ รายการ/);
        await expect(inventoryManagementPage.cardWithdrawRequests).toContainText(/\d+ รายการ/);
        await expect(inventoryManagementPage.cardPendingApprovals).toContainText(/\d+ รายการ/);
        await expect(inventoryManagementPage.cardLowStock).toContainText(/\d+ รายการ/);
    });

    test(`INVE-STO-03 แสดงผลตารางรายการคลัง`, async ({ loginPage, inventoryManagementPage }) => {
        const user = validUsers[3];
        await gotoStock(loginPage, inventoryManagementPage, user.username, user.password, user.role);

        await expect(inventoryManagementPage.stockTable).toBeVisible();

        const dynamicRow = inventoryManagementPage.tableRows.first();
        await expect(dynamicRow).toBeVisible();

        await expect(dynamicRow.locator('td').nth(6))
            .toHaveText(/(สินค้าหมด|ใกล้หมด|พร้อมใช้งาน)/);

        const actionButton = dynamicRow.locator('button[title="เมนู"]');
        await expect(actionButton).toBeVisible();
    });

    // =========================================================================
    // Functional Case
    // =========================================================================

    test(`INVE-STO-04 เพื่มรายการวัสดุ/อุปกรณ์ (กรณีไม่ซ้ำกับของเดิม)`, async ({ loginPage, inventoryManagementPage }) => {
        const user = validUsers[3];
        await gotoStock(loginPage, inventoryManagementPage, user.username, user.password, user.role);

        await inventoryManagementPage.addItemBtn.click();
        await expect(inventoryManagementPage.modalTitle).toBeVisible();

        await inventoryManagementPage.fillAddItemForm({
            name: 'คีย์บอร์ดบลูทูธ',
            equipmentNum: 'KEY-999',
            category: 'IT',
            // quantity: 10,
            unit: 'อัน',
            status: 'พร้อมใช้งาน'
        });

        await inventoryManagementPage.saveBtn.click();

        await expect(inventoryManagementPage.modalTitle).not.toBeVisible({ timeout: 7000 });
    });

    test.skip(`INVE-STO-05 เพื่มรายการวัสดุ/อุปกรณ์ (กรณีซ้ำกับของเดิม)`, async ({ loginPage, inventoryManagementPage, page }) => {

    });

    test.skip(`INVE-STO-06 เพื่มรายการวัสดุ/อุปกรณ์ด้วยไฟล์ Excel`, async ({ loginPage, inventoryManagementPage, page }) => {

    });

    test(`INVE-STO-07 แก้ไขรายการวัสดุ/อุปกรณ์`, async ({ loginPage, inventoryManagementPage, page }) => {
        const user = validUsers[3];
        await gotoStock(loginPage, inventoryManagementPage, user.username, user.password, user.role);

        const firstRow = inventoryManagementPage.tableRows.first();
        await expect(firstRow).toBeVisible({ timeout: 10000 });

        const firstItemName = await firstRow.locator('td').nth(1).innerText();
        const currentStatusText = await firstRow.locator('td').nth(6).innerText();
        const currentStatus = currentStatusText.trim();

        const newStatus = (currentStatus === 'พร้อมใช้งาน') ? 'ไม่พร้อมใช้งาน' : 'พร้อมใช้งาน';

        console.log(`กำลังแก้ไขรายการ: ${firstItemName}`);
        console.log(`เปลี่ยนสถานะ: [${currentStatus}]  -->  [${newStatus}]`);

        await firstRow.locator('button[title="เมนู"]').click();

        await page.getByRole('button', { name: 'แก้ไข' }).filter({ visible: true }).first().click();

        await expect(inventoryManagementPage.saveBtn).toBeVisible();

        await inventoryManagementPage.fillAddItemForm({
            status: newStatus
        });

        await inventoryManagementPage.saveBtn.click();

        await expect(inventoryManagementPage.saveBtn).not.toBeVisible({ timeout: 7000 });
    });

    test.skip(`INVE-STO-08 ลบรายการวัสดุ/อุปกรณ์ (รายการแรกของตาราง)`, async ({ loginPage, inventoryManagementPage, page }) => {

    });

});