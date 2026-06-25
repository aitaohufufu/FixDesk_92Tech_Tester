import { BasePage } from './base.page.js';

export class UserManagementPage extends BasePage {

    /**
     * 
     * @param {import('@playwright/test').Page} page 
     */
    constructor(page) {
        super(page);

        this.userMenu = page.locator('a[title="ข้อมูลผู้ใช้"]');

        this.userTitle = page.getByRole('heading', { name: "จัดการข้อมูลผู้ใช้งานระบบ" });
        this.detailModalTitle = page.getByRole('heading', { name: 'รายละเอียดผู้ใช้งาน (ไม่สามารถแก้ไขได้)' });
        this.createModalTitle = page.getByRole('heading', { name: 'เพิ่มผู้ใช้งานใหม่' });

        this.searchInput = page.getByPlaceholder('ค้นหารายการผู้ใช้');

        this.tableRows = page.locator('table tbody tr');

        this.modalTitle = page.getByRole('heading', { name: 'เพิ่มผู้ใช้งานใหม่' });
        this.usernameInput = page.getByPlaceholder('กรอกชื่อผู้ใช้');
        this.prefixSelect = page.locator('select').nth(0);
        this.positionInput = page.getByPlaceholder('กรอกตำแหน่งบุคลากร');
        this.firstNameThInput = page.getByPlaceholder('กรอกชื่อ', { exact: true });
        this.lastNameThInput = page.getByPlaceholder('กรอกนามสกุล', { exact: true });
        this.firstNameEnInput = page.getByPlaceholder('First Name');
        this.lastNameEnInput = page.getByPlaceholder('Last Name');
        this.phoneInput = page.getByPlaceholder('กรอกเบอร์โทรศัพท์');
        this.departmentInput = page.getByPlaceholder('กรอกชื่อหน่วยงาน');
        this.roleSelect = page.locator('select').nth(1);

        this.kebabButton = page.locator('button[title="เมนู"]');
        this.detailButton = page.getByRole('button', { name: 'รายละเอียด' });
        this.createButton = page.getByRole('button', { name: 'เพิ่มผู้ใช้' });
        this.submitCreateButton = page.getByRole('button', { name: 'เพิ่มผู้ใช้งาน' });
        this.submitButton = page.getByRole('button', { name: 'ยืนยัน' });
        this.deleteButton = page.getByRole('button', { name: 'ลบ' });
    }

    /**
     * คลิกเมนู "จัดการผู้ใช้"
     */
    async clickUserMenu() {
        await this.userMenu.click();
    }


}