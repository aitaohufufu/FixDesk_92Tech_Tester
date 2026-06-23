import { BasePage } from "../pages/base.page";

export class EditPasswordModal extends BasePage {

    /**
     * 
     * @param {import('@playwright/test').Page} page 
     */
    constructor(page) {
        super(page);

        this.modalTitle = page.getByRole('heading', { name: 'ตั้งค่ารหัสผ่าน' });
        this.newUserTitle = page.getByRole('heading', { name: 'เปลี่ยนรหัสผ่านครั้งแรก' });

        this.userIconLocator = page.getByRole('img', { name: 'User Icon' });
        this.editPasswordMenu = page.getByRole('button', { name: 'ตั้งค่ารหัสผ่าน' });

        this.nameInput = page.locator('div:has(> label:has-text("ชื่อบัญชีผู้ใช้"))').locator('input');

        this.currentPasswordInput = page.locator('input[placeholder="กรอกรหัสผ่านปัจจุบัน"]');
        this.newPasswordInput = page.locator('input[placeholder="กรอกรหัสผ่านใหม่"]');
        this.confirmPasswordInput = page.locator('input[placeholder="กรอกยืนยันรหัสผ่านใหม่"]');

        this.newUserPasswordButton = page.locator('button:has-text("เปลี่ยนรหัสผ่าน")');
        this.submitButton = page.locator('button:has-text("ยืนยัน")');

        this.successMessage = page.locator('#swal2-html-container', { hasText: 'แก้ไขรหัสผ่านเรียบร้อย' });
        this.errorMessage = page.getByText(/กรุณากรอกรหัสผ่านปัจจุบัน|กรุณากรอกรหัสผ่านใหม่|กรุณากรอกยืนยันรหัสผ่าน|รหัสผ่านใหม่ไม่ตรงกัน|รหัสผ่านปัจจุบันไม่ถูกต้อง/);
    }

     /**
     * กรอกข้อมูลรหัสผ่าน
     * @param {string} currentPasswordInput - รหัสผ่านปัจจุบัน
     * @param {string} newPasswordInput - รหัสผ่านใหม่
     * @param {string} confirmPasswordInput - รหัสผ่านยืนยัน
     */
    async fillPassword(currentPasswordInput, newPasswordInput, confirmPasswordInput) {
        await this.currentPasswordInput.fill(currentPasswordInput || '');
        await this.newPasswordInput.fill(newPasswordInput || '');
        await this.confirmPasswordInput.fill(confirmPasswordInput || '');
    }

    /**
     * คลิกปุ่ม "ยืนยัน"
     */
    async clickSubmitPassword() {
        await this.submitButton.click();
    }

    /**
     * คลิกปุ่ม "เปลี่ยนรหัสผ่าน"
     */
    async clickChangeNewPassword() {
        await this.newUserPasswordButton.click();
    }

    /**
     * ฟังก์ชันคลิกเมนู "ตั้งค่ารหัสผ่าน"
     */
    async clickEditPasswordMenu() {
        await this.userIconLocator.click();

        await this.editPasswordMenu.waitFor({ state: 'visible', timeout: 3000 });
        await this.editPasswordMenu.click();
    }
}