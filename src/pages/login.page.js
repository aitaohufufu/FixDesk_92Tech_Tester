import { BasePage } from './base.page';

export class LoginPage extends BasePage {

    /**
     * 
     * @param {import('@playwright/test').Page} page 
     */
    constructor(page) {
        super(page);

        this.path = '/#/login';

        this.loginTitle = page.getByRole('heading', { name: 'เข้าสู่ระบบ' });
        this.mainTitle = page.getByText("หน้าจอหลัก");
        
        this.usernameInput = page.getByPlaceholder('ชื่อผู้ใช้');
        this.passwordInput = page.getByPlaceholder('รหัสผ่าน');

        this.userIconLocator = page.getByRole('img', { name: 'User Icon' });

        this.logoutMenu = page.getByRole('button', { name: 'ออกจากระบบ' });
        
        this.loginButton = page.getByRole('button', { name: 'เข้าสู่ระบบ' });
        this.signInButton = page.getByRole('button', { name: 'ลงชื่อเข้าใช้' });
        this.rememberMeCheckbox = page.getByRole('checkbox', { name: 'จำฉันไว้' });
   
        this.alertMessage = page.locator('p.text-red-600');
    }

    /**
     * กรอกชื่อผู้ใช้และรหัสผ่าน
     */
    async fillLogin(username, password) {
        await this.usernameInput.fill(username || '');
        await this.passwordInput.fill(password || '');
    }
    
    /**
     * รอให้หน้าเว็บโหลดสมบูรณ์
     */
    async waitForLoaded() {
        await this.page.waitForLoadState('networkidle');
    }

    /**
     * คลิกปุ่ม "เข้าสู่ระบบ"
     */
    async clickLogin() {
        await this.loginButton.click();
    }

    /**
     * คลิกปุ่ม "ลงชื่อเข้าใช้"
     */
    async clickSignIn() {
        await this.signInButton.click();
    }

    /**
     * คลิกปุ่ม "ออกจากระบบ"
     */
    async clickLogout() {
        await this.userIconLocator.click();

        await this.logoutMenu.waitFor({ state: 'visible', timeout: 3000 });
        
        await this.logoutMenu.click();
    }
}