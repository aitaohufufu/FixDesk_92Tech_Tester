import { test, expect } from '../utils/base.js';
import { sendTestReport } from '../utils/reportHelper.js';
import { fillUserNamePassword, gotoLoginPage } from '../utils/authHelper.js';
import { validUsers, testUsers } from '../test-data/users.js';

async function gotoModal(loginPage, editPasswordModal, username, password, role) {
    await fillUserNamePassword(loginPage, username, password);
    await loginPage.clickSignIn();

    const expectedHomePattern = `/main/${role}-home`;
    await loginPage.page.waitForURL(`**${expectedHomePattern}`);
    await expect(loginPage.mainTitle).toBeVisible({ timeout: 3000 });

    await editPasswordModal.clickEditPasswordMenu();
}

test.describe('Profile Management - Edit Password [03:admin failed]', () => {

    test.afterEach(async ({ page, request }, testInfo) => {
        await sendTestReport(page, request, testInfo, 'PROF-PAS');
    });

    // =========================================================================
    // Page Case
    // =========================================================================

    validUsers.forEach((user) => {
        test(`PROF-PAS-01 [${user.username}] เข้าสู่หน้าจอ "ตั้งค่ารหัสผ่าน" ด้วยบัญชีผู้ใช้ใดก็ได้`, async ({ loginPage, editPasswordModal }) => {
            await gotoModal(loginPage, editPasswordModal, user.username, user.password, user.role);

            await expect(editPasswordModal.modalTitle).toBeVisible();
        });
    });

    // =========================================================================
    // Functional Case
    // =========================================================================

    validUsers.forEach((user) => {
        test(`PROF-PAS-02 [${user.username}] แสดงผลชื่อบัญชี ด้วยบัญชีผู้ใช้ใดก็ได้`, async ({ loginPage, editPasswordModal }) => {
            await gotoModal(loginPage, editPasswordModal, user.username, user.password, user.role);

            await expect(editPasswordModal.nameInput).not.toHaveValue('');
        });
    });

    validUsers.forEach((user) => {
        test(`PROF-PAS-03 [${user.username}] แก้ไข "รหัสผ่าน" ด้วยบัญชีผู้ใช้ใดก็ได้`, async ({ loginPage, editPasswordModal }) => {
            await gotoModal(loginPage, editPasswordModal, user.username, user.password, user.role);

            await editPasswordModal.fillPassword(user.password, user.newPassword, user.newPassword);

            await editPasswordModal.clickSubmitPassword();

            await expect(editPasswordModal.successMessage).toBeVisible();
        });
    });

    // =========================================================================
    // Security Case
    // =========================================================================

    validUsers.forEach((user) => {
        test(`PROF-PAS-04 [${user.username}] เข้าสู่ระบบด้วยรหัสผ่านที่เพิ่งทำการแก้ไข`, async ({ loginPage, editPasswordModal }) => {
            await fillUserNamePassword(loginPage, user.username, user.password);
            await loginPage.clickSignIn();

            const expectedPattern = `/main/${user.role}-home`;
            await loginPage.page.waitForURL(`**${expectedPattern}`);

            expect(loginPage.isURL(expectedPattern)).toBe(true);
            await expect(loginPage.mainTitle).toBeVisible();
        });
    });

    testUsers.forEach((user) => {
        test(`PROF-PAS-05 [${user.username}] เปลี่ยนรหัสผ่าน ด้วยบัญชีที่ลงชื่อเข้าใช้งานใหม่ครั้งแรก`, async ({ loginPage, editPasswordModal }) => {
            await fillUserNamePassword(loginPage, user.username, user.password);
            await loginPage.clickSignIn();

            const expectedPattern = `/main/${user.role}-home`;
            await loginPage.page.waitForURL(`**${expectedPattern}`);

            expect(loginPage.isURL(expectedPattern)).toBe(true);
            await expect(loginPage.mainTitle).toBeVisible();

            await expect(editPasswordModal.newUserTitle).toBeVisible();
            await editPasswordModal.newPasswordInput.fill(user.newPassword);
            await editPasswordModal.confirmPasswordInput.fill(user.newPassword);
            await editPasswordModal.clickChangeNewPassword();

            await expect(editPasswordModal.successMessage).toBeVisible();
        });
    });

    testUsers.forEach((user) => {
        test(`PROF-PAS-06 [${user.username}] คลิกปุ่ม "เปลี่ยนรหัสผ่าน" โดยไม่เปลี่ยนรหัสผ่านครั้งแรก`, async ({ loginPage, editPasswordModal }) => {
            await fillUserNamePassword(loginPage, user.username, user.password);
            await loginPage.clickSignIn();

            const expectedPattern = `/main/${user.role}-home`;
            await loginPage.page.waitForURL(`**${expectedPattern}`);

            expect(loginPage.isURL(expectedPattern)).toBe(true);
            await expect(loginPage.mainTitle).toBeVisible();

            await expect(editPasswordModal.newUserTitle).toBeVisible();
            await editPasswordModal.clickChangeNewPassword();
            await expect(editPasswordModal.errorMessage).toHaveCount(2);
        });
    });
    
    validUsers.forEach((user) => {
        test(`PROF-PAS-07 [${user.username}] คลิกปุ่ม "ยืนยัน" โดยไม่กรอกช่อง  "รหัสผ่านเดิม" "รหัสผ่านใหม่" หรือ "ยืนยันรหัสผ่าน"`, async ({ loginPage, editPasswordModal }) => {
            await gotoModal(loginPage, editPasswordModal, user.username, user.password, user.role);

            await editPasswordModal.clickSubmitPassword();

            await expect(editPasswordModal.errorMessage).toHaveCount(3);
        });
    });

    validUsers.forEach((user) => {
        test(`PROF-PAS-08 [${user.username}] กรอก "รหัสผ่านใหม่" และ "ยืนยันรหัสผ่าน" ด้วยบัญชีผู้ใช้ใดก็ได้ โดยกรอก "รหัสผ่านปัจจุบัน" ไม่ถูกต้อง`, async ({ loginPage, editPasswordModal }) => {
            await gotoModal(loginPage, editPasswordModal, user.username, user.password, user.role);

            await editPasswordModal.fillPassword('fakecurrentpassword', user.newPassword, user.newPassword);

            await editPasswordModal.clickSubmitPassword();

            await expect(editPasswordModal.errorMessage).toBeVisible();
        });
    });

    validUsers.forEach((user) => {
        test(`PROF-PAS-09 [${user.username}] กรอก "รหัสผ่านใหม่" และ "ยืนยันรหัสผ่าน" ไม่ตรงกัน ด้วยบัญชีผู้ใช้ใดก็ได้ `, async ({ loginPage, editPasswordModal }) => {
            await gotoModal(loginPage, editPasswordModal, user.username, user.password, user.role);

            await editPasswordModal.fillPassword(user.password, user.newPassword, 'fakepassword');

            await editPasswordModal.clickSubmitPassword();

            await expect(editPasswordModal.errorMessage).toBeVisible();
        });
    });



});