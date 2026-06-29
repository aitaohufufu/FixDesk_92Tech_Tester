import { BasePage } from "./base.page";

export class TechRequestPage extends BasePage {
    constructor(page) {
        super(page);

        // ════ MENU ════
        this.stockMenu              = page.locator('a[title="รายการในคลัง"]');
        this.titleStockMenu         = page.locator('h1').filter({ hasText: 'รายการในคลัง' });

        this.stockReqMenu           = page.locator('a[title="รายการเบิกของฉัน"]');
        this.titleStockReqMenu      = page.locator('h1').filter({ hasText: 'รายการเบิกของฉัน' });

        // ════ STOCK LIST PAGE ════
        this.stockTitle             = page.locator('h3.text-sm.font-semibold.text-gray-800').first();
        this.addToCartBtn           = page.locator('button', { hasText: 'เพิ่มลงตะกร้า' });
        this.cartBtn                = page.locator('button.inline-flex.items-center.gap-2.bg-blue-700');
        this.proceedBtn             = page.locator('button', { hasText: 'ดำเนินการต่อ' });

        // ════ CART SIDEBAR ════
        this.cartSidebarTitle       = page.locator('h2 span', { hasText: 'รายการวัสดุ/อุปกรณ์ในตะกร้า' });
        this.cartItem               = page.locator('.flex.gap-3.p-3.border.rounded-xl');
        this.cartPlusBtn            = page.locator('button', { hasText: '+' });
        this.cartMinusBtn           = page.locator('button', { hasText: '−' });
        this.cartDeleteBtn          = page.locator('button.bg-red-500');

        // ════ REVIEW SIDEBAR ════
        this.reviewSidebarTitle     = page.locator('h2 span', { hasText: 'ตรวจสอบรายละเอียดการเบิก' });
        this.dateInput              = page.locator('input[type="date"]');
        this.submitFormBtn          = page.locator('button', { hasText: 'ส่งแบบฟอร์มคำขอเบิก' });
        this.backToSelectBtn        = page.locator('button', { hasText: 'กลับไปเลือกวัสดุ/อุปกรณ์เพิ่มเติม' });

        // ════ FROM DETAIL PAGE ════
        this.requisitionFromDetailBtn = page.getByRole('button', { name: 'เบิกวัสดุ' });
        this.requisitionBanner        = page.locator('div.fixed.bottom-6', { hasText: 'กำลังเบิกวัสดุ' });
   
        // ════ STOCK STATUS ════
        this.outOfStockBadge = page.locator('span.text-red-600.bg-red-50', { hasText: 'สินค้าหมด' });
        
        // ════ REQUISITION LIST PAGE ════
        this.reqListFirstLink       = page.locator('table tbody tr').first().locator('a.text-blue-600');

        // ════ REQUISITION DETAIL PAGE ════
        this.reqDetailMaterialTitle = page.locator('h3', { hasText: 'รายการวัสดุที่ต้องใช้' });
        this.reqDetailMaterialItem  = page.locator('.flex.items-center.justify-between.p-4.bg-gray-50\\/80.rounded-2xl');
       
        // ════ RETURN MODAL ════
        this.returnEquipBtn         = page.locator('button', { hasText: 'คืนอุปกรณ์' });
        this.returnModal            = page.locator('h2', { hasText: 'คืนอุปกรณ์' });
        this.returnModalCloseBtn    = page.locator('div.fixed').locator('button', { hasText: '✕' });
        this.selectAllCheckbox      = page.locator('label', { hasText: 'เลือกทั้งหมด' }).locator('input[type="checkbox"]');
        this.selectedCountText      = page.locator('span.text-sm.text-gray-500', { hasText: 'เลือก' });
        this.returnItemCheckbox     = page.locator('div.fixed div.p-4 div.p-3 input[type="checkbox"]');
        this.returnItemQtyInput     = page.locator('div.fixed div.p-4 div.p-3 input[type="number"]');
        this.returnItem             = page.locator('div.fixed div.p-4 div.p-3.border.rounded-lg');
        this.returnConfirmBtn       = page.locator('button', { hasText: 'คืนที่เลือก' });
        this.returnCancelBtn        = page.locator('div.fixed button', { hasText: 'ยกเลิก' });
        this.returnSuccessToast     = page.getByText('คืนอุปกรณ์สำเร็จ', { exact: false });
    }
    
    // ════ NAVIGATION ════
    async clickStockMenu() {
        await this.stockMenu.waitFor({ state: 'visible', timeout: 3000 });
        await this.stockMenu.click();
    }

    async clickMyRequestMenu() {
        await this.stockReqMenu.waitFor({ state: 'visible', timeout: 3000 });
        await this.stockReqMenu.click();
    }

    // ════ STOCK LIST — เพิ่มของลงตะกร้า ════
    async addProductToCart(productName) {
        const card = this.page.locator('div.p-3.flex.flex-col.flex-grow').filter({
            has: this.page.locator('h3', { hasText: productName })
        }).first();
        await card.getByRole('button', { name: 'เพิ่มลงตะกร้า' }).click();
    }
    async getAddToCartBtn(productName) {
        const card = this.page.locator('div.p-3.flex.flex-col.flex-grow').filter({
            has: this.page.locator('h3', { hasText: productName })
        }).first();
        return card.getByRole('button', { name: 'เพิ่มลงตะกร้า' });
    }

    async clickCartBtn() {
        await this.cartBtn.waitFor({ state: 'visible' });
        await this.cartBtn.click();
    }

    async clickProceed() {
        await this.proceedBtn.waitFor({ state: 'visible' });
        await this.proceedBtn.click();
    }

    // ════ REVIEW SIDEBAR ════
    async fillDate(dateStr) {
        await this.dateInput.waitFor({ state: 'visible' });
        await this.dateInput.fill(dateStr);
    }

    async clickSubmitForm() {
        await this.submitFormBtn.waitFor({ state: 'visible' });
        await this.submitFormBtn.click();
    }

    async clickBackToSelect() {
        await this.backToSelectBtn.waitFor({ state: 'visible' });
        await this.backToSelectBtn.click();
    }

    // ════ FROM DETAIL PAGE ════
    async clickRequisitionFromDetail() {
        await this.requisitionFromDetailBtn.waitFor({ state: 'visible' });
        await this.requisitionFromDetailBtn.click();
    }

    async clickFirstReqLink() {
        await this.reqListFirstLink.waitFor({ state: 'visible' });
        await this.reqListFirstLink.click();
    }


    // ════ RETURN MODAL ════
    async clickReturnEquipBtn() {
        await this.returnEquipBtn.waitFor({ state: 'visible' });
        await this.returnEquipBtn.click();
    }

    async clickSelectAll() {
        await this.selectAllCheckbox.waitFor({ state: 'visible' });
        await this.selectAllCheckbox.click();
    }

    async clickReturnConfirm() {
        await this.returnConfirmBtn.waitFor({ state: 'visible' });
        await this.returnConfirmBtn.isEnabled();
        await this.returnConfirmBtn.click();
    }

    async clickReturnCancel() {
        await this.returnCancelBtn.waitFor({ state: 'visible' });
        await this.returnCancelBtn.click();
    }

    /** เลือก checkbox รายการที่ index (0-based) แล้วระบุจำนวน */
    async selectReturnItem(index, qty) {
        await this.returnItemCheckbox.nth(index).waitFor({ state: 'visible' });
        await this.returnItemCheckbox.nth(index).click();
        await this.returnItemQtyInput.nth(index).fill(String(qty));
}
}