import { test, expect } from '../utils/base.js';
import { sendTestReport } from '../utils/reportHelper.js';
import { fillUserNamePassword, gotoLoginPage } from '../utils/authHelper.js';
import { validUsers, invalidUsers } from '../test-data/users.js';

test.describe('Authentication [12, 14 disabled]', () => {

    test.afterEach(async ({ page, request }, testInfo) => {
        await sendTestReport(page, request, testInfo, 'AUTH');
    });

    // =========================================================================
    // Page Case
    // =========================================================================

    test(`AUTH-01 เข้าสู่หน้าจอ "เข้าสู่ระบบ (Login Page)"`, async ({ loginPage }) => {
        await gotoLoginPage(loginPage);

        expect(loginPage.isURL('/login')).toBe(true);
        await expect(loginPage.loginTitle).toBeVisible();
    });

    // =========================================================================
    // Functional Case
    // =========================================================================

    validUsers.forEach((user) => {
        test(`AUTH-02 [${user.username}] เข้าสู่ระบบด้วยบัญชีผู้ใช้ใดก็ได้ โดยกรอกชื่อบัญชีผู้ใช้ (Username) และรหัสผ่าน (Password) ที่ถูกต้อง`, async ({ loginPage }) => {
            await fillUserNamePassword(loginPage, user.username, user.password);
            await loginPage.clickSignIn();

            const expectedPattern = `/main/${user.role}-home`;
            await loginPage.page.waitForURL(`**${expectedPattern}`);

            expect(loginPage.isURL(expectedPattern)).toBe(true);
            await expect(loginPage.mainTitle).toBeVisible();
        });
    });

    validUsers.forEach((user) => {
        test(`AUTH-03 [${user.username}] เข้าสู่ระบบด้วยบัญชีผู้ใช้ใดก็ได้ โดยกรอกชื่อบัญชีผู้ใช้ (Username) ที่ถูกต้อง แต่รหัสผ่าน (Password) ผิด`, async ({ loginPage }) => {
            const invalidPassword = invalidUsers[0].password;

            await fillUserNamePassword(loginPage, user.username, invalidPassword);
            await loginPage.clickSignIn();

            await expect(loginPage.alertMessage).toContainText("รหัสผ่านไม่ถูกต้อง");
            expect(loginPage.isURL('/login')).toBe(true);
        });
    });

    validUsers.forEach((user) => {
        test(`AUTH-04 [${user.username}] เข้าสู่ระบบด้วยบัญชีผู้ใช้ใดก็ได้ โดยกรอกชื่อบัญชีผู้ใช้ (Username) ที่ถูกต้อง แต่ไม่กรอกรหัสผ่าน (Password)`, async ({ loginPage }) => {
            await fillUserNamePassword(loginPage, user.username, '');
            await loginPage.clickSignIn();

            await expect(loginPage.alertMessage).toContainText("กรุณากรอกรหัสผ่าน");
            expect(loginPage.isURL('/login')).toBe(true);
        });
    });

    invalidUsers.forEach((user) => {
        test(`AUTH-05 [${user.username}] เข้าสู่ระบบด้วยบัญชีผู้ใช้ใดก็ได้ โดยกรอกชื่อบัญชีผู้ใช้ (Username) ที่ผิด แต่รหัสผ่าน (Password) ถูกต้อง`, async ({ loginPage }) => {
            const sampleCorrectPassword = validUsers[0].password;

            await fillUserNamePassword(loginPage, user.username, sampleCorrectPassword);
            await loginPage.clickSignIn();

            await expect(loginPage.alertMessage).toContainText("ไม่พบชื่อผู้ใช้นี้ในระบบ");
            expect(loginPage.isURL('/login')).toBe(true);
        });
    });

    validUsers.forEach((user) => {
        test(`AUTH-06 [${user.username}] เข้าสู่ระบบด้วยบัญชีผู้ใช้ใดก็ได้ โดยไม่กรอกชื่อบัญชีผู้ใช้ (Username) แต่กรอกรหัสผ่าน (Password) ถูกต้อง`, async ({ loginPage }) => {
            await fillUserNamePassword(loginPage, '', user.password);
            await loginPage.clickSignIn();

            await expect(loginPage.alertMessage).toContainText("กรุณากรอกชื่อผู้ใช้");
            expect(loginPage.isURL('/login')).toBe(true);
        });
    });

    invalidUsers.forEach((user) => {
        test(`AUTH-07 [${user.username}] เข้าสู่ระบบด้วยบัญชีผู้ใช้ใดก็ได้ โดยกรอกชื่อบัญชีผู้ใช้ (Username) และรหัสผ่าน (Password) ที่ผิด`, async ({ loginPage }) => {
            await fillUserNamePassword(loginPage, user.username, user.password);
            await loginPage.clickSignIn();

            await expect(loginPage.alertMessage).toContainText("ไม่พบชื่อผู้ใช้นี้ในระบบ");
            expect(loginPage.isURL('/login')).toBe(true);
        });
    });

    test(`AUTH-08 เข้าสู่ระบบ โดยไม่กรอกชื่อบัญชีผู้ใช้ (Username) และรหัสผ่าน (Password)`, async ({ loginPage }) => {
        await fillUserNamePassword(loginPage, '', '');
        await loginPage.clickSignIn();

        await expect(loginPage.alertMessage).toContainText("กรุณากรอกชื่อผู้ใช้และรหัสผ่าน");
        expect(loginPage.isURL('/login')).toBe(true);
    });

    validUsers.forEach((user, index) => {
        test(`AUTH-09 [${user.username}] ออกจากระบบ (Logout) ด้วยบัญชีผู้ใช้ใดก็ได้`, async ({ loginPage }) => {
            await fillUserNamePassword(loginPage, user.username, user.password);
            await loginPage.clickSignIn();

            const expectedPattern = `/main/${user.role}-home`;
            await loginPage.page.waitForURL(`**${expectedPattern}`);
            expect(loginPage.isURL(expectedPattern)).toBe(true);
            await expect(loginPage.mainTitle).toBeVisible({ timeout: 3000 }); 

            await loginPage.clickLogout();

            await loginPage.page.waitForURL('**/home');
            expect(loginPage.isURL('/home')).toBe(true);
        });
    });

    // =========================================================================
    // Non-functional Case
    // =========================================================================

    test(`AUTH-10 ใช้ฟังก์ชัน "จำฉันไว้" โดยปิดแถบเบราว์เซอร์ และเปิดแถบเข้าใช้งานระบบใหม่อีกครั้ง`, async ({ context, loginPage }) => {
        const user = validUsers[0];
        const tempTab = await context.newPage();
        const tempLoginPage = new loginPage.constructor(tempTab);

        await tempLoginPage.goto();
        await tempLoginPage.fillLogin(user.username, user.password);
        await tempLoginPage.rememberMeCheckbox.check();

        await tempLoginPage.clickSignIn();
        const expectedPattern = `/main/${user.role}-home`;
        await tempTab.waitForURL(`**${expectedPattern}`);
        await tempTab.close();

        await loginPage.goto();

        await loginPage.page.waitForURL(`**${expectedPattern}`);
        expect(loginPage.isURL(expectedPattern)).toBe(true);
        await expect(loginPage.mainTitle).toBeVisible();
    });

    test(`AUTH-11 ออกจากระบบแล้วคลิกปุ่มย้อนกลับ (Back) ของเว็บเบราว์เซอร์`, async ({ loginPage }) => {
        const user = validUsers[0];

        await fillUserNamePassword(loginPage, user.username, user.password);
        await loginPage.clickSignIn();

        const expectedPattern = `/main/${user.role}-home`;
        await loginPage.page.waitForURL(`**${expectedPattern}`);

        await loginPage.clickLogout();
        await loginPage.page.waitForURL('**/login');

        await loginPage.page.goBack();
        
        await loginPage.page.waitForURL('**/login');
        expect(loginPage.isURL('/login')).toBe(true);
    });

    test.skip(`AUTH-12 เข้าสู่ระบบ (Login) ด้วยบัญชีผู้ใช้ใดก็ได้จากหลายอุปกรณ์พร้อมกัน`, async ({ browser, loginPage }) => {
        const user = validUsers[0];

        await fillUserNamePassword(loginPage, user.username, user.password);
        await loginPage.clickSignIn();
        
        const expectedPattern = `/main/${user.username}-home`;
        await loginPage.page.waitForURL(`**${expectedPattern}`);
        await expect(loginPage.mainTitle).toBeVisible();

        const context2 = await browser.newContext();
        const page2 = await context2.newPage();
        
        const loginPage2 = new loginPage.constructor(page2); 
        await loginPage2.goto();
        
        await loginPage2.page.waitForURL('**/login');
        expect(loginPage2.isURL('/login')).toBe(true);
        await expect(loginPage2.loginTitle).toBeVisible();

        await fillUserNamePassword(loginPage2, user.username, user.password);
        await loginPage2.clickSignIn();

        await page2.waitForURL(`**${expectedPattern}`);
        await expect(loginPage2.mainTitle).toBeVisible();

        await loginPage.page.reload();
        await expect(loginPage.mainTitle).toBeVisible();

        await context2.close();
    });

    // =========================================================================
    // Security Case
    // =========================================================================

    test(`AUTH-13 ป้องกันการเข้าถึง URL โดยตรงโดยไม่เข้าสู่ระบบก่อน`, async ({ page }) => {
        await page.goto('/#/main/admin-home');

        await page.waitForURL('**/login');
        await expect(page).toHaveURL(/.*\/login.*/);
    });

    test.skip(`AUTH-14 เข้าสู่ระบบค้างไว้ และไม่ใช้งานเป็นระยะเวลาหนึ่ง (Session Timeout)`, async ({ page, loginPage }) => {
       
    });
});