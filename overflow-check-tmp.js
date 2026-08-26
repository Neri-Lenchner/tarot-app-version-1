const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch();
    const email = `t${Date.now()}@test.com`;

    for (const vp of [{ width: 1024, height: 768 }, { width: 900, height: 700 }, { width: 800, height: 700 }, { width: 769, height: 700 }]) {
        const page = await browser.newPage({ viewport: vp });
        await page.goto('http://localhost:3002/register');
        await page.waitForTimeout(400);
        await page.fill('input[name="firstName"]', 'Test');
        await page.fill('input[name="lastName"]', 'User');
        await page.fill('input[name="email"]', `${vp.width}-${email}`);
        await page.fill('input[name="password"]', 'test1234');
        await page.locator('.auth-gender-btn').first().click();
        await page.click('button[type="submit"]');
        await page.waitForTimeout(1200);

        for (const [name, url] of [
            ['home', '/'],
            ['celtic', '/celtic-spread-global'],
            ['three-cards', '/three-cards-spread'],
            ['deck', '/tarot-deck'],
            ['my-spreads', '/my-spreads'],
        ]) {
            await page.goto('http://localhost:3002' + url);
            await page.waitForTimeout(600);
            const info = await page.evaluate(() => ({
                scrollWidth: document.documentElement.scrollWidth,
                innerWidth: window.innerWidth,
            }));
            const overflow = info.scrollWidth - info.innerWidth;
            console.log(`vp=${vp.width} page=${name} scrollWidth=${info.scrollWidth} innerWidth=${info.innerWidth} overflow=${overflow}`);
        }

        // Celtic after spreading
        await page.goto('http://localhost:3002/celtic-spread-global');
        await page.waitForTimeout(600);
        const spreadBtn = page.locator('button:has-text("Spread Them")').first();
        await spreadBtn.click();
        await page.waitForTimeout(1000);
        const info2 = await page.evaluate(() => ({
            scrollWidth: document.documentElement.scrollWidth,
            innerWidth: window.innerWidth,
        }));
        console.log(`vp=${vp.width} page=celtic-spread scrollWidth=${info2.scrollWidth} innerWidth=${info2.innerWidth} overflow=${info2.scrollWidth - info2.innerWidth}`);

        await page.close();
    }

    await browser.close();
})();
