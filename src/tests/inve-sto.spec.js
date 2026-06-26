import { test, expect } from '../utils/base.js';
import { sendTestReport } from '../utils/reportHelper.js';
import { validUsers } from '../test-data/users.js';

async function gotoStock(loginPage, inventoryManagementPage, username, password, role) {
    await inventoryManagementPage.gotoHome(loginPage, username, password, role);
    await inventoryManagementPage.clickStockManagementMenu();
    await expect(inventoryManagementPage.stockTitle).toBeVisible();
}

test.describe('Inventory Management - Stock Management', () => {

    test.afterEach(async ({ page, request }, testInfo) => {
        await sendTestReport(page, request, testInfo, 'INVE-STO');
    });

    // =========================================================================
    // Page Case
    // =========================================================================

    test(`INVE-STO-01 เข้าสู่หน้าจอ “รายการคลัง" ของผู้ดูแลคลัง`, async ({ loginPage, inventoryManagementPage }) => {
        const user = validUsers[3];
        await gotoStock(loginPage, inventoryManagementPage, user.username, user.password, user.role);

    });



    // =========================================================================
    // Functional Case
    // =========================================================================

    

});