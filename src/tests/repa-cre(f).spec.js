import { test, expect } from '../utils/base.js';
import { sendTestReport } from '../utils/reportHelper.js';
import { fillUserNamePassword } from '../utils/authHelper.js';
import { validUsers } from '../test-data/users.js';
import { validForm } from '../test-data/form.js';

async function gotoRepairForm(loginPage, repairFormPage, username, password, role) {
    await fillUserNamePassword(loginPage, username, password);
    await loginPage.clickSignIn();

    const expectedHomePattern = `/main/${role}-home`;
    await loginPage.page.waitForURL(`**${expectedHomePattern}`);
    await expect(loginPage.mainTitle).toBeVisible({ timeout: 3000 });

    await repairFormPage.clickRepairMenu();
}

test.describe('Repair Request - Create Form', () => {

    test.afterEach(async ({ page, request }, testInfo) => {
        await sendTestReport(page, request, testInfo, 'REPA-CRE(F)');
    });

    // =========================================================================
    // Page Case
    // =========================================================================

    validUsers.forEach((user) => {
        test(`REPA-CRE(F)-01 [${user.username}] เข้าสู่หน้าจอ "แบบฟอร์มแจ้งซ่อม" `, async ({ loginPage, repairFormPage }) => {
            await gotoRepairForm(loginPage, repairFormPage, user.username, user.password, user.role);

            await expect(repairFormPage.repairFormTitle).toBeVisible();
        });
    });

    // =========================================================================
    // Functional Case
    // =========================================================================

    validUsers.forEach((user) => {
        test(`REPA-CRE(F)-02 [${user.username}] แสดงผลข้อมูลของผู้แจ้งซ่อม ด้วยบัญชีผู้ใช้ใดก็ได้`, async ({ loginPage, repairFormPage }) => {
            await gotoRepairForm(loginPage, repairFormPage, user.username, user.password, user.role);

            await expect(repairFormPage.nameInput).not.toHaveValue('');
            await expect(repairFormPage.phoneInput).not.toHaveValue('');
            await expect(repairFormPage.departmentInput).not.toHaveValue('');
        });
    });

    validUsers.forEach((user) => {
        test(`REPA-CRE(F)-03 [${user.username}] กรอกข้อมูลแบบฟอร์มแจ้งซ่อมทุกช่องที่บังคับกรอก และบันทึกข้อมูลเข้าสู่ระบบ`, async ({ loginPage, repairFormPage }) => {
            await gotoRepairForm(loginPage, repairFormPage, user.username, user.password, user.role);

            await repairFormPage.fillFormInput(
                validForm[0].type,
                '',
                validForm[0].topic,
                validForm[0].building,
                validForm[0].floor,
                validForm[0].room,
                validForm[0].detail
            );
            await repairFormPage.selectUrgency('เร่งด่วน');

            await repairFormPage.clickSubmitForm();
            await repairFormPage.clickConfirm();

            const expectedPattern = '/main/my-list';
            await loginPage.page.waitForURL(`**${expectedPattern}`);
            expect(loginPage.isURL(expectedPattern)).toBe(true);
        });
    });

    validUsers.forEach((user) => {
        test(`REPA-CRE(F)-04 [${user.username}] กรอกข้อมูลแบบฟอร์มแจ้งซ่อมครบทุกช่อง และบันทึกข้อมูลเข้าสู่ระบบ`, async ({ loginPage, repairFormPage }) => {
            await gotoRepairForm(loginPage, repairFormPage, user.username, user.password, user.role);

            await repairFormPage.fillFormInput(
                validForm[0].type,
                validForm[0].assetCode,
                validForm[0].topic,
                validForm[0].building,
                validForm[0].floor,
                validForm[0].room,
                validForm[0].detail
            );
            await repairFormPage.uploadFile('src/test-data/images/mouse-sample.jpg');
            await repairFormPage.selectUrgency('เร่งด่วน');

            await repairFormPage.clickSubmitForm();
            await repairFormPage.clickConfirm();

            const expectedPattern = '/main/my-list';
            await loginPage.page.waitForURL(`**${expectedPattern}`);
            expect(loginPage.isURL(expectedPattern)).toBe(true);
        });
    });

    validUsers.forEach((user) => {
        test(`REPA-CRE(F)-05 [${user.username}] กรอกข้อมูลแบบฟอร์มแจ้งซ่อมช่องที่บังคับกรอกไม่ครบทุกช่อง และบันทึกข้อมูลเข้าสู่ระบบ`, async ({ loginPage, repairFormPage }) => {
            await gotoRepairForm(loginPage, repairFormPage, user.username, user.password, user.role);

            await repairFormPage.fillFormInput(
                '',
                validForm[0].assetCode,
                validForm[0].topic,
                validForm[0].building,
                validForm[0].floor,
                validForm[0].room,
                validForm[0].detail
            );
            await repairFormPage.uploadFile('src/test-data/images/mouse-sample.jpg');
            await repairFormPage.selectUrgency('เร่งด่วน');

            await repairFormPage.clickSubmitForm();

            await expect(repairFormPage.alertMessage).toBeVisible();
        });
    });

    validUsers.forEach((user) => {
        test(`REPA-CRE(F)-06 [${user.username}] กรอกข้อมูลแบบฟอร์มแจ้งซ่อมครบทุกช่อง แต่ไม่เลือกระดับความเร่งด่วน`, async ({ loginPage, repairFormPage }) => {
            await gotoRepairForm(loginPage, repairFormPage, user.username, user.password, user.role);

            await repairFormPage.fillFormInput(
                validForm[0].type,
                validForm[0].assetCode,
                validForm[0].topic,
                validForm[0].building,
                validForm[0].floor,
                validForm[0].room,
                validForm[0].detail
            );
            await repairFormPage.uploadFile('src/test-data/images/mouse-sample.jpg');

            await repairFormPage.clickSubmitForm();

            await expect(repairFormPage.toastAlert).toHaveText('ยังไม่ได้เลือกระดับความเร่งด่วน');
            await expect(repairFormPage.toastAlert).toBeHidden({ timeout: 5000 });
        });
    });

    validUsers.forEach((user) => {
        test(`REPA-CRE(F)-07 [${user.username}] ไม่กรอกข้อมูลแบบฟอร์มแจ้งซ่อม และบันทึกข้อมูลเข้าสู่ระบบ`, async ({ loginPage, repairFormPage }) => {
            await gotoRepairForm(loginPage, repairFormPage, user.username, user.password, user.role);

            await repairFormPage.clickSubmitForm();

            await expect(repairFormPage.alertMessage).toHaveCount(6);
            await expect(repairFormPage.toastAlert).toHaveText('กรุณากรอกข้อมูลให้ครบถ้วน');
            await expect(repairFormPage.toastAlert).toBeHidden({ timeout: 5000 });
        });
    });

    // =========================================================================
    // File Upload & Data Validation Cases
    // =========================================================================

    validUsers.forEach((user) => {
        test(`REPA-CRE(F)-08 [${user.username}] แนบไฟล์รูปภาพ หรือวิดีโอ จำนวน 1 ไฟล์ (สูงสุด 5 ไฟล์ 50MB/ไฟล์)`, async ({ loginPage, repairFormPage }) => {
            await gotoRepairForm(loginPage, repairFormPage, user.username, user.password, user.role);

            await repairFormPage.fillFormInput(
                validForm[0].type,
                validForm[0].assetCode,
                validForm[0].topic,
                validForm[0].building,
                validForm[0].floor,
                validForm[0].room,
                validForm[0].detail
            );
            await repairFormPage.uploadFile('src/test-data/images/mouse-sample.jpg');
            await repairFormPage.selectUrgency('เร่งด่วน');

            await repairFormPage.clickSubmitForm();
            await repairFormPage.clickConfirm();

            const expectedPattern = '/main/my-list';
            await loginPage.page.waitForURL(`**${expectedPattern}`);
            expect(loginPage.isURL(expectedPattern)).toBe(true);
        });
    });

    validUsers.forEach((user) => {
        test(`REPA-CRE(F)-09 [${user.username}] แนบไฟล์รูปภาพ หรือวิดีโอ จำนวน 3 ไฟล์ (สูงสุด 5 ไฟล์ 50MB/ไฟล์)`, async ({ loginPage, repairFormPage }) => {
            await gotoRepairForm(loginPage, repairFormPage, user.username, user.password, user.role);

            await repairFormPage.fillFormInput(
                validForm[0].type,
                validForm[0].assetCode,
                validForm[0].topic,
                validForm[0].building,
                validForm[0].floor,
                validForm[0].room,
                validForm[0].detail
            );

            await repairFormPage.uploadFile([
                'src/test-data/images/mouse-sample.jpg',
                'src/test-data/images/mouse-sample.jpg',
                'src/test-data/images/mouse-sample.jpg'
            ]);
            await repairFormPage.selectUrgency('เร่งด่วน');

            await repairFormPage.clickSubmitForm();
            await repairFormPage.clickConfirm();

            const expectedPattern = '/main/my-list';
            await loginPage.page.waitForURL(`**${expectedPattern}`);
            expect(loginPage.isURL(expectedPattern)).toBe(true);
        });
    });

    validUsers.forEach((user) => {
        test(`REPA-CRE(F)-10 [${user.username}] แนบไฟล์รูปภาพ หรือวิดีโอ จำนวน 5 ไฟล์ (สูงสุด 5 ไฟล์ 50MB/ไฟล์)`, async ({ loginPage, repairFormPage }) => {
            await gotoRepairForm(loginPage, repairFormPage, user.username, user.password, user.role);

            await repairFormPage.fillFormInput(
                validForm[0].type,
                validForm[0].assetCode,
                validForm[0].topic,
                validForm[0].building,
                validForm[0].floor,
                validForm[0].room,
                validForm[0].detail
            );
            await repairFormPage.uploadFile([
                'src/test-data/images/mouse-sample.jpg',
                'src/test-data/images/mouse-sample.jpg',
                'src/test-data/images/mouse-sample.jpg',
                'src/test-data/images/mouse-sample.jpg',
                'src/test-data/images/mouse-sample.jpg'
            ]);
            await repairFormPage.selectUrgency('เร่งด่วน');

            await repairFormPage.clickSubmitForm();
            await repairFormPage.clickConfirm();

            const expectedPattern = '/main/my-list';
            await loginPage.page.waitForURL(`**${expectedPattern}`);
            expect(loginPage.isURL(expectedPattern)).toBe(true);
        });
    });

    validUsers.forEach((user) => {
        test(`REPA-CRE(F)-11 [${user.username}] แนบไฟล์รูปภาพ หรือวิดีโอ จำนวน 6 ไฟล์ (สูงสุด 5 ไฟล์ 50MB/ไฟล์)`, async ({ loginPage, repairFormPage }) => {
            await gotoRepairForm(loginPage, repairFormPage, user.username, user.password, user.role);

            await repairFormPage.fillFormInput(
                validForm[0].type,
                validForm[0].assetCode,
                validForm[0].topic,
                validForm[0].building,
                validForm[0].floor,
                validForm[0].room,
                validForm[0].detail
            );
            await repairFormPage.uploadFile([
                'src/test-data/images/mouse-sample.jpg',
                'src/test-data/images/mouse-sample.jpg',
                'src/test-data/images/mouse-sample.jpg',
                'src/test-data/images/mouse-sample.jpg',
                'src/test-data/images/mouse-sample.jpg',
                'src/test-data/images/mouse-sample.jpg'
            ]);

            await expect(repairFormPage.toastAlert).toContainText(/เกินกำหนด|สูงสุด 5 ไฟล์/);
            await expect(repairFormPage.toastAlert).toBeHidden({ timeout: 5000 });
        });
    });

    validUsers.forEach((user) => {
        test(`REPA-CRE(F)-12 [${user.username}] ทดสอบการแนบไฟล์รูปภาพ หรือวิดีโอเกินขนาดที่กำหนด`, async ({ loginPage, repairFormPage }) => {
            await gotoRepairForm(loginPage, repairFormPage, user.username, user.password, user.role);

            await repairFormPage.fillFormInput(
                validForm[0].type,
                validForm[0].assetCode,
                validForm[0].topic,
                validForm[0].building,
                validForm[0].floor,
                validForm[0].room,
                validForm[0].detail
            );
            await repairFormPage.uploadFile('src/test-data/files/large-video-over-50mb.mp4');

            await expect(repairFormPage.toastAlert).toContainText(/ไฟล์ใหญ่เกินไป|เกิน 50MB/);
            await expect(repairFormPage.toastAlert).toBeHidden({ timeout: 5000 });
        });
    });

    validUsers.forEach((user) => {
        test(`REPA-CRE(F)-13 [${user.username}] ทดสอบการแนบไฟล์ที่ไม่รองรับ เช่น .exe, .pdf หรืออื่น ๆ`, async ({ loginPage, repairFormPage }) => {
            await gotoRepairForm(loginPage, repairFormPage, user.username, user.password, user.role);

            await repairFormPage.fillFormInput(
                validForm[0].type,
                validForm[0].assetCode,
                validForm[0].topic,
                validForm[0].building,
                validForm[0].floor,
                validForm[0].room,
                validForm[0].detail
            );
            await repairFormPage.uploadFile('src/test-data/files/invalid-file.pdf');

            await expect(repairFormPage.toastAlert).toContainText(/ไม่รองรับ|ไฟล์ที่แนบมาไม่รองรับ/);
            await expect(repairFormPage.toastAlert).toBeHidden({ timeout: 5000 });
        });
    });

    validUsers.forEach((user) => {
        test(`REPA-CRE(F)-14 [${user.username}] ทดสอบกรอกข้อความยาวเกินกำหนด ในช่องกรอกข้อมูล "ขอความอนุเคราะห์ตรวจสอบ/ซ่อมแซม" หรือ "สาเหตุ/อาการเสีย" เกิน 500 ตัวอักษร`, async ({ loginPage, repairFormPage }) => {
            await gotoRepairForm(loginPage, repairFormPage, user.username, user.password, user.role);

            const overLengthText = 'A'.repeat(505);

            await repairFormPage.fillFormInput(
                validForm[0].type,
                validForm[0].assetCode,
                overLengthText,
                validForm[0].building,
                validForm[0].floor,
                validForm[0].room,
                overLengthText
            );
            await repairFormPage.selectUrgency('เร่งด่วน');
            await repairFormPage.clickSubmitForm();
            await repairFormPage.clickConfirm();

            await expect(repairFormPage.toastAlert).toContainText('ส่งแบบฟอร์มแจ้งซ่อมไม่สำเร็จ');
            await expect(repairFormPage.toastAlert).toBeHidden({ timeout: 5000 });
        });
    });

});