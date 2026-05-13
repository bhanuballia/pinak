const puppeteer = require('puppeteer');

(async () => {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        
        page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
        page.on('pageerror', err => console.log('BROWSER ERROR:', err.message));
        
        await page.goto('http://localhost:5173/'); // Go to root first to set localStorage
        await page.evaluate(() => {
            const mockData = {
                life_oracle: {
                    finance: {
                        score: 85,
                        label: 'Excellent',
                        color: 'excellent',
                        notes: ['Great wealth'],
                        planets: [{name: 'Jupiter', role: 'Karaka', strength: '100/150'}],
                        remedies: ['Worship'],
                        note: 'Test note'
                    }
                }
            };
            localStorage.setItem('worksheetData', JSON.stringify(mockData));
        });
        
        await page.goto('http://localhost:5173/?oracle=finance', { waitUntil: 'networkidle0' });
        
        const content = await page.content();
        if (content.includes('Divine insights')) {
            console.log('PAGE SHOWS: Divine insights');
        } else if (content.includes('Wealth & Prosperity Index')) {
            console.log('PAGE SHOWS: Finance Panel');
        } else if (content.includes('Invalid Oracle Category')) {
            console.log('PAGE SHOWS: Invalid Category');
        } else {
            const bodyText = await page.evaluate(() => document.body.innerText);
            console.log('PAGE BODY TEXT:', bodyText);
        }
        
        await browser.close();
    } catch (e) {
        console.error(e);
    }
})();
