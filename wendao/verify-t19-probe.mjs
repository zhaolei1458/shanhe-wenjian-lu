/* T19 诊断探针：复刻 verify 的邪修存档与红尘劫探索循环，逐轮打印状态 */
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
await new Promise(r => server.listen(8892, '127.0.0.1', r));

const browser = await puppeteer.launch({ headless: 'new', executablePath: CHROME, args: ['--no-sandbox', '--disable-gpu'], defaultViewport: { width: 1280, height: 760 } });
const page = await browser.newPage();
page.on('pageerror', e => console.log('[PAGEERROR]', String(e).split('\n')[0]));

// 剧情静默器（同 verify）
await page.evaluateOnNewDocument(() => {
  const t = setInterval(() => {
    if (!window.Story || window.Story.__silenced) return;
    clearInterval(t);
    window.Story.__silenced = true;
    window.Story.play = function (script, onEnd) {
      try {
        if (script && script.id && window.Game && Game.player && Game.player.story) {
          Game.player.story.seen[script.id] = Math.floor(Game.player.day || 0) + 1;
          const ch = (script.scenes || []).find(s => s.t === 'choice');
          if (ch && ch.options && ch.options[0]) {
            Story.recordChoice(script.id, ch.options[0].value);
            if (ch.options[0].flag) Story.setFlag(ch.options[0].flag);
          }
        }
      } catch (e) {}
      if (onEnd) onEnd();
    };
  }, 40);
});

const sleep = ms => new Promise(r => setTimeout(r, ms));
await page.goto('http://127.0.0.1:8892/', { waitUntil: 'networkidle0' });
await sleep(700);

// ---- 建号：魔道命帖 ----
await page.evaluate(() => document.querySelector('[data-action="st-newgame"]')?.click());
await sleep(500);
await page.evaluate(() => document.querySelector('[data-fate="modao"]')?.click());
await sleep(300);
await page.evaluate(() => { const i = document.getElementById('create-name'); if (i) i.value = '探针'; });
await page.evaluate(() => document.querySelector('[data-action="st-start"]')?.click());
await sleep(1200);
await page.evaluate(() => document.querySelector('[data-action="tut-skip"]')?.click());
await sleep(500);

// ---- 存档改造成 T18 邪修形态 ----
await page.evaluate(() => {
  for (const key of ['fanren_wd_auto', 'fanren_wd_1', 'fanren_wd_2', 'fanren_wd_3']) {
    const raw = localStorage.getItem(key);
    if (!raw) continue;
    const sv = JSON.parse(raw);
    if (!sv || !sv.player) continue;
    const pl = sv.player;
    pl.realmIdx = 1; pl.layer = 0; pl.exp = 0; pl.dao = 'demonic';
    pl.karma = 0; pl.fortune = 0; pl.sect = null;
    pl.stones = Object.assign({}, pl.stones, { low: 1000, mid: 0, high: 0 });
    pl.attrs = Object.assign({}, pl.attrs, { gen: 9, comp: 5, luck: 5, body: 9 });
    pl.bag = Object.assign({}, pl.bag, { pill_liaoshang: 5 });
    sv.meta = Object.assign({}, sv.meta, { realmText: '测试', day: 60, age: 16 });
    localStorage.setItem(key, JSON.stringify(sv));
    console.log('patched', key);
  }
});
await page.reload({ waitUntil: 'networkidle0' });
await sleep(800);
// 继续游戏（st-load 带档位）
await page.evaluate(() => {
  const btn = document.querySelector('[data-action="st-load"][data-slot="3"]')
          || document.querySelector('[data-action="st-load"][data-slot="2"]')
          || document.querySelector('[data-action="st-load"][data-slot="1"]');
  btn?.click();
});
await sleep(1000);
await page.evaluate(() => document.querySelector('[data-action="tut-skip"]')?.click());
await sleep(400);
// 切到行走页签
await page.evaluate(() => document.querySelector('[data-action="act-tab"][data-tab="map"]')?.click());
await sleep(400);

// ---- T19 循环（15 轮插桩）----
const state = () => page.evaluate(() => {
  const vis = id => { const el = document.getElementById(id); return el ? !el.className.includes('hidden') : false; };
  const pl = (window.Game && Game.player) || {};
  let logTail = '';
  const logEl = document.querySelector('#log');
  if (logEl) logTail = logEl.innerText.slice(-150).replace(/\n+/g, ' | ');
  return {
    battle: vis('battle-modal'), popup: vis('popup-modal'), story: vis('story-modal'),
    popupTitle: (document.getElementById('popup-title') || {}).innerText || '',
    exploreBtn: !!document.querySelector('[data-action="act-explore"][data-map="village"]'),
    hp: pl.hp, hpMax: pl.hpMax, day: pl.day, dead: !!pl.dead,
    logTail,
  };
});

for (let i = 1; i <= 15; i++) {
  // clearBattle
  for (let t = 0; t < 40; t++) {
    const s = await state();
    if (!s.battle) break;
    await page.click('[data-action="bt-attack"]').catch(() => {});
    await sleep(850);
  }
  await page.click('[data-action="act-explore"][data-map="village"]').catch(() => {});
  await sleep(500);
  for (let t = 0; t < 40; t++) {
    const s = await state();
    if (!s.battle) break;
    await page.click('[data-action="bt-attack"]').catch(() => {});
    await sleep(850);
  }
  const s = await state();
  console.log(`[${i}] battle=${s.battle} popup=${s.popup} story=${s.story} title="${s.popupTitle}" exploreBtn=${s.exploreBtn} hp=${s.hp}/${s.hpMax} day=${s.day} dead=${s.dead}`);
  if (s.popup) {
    const bs = await page.$$('#popup-btns button');
    console.log(`    popup buttons=${bs.length} log="${s.logTail}"`);
    if (bs.length) { await bs[bs.length - 1].click().catch(() => {}); await sleep(300); }
  } else {
    console.log(`    log="${s.logTail}"`);
  }
  if (s.story) { console.log('    !! STORY MODAL OPEN'); break; }
}

await browser.close();
server.close();
process.exit(0);
