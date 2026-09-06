/* 山河问剑录 · 视觉探针：拍 标题屏/命帖屏/游戏主屏 三张截图与参考比对 */
import puppeteer from 'puppeteer-core';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
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
await new Promise(r => server.listen(8891, '127.0.0.1', r));

const browser = await puppeteer.launch({ headless: 'new', executablePath: CHROME, args: ['--no-sandbox'], defaultViewport: { width: 1440, height: 800 } });
const page = await browser.newPage();
const errs = [];
page.on('pageerror', e => errs.push(String(e).split('\n')[0]));
page.on('console', m => { if (m.type() === 'error') errs.push(m.text().slice(0, 150)); });

await page.goto('http://127.0.0.1:8891/', { waitUntil: 'networkidle0' });
await new Promise(r => setTimeout(r, 700));
await page.screenshot({ path: 'shots/01-title.png' });

// 进创角（点第一个存档位的 开辟仙途）
await page.evaluate(() => { document.querySelector('[data-action="st-newgame"]')?.click(); });
await new Promise(r => setTimeout(r, 500));
// 选第二张命帖
await page.evaluate(() => { document.querySelector('[data-fate="modao"]')?.click(); });
await new Promise(r => setTimeout(r, 400));
await page.screenshot({ path: 'shots/02-create-fates.png' });

// 起名入世
await page.evaluate(() => { const i = document.getElementById('create-name'); i.value = '沈砚'; });
await page.evaluate(() => { document.querySelector('[data-action="st-start"]')?.click(); });
await new Promise(r => setTimeout(r, 1200));
// 关掉新手引导
await page.evaluate(() => { document.querySelector('[data-action="tut-skip"]')?.click(); });
await new Promise(r => setTimeout(r, 600));
// 切到问道页签（主线章回）
await page.evaluate(() => { document.querySelector('[data-tab="quest"]')?.click(); });
await new Promise(r => setTimeout(r, 500));
await page.screenshot({ path: 'shots/03-game-quest.png' });
// 行走（游历页签）
await page.evaluate(() => { document.querySelector('[data-tab="map"]')?.click(); });
await new Promise(r => setTimeout(r, 500));
await page.screenshot({ path: 'shots/04-game-map.png' });

console.log('console/page errors:', errs.length ? errs : '无');
await browser.close();
server.close();
process.exit(0);
