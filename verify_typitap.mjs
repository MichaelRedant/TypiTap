import { chromium } from '@playwright/test';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
const errors = [];
page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
page.on('pageerror', err => errors.push(err.message));

// Step 1
await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
await page.screenshot({ path: 'C:/Users/donmi/Desktop/typitap_01_home.png' });
const h1 = await page.locator('h1').textContent();
console.log('Step 1 - H1:', h1?.trim());
const playBtnCount = await page.locator('button').filter({ hasText: /Spelen|Doorgaan/ }).count();
console.log('Step 1 - Play button visible:', playBtnCount > 0);

// Step 2
await page.locator('button').filter({ hasText: /Spelen|Doorgaan/ }).first().click();
await page.waitForTimeout(600);
await page.screenshot({ path: 'C:/Users/donmi/Desktop/typitap_02_levelmap.png' });
const chapterTitle = await page.locator('h2').first().textContent();
console.log('Step 2 - Chapter title:', chapterTitle?.trim());

// Step 3
await page.locator('button').filter({ hasText: /Hallo/ }).first().click();
await page.waitForTimeout(600);
await page.screenshot({ path: 'C:/Users/donmi/Desktop/typitap_03_game.png' });
const gameH1 = await page.locator('h1').first().textContent();
console.log('Step 3 - Game H1:', gameH1?.trim());

// Step 4 - correct key
await page.keyboard.press('f');
await page.waitForTimeout(200);
await page.screenshot({ path: 'C:/Users/donmi/Desktop/typitap_04_correct.png' });
console.log('Step 4 - Typed f');

// Step 5 - wrong key
await page.keyboard.press('x');
await page.waitForTimeout(350);
await page.screenshot({ path: 'C:/Users/donmi/Desktop/typitap_05_wrong.png' });
console.log('Step 5 - Typed x (wrong)');

console.log('Errors:', errors.length ? errors : 'none');
await browser.close();
process.exit(0);
