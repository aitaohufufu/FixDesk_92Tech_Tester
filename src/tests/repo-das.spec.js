import { test, expect }         from '../utils/base.js';
import { sendTestReport }       from '../utils/reportHelper.js';
import { fillUserNamePassword }  from '../utils/authHelper.js';
import { validUsers }           from '../test-data/users.js';

async function gotoReportDas(loginPage, reportDasPage, username, password) {
    await fillUserNamePassword(loginPage, username, password);
    await loginPage.clickSignIn();

    const expectedHomePattern = `/main/${username}-home`;
    await loginPage.page.waitForURL(`**${expectedHomePattern}`);
    await expect(loginPage.mainTitle).toBeVisible({ timeout: 3000 });

    await reportDasPage.clickDashboard();
    await reportDasPage.page.waitForURL('**/main/Dashboard');
}

test.describe('Dashboard', () => {

    test.afterEach(async ({ page, request }, testInfo) => {
        await sendTestReport(page, request, testInfo, 'REPO-DAS');
    });
    
    test('REPO-DAS-01 เข้าสู่หน้าจอ Dashboard', async ({ loginPage, reportDasPage }) => {
        const adminUser = validUsers[0];

        await gotoReportDas(loginPage, reportDasPage, adminUser.username, adminUser.password);

        expect(reportDasPage.isURL('/main/Dashboard')).toBe(true);
        await expect(reportDasPage.dashboardTitle).toBeVisible();
    });

    test('REPO-DAS-02 แสดง KPI Card เมื่อมีข้อมูล', async ({ loginPage, reportDasPage }) => {
        const adminUser = validUsers[0];

        await gotoReportDas(loginPage, reportDasPage, adminUser.username, adminUser.password);

        // เลือกเดือนที่มีข้อมูล (กุมภาพันธ์ 2026)
        await reportDasPage.selectYear('2026');
        await reportDasPage.selectMonth('กุมภาพันธ์');
        await reportDasPage.page.waitForTimeout(1000);

        // Assert: KPI ทั้ง 4 ตัวแสดงผล
        await expect(reportDasPage.kpiTotalJobs).toBeVisible();
        await expect(reportDasPage.kpiPending).toBeVisible();
        await expect(reportDasPage.kpiInProgress).toBeVisible();
        await expect(reportDasPage.kpiDone).toBeVisible();

    });

    test('REPO-DAS-03 แสดง Growth Rate เมื่อเทียบกับเดือนก่อนหน้า', async ({ loginPage, reportDasPage }) => {
        const adminUser = validUsers[0];

        await gotoReportDas(loginPage, reportDasPage, adminUser.username, adminUser.password);

        await reportDasPage.selectYear('2026');
        await reportDasPage.selectMonth('กุมภาพันธ์');
        await reportDasPage.page.waitForTimeout(1000);

        // Assert: แสดง % เทียบเดือนก่อน (ขึ้นหรือลงก็ได้)
        await expect(
            reportDasPage.page.locator('text=เทียบกับเดือนก่อนหน้า').first()
        ).toBeVisible();
    });

    test('REPO-DAS-04 Growth Rate กรณีเดือนก่อนหน้าไม่มีข้อมูล', async ({ loginPage, reportDasPage }) => {
        const adminUser = validUsers[0];

        await gotoReportDas(loginPage, reportDasPage, adminUser.username, adminUser.password);

        // เลือกมกราคม (เดือนแรก — ไม่มีเดือนก่อนหน้า)
        await reportDasPage.selectYear('2026');
        await reportDasPage.selectMonth('มกราคม');
        await reportDasPage.page.waitForTimeout(1000);

        // Assert: แสดง 0% หรือ N/A หรือ "-"
        await expect(
            reportDasPage.page.locator('text=0%').or(
            reportDasPage.page.locator('text=N/A')).or(
            reportDasPage.page.locator('text=-')).first()
        ).toBeVisible();
    });

    test('REPO-DAS-05 Growth Rate ข้ามปี มกราคม เทียบ ธันวาคม ปีก่อน', async ({ loginPage, reportDasPage }) => {
        const adminUser = validUsers[0];

        await gotoReportDas(loginPage, reportDasPage, adminUser.username, adminUser.password);

        await reportDasPage.selectYear('2026');
        await reportDasPage.selectMonth('มกราคม');
        await reportDasPage.page.waitForTimeout(1000);

        await expect(
            reportDasPage.page.getByRole('paragraph').filter({ hasText: 'งานซ่อมทั้งหมด' })
        ).toBeVisible();
        await expect(
            reportDasPage.page.getByText('เทียบกับเดือนก่อนหน้า').first()
        ).toBeVisible();
    });


    test('REPO-DAS-06 กราฟทั้งหมดแสดงผลเมื่อมีข้อมูล', async ({ loginPage, reportDasPage }) => {
        const adminUser = validUsers[0];

        await gotoReportDas(loginPage, reportDasPage, adminUser.username, adminUser.password);

        await reportDasPage.selectYear('2026');
        await reportDasPage.selectMonth('กุมภาพันธ์');
        await reportDasPage.page.waitForTimeout(1000);

        // Assert: ทุกกราฟมี heading ปรากฏ
        await expect(reportDasPage.page.getByText('ปริมาณงานแจ้งซ่อมรายเดือน')).toBeVisible();
        await expect(reportDasPage.page.getByText('สัดส่วนสถานะงานแจ้งซ่อม')).toBeVisible();
        await expect(reportDasPage.page.getByText('แนวโน้มปริมาณงานแจ้งซ่อมรายวัน')).toBeVisible();
        await expect(reportDasPage.page.getByText('อัตราความสำเร็จการปฏิบัติงานของช่างแต่ละแผนก')).toBeVisible();
        await expect(reportDasPage.page.getByText('ปริมาณงานแจ้งซ่อมจำแนกตามประเภท')).toBeVisible();
        await expect(reportDasPage.page.getByText('ปริมาณการแจ้งซ่อมจำแนกตามหน่วยงาน')).toBeVisible();
        await expect(reportDasPage.page.getByText('จำนวนการปิดงานของช่างภายในและช่างภายนอก')).toBeVisible();

        // Assert: SVG กราฟ render จริง
        await expect(reportDasPage.page.locator('.apexcharts-canvas').first()).toBeVisible();
    });

    test('REPO-DAS-07 กราฟแสดงผลเมื่อไม่มีข้อมูล', async ({ loginPage, reportDasPage }) => {
        const adminUser = validUsers[0];

        await gotoReportDas(loginPage, reportDasPage, adminUser.username, adminUser.password);

        // เลือกเดือนที่ไม่มีข้อมูล
        await reportDasPage.selectYear('2026');
        await reportDasPage.selectMonth('ธันวาคม');
        await reportDasPage.page.waitForTimeout(1000);

        // Assert: KPI แสดง 0 รายการ
        const zeroCards = reportDasPage.page.locator('text=0 รายการ');
        await expect(zeroCards.first()).toBeVisible();

        // Assert: กราฟยังคง render อยู่ (ไม่หายไป)
        await expect(reportDasPage.page.locator('.apexcharts-canvas').first()).toBeVisible();
    });

    test('REPO-DAS-08 เลือก Filter ปีและเดือน ข้อมูลเปลี่ยนตาม', async ({ loginPage, reportDasPage }) => {
        const adminUser = validUsers[0];

        await gotoReportDas(loginPage, reportDasPage, adminUser.username, adminUser.password);

        // เลือก กุมภาพันธ์ 2026
        await reportDasPage.selectYear('2026');
        await reportDasPage.selectMonth('2');
        await reportDasPage.page.waitForTimeout(1000);

        expect(await reportDasPage.monthDropdown.inputValue()).toBe('2');
        expect(await reportDasPage.yearDropdown.inputValue()).toBe('2026');

        // เปลี่ยนเป็น มีนาคม 2026
        await reportDasPage.selectMonth('3');
        await reportDasPage.page.waitForTimeout(1000);

        expect(await reportDasPage.monthDropdown.inputValue()).toBe('3');

        // Assert: หน้าไม่ crash
        await expect(reportDasPage.dashboardTitle).toBeVisible();
    });

    test('REPO-DAS-09 Tooltip ของกราฟแสดงเมื่อ hover', async ({ loginPage, reportDasPage }) => {
        const adminUser = validUsers[0];

        await gotoReportDas(loginPage, reportDasPage, adminUser.username, adminUser.password);

        await reportDasPage.selectYear('2026');
        await reportDasPage.selectMonth('กุมภาพันธ์');
        await reportDasPage.page.waitForTimeout(1000);

        // hover บนกราฟ Bar รายเดือน
        const chart = reportDasPage.page.locator('.apexcharts-bar-area').first();
        await chart.hover();
        await reportDasPage.page.waitForTimeout(500);

        // Assert: tooltip แสดงขึ้นมา
        await expect(
            reportDasPage.page.locator('.apexcharts-tooltip').first()
        ).toBeVisible();
    });

});