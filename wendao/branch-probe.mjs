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
await new Promise(r => server.listen(8897, '127.0.0.1', r));
const browser = await puppeteer.launch({ headless: 'new', executablePath: CHROME, args: ['--no-sandbox'], defaultViewport: { width: 1440, height: 800 } });
const page = await browser.newPage();
const errs = [];
page.on('pageerror', e => errs.push(String(e).split('\n')[0]));

for (const fate of ['modao', 'shuzu', 'jiangmen', 'shuxiang', 'shancun']) {
  await page.goto('http://127.0.0.1:8897/', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 700));
  await page.evaluate(() => { localStorage.clear(); });
  await page.reload({ waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 500));
  await page.evaluate(() => document.querySelector('[data-action="st-newgame"]')?.click());
  await new Promise(r => setTimeout(r, 400));
  await page.evaluate(id => document.querySelector(`[data-fate="${id}"]`)?.click(), fate);
  await new Promise(r => setTimeout(r, 300));
  await page.evaluate(() => { const i = document.getElementById('create-name'); i.value = '试局'; });
  await page.evaluate(() => document.querySelector('[data-action="st-start"]')?.click());
  await new Promise(r => setTimeout(r, 1400));
  const r = await page.evaluate(() => {
    const c1 = QuestSys.CHAPTERS[0];
    const c9 = QuestSys.CHAPTERS[8];
    const goal = document.getElementById('tab-content') ? (document.getElementById('tab-content').innerText || '') : '';
    return {
      fate: Game.player.fate ? Game.player.fate.id : null,
      c1: c1.title, c1Story: c1.story.slice(0, 12),
      c1Open: (GameData.STORIES.c1_open || {}).title,
      c9: c9.title,
      stepsN: c1.steps.length,
      chapterCount: QuestSys.CHAPTERS.length,
    };
  });
  console.log(JSON.stringify(r));
}
console.log('pageerrors:', errs.length ? errs : '无');
await browser.close();
server.close();
process.exit(0);
