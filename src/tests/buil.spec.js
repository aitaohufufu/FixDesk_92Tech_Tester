import { test, expect } from '../utils/base.js';
import { sendTestReport } from '../utils/reportHelper.js';
import { fillUserNamePassword } from '../utils/authHelper.js';
import { validUsers } from '../test-data/users.js';
import * as path from 'path';

async function gotoBuilding(loginPage, buildingPage, username, password) {
    await fillUserNamePassword(loginPage, username, password);
    await loginPage.clickSignIn();

    await loginPage.page.waitForURL(/#\/main\/.+-home/);

    await expect(loginPage.mainTitle).toBeVisible();

    await Promise.all([
        buildingPage.page.waitForURL(/#\/main\/admin-manage-location/),
        buildingPage.clickBuildingMenu()
    ]);
}

test.describe('Building', () => {
    test.afterEach(async ({ page, request }, testInfo) => {
        await sendTestReport(page, request, testInfo, 'BUIL');

    });
    test('BUIL-01 เข้าสู่หน้าจอ Building', async ({ loginPage, buildingPage }) => {
        const adminUser = validUsers[0];
    
        await gotoBuilding(loginPage, buildingPage, adminUser.username, adminUser.password);
    
        await expect(buildingPage.page).toHaveURL(/#\/main\/admin-manage-location/);
    });

    test('BUIL-02 แสดงผลรายการข้อมูลสถานที่ในระบบ', async ({ loginPage, buildingPage }) => {
        const adminUser = validUsers[0];
    
        await gotoBuilding(loginPage, buildingPage, adminUser.username, adminUser.password);
    
        const rows = buildingPage.page.locator('table tbody tr');
    
        // รอข้อมูลโหลด
        await expect(rows.first()).toBeVisible();
    
        const count = await rows.count();
        expect(count).toBeGreaterThan(0);
    });

    test('BUIL-03 ค้นหาสถานที่แบบ Search', async ({ loginPage, buildingPage }) => {
    
        const adminUser = validUsers[0];
    
        await gotoBuilding(loginPage, buildingPage, adminUser.username, adminUser.password);
    
        // Search
        await buildingPage.searchLocation('กองช่าง');
        await expect(buildingPage.tableRows.first()).toBeVisible();
        await buildingPage.validateRowsContain('กองช่าง');
    
        // Clear
        await buildingPage.clearFilters();
        await expect(buildingPage.tableRows.first()).toBeVisible();
    });
    
    test('BUIL-04 ดูรายละเอียดของสถานที่', async ({ loginPage, buildingPage }) => {
        const adminUser = validUsers[0];
    
        await gotoBuilding(loginPage, buildingPage, adminUser.username, adminUser.password);
    
        await buildingPage.clickKebabMenu(0);
        await buildingPage.clickDetail();
    
        // Assert: Modal แสดงขึ้นมา
        await expect(buildingPage.modalTitle).toBeVisible();
    
        // Assert: เช็คใน Modal โดยตรง
        const modal = buildingPage.page.locator('.bg-white.rounded-lg').filter({ has: buildingPage.page.locator('h2:has-text("รายละเอียดห้อง")') });
        await expect(modal.locator('text=อาคาร').first()).toBeVisible();
        await expect(modal.locator('text=ชั้น').first()).toBeVisible();
    
        // ปิด Modal
        await buildingPage.closeModal();
        await expect(buildingPage.modalTitle).not.toBeVisible();
    });

    test('BUIL-05 เพิ่มสถานที่ใหม่ (กรณีสถานที่ไม่ซ้ำกัน)', async ({ loginPage, buildingPage }) => {
        const adminUser = validUsers[0];
    
        await gotoBuilding(loginPage, buildingPage, adminUser.username, adminUser.password);
    
        // Step 6: คลิกปุ่ม "+ เพิ่มสถานที่"
        await buildingPage.clickAddLocation();
        await expect(buildingPage.modalAddTitle).toBeVisible();
    
        // Step 6.1: สร้างอาคารใหม่
        await buildingPage.createNewBuilding('ทดสอบการเพิ่มอาคารใหม่');
    
        // Step 6.2: สร้างชั้นใหม่
        await buildingPage.createNewFloor('1');
    
        // Step 6.3: กรอกชื่อห้อง
        await buildingPage.fillRoomName('ทดสอบการเพิ่มชื่อห้องใหม่');
    
        // Step 7: กดปุ่ม "เพิ่มสถานที่"
        await buildingPage.confirmAdd();
    
        // Assert: Modal ปิด = เพิ่มสำเร็จ
        await expect(buildingPage.modalAddTitle).not.toBeVisible();

        // Assert: ตารางมีข้อมูล (ไม่ต้องหาชื่อห้องเฉพาะเจาะจง)
        await expect(buildingPage.tableRows.first()).toBeVisible();
      
    });

    test('BUIL-06 เพิ่มสถานที่ใหม่ (กรณีสถานที่ซ้ำกัน)', async ({ loginPage, buildingPage }) => {
        const adminUser = validUsers[0];
    
        await gotoBuilding(loginPage, buildingPage, adminUser.username, adminUser.password);
    
        // เปิด Modal เพิ่มสถานที่
        await buildingPage.clickAddLocation();
        await expect(buildingPage.modalAddTitle).toBeVisible();
    
        // กรอกข้อมูลที่มีอยู่แล้วในระบบ
        await buildingPage.createNewBuilding('ทดสอบชื่ออาคารใหม่');
        await buildingPage.createNewFloor('1');
        await buildingPage.fillRoomName('ทดสอบชื่อห้องใหม่');
    
        // กดเพิ่มสถานที่
        await buildingPage.confirmAdd();
    
        // Assert: แสดงข้อความแจ้งเตือน
        await expect(
            buildingPage.page.getByText('ชื่ออาคารนี้มีอยู่แล้ว')
        ).toBeVisible();
    });


    test('BUIL-07 เพิ่มสถานที่ด้วยการนำเข้าไฟล์ .xlsx (กรณีชื่อสถานที่ไม่ซ้ำกัน)', async ({ loginPage, buildingPage }) => {
        const adminUser = validUsers[0];
    
        await gotoBuilding(loginPage, buildingPage, adminUser.username, adminUser.password);
    
        // Step 6: คลิกปุ่ม Import Excel
        await buildingPage.page.locator('button:has-text("Import Excel")').click();
    
        // Assert: Modal เปิด
        await expect(
            buildingPage.page.locator('h2:has-text("นำเข้าข้อมูลสถานที่")')
        ).toBeVisible();
    
        // Step 6.1: Upload ไฟล์ .xlsx
        const filePath = path.resolve('src/test-data/Template_Location_Import_Test.xlsx');
        await buildingPage.page
            .locator('input[type="file"][accept=".xlsx"]')
            .setInputFiles(filePath);
    
        // รอ step 2 โหลด (แสดงรายการให้เลือก)
        await expect(
            buildingPage.page.locator('text=ขั้นตอนที่ 2')
        ).toBeVisible({ timeout: 10000 });
    
        // Step 6.2: คลิกเลือกทั้งหมด
        await buildingPage.page.locator('input[type="checkbox"]').first().check();
    
        // Step 6.2.1: คลิกปุ่ม "นำเข้าข้อมูลสถานที่ที่เลือก"
        await buildingPage.page
        .locator('button.bg-green-500:has-text("Import")')
        .click();
    
        // Assert: Modal ปิด = นำเข้าสำเร็จ
        await expect(
            buildingPage.page.locator('h2:has-text("นำเข้าข้อมูลสถานที่")')
        ).not.toBeVisible({ timeout: 10000 });
    
        // Assert: ค้นหาห้องที่นำเข้า
        await buildingPage.searchLocation('ห้องพักรวม');
        await expect(
            buildingPage.page.locator('table').getByText('ห้องพักรวม')
        ).toBeVisible();
    });

    test('BUIL-08 แก้ไขข้อมูลสถานที่ (กรณีชื่อสถานที่ไม่ซ้ำกัน)', async ({ loginPage, buildingPage }) => {
        const adminUser = validUsers[0];
    
        await gotoBuilding(loginPage, buildingPage, adminUser.username, adminUser.password);
    
        // Step 5.2: คลิก Kebab Menu row แรก
        await buildingPage.clickKebabMenu(0);
    
        // Step 5.3: คลิก "แก้ไข"
        await buildingPage.clickEdit();
        await expect(buildingPage.editModalTitle).toBeVisible();
    
        // Step 6: แก้ไขข้อมูล
        await buildingPage.editBuilding('อาคารทดสอบแก้ไข 1');
        await buildingPage.editRoom('ห้องทดสอบแก้ไข 1');
    
        // Step 7: บันทึก
        await buildingPage.saveEdit();

        // Step 7.1: กด "ยืนยัน" ใน SweetAlert
        await buildingPage.confirmSwal();

        // Assert: Modal ปิด
        await expect(buildingPage.editModalTitle).not.toBeVisible();

    });
    
    test('BUIL-09 แก้ไขข้อมูลสถานที่ (กรณีชื่อสถานที่ซ้ำกัน)', async ({ loginPage, buildingPage }) => {
        const adminUser = validUsers[0];
    
        await gotoBuilding(loginPage, buildingPage, adminUser.username, adminUser.password);
    
        await buildingPage.clickKebabMenu(0);
        await buildingPage.clickEdit();
        await expect(buildingPage.editModalTitle).toBeVisible();
    
        // แก้ไขเป็นชื่อที่มีอยู่แล้วในระบบ
        await buildingPage.editBuilding('อาคารกองช่าง');
        await buildingPage.editFloor('2');
        await buildingPage.editRoom('ทดสอบชื่อห้องใหม่');
    
        // Step 7: บันทึก
        await buildingPage.saveEdit();

        // Step 7.1: กด "ยืนยัน" ใน SweetAlert
        await buildingPage.confirmSwal();

        // Assert: แสดงข้อความแจ้งเตือน
        await expect(
            buildingPage.page.getByText('ชื่ออาคารนี้มีอยู่แล้ว')
        ).toBeVisible();
    });

    test('BUIL-10 ลบข้อมูลสถานที่ (กรณีไม่มีรายการแจ้งซ่อมใช้งานอยู่)', async ({ loginPage, buildingPage }) => {
        const adminUser = validUsers[0];
    
        await gotoBuilding(loginPage, buildingPage, adminUser.username, adminUser.password);
    
        // ค้นหาห้องที่สร้างจาก BUIL-05 เพื่อลบ
        await buildingPage.searchLocation('ห้องทำงาน 401');
        await expect(buildingPage.tableRows.first()).toBeVisible();
    
        // คลิก Kebab Menu แล้วกด "ลบ"
        await buildingPage.clickKebabMenu(0);
        await buildingPage.clickDelete();
    
        // Assert: SweetAlert แสดง "ยืนยันการลบข้อมูล?"
        await expect(buildingPage.swalTitle).toHaveText('ยืนยันการลบข้อมูล?');
    
        // กด "ยืนยันการลบ"
        await buildingPage.confirmSwal();
    

    });
    
    test('BUIL-11 ลบข้อมูลสถานที่ (กรณีมีรายการแจ้งซ่อมใช้งานอยู่)', async ({ loginPage, buildingPage }) => {
        const adminUser = validUsers[0];
    
        await gotoBuilding(loginPage, buildingPage, adminUser.username, adminUser.password);
    
        // ค้นหาห้องที่มีรายการแจ้งซ่อมอยู่
        await buildingPage.searchLocation('ห้อง B');
        await expect(buildingPage.tableRows.first()).toBeVisible();
    
        // คลิก Kebab Menu แล้วกด "ลบ"
        await buildingPage.clickKebabMenu(0);
        await buildingPage.clickDelete();
    
        // กด "ยืนยันการลบ"
        await buildingPage.confirmSwal();
    
        // Assert: SweetAlert แสดง "ไม่สามารถลบได้"
        await expect(buildingPage.swalTitle).toHaveText('ไม่สามารถลบได้');
    
      
    });
    
    test('BUIL-12 ยกเลิกการแก้ไขข้อมูลสถานที่', async ({ loginPage, buildingPage }) => {
        const adminUser = validUsers[0];
    
        await gotoBuilding(loginPage, buildingPage, adminUser.username, adminUser.password);
    
        // คลิก Kebab Menu แล้วกด "แก้ไข"
        await buildingPage.clickKebabMenu(0);
        await buildingPage.clickEdit();
        await expect(buildingPage.editModalTitle).toBeVisible();
    
        // แก้ไขข้อมูล
        await buildingPage.editBuilding('อาคารทดสอบยกเลิก');
        await buildingPage.editRoom('ห้องทดสอบยกเลิก');
    
        // กดบันทึก
        await buildingPage.saveEdit();
    
        // SweetAlert ขึ้นมา — กด "ยกเลิก" แทน "ยืนยัน"
        await buildingPage.swalCancelBtn.waitFor({ state: 'visible' });
        await buildingPage.swalCancelBtn.click();
    
        // Assert: SweetAlert ปิด แต่ Modal แก้ไขยังอยู่
        await expect(buildingPage.editModalTitle).toBeVisible();
    
        // Assert: ข้อมูลใน input ยังเป็นค่าที่แก้ไขไว้ (ยังไม่ถูกบันทึก)
        await expect(buildingPage.editRoomInput).toHaveValue('ห้องทดสอบยกเลิก');
    });

});

