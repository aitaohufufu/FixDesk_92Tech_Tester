import { BasePage } from "../pages/base.page";

export class EditPhoneModal extends BasePage {

    /**
     * 
     * @param {import('@playwright/test').Page} page 
     */
    constructor(page) {
        super(page);

        this.modalTitle = page.getByRole('heading', { name: 'ตั้งค่าเบอร์โทรศัพท์' });

        this.userIconLocator = page.getByRole('img', { name: 'User Icon' });
        this.editPhoneMenu = page.getByRole('button', { name: 'ตั้งค่าเบอร์โทรศัพท์' });

        this.thaiNameInput = page.locator('div:has(> label:has-text("ชื่อ - นามสกุล (ภาษาไทย)"))').locator('input');
        this.engNameInput = page.locator('div:has(> label:has-text("ชื่อ - นามสกุล (ภาษาอังกฤษ)"))').locator('input');

        this.phoneInput = page.locator('input[placeholder="กรอกเบอร์โทร"]');
        this.passwordInput = page.locator('input[placeholder="กรอกรหัสผ่านปัจจุบัน"]');

        this.submitButton = page.locator('button:has-text("ยืนยัน")');

        this.errorMessage = page.getByText(/กรุณากรอกรหัสผ่านปัจจุบัน|กรุณากรอกเบอร์โทร/);
    }

    /**
     * กรอกข้อมูลเบอร์โทรศัพท์ และรหัสผ่าน
     * @param {string} phoneNumber - เบอร์โทรศัพท์
     * @param {string} password - รหัสผ่าน
     */
    async fillPhonePassword(phoneNumber, password) {
        await this.phoneInput.fill(phoneNumber || '');
        await this.passwordInput.fill(password || '');
    }

    /**
     * คลิกปุ่ม "ยืนยัน"
     */
    async clickSubmitPhone() {
        await this.submitButton.click();
    }

    /**
     * ฟังก์ชันคลิกเมนู "ตั้งค่าเบอร์โทรศัพท์"
     */
    async clickEditPhoneMenu() {
        await this.userIconLocator.click();

        await this.editPhoneMenu.waitFor({ state: 'visible', timeout: 3000 });
        await this.editPhoneMenu.click();
    }
}