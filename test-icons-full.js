const { chromium } = require('playwright');
const TOKEN = process.argv[2];

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    page.on('pageerror', err => console.log('[pageerror]', err.message));

    await page.route('**/api/tarot/interpret', async route => {
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ interpretation: 'MOCK\n\n**Conclusion**\nMock.' }) });
    });
    await page.route('**/api/tarot/translate', async route => {
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ translation: 'מוק' }) });
    });
    await page.route('**/api/tarot/check-combinations', async route => {
        const body = route.request().postDataJSON();
        const [c1, c2] = body.cardNames;
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([{ cards: [c1, c2], meaning: 'Mock meaning', meaning_he: 'משמעות', source: 'general', category: 'MOCK', category_he: 'מוק' }]) });
    });

    await page.goto('http://localhost:3000/');
    await page.evaluate((t) => localStorage.setItem('tarot-token', t), TOKEN);

    // Give any pending Vite HMR from concurrent edits time to fully settle
    // before measuring anything, so this isn't racing a hot-reload.
    await page.goto('http://localhost:3000/three-cards-spread');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2500);

    console.log('--- bare page (no spread yet) ---');
    console.log('lucide count:', await page.locator('svg.lucide').count());

    await page.fill('.spread-question-input', 'Full icon check');
    await page.press('.spread-question-input', 'Enter');
    await page.waitForSelector('.iw-result', { timeout: 15000 });
    await page.waitForSelector('.combo-confirm-btn', { timeout: 10000 });
    await page.waitForTimeout(500);

    console.log('--- after spread + interpretation (widget/conclusion/combo all open) ---');
    console.log('lucide count:', await page.locator('svg.lucide').count());
    const classes = await page.locator('svg.lucide').evaluateAll(els => els.map(el => el.getAttribute('class')));
    console.log('lucide icon classes found:', JSON.stringify(classes));

    await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
