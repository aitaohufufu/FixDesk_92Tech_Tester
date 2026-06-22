import { test, expect } from '../utils/base.js';
import { sendTestReport } from '../utils/reportHelper.js';

test.describe('Login', () => {

    test.afterEach(async ({ page, request }, testInfo) => {
        await sendTestReport(page, request, testInfo, 'AUTH');
    });

    //  ==================================================
    //  Functional Case
    //  ==================================================

    test('AUTH-01 เข้าสู่หน้าจอ "เข้าสู่ระบบ (Login Page)"', async ({ loginPage }) => {
        await loginPage.goto();

        await loginPage.waitForLoaded();

        expect(loginPage.isURL('/login')).toBe(true);
        await expect(loginPage.loginTitle).toBeVisible();
    });

    test('AUTH-02 เข้าสู่ระบบด้วยบัญชีผู้ใช้ใดก็ได้ โดยกรอกชื่อบัญชีผู้ใช้ (Username) และรหัสผ่าน (Password) ที่ถูกต้อง', async ({ loginPage }) => {
        
    });

    test('AUTH-03 เข้าสู่ระบบด้วยบัญชีผู้ใช้ใดก็ได้ โดยกรอกชื่อบัญชีผู้ใช้ (Username) ที่ถูกต้อง แต่รหัสผ่าน (Password) ผิด', async ({ loginPage }) => {
        
    });

    test('AUTH-04 เข้าสู่ระบบด้วยบัญชีผู้ใช้ใดก็ได้ โดยกรอกชื่อบัญชีผู้ใช้ (Username) ที่ถูกต้อง แต่ไม่กรอกรหัสผ่าน (Password)', async ({ loginPage }) => {
        
    });

    test('AUTH-05 เข้าสู่ระบบด้วยบัญชีผู้ใช้ใดก็ได้ โดยกรอกชื่อบัญชีผู้ใช้ (Username) ที่ผิด แต่รหัสผ่าน (Password) ถูกต้อง', async ({ loginPage }) => {
        
    });

    test('AUTH-06 เข้าสู่ระบบด้วยบัญชีผู้ใช้ใดก็ได้ โดยไม่กรอกชื่อบัญชีผู้ใช้ (Username) แต่กรอกรหัสผ่าน (Password) ถูกต้อง', async ({ loginPage }) => {
        
    });

    test('AUTH-07 เข้าสู่ระบบด้วยบัญชีผู้ใช้ใดก็ได้ โดยกรอกชื่อบัญชีผู้ใช้ (Username) และรหัสผ่าน (Password) ที่ผิด', async ({ loginPage }) => {
        
    });

    test('AUTH-08 เข้าสู่ระบบ โดยไม่กรอกชื่อบัญชีผู้ใช้ (Username) และรหัสผ่าน (Password)', async ({ loginPage }) => {
        
    });

    test('AUTH-09 ออกจากระบบ (Logout) ด้วยบัญชีผู้ใช้ใดก็ได้', async ({ loginPage }) => {
        
    });

    test('AUTH-10 ใช้ฟังก์ชัน "จำฉันไว้" โดยปิดแถบเบราว์เซอร์ และเปิดแถบเข้าใช้งานระบบใหม่อีกครั้ง', async ({ loginPage }) => {
        
    });

    test('AUTH-11 ออกจากระบบ (Logout) ด้วยบัญชีผู้ใช้ใดก็ได้ แล้วคลิกปุ่มย้อนกลับ (Back) ของเว็บเบราว์เซอร์', async ({ loginPage }) => {
        
    });

    test('AUTH-12 เข้าสู่ระบบ (Login) ด้วยบัญชีผู้ใช้ใดก็ได้จากหลายอุปกรณ์พร้อมกัน', async ({ loginPage }) => {
        
    });

    test('AUTH-13 ป้องกันการเข้าถึง URL โดยไม่เข้าสู่ระบบก่อน', async ({ loginPage }) => {
        
    });

    test('AUTH-14 เข้าสู่ระบบค้างไว้ และไม่ใช้งานเป็นระยะเวลาหนึ่ง', async ({ loginPage }) => {
        
    });

}); 

