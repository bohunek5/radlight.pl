const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
  await page.goto('http://localhost:3000/apartamenty.html');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'mobile_apartamenty.png', fullPage: true });
  
  const desktopPage = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await desktopPage.goto('http://localhost:3000/apartamenty.html');
  await desktopPage.waitForTimeout(1000);
  await desktopPage.screenshot({ path: 'desktop_apartamenty.png', fullPage: true });
  
  await browser.close();
})();
