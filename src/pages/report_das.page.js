import { BasePage } from './base.page';

export class ReportDasPage extends BasePage {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        super(page);

        // Locators
        this.dashboardMenu = page.locator('a[title="หน้าสรุปผล"]');
        this.dashboardTitle = page.locator(
            'span',
            { hasText: 'หน้าจอหลักของผู้บริหาร - สวัสดีคุณผู้ใช้งาน' }
          );
        
       // ════ Filter ════
       this.yearDropdown  = page.locator('select').nth(0);
       this.monthDropdown = page.locator('select').nth(1);

      //  KPI locator
        this.kpiTotalJobs  = page.getByRole('paragraph').filter({ hasText: 'งานซ่อมทั้งหมด' });
        this.kpiPending    = page.getByRole('paragraph').filter({ hasText: 'รอดำเนินการทั้งหมด' });
        this.kpiInProgress = page.getByRole('paragraph').filter({ hasText: 'กำลังดำเนินการทั้งหมด' });
        this.kpiDone       = page.getByRole('paragraph').filter({ hasText: 'เสร็จสิ้นทั้งหมด' });

       // ════ กราฟ ════
       this.chartMonthly       = page.locator('text=ปริมาณงานแจ้งซ่อมรายเดือน').locator('..').locator('..');
       this.chartPieStatus     = page.locator('text=สัดส่วนสถานะงานแจ้งซ่อม').locator('..').locator('..');
       this.chartWeeklyTrend   = page.locator('text=แนวโน้มปริมาณงานแจ้งซ่อมรายวัน').locator('..').locator('..');
       this.chartSuccessRate   = page.locator('text=อัตราความสำเร็จการปฏิบัติงานของช่างแต่ละแผนก').locator('..').locator('..');
       this.chartByType        = page.locator('text=ปริมาณงานแจ้งซ่อมจำแนกตามประเภท').locator('..').locator('..');
       this.chartByUnit        = page.locator('text=ปริมาณการแจ้งซ่อมจำแนกตามหน่วยงาน').locator('..').locator('..');
       this.chartInternalVsExt = page.locator('text=จำนวนการปิดงานของช่างภายในและช่างภายนอก').locator('..').locator('..');

       // toggle สัปดาห์/เดือน (มีหลายอัน)
       this.toggleWeek  = page.locator('button:has-text("สัปดาห์")');
       this.toggleMonth = page.locator('button:has-text("เดือน")');
   }


     /**
     * ฟังก์ชันคลิกเมนู "Dashboard"
     */
     async clickDashboard() {
       await this.dashboardMenu.waitFor({ state: 'visible', timeout: 3000 });
         await this.dashboardMenu.click();
    }
 
    async selectMonth(month) {
        await this.monthDropdown.selectOption(month.toString());
    }
 
    async selectYear(year) {
        await this.yearDropdown.selectOption(year.toString());
    }
    
 
}