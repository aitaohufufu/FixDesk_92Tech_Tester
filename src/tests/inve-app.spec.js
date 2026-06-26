import { test, expect } from '../utils/base.js';
import { sendTestReport } from '../utils/reportHelper.js';
import { validUsers } from '../test-data/users.js';

async function gotoRequisition(loginPage, inventoryApplyPage, username, password, role) {
    await inventoryApplyPage.gotoHome(loginPage, username, password, role);
    await inventoryApplyPage.clickRequisitionListMenu();
    await expect(inventoryApplyPage.requisitionListTitle).toBeVisible();
}

async function gotoRequisitionHistory(loginPage, inventoryApplyPage, username, password, role) {
    await inventoryApplyPage.gotoHome(loginPage, username, password, role);
    await inventoryApplyPage.clickRequisitionHistoryMenu();
    await expect(inventoryApplyPage.requisitionHistoryTitle).toBeVisible();
}

test.describe('Inventory Management - Requisition Approvement', () => {

    test.afterEach(async ({ page, request }, testInfo) => {
        await sendTestReport(page, request, testInfo, 'INVE-APP');
    });

    // =========================================================================
    // Page Case
    // =========================================================================

    test(`INVE-APP-01 เข้าสู่หน้าจอ “รายการเบิกของ" ด้วยบัญชีผู้ดูแลคลัง`, async ({ loginPage, inventoryApplyPage }) => {
        const user = validUsers[3];
        await gotoRequisition(loginPage, inventoryApplyPage, user.username, user.password, user.role);

    });

    test(`INVE-APP-02 แสดงผลรายการเบิกของ`, async ({ loginPage, inventoryApplyPage }) => {
        const user = validUsers[3];
        await gotoRequisition(loginPage, inventoryApplyPage, user.username, user.password, user.role);

        await inventoryApplyPage.checkRequisitionRow();
    });

    // =========================================================================
    // Functional Case
    // =========================================================================

    test(`INVE-APP-03 ดูรายละเอียดการเบิกของ`, async ({ loginPage, inventoryApplyPage }) => {
        const user = validUsers[3];
        await gotoRequisition(loginPage, inventoryApplyPage, user.username, user.password, user.role);

        await inventoryApplyPage.clickFirstRowDetailButton();

        await inventoryApplyPage.checkRequistionDetail();
    });

    test(`INVE-APP-04 อนุมัติการเบิกของ (กรณีอนุมัติทั้งหมด)`, async ({ loginPage, inventoryApplyPage }) => {
        const user = validUsers[3];
        await gotoRequisition(loginPage, inventoryApplyPage, user.username, user.password, user.role);

        await inventoryApplyPage.clickFirstRowDetailButton();
        await inventoryApplyPage.approveAllRequisitions();
        await inventoryApplyPage.clickSubmitConfirm();

        await inventoryApplyPage.checkHistoryURL();
    });

    test(`INVE-APP-05 อนุมัติการเบิกของ (กรณีไม่อนุมัติทั้งหมด)`, async ({ loginPage, inventoryApplyPage }) => {
        const user = validUsers[3];
        await gotoRequisition(loginPage, inventoryApplyPage, user.username, user.password, user.role);

        await inventoryApplyPage.clickFirstRowDetailButton();
        await inventoryApplyPage.rejectAllRequisitions();
        await inventoryApplyPage.clickSubmitConfirm();

        await inventoryApplyPage.checkHistoryURL();
    });

    test(`INVE-APP-06 อนุมัติการเบิกของ (กรณีอนุมัติ และไม่อนุมัติบางรายการ)`, async ({ loginPage, inventoryApplyPage }) => {
        const user = validUsers[3];
        await gotoRequisition(loginPage, inventoryApplyPage, user.username, user.password, user.role);

        await inventoryApplyPage.clickFirstRowDetailButton();
        await inventoryApplyPage.managePartialRequisitions();
        await inventoryApplyPage.clickSubmitConfirm();

        await inventoryApplyPage.checkHistoryURL();
    });

    test(`INVE-APP-07 ตรวจสอบประวัติรายการเบิกของ`, async ({ loginPage, inventoryApplyPage }) => {
        const user = validUsers[3];
        await gotoRequisitionHistory(loginPage, inventoryApplyPage, user.username, user.password, user.role);

        await inventoryApplyPage.checkRequisitionRow();
    });

    test(`INVE-APP-08 ทดสอบการเบิกซ้ำรายการที่มีผลอนุมัติเสร็จสิ้นแล้ว`, async ({ loginPage, inventoryApplyPage }) => {
        const user = validUsers[3];
        await goto(loginPage, inventoryApplyPage, user.username, user.password, user.role);

    });
});