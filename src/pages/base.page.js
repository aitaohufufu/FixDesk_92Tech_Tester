export class BasePage {

    /**
     * 
     * @param {import('@playwright/test').Page} page 
     */
    constructor(page) {
        this.page = page;

        this.path = '/';
    }

    /**
     * ตรวจสอบ URL ปัจจุบันกับ pattern ที่กำหนด
     *
     * @param {string | RegExp} pattern
     * @returns {boolean} true: ตรง, false: ไม่ตรง
     */
    isURL(pattern) {
        const currentUrl = this.page.url();

        if (pattern instanceof RegExp) {
            return pattern.test(currentUrl);
        }

        return currentUrl.includes(pattern);
    }

    /**
     * ฟังก์ชันเปิดหน้าเว็บตาม path ของเพจนั้นๆ
     */
    async goto() {
        await this.page.goto(this.path);
    }
}