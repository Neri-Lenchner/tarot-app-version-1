const { chromium } = require('playwright');
const TOKEN = process.argv[2];

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    page.on('console', msg => console.log('[console]', msg.type(), msg.text()));
    page.on('pageerror', err => console.log('[pageerror]', err.message));
    page.on('requestfailed', req => console.log('[requestfailed]', req.url(), req.failure()?.errorText));

    await page.goto('http://localhost:3000/');
    await page.evaluate((t) => localStorage.setItem('tarot-token', t), TOKEN);
    await page.goto('http://localhost:3000/three-cards-spread');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    const svgCount = await page.locator('svg.lucide').count();
    console.log('lucide svg count on page:', svgCount);
    const iwToggleHtml = await page.locator('.iw-toggle-btn').innerHTML().catch(() => '(not found)');
    console.log('iw-toggle-btn innerHTML:', iwToggleHtml);

    await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
