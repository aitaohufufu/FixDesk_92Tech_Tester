import { expect } from './base.js';

/**
 * เปิดหน้าจอเริ่มต้นของระบบ
 * @param {import('../pages/login.page').LoginPage} loginPage
 */
export async function gotoLoginPage(loginPage) {
    await loginPage.goto();
    await loginPage.waitForLoaded();
}

/**
 * Login: กรอก username/password
 *
 * @param {import('../pages/login.page').LoginPage} loginPage
 * @param {string} username - ชื่อบัญชีผู้ใช้
 * @param {string} password - รหัสผ่าน
 */
export async function fillUserNamePassword(loginPage, username, password) {
    await gotoLoginPage(loginPage);
    await loginPage.fillLogin(username, password);

    await expect(loginPage.usernameInput).toHaveValue(username);
    await expect(loginPage.passwordInput).toHaveValue(password);
}