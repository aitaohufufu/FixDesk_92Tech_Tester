import { expect } from '@playwright/test';

/**
 * ฟังก์ชันส่งผลการทดสอบไปยัง Google Sheets
 * @param {Object} page 
 * @param {Object} request 
 * @param {Object} testInfo - รายละเอียดกรณีทดสอบ
 * @param {string} sheetName - ชื่อชีต
 * @returns 
 */
export async function sendTestReport(page, request, testInfo, sheetName) {

    const testIdMatch = testInfo.title.match(/[A-Z_]+(?:-[A-Z_]+)*-\d+/);
    
    if (!testIdMatch) return;

    const testId = testIdMatch[0];
    let screenshotBase64 = null;

    try {
        await page.waitForTimeout(1000);
        const screenshotBuffer = await page.screenshot({ type: 'jpeg', quality: 50 });
        screenshotBase64 = screenshotBuffer.toString('base64');
    } catch (e) {
        console.log(`[${testId}] Could not take screenshot: `, e);
    }

    const apiUrl = process.env.GOOGLE_SHEET_API_URL;
    if (!apiUrl) {
        console.error('Error: GOOGLE_SHEET_API_URL is not defined in .env file');
        return;
    }

    try {
        const response = await request.post(apiUrl, {
            data: {
                sheetName: sheetName,
                testId: testId,
                status: testInfo.status,
                screenshot: screenshotBase64,
            }
        });
        
        const responseText = await response.text();
        console.log(`[${testId}] Updated status: ${testInfo.status} | GAS Response: ${responseText}`);
    } catch (error) {
        console.error(`[${testId}] Failed to send API report:`, error);
    }
}