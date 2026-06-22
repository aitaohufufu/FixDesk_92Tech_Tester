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
        
        this.usernameInput = page.getByPlaceholder('ชื่อผู้ใช้');
        this.passwordInput = page.getByPlaceholder('รหัสผ่าน');
        
        this.loginButton = page.getByRole('button', { name: 'เข้าสู่ระบบ' });
        this.logoutButton = page.getByRole('button', { name: 'ออกจากระบบ' });
   
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
}