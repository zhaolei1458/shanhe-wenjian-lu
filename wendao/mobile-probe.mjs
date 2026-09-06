import puppeteer from 'puppeteer-core';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/, '$1'));
const CHROME = 'C:/Users/Administrator/AppData/Local/Google/Chrome/Bin/chrome.exe';
const server = http.createServer((req, res) => {
  const p = decodeURIComponent(req.url.split('?')[0]);
  const fp = path.join(ROOT, p === '/' ? 'index.html' : p);
  fs.readFile(fp, (err, data) => {
    if (err) { res.writeHead(404); res.end('no'); return; }
    const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml' }[path.extname(fp)] || 'application/octet-stream';
    res.writeHead(200, { 'content-type': mime });
    res.end(data);
  });
});
await new Promise(r => server.listen(8898, '127.0.0.1', r));
const browser = await puppeteer.launch({ headless: 'new', executablePath: CHROME, args: ['--no-sandbox'] });

// 1) 竖屏：应显示横屏提示遮罩
let page = await browser.newPage();
await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
await page.goto('http://127.0.0.1:8898/', { waitUntil: 'networkidle0' });
await new Promise(r => setTimeout(r, 700));
await page.screenshot({ path: 'shots/06-mobile-portrait.png' });
console.log('竖屏遮罩可见:', await page.evaluate(() => getComputedStyle(document.getElementById('rotate-hint')).display));
await page.close();

// 2) 横屏手机：标题屏
page = await browser.newPage();
await page.setViewport({ width: 844, height: 390, isMobile: true, hasTouch: true });
await page.goto('http://127.0.0.1:8898/', { waitUntil: 'networkidle0' });
await new Promise(r => setTimeout(r, 700));
await page.screenshot({ path: 'shots/07-mobile-landscape-title.png' });
console.log('横屏遮罩隐藏:', await page.evaluate(() => getComputedStyle(document.getElementById('rotate-hint')).display));

// 3) 横屏手机：游戏内
await page.evaluate(() => document.querySelector('[data-action="st-newgame"]')?.click());
await new Promise(r => setTimeout(r, 400));
await page.evaluate(() => document.querySelector('[data-fate="modao"]')?.click());
await new Promise(r => setTimeout(r, 300));
await page.evaluate(() => { const i = document.getElementById('create-name'); i.value = '横屏客'; });
await page.evaluate(() => document.querySelector('[data-action="st-start"]')?.click());
await new Promise(r => setTimeout(r, 1400));
await page.evaluate(() => document.querySelector('[data-action="tut-skip"]')?.click());
await new Promise(r => setTimeout(r, 500));
await page.evaluate(() => document.querySelector('[data-action="story-next"]')?.click());
await new Promise(r => setTimeout(r, 400));
await page.evaluate(() => document.querySelector('[data-action="story-next"]')?.click());
await new Promise(r => setTimeout(r, 400));
await page.evaluate(() => document.querySelector('[data-action="story-next"]')?.click());
await new Promise(r => setTimeout(r, 600));
await page.screenshot({ path: 'shots/08-mobile-landscape-game.png' });
console.log('游戏内布局 grid:', await page.evaluate(() => getComputedStyle(document.getElementById('layout')).gridTemplateColumns));
await browser.close();
server.close();
process.exit(0);
