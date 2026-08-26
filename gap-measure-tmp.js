const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage({ viewport: { width: 1024, height: 800 } });
    const email = `t${Date.now()}@test.com`;

    await page.goto('http://localhost:3002/register');
    await page.waitForTimeout(400);
    await page.fill('input[name="firstName"]', 'Test');
    await page.fill('input[name="lastName"]', 'User');
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', 'test1234');
    await page.locator('.auth-gender-btn').first().click();
    await page.click('button[type="submit"]');
    await page.waitForTimeout(1200);

    await page.goto('http://localhost:3002/celtic-spread-global');
    await page.waitForTimeout(700);
    await page.click('.header-lang-btn');
    await page.waitForTimeout(400);

    const info = await page.evaluate(() => {
        const container = document.querySelector('.spread-container');
        const cRect = container.getBoundingClientRect();
        function get(cls) {
            const el = document.querySelector('.' + cls);
            if (!el) return null;
            const r = el.getBoundingClientRect();
            return { left: r.left - cRect.left, right: r.right - cRect.left, width: r.width };
        }
        const result = { containerWidth: cRect.width };
        for (let i = 1; i <= 10; i++) result['card-container-' + i] = get('card-container-' + i);
        result['ready-questions-stack'] = get('ready-questions-stack');
        return result;
    });
    console.log(JSON.stringify(info, null, 1));

    const btnInfo = await page.evaluate(() => {
        const container = document.querySelector('.ready-questions-stack');
        const cRect = container.getBoundingClientRect();
        const title = document.querySelector('.ready-questions-title');
        const btns = [...document.querySelectorAll('.ready-question')];
        function measure(el) {
            const r = el.getBoundingClientRect();
            const cs = getComputedStyle(el);
            return {
                text: el.textContent,
                left: r.left - cRect.left, right: r.right - cRect.left, width: r.width,
                dir: el.getAttribute('dir'), direction: cs.direction,
                boxSizing: cs.boxSizing, cssWidth: cs.width, paddingLeft: cs.paddingLeft, paddingRight: cs.paddingRight,
            };
        }
        return { container: { left: 0, right: cRect.width, width: cRect.width }, title: measure(title), buttons: btns.map(measure) };
    });
    console.log('info:', JSON.stringify(btnInfo, null, 1));

    await page.screenshot({ path: require('path').resolve(__dirname, 'celtic-1024.png') });

    await browser.close();
})();
