/* 3.7a 系统咬合探针：闭关递减 / 修为软上限 / 破境丹门 / 炼丹产丹 / 师命馈丹 黑盒验证 */
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
await new Promise(r => server.listen(8903, '127.0.0.1', r));
const browser = await puppeteer.launch({ headless: 'new', executablePath: CHROME, args: ['--no-sandbox'], protocolTimeout: 8000 });
const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 800 });
const errors = [];
page.on('dialog', d => { d.dismiss().catch(() => {}); });
page.on('pageerror', e => errors.push('PAGEERROR: ' + e.message));
page.on('console', msg => { if (msg.type() === 'error') errors.push('CONSOLE: ' + msg.text()); });

let passN = 0, failN = 0;
const pass = (t) => { passN++; console.log('  ✓ ' + t); };
const fail = (t, x) => { failN++; console.log('  ✗ ' + t + (x ? ' —— ' + x : '')); };
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

await page.goto('http://127.0.0.1:8903/', { waitUntil: 'networkidle0' });
await sleep(600);

/* 创角入世 */
await page.evaluate(() => document.querySelector('[data-action="st-newgame"][data-slot="1"]')?.click());
await sleep(300);
await page.evaluate(() => { document.getElementById('create-name').value = '关卡探针'; });
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

/* T1 闭关收益递减乘数 */
const dims = await page.evaluate(() => [0, 1, 2, 3, 4, 5, 6].map(s => { Game.player.seclStreak = s; return Cultivate.diminMul(Game.player); }));
JSON.stringify(dims) === JSON.stringify([1, 0.8, 0.65, 0.5, 0.4, 0.35, 0.35])
  ? pass('T1 闭关递减乘数 1→0.8→0.65→0.5→0.4→0.35（保底）') : fail('T1 递减乘数', JSON.stringify(dims));

/* T2 修为软上限：圆满层修为+溢出 ≤ 需求×1.3，超出散逸 */
const capT = await page.evaluate(() => {
  const p = Game.player;
  p.realmIdx = 0; p.layer = 3; p.exp = GameData.layerNeed(0, 3); p.expOverflow = 0; p.capNotified = false;
  const need = GameData.layerNeed(0, 3);
  Cultivate.addExp(p, need);   // 大量灌入，远超 1.3 倍
  return { total: p.exp + (p.expOverflow || 0), cap: Cultivate.capNeed(p), notified: !!p.capNotified, need };
});
capT.total === capT.cap && capT.cap === Math.round(capT.need * 1.3) && capT.notified
  ? pass(`T2 修为软上限钳在需求×1.3（${capT.total}/${capT.cap}），散逸提示已发`) : fail('T2 软上限', JSON.stringify(capT));

/* T3 破境丹门：无丹不成关 */
const gateT = await page.evaluate(() => {
  const p = Game.player;
  p.exp = GameData.layerNeed(0, 3); p.expOverflow = 0;
  delete p.bag['pill_pj1'];
  void Cultivate.breakthrough();
  return p.realmIdx;
});
await sleep(400);
const gatePopup = await page.evaluate(() => !document.getElementById('popup-modal').className.includes('hidden'));
await page.evaluate(() => { if (UI._popupResolve) UI.popupChoose(0); });
await sleep(200);
gateT === 0 && gatePopup ? pass('T3 无破境丹——冲关被阻，弹「无丹不成关」') : fail('T3 丹门拦截', `realm=${gateT} popup=${gatePopup}`);

/* T4 炼丹产丹：b1 方（灵草×3+妖皮×1 → 破境丹·筑基） */
const craftT = await page.evaluate(() => {
  Bag.addItem('m_lingcao', 40); Bag.addItem('m_yaopi', 20);
  CraftSys.alchemy('b1', 12);
  return { made: Bag.count('pill_pj1'), leftGrass: Bag.count('m_lingcao') };
});
craftT.made >= 1 ? pass(`T4 丹炉开 12 炉，得【破境丹·筑基】×${craftT.made}`) : fail('T4 炼丹产丹', JSON.stringify(craftT));

/* T5 服丹破关：消耗丹 + 晋入筑基（钳成算为必成） */
const btT = await page.evaluate(() => {
  const p = Game.player;
  p.exp = GameData.layerNeed(0, 3); p.expOverflow = 0; p.seclStreak = 3;
  if (Bag.count('pill_pj1') < 1) Bag.addItem('pill_pj1', 1);
  const before = Bag.count('pill_pj1');   // 须在 breakthrough 前取值——突破内的扣丹是同步执行
  p.attrs.comp = 10; p.insight = 100;
  window.__origChance = Utils.chance; Utils.chance = () => true;   // 探针钳必成
  void Cultivate.breakthrough();
  return { before };
});
await sleep(1600);
const btState = await page.evaluate(() => {
  Utils.chance = window.__origChance;   // 还原
  const p = Game.player;
  return { realm: p.realmIdx, after: Bag.count('pill_pj1'), streak: p.seclStreak || 0 };
});
(btState.realm === 1 && btState.after === btT.before - 1)
  ? pass(`T5 服丹冲关：破境丹消耗 1 枚，晋入筑基（连坐清零=${btState.streak === 0}` + '）')
  : fail('T5 服丹破关', JSON.stringify({ ...btState, before: btT.before }));

/* T6 天劫路径丹门：筑基圆满无丹被阻 / 有丹入天劫 */
const tribT = await page.evaluate(() => {
  const p = Game.player;
  p.realmIdx = 1; p.layer = 3; p.exp = GameData.layerNeed(1, 3); p.expOverflow = 0;
  delete p.bag['pill_pj2'];
  void Cultivate.breakthrough();
  return p.realmIdx;
});
await sleep(400);
const tribPopup = await page.evaluate(() => !document.getElementById('popup-modal').className.includes('hidden'));
await page.evaluate(() => { if (UI._popupResolve) UI.popupChoose(0); });
await sleep(200);
await page.evaluate(() => { Bag.addItem('pill_pj2', 1); void Cultivate.breakthrough(); });
await sleep(600);
const tribOpen = await page.evaluate(() => !document.getElementById('tribulation-modal').className.includes('hidden'));
await page.evaluate(() => { document.getElementById('tribulation-modal')?.classList.add('hidden'); if (UI._popupResolve) UI.popupChoose(0); });
(tribT === 1 && tribPopup && tribOpen)
  ? pass('T6 天劫关同理被丹门拦；补丹后天劫降下') : fail('T6 天劫丹门', JSON.stringify({ tribT, tribPopup, tribOpen }));

/* T7 师命馈丹：复命五成几率赐破境丹（钳必中） */
const giftT = await page.evaluate(() => {
  const p = Game.player;
  p.master = { npcId: 'n4', stage: 'active', bond: 50, joinedDay: 1, trial: null, task: { type: 'collect', target: 'm_lingcao', need: 1, progress: 0, name: '师命·备灵草', desc: '' }, qinganDay: -1, lundaoDay: -1, protectDay: -1, taught: [], gifts: [] };
  Bag.addItem('m_lingcao', 2);
  delete p.bag['pill_pj2'];
  Utils.chance = () => true;   // 钳必中馈赠
  void MasterSys.taskSubmit();
  return Bag.count('pill_pj2');
});
await sleep(300);
const giftAfter = await page.evaluate(() => { Utils.chance = window.__origChance; return { pj2: Bag.count('pill_pj2'), task: Game.player.master.task }; });
giftT >= 1 && giftAfter.task === null
  ? pass('T7 复命获师赐【破境丹·金丹】——师门直接喂主线') : fail('T7 师命馈丹', JSON.stringify(giftAfter));

/* T8 3.7b 贴符护道：天劫第四策——无符禁用 / 有符耗符渡劫 */
const tfT = await page.evaluate(() => {
  const p = Game.player;
  p.realmIdx = 1; p.layer = 3; p.exp = GameData.layerNeed(1, 3); p.expOverflow = 0;
  p.attrs.comp = 10; p.insight = 100; p.karma = 0; p.fortune = 0;
  Bag.addItem('pill_pj2', 1);
  delete p.bag['tal_hujie'];
  window.__origChance2 = Utils.chance; Utils.chance = () => true;   // 钳必成
  void Cultivate.breakthrough();
  return p.realmIdx;
});
await sleep(1200);
const tfBtn = await page.evaluate(() => {
  const b = document.querySelector('[data-action="trib-strategy"][data-strategy="talFu"]');
  return b ? { exists: true, disabled: b.disabled } : { exists: false };
});
await page.evaluate(() => { Bag.addItem('tal_hujie', 1); Tribulation.render(); });
await sleep(200);
const tfBtn2 = await page.evaluate(() => document.querySelector('[data-action="trib-strategy"][data-strategy="talFu"]').disabled);
await page.evaluate(() => document.querySelector('[data-action="trib-strategy"][data-strategy="talFu"]').click());
await sleep(4200);
const tfState = await page.evaluate(() => {
  const p = Game.player;
  document.getElementById('tribulation-modal')?.classList.add('hidden');
  document.getElementById('dao-modal')?.classList.add('hidden');
  document.getElementById('popup-modal')?.classList.add('hidden');
  if (UI._popupResolve) UI.popupChoose(0);
  p.pendingDao = false;
  Utils.chance = window.__origChance2;
  return { realm: p.realmIdx, tal: Bag.count('tal_hujie') };
});
(tfT === 1 && tfBtn.exists && tfBtn.disabled === true && tfBtn2 === false && tfState.realm === 2 && tfState.tal === 0)
  ? pass('T8 贴符护道：无符禁用→补符可点→耗符渡劫功成（晋入金丹）')
  : fail('T8 贴符护道', JSON.stringify({ tfT, tfBtn, tfBtn2, ...tfState }));

/* T9 3.7b 功法层数反哺修炼：cultPct += 总层数（上限20） */
const gfT = await page.evaluate(() => {
  const p = Game.player;
  const saved = p.gongfa;
  p.gongfa = { gf_jianqi: { level: 5, exp: 0 }, gf_hansha: { level: 3, exp: 0 } };
  const b = Stat.gongfaBonus(p);
  p.gongfa = { gf_jianqi: { level: 30, exp: 0 } };
  const capped = Stat.gongfaBonus(p);
  p.gongfa = saved;
  return { eight: b.cultPct || 0, cap: capped.cultPct || 0 };
});
gfT.eight === 8 && gfT.cap === 20
  ? pass('T9 功法层数反哺修炼：总层数8层 → 行功效率 +8%，上限钳 +20%')
  : fail('T9 功法反哺', JSON.stringify(gfT));

console.log(`\n===== 关卡探针：${passN} 过 / ${failN} 败，console 错误 ${errors.length} =====`);
errors.slice(0, 5).forEach(e => console.log('  ' + e));
await page.screenshot({ path: 'shots/guanqia-probe.png' });
await browser.close();
server.close();
process.exit(failN > 0 || errors.length > 0 ? 1 : 0);
