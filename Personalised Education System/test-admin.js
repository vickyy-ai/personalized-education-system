const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
    page.on('pageerror', error => console.error('BROWSER ERROR:', error.message));

    await page.goto('http://localhost:8042/admin-users.html');

    // Evaluate if DB is present
    const isDB = await page.evaluate(() => typeof DB !== 'undefined');
    console.log('DB present:', isDB);

    // Call loadUsers manually in case it failed
    await page.evaluate(async () => {
        if (typeof loadUsers === 'function') {
            await loadUsers();
            console.log('Table HTML:', document.getElementById('usersTableBody').innerHTML);
        } else {
            console.log('loadUsers not found');
        }
    });

    await browser.close();
})();
