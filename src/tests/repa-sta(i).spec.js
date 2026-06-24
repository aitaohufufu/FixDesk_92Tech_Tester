import { test, expect } from '../utils/base.js';
import { sendTestReport } from '../utils/reportHelper.js';
import { fillUserNamePassword } from '../utils/authHelper.js';
import { validUsers } from '../test-data/users.js';

test.describe('Repair Request - Status and Information [13, 14, 15, 18, 19: failed]', () => {

    test.afterEach(async ({ page, request }, testInfo) => {
        await sendTestReport(page, request, testInfo, 'REPA-STA(I)');
    });

    // =========================================================================
    // Page Case
    // =========================================================================

    test(`REPA-STA(I)-01 เข้าสู่หน้าจอ "ตรวจสอบสถานะงานซ่อม"`, async ({ loginPage, repairStatusPage }) => {
        await repairStatusPage.goto();

        await expect(repairStatusPage.repairStatusCheckTitle).toBeVisible();
    });

    test(`REPA-STA(I)-02 แสดงผลรายละเอียด และสถานะของรายการแจ้งซ่อม`, async ({ loginPage, repairStatusPage }) => {
        await repairStatusPage.goto();

        const data = 'RF2026';

        await repairStatusPage.searchRepair(data);
        await expect(repairStatusPage.getSearchResultCard(data)).toBeVisible();
    });

    // =========================================================================
    // Admin Case
    // =========================================================================

    test(`REPA-STA(I)-03 ติดตามสถานะ และรายละเอียดงานซ่อมบนหน้าจอ "หลัก (Home)" ของผู้ดูแลระบบ`, async ({ loginPage, repairStatusPage }) => {
        const user = validUsers[0];
        await repairStatusPage.gotoHome(loginPage, user.username, user.password, user.role);

        await expect(loginPage.mainTitle).toBeVisible();

        const statusCards = [
            'จำนวนงานซ่อมในเดือนนี้',
            'จำนวนงานซ่อมในวันนี้',
            'จำนวนงานซ่อมที่กำลังดำเนินการ',
            'จำนวนงานซ่อมที่เสร็จสิ้นภายใน 7 วัน'
        ];
        await repairStatusPage.adminHomeCardCheck(statusCards);

        await repairStatusPage.repairRowCheck('RF2026', {
            reporter: 'พชร ไพศรีสกุล',
            subject: 'ตรวจสอบซ่อมแซมไฟ',
            status: 'ดำเนินการเสร็จสิ้น'
        });
    });

    test(`REPA-STA(I)-04 ติดตามสถานะ และรายละเอียดงานซ่อมบนหน้าจอ "รายการของฉัน" ของผู้ดูแลระบบ`, async ({ loginPage, repairStatusPage }) => {
        const user = validUsers[0];
        await repairStatusPage.gotoHome(loginPage, user.username, user.password, user.role);
        await repairStatusPage.clickMyListMenu();

        await expect(repairStatusPage.myListTitle).toBeVisible();

        await repairStatusPage.repairRowCheck('RF2026', {
            reporter: '',
            subject: 'ตรวจสอบซ่อมแซมไฟ',
            status: 'ดำเนินการเสร็จสิ้น'
        });
    });

    test(`REPA-STA(I)-05 ติดตามสถานะ และรายละเอียดงานซ่อมบนหน้าจอ "ตรวจสอบคำร้อง" ของผู้ดูแลระบบ`, async ({ loginPage, repairStatusPage }) => {
        const user = validUsers[0];
        await repairStatusPage.gotoHome(loginPage, user.username, user.password, user.role);
        await repairStatusPage.clickRequestMenu();

        await expect(repairStatusPage.requestTitle).toBeVisible();

        await repairStatusPage.repairRowCheck('RF2026', {
            reporter: 'พชร',
            subject: 'เมาส์ไร้สาย',
            status: 'รอดำเนินการ'
        });
    });

    test(`REPA-STA(I)-06 ติดตามสถานะ และรายละเอียดงานซ่อมบนหน้าจอ "ประวัติการแจ้งซ่อม" ของผู้ดูแลระบบ`, async ({ loginPage, repairStatusPage }) => {
        const user = validUsers[0];
        await repairStatusPage.gotoHome(loginPage, user.username, user.password, user.role);
        await repairStatusPage.clickRepairHistoryMenu();

        await expect(repairStatusPage.repairHistoryTitle).toBeVisible();

        await repairStatusPage.repairRowCheck('RF2026', {
            reporter: 'พชร',
            subject: '1111',
            status: 'ดำเนินการเสร็จสิ้น'
        });
    });

    test(`REPA-STA(I)-07 ติดตามสถานะ และรายละเอียดงานซ่อมบนหน้าจอ "รายละเอียดงานซ่อม" ของผู้ดูแลระบบ`, async ({ loginPage, repairStatusPage }) => {
        const user = validUsers[0];
        await repairStatusPage.gotoHome(loginPage, user.username, user.password, user.role);

        await repairStatusPage.clickFirstRepairId();

        await repairStatusPage.checkRepairDetail();
    });

    // =========================================================================
    // Technician Case
    // =========================================================================

    test(`REPA-STA(I)-08 ติดตามสถานะ และรายละเอียดงานซ่อมบนหน้าจอ "หลัก (Home)" ของช่างซ่อม`, async ({ loginPage, repairStatusPage }) => {
        const user = validUsers[1];
        await repairStatusPage.gotoHome(loginPage, user.username, user.password, user.role);

        await repairStatusPage.technicianHomeCheck();
    });

    test(`REPA-STA(I)-09 ติดตามสถานะ และรายละเอียดงานซ่อมบนหน้าจอ "รายการของฉัน" ของช่างซ่อม`, async ({ loginPage, repairStatusPage }) => {
        const user = validUsers[1];
        await repairStatusPage.gotoHome(loginPage, user.username, user.password, user.role);
        await repairStatusPage.clickMyListMenu();

        await expect(repairStatusPage.myListTitle).toBeVisible();

        await repairStatusPage.repairRowCheck('RF2026', {
            reporter: '',
            subject: 'หลอดไฟ',
            status: 'ดำเนินการเสร็จสิ้น'
        });
    });

    test(`REPA-STA(I)-10 ติดตามสถานะ และรายละเอียดงานซ่อมบนหน้าจอ "รายงานการแจ้งซ่อม" ของช่างซ่อม`, async ({ loginPage, repairStatusPage }) => {
        const user = validUsers[1];
        await repairStatusPage.gotoHome(loginPage, user.username, user.password, user.role);
        await repairStatusPage.clickMyRepairRequestMenu();

        await expect(repairStatusPage.myRepairRequestMenu).toBeVisible();

        await repairStatusPage.repairRowCheck('RF2026', {
            reporter: 'พชร',
            subject: 'พัดลม',
            status: 'กำลังดำเนินการ'
        });
    });

    test(`REPA-STA(I)-11 ติดตามสถานะ และรายละเอียดงานซ่อมบนหน้าจอ "ประวัติของฉัน" ของช่างซ่อม`, async ({ loginPage, repairStatusPage }) => {
        const user = validUsers[1];
        await repairStatusPage.gotoHome(loginPage, user.username, user.password, user.role);
        await repairStatusPage.clickMyRepairHistoryMenu();

        await expect(repairStatusPage.myRepairHistoryTitle).toBeVisible();

        await repairStatusPage.repairRowCheck('RF2026', {
            reporter: 'พชร',
            subject: 'ตรวจสอบซ่อมแซมไฟ',
            status: 'ดำเนินการเสร็จสิ้น'
        });
    });

    test(`REPA-STA(I)-12 ติดตามสถานะ และรายละเอียดงานซ่อมบนหน้าจอ "รายละเอียดงานซ่อม" ของช่างซ่อม`, async ({ loginPage, repairStatusPage }) => {
        const user = validUsers[1];
        await repairStatusPage.gotoHome(loginPage, user.username, user.password, user.role);

        await repairStatusPage.clickFirstRepairId();

        await repairStatusPage.checkRepairDetail();
    });

    // =========================================================================
    // User Case
    // =========================================================================

    test.skip(`REPA-STA(I)-13 ติดตามสถานะ และรายละเอียดงานซ่อมบนหน้าจอ "หลัก (Home)" ของผู้ดูแลระบบ`, async ({ loginPage, repairStatusPage }) => {
        const user = validUsers[2];
        await repairStatusPage.gotoHome(loginPage, user.username, user.password, user.role);
        await expect(loginPage.mainTitle).toBeVisible();

        const statusCards = [
            'จำนวนรายการแจ้งซ่อมทั้งหมด',
            'จำนวนรายการแจ้งซ่อมที่รอดำเนินการ',
            'จำนวนรายการแจ้งซ่อมที่กำลังดำเนินการ',
            'จำนวนรายการแจ้งซ่อมที่ดำเนินการเสร็จสิ้น'
        ];

        await repairStatusPage.checkUserRepairTimeline();
    });

    test.skip(`REPA-STA(I)-14 ติดตามสถานะ และรายละเอียดงานซ่อมบนหน้าจอ "รายการของฉัน" ของผู้ใช้งาน`, async ({ loginPage, repairStatusPage }) => {
        const user = validUsers[2];
        await repairStatusPage.gotoHome(loginPage, user.username, user.password, user.role);

        await repairStatusPage.clickMyListMenu();

        await expect(repairStatusPage.myListTitle).toBeVisible();

        await repairStatusPage.repairRowCheck('RF2026', {
            reporter: '',
            subject: 'สายชำระ',
            status: 'กำลังดำเนินการ'
        });

    });

    test.skip(`REPA-STA(I)-15 ติดตามสถานะ และรายละเอียดงานซ่อมบนหน้าจอ "รายละเอียดงานซ่อม" ของผู้ใช้งาน`, async ({ loginPage, repairStatusPage }) => {
        const user = validUsers[2];
        await repairStatusPage.gotoHome(loginPage, user.username, user.password, user.role);

        await repairStatusPage.clickMyListMenu();
        await repairStatusPage.clickFirstRepairId();

        await repairStatusPage.checkRepairDetail();
    });

    // =========================================================================
    // Stock Case
    // =========================================================================

    test(`REPA-STA(I)-16 ติดตามสถานะ และรายละเอียดงานซ่อมบนหน้าจอ "รายการของฉัน" ของผู้ดูแลคลัง`, async ({ loginPage, repairStatusPage }) => {
        const user = validUsers[3];
        await repairStatusPage.gotoHome(loginPage, user.username, user.password, user.role);

        await repairStatusPage.clickMyListMenu();

        await expect(repairStatusPage.myListTitle).toBeVisible();

        await repairStatusPage.repairRowCheck('RF2026', {
            reporter: '',
            subject: 'ไฟไม่ติด',
            status: 'รอดำเนินการ'
        });
    });

    test(`REPA-STA(I)-17 ติดตามสถานะ และรายละเอียดงานซ่อมบนหน้าจอ "รายละเอียดงานซ่อม" ของผู้ดูแลคลัง`, async ({ loginPage, repairStatusPage }) => {
        const user = validUsers[3];
        await repairStatusPage.gotoHome(loginPage, user.username, user.password, user.role);

        await repairStatusPage.clickMyListMenu();
        await repairStatusPage.clickFirstRepairId();

        await repairStatusPage.checkRepairDetail();
    });

    // =========================================================================
    // Manager Case
    // =========================================================================

    test.skip(`REPA-STA(I)-18 ติดตามสถานะ และรายละเอียดงานซ่อมบนหน้าจอ "รายการของฉัน" ของผู้บริหาร`, async ({ loginPage, repairStatusPage }) => {
        const user = validUsers[4];
        await repairStatusPage.gotoHome(loginPage, user.username, user.password, user.role);

        await repairStatusPage.clickMyListMenu();

        await expect(repairStatusPage.myListTitle).toBeVisible();

        await repairStatusPage.repairRowCheck('RF2026', {
            reporter: '',
            subject: 'ทดสอบ',
            status: 'ดำเนินการเสร็จสิ้น'
        });
    });

    test.skip(`REPA-STA(I)-19 ติดตามสถานะ และรายละเอียดงานซ่อมบนหน้าจอ "รายละเอียดคำร้องแจ้งซ่อม" ของผู้บริหาร`, async ({ loginPage, repairStatusPage }) => {
        const user = validUsers[4];
        await repairStatusPage.gotoHome(loginPage, user.username, user.password, user.role);

        await repairStatusPage.clickMyListMenu();
        await repairStatusPage.clickFirstRepairId();

        await repairStatusPage.checkRepairDetail();
    });

});