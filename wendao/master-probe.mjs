/* 3.6a 师承系统探针：拜师三关 → 教导五事 → 护道 → 衣钵 全链黑盒验证 */
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
    res.writeHead(200, { 'content-type': 'text/html' });
    res.end(data);
  });
});
await new Promise(r => server.listen(8902, '127.0.0.1', r));
const browser = await puppeteer.launch({ headless: 'new', executablePath: CHROME, args: ['--no-sandbox'], protocolTimeout: 8000 });
const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 800 });
const errors = [];
page.on('dialog', d => { console.log('NATIVE-DIALOG:', d.message().slice(0, 60)); d.dismiss().catch(() => {}); });
page.on('pageerror', e => errors.push('PAGEERROR: ' + e.message));
page.on('console', msg => { if (msg.type() === 'error') errors.push('CONSOLE: ' + msg.text()); });

let passN = 0, failN = 0;
const pass = (t) => { passN++; console.log('  ✓ ' + t); };
const fail = (t, x) => { failN++; console.log('  ✗ ' + t + (x ? ' —— ' + x : '')); };
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const cdp = await page.createCDPSession();
await cdp.send('Debugger.enable').catch(() => {});
cdp.on('Debugger.paused', ev => {
  console.log('=== 主线程阻塞调用栈（顶层 8 帧）===');
  for (const f of ev.callFrames.slice(0, 8)) console.log('   ', f.functionName || '(匿名)', '@', f.url.split('/').pop() + ':' + f.location.lineNumber);
  cdp.send('Debugger.resume').catch(() => {});
});
const alive = async (tag) => { try { await page.evaluate(() => 1); console.log('  [alive]', tag); } catch (e) { console.log('  [BLOCKED]', tag); try { await cdp.send('Debugger.pause'); } catch (e2) {} throw e; } };

await page.goto('http://127.0.0.1:8902/', { waitUntil: 'networkidle0' });
await sleep(600);

/* 创角入世 */
await page.evaluate(() => document.querySelector('[data-action="st-newgame"][data-slot="1"]')?.click());
await sleep(300);
await page.evaluate(() => { document.getElementById('create-name').value = '拜师探针'; });
await page.evaluate(() => document.querySelector('[data-action="st-start"]')?.click());
await sleep(400);
for (let i = 0; i < 6; i++) {
  const has = await page.evaluate(() => { const b = document.querySelector('[data-action="tut-next"]'); if (!b) return false; b.click(); return true; });
  if (!has) break;
  await sleep(100);
}
for (let i = 0; i < 10; i++) {
  const hidden = await page.evaluate(() => { const sb = document.getElementById('story-box'); return !sb || sb.className.includes('hidden'); });
  if (hidden) break;
  await page.evaluate(() => { const b = document.querySelector('#story-box [data-action]'); if (b) b.click(); });
  await sleep(150);
}
await page.evaluate(() => { if (UI._popupResolve) UI.popupChoose(0); document.getElementById('popup-modal')?.classList.add('hidden'); });
await sleep(200);

/* T1 师承页签存在且渲染名册 */
await page.evaluate(() => { document.querySelector('[data-action="act-tab"][data-tab="master"]')?.click(); });
await sleep(300);
const rosterN = await page.evaluate(() => Object.keys(MasterSys.DEFS).length);
rosterN === 8 ? pass('T1 师父池 8 位散人') : fail('T1 师父池', String(rosterN));
const tabHtml = await page.evaluate(() => document.getElementById('tab-content').innerHTML);
tabHtml.includes('叶孤鸿') && tabHtml.includes('云无月') && tabHtml.includes('老酒鬼') ? pass('T1 名册渲染含叶孤鸿/云无月/老酒鬼') : fail('T1 名册渲染', '');

await alive('T1 后');
/* T2 好感不足递帖被拒 */
const denied = await page.evaluate(() => {
  const p = Game.player;
  p.npcs.n4.met = true;
  p.npcs.n4.rel = 10;
  MasterSys.baishi('n4');
  return !p.master;
});
denied ? pass('T2 交情不足 10/55 递帖被拒') : fail('T2 递帖门槛', '');

await alive('T2 后');
await alive('T2 后 +1s');
await page.evaluate(() => { document.querySelector('[data-action="act-tab"][data-tab="cultivate"]')?.click(); });
await alive('切回修炼页');
/* T3 交情到位 → 考验开启（切磋自动开场）
   注意：baishi 是 async，内部 await UI.popup 等玩家点帖——绝不能把它的 Promise
   交给 page.evaluate 等待（会永久挂起）。void 掉 + 延时单独点弹窗。 */
await page.evaluate(() => { Game.player.npcs.n4.rel = 60; void MasterSys.baishi('n4'); });
await sleep(500);
await page.evaluate(() => { if (UI._popupResolve) UI.popupChoose(0); });
await sleep(500);
const trialState = await page.evaluate(() => {
  const m = Game.player.master;
  return m ? `${m.stage}:${m.trial.kind}:battle=${!!Battle.active}` : 'none';
});
trialState === 'trial:spar:battle=true' ? pass('T3 递帖成，考验【接他三刀】切磋已开场') : fail('T3 考验开启', trialState);

/* T4 强制胜切磋 → trialReady → 奉礼转正 */
await page.evaluate(() => { if (Battle.active) Battle.active.enemy.hp = 1; });
for (let i = 0; i < 14; i++) {
  const over = await page.evaluate(() => !Battle.active);
  if (over) break;
  await page.evaluate(() => { if (Battle.active && !Battle.active.busy) void Battle.act('attack'); });
  await sleep(500);
}
await sleep(600);
const won = await page.evaluate(() => MasterSys.trialReady(Game.player));
won ? pass('T4 切磋获胜，考验达成') : fail('T4 考验达成', '');
await page.evaluate(() => { Game.player.stones.mid += 60; void MasterSys.offerGift(); });   // 60 中品 = 6000 下品，顺带验证总资产门槛
await sleep(300);
await page.evaluate(() => { if (UI._popupResolve) UI.popupChoose(0); });
await sleep(300);
const active = await page.evaluate(() => { const m = Game.player.master; return m ? `${m.stage}:bond=${m.bond}` : 'none'; });
active.startsWith('active:bond=35') ? pass('T5 奉礼转正，敬师 35') : fail('T5 转正', active);

/* T6 请安：bond 涨且当日仅一次 */
const b1 = await page.evaluate(() => { MasterSys.qingan(); return Game.player.master.bond; });
const b2 = await page.evaluate(() => { MasterSys.qingan(); return Game.player.master.bond; });
(b2 > b1) ? pass(`T6 请安敬师 +${b2 - b1}`) : fail('T6 请安', `${b1}→${b2}`);
/* 请安内部 Time.add(1) 会推进天数，三次调用前把日钉回 qinganDay 才构成"同日" */
const b3 = await page.evaluate(() => {
  const m = Game.player.master;
  const diag = { qd: m.qinganDay, dayBefore: Game.player.day };
  Game.player.day = m.qinganDay;
  diag.dayPinned = Game.player.day;
  const before = m.bond;
  MasterSys.qingan();
  diag.same = before === m.bond; diag.after = m.bond;
  return diag;
});
b3.same ? pass('T6 同日二次请安无效') : fail('T6 二次请安未拦截', JSON.stringify(b3));

/* T7 师命：接→杀→复命 */
await page.evaluate(() => MasterSys.taskAccept());
await sleep(200);
const task = await page.evaluate(() => Game.player.master.task);
task ? pass(`T7 领师命【${task.name}】`) : fail('T7 接师命', '');
if (task) {
  if (task.type === 'kill') {
    await page.evaluate((tid) => { const m = Game.player.master; m.task.progress = m.task.need - 1; MasterSys.onKill(m.task.target); }, task.target);
  } else {
    await page.evaluate((tid) => { Bag.addItem(tid, Game.player.master.task.need); }, task.target);
  }
  const done = await page.evaluate(() => { const t = Game.player.master.task; return t.type === 'kill' ? t.progress >= t.need : Bag.count(t.target) >= t.need; });
  done ? pass(`T7 师命进度记满（${task.type === 'kill' ? '讨伐' : '备办'}）`) : fail('T7 师命进度', '');
  const stones0 = await page.evaluate(() => { const s = Game.player.stones; return s.low + s.mid * 100 + s.high * 10000; });
  await page.evaluate(() => MasterSys.taskSubmit());
  await sleep(150);
  const claim = await page.evaluate(() => { const s = Game.player.stones; return { bond: Game.player.master.bond, stones: s.low + s.mid * 100 + s.high * 10000, task: Game.player.master.task }; });
  claim.task === null && claim.bond > b2 ? pass(`T7 复命：灵石 +${claim.stones - stones0}，敬师 +${claim.bond - b2}`) : fail('T7 复命', JSON.stringify(claim));
}

/* T8 求传功：门槛与发放 */
const teachDeny = await page.evaluate(() => { const p = Game.player; p.master.bond = 50; const has0 = !!p.bag['gf_hansha']; MasterSys.teach(); return !has0 && !p.bag['gf_hansha']; });
teachDeny ? pass('T8 敬师 50 < 60 拒传') : fail('T8 传功门槛', '');
await page.evaluate(() => { const p = Game.player; p.master.bond = 75; p.realmIdx = Math.max(p.realmIdx, 1); MasterSys.teach(); });
await sleep(250);
await page.evaluate(() => { if (UI._popupResolve) UI.popupChoose(0); });
await sleep(250);
const taught = await page.evaluate(() => !!Game.player.bag['gf_hansha']);
taught ? pass('T8 敬师 75 + 境界达标 → 获授【寒沙掌】') : fail('T8 传功发放', '');

/* T9 传艺被动两档 */
const bonus = await page.evaluate(() => MasterSys.bonusOf(Game.player));
bonus.atkPct === 6 ? pass('T9 敬师 75 满效传艺（攻 +6%）') : fail('T9 满效传艺', JSON.stringify(bonus));
await page.evaluate(() => { Game.player.master.bond = 45; });
const bonusHalf = await page.evaluate(() => MasterSys.bonusOf(Game.player));
bonusHalf.atkPct === 3 ? pass('T9 敬师 45 半效（攻 +3%）') : fail('T9 半效传艺', JSON.stringify(bonusHalf));
await page.evaluate(() => { Game.player.master.bond = 75; });

/* T10 护道：触发一次 + 当日不再 */
const p1 = await page.evaluate(() => MasterSys.tryProtect(Game.player));
const p2 = await page.evaluate(() => MasterSys.tryProtect(Game.player));
(p1 && p1.name === '叶孤鸿' && !p2) ? pass('T10 护道出手一次/日（叶孤鸿）') : fail('T10 护道', JSON.stringify([p1, p2]));
const bondAfterProtect = await page.evaluate(() => Game.player.master.bond);
bondAfterProtect === 55 ? pass('T10 护道耗敬师 20（75→55）') : fail('T10 护道扣减', String(bondAfterProtect));

/* T11 衣钵：师父道陨 */
await page.evaluate(() => { Game.player.npcs.n4.alive = false; MasterSys.checkInheritance(Game.player); });
const inherit = await page.evaluate(() => ({ stage: Game.player.master.stage, gifts: Game.player.master.gifts.length }));
inherit.stage === 'dead' && inherit.gifts > 0 ? pass(`T11 师父道陨 → 衣钵承继（师赐 ${inherit.gifts} 件入袋）`) : fail('T11 衣钵', JSON.stringify(inherit));

/* T12 师承页签渲染先师牌位 + 可另拜 */
await page.evaluate(() => { document.querySelector('[data-action="act-tab"][data-tab="master"]')?.click(); });
await sleep(200);
const memorial = await page.evaluate(() => document.getElementById('tab-content').innerHTML.includes('先师之位'));
memorial ? pass('T12 先师牌位渲染') : fail('T12 牌位', '');
const reBaishi = await page.evaluate(() => { Game.player.realmIdx = 0; return MasterSys.isCandidate(Game.player, 'n24'); });
reBaishi ? pass('T12 先师既去可另拜（燕回时可递帖）') : fail('T12 另拜', '');

console.log(`\n===== 师承探针：${passN} 过 / ${failN} 败，console 错误 ${errors.length} =====`);
errors.slice(0, 5).forEach(e => console.log('  ' + e));
await page.screenshot({ path: 'shots/master-probe.png' });
await browser.close();
server.close();
process.exit(failN > 0 || errors.length > 0 ? 1 : 0);
