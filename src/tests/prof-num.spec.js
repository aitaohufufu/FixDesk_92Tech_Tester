import { test, expect } from '../utils/base.js';
import { sendTestReport } from '../utils/reportHelper.js';
import { fillUserNamePassword } from '../utils/authHelper.js';
import { validUsers } from '../test-data/users.js';

async function gotoModal(loginPage, editPhoneModal, username, password) {
    await fillUserNamePassword(loginPage, username, password);
    await loginPage.clickSignIn();

    const expectedHomePattern = `/main/${username}-home`;
    await loginPage.page.waitForURL(`**${expectedHomePattern}`);
    await expect(loginPage.mainTitle).toBeVisible({ timeout: 3000 });

    await editPhoneModal.clickEditPhoneMenu();
}

test.describe('Profile Management [03:admin failed]', () => {

    test.afterEach(async ({ page, request }, testInfo) => {
        await sendTestReport(page, request, testInfo, 'PROF-NUM');
    });

    // =========================================================================
    // Page Case
    // =========================================================================

    validUsers.forEach((user) => {
        test(`PROF-NUM-01 [${user.username}] เข้าสู่หน้าจอ "ตั้งค่าหมายเลขโทรศัพท์" ด้วยบัญชีผู้ใช้ใดก็ได้`, async ({ loginPage, editPhoneModal }) => {
            await gotoModal(loginPage, editPhoneModal, user.username, user.password);

            await expect(editPhoneModal.modalTitle).toBeVisible();
        });
    });

    validUsers.forEach((user) => {
        test(`PROF-NUM-02 [${user.username}] แสดงผลข้อมูลส่วนตัว ด้วยบัญชีผู้ใช้งานใดก็ได้`, async ({ loginPage, editPhoneModal }) => {
            await gotoModal(loginPage, editPhoneModal, user.username, user.password);

            await expect(editPhoneModal.thaiNameInput).not.toHaveValue('');
            await expect(editPhoneModal.engNameInput).not.toHaveValue('');
        });
    });

    validUsers.forEach((user) => {
        test(`PROF-NUM-03 [${user.username}] แก้ไข "ข้อมูลหมายเลขโทรศัพท์" ด้วยบัญชีผู้ใช้ใดก็ได้`, async ({ loginPage, editPhoneModal }) => {
            await gotoModal(loginPage, editPhoneModal, user.username, user.password);

            await editPhoneModal.fillPhonePassword(user.phone, user.password);

            await editPhoneModal.clickSubmitPhone();

            await expect(editPhoneModal.modalTitle).not.toBeVisible();
        });
    });

    validUsers.forEach((user) => {
        test(`PROF-NUM-04 [${user.username}] แก้ไข "ข้อมูลหมายเลขโทรศัพท์" โดยไม่กรอกรหัสผ่าน ด้วยบัญชีผู้ใช้ใดก็ได้`, async ({ loginPage, editPhoneModal }) => {
            await gotoModal(loginPage, editPhoneModal, user.username, user.password);

            await editPhoneModal.fillPhonePassword(user.phone, '');

            await editPhoneModal.clickSubmitPhone();

            await expect(editPhoneModal.errorMessage).toBeVisible();
        });
    });

    validUsers.forEach((user) => {
        test(`PROF-NUM-05 [${user.username}] แก้ไข "ข้อมูลหมายเลขโทรศัพท์" โดยไม่กรอก/ลบหมายเลขโทรศัพท์ ด้วยบัญชีผู้ใช้ใดก็ได้`, async ({ loginPage, editPhoneModal }) => {
            await gotoModal(loginPage, editPhoneModal, user.username, user.password);

            await editPhoneModal.fillPhonePassword('', user.password);

            await editPhoneModal.clickSubmitPhone();

            await expect(editPhoneModal.errorMessage).toBeVisible();
        });
    });



});