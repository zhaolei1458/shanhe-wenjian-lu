/* 3.5 专项探针：挖宝 / 兽蛋孵化 / 法宝技 / 新符箓 / 护脉丹 / 奇遇扩池 */
import puppeteer from 'puppeteer-core';

const EDGE = 'C:/Users/Administrator/AppData/Local/Google/Chrome/Bin/chrome.exe';
const URL = 'http://localhost:8341/index.html';
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const results = [];
const pass = (n) => { results.push(['PASS', n]); console.log('  ✓ ' + n); };
const fail = (n, d) => { results.push(['FAIL', n + ' :: ' + d]); console.log('  ✗ ' + n + ' :: ' + d); };

const browser = await puppeteer.launch({ executablePath: EDGE, headless: true, args: ['--no-sandbox', '--window-size=1280,760', '--disable-gpu', '--disable-gpu-compositing', '--disable-dev-shm-usage'] });
const page = await browser.newPage();
await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
const consoleErrors = [];
page.on('console', m => { if (m.type() === 'error' && !/net::ERR_/.test(m.text())) consoleErrors.push(m.text().slice(0, 160)); });
page.on('pageerror', e => consoleErrors.push('PAGEERROR: ' + String(e).slice(0, 160)));

await page.evaluateOnNewDocument(() => {
  const t = setInterval(() => {
    if (typeof window.Anim !== 'undefined') { window.Anim.enabled = false; }
    if (!window.Story || window.Story.__silenced) return;
    clearInterval(t);
    window.Story.__silenced = true;
    window.Story.play = function (script, onEnd) { if (onEnd) onEnd(); };
  }, 40);
});

try {
  await page.goto(URL, { waitUntil: 'domcontentloaded' });
  await sleep(600);
  await page.evaluate(() => { document.querySelector('[data-action="st-newgame"][data-slot="1"]').click(); });
  await sleep(400);
  await page.evaluate(() => { document.getElementById('create-name').value = '探针道人'; document.querySelector('[data-action="st-start"]').click(); });
  await sleep(500);
  await page.evaluate(() => {
    for (let i = 0; i < 6; i++) { const b = document.querySelector('[data-action="tut-next"]'); if (b) b.click(); else break; }
    if (UI._popupResolve) UI.popupChoose(0);
    document.getElementById('popup-modal')?.classList.add('hidden');
    document.getElementById('tutorial')?.classList.add('hidden');
    window._slp = (ms) => new Promise(r => setTimeout(r, ms));
    UI.popup = function (opt) { return Promise.resolve(opt.options && opt.options[0] ? opt.options[0].value : true); };
  });
  await sleep(300);

  /* P1 挖宝三档 */
  const digOnce = (mapId) => page.evaluate(async (id) => {
    Bag.addItem(id, 1);
    const had = Bag.count(id) > 0;
    await DigSys.dig(id);
    const gone = Bag.count(id) === 0;
    if (Battle.active) { Battle.active.enemy.hp = 0; Battle.end(); await _slp(300); }
    return { had, gone, digs: Game.player.counters.digs || 0 };
  }, mapId);
  let r = await digOnce('map_cangbao');
  (r.had && r.gone && r.digs >= 1) ? pass('P1a 一档藏宝图挖掘结算') : fail('P1a 一档挖掘', JSON.stringify(r));
  r = await digOnce('map_gu');
  (r.gone) ? pass('P1b 二档古修遗图挖掘') : fail('P1b 二档挖掘', JSON.stringify(r));
  r = await digOnce('map_xian');
  (r.gone) ? pass('P1c 三档仙家残图挖掘') : fail('P1c 三档挖掘', JSON.stringify(r));

  /* P2 兽蛋孵化 */
  const hatch = await page.evaluate(async () => {
    Game.player.beasts.list = [];
    Bag.addItem('egg_fengbao', 1);
    await BeastSys.hatch('egg_fengbao');
    const b = Game.player.beasts.list[0];
    return { n: Game.player.beasts.list.length, name: b && b.name, skills: b && b.skills.length };
  });
  (hatch.n === 1 && /风影豹/.test(hatch.name || '') && hatch.skills >= 1) ? pass('P2 兽蛋孵化出风影豹（带天生技）') : fail('P2 孵化', JSON.stringify(hatch));

  /* P3 法宝技 */
  const fab = await page.evaluate(async () => {
    const p = Game.player;
    p.equipped.weapon = { id: 'w_sanqing', enhance: 0, affixes: { prefix: 'sharp', fskill: 'fsshou' } };
    UI.renderAll();
    await Battle.start('m_yezhu', { mapName: '探针' });
    await _slp(400);
    const B = Battle.active;
    if (!B) return { err: 'no battle' };
    B.zhenyuan = 6;
    Battle.render();
    await _slp(150);
    const btn = !!document.querySelector('[data-action="bt-fabao"]');
    const before = B.enemy.hp;
    await Battle.actFabao();
    await _slp(300);
    const after = Battle.active ? Battle.active.enemy.hp : 0;
    const zUsed = B.zhenyuan;
    if (Battle.active) { B.enemy.hp = 0; B.over = true; Battle.end(); await _slp(400); }
    return { btn, before, after, zUsed };
  });
  (fab.btn && fab.after < fab.before && fab.zUsed < 6) ? pass('P3 法宝技按钮出现且收摄乾坤造成伤害耗真元') : fail('P3 法宝技', JSON.stringify(fab));

  /* P4 新符箓三式 */
  const tals = await page.evaluate(async () => {
    const p = Game.player;
    const out = {};
    await Battle.start('m_yezhu', { mapName: '探针' });
    await _slp(300);
    const B = Battle.active;
    Bag.addItem('tal_xuanbi', 1);
    await Battle.act('item', 'tal_xuanbi');
    await _slp(200);
    out.reflect = (B.buffs.reflectRounds || 0) > 0;
    p.hp = Math.max(1, Math.round(p.hp * 0.4));
    const before = p.hp;
    Bag.addItem('tal_liaoshang', 1);
    await Battle.act('item', 'tal_liaoshang');
    await _slp(200);
    out.heal = p.hp > before;
    Bag.addItem('tal_tianlei', 1);
    const ehp = B.enemy.hp;
    await Battle.act('item', 'tal_tianlei');
    await _slp(200);
    out.thunder = B.enemy.hp < ehp;
    B.over = true; Battle.end();
    await _slp(300);
    return out;
  });
  (tals.reflect && tals.heal && tals.thunder) ? pass('P4 玄壁/疗伤/天雷三式新符生效') : fail('P4 新符', JSON.stringify(tals));

  /* P5 护脉丹 */
  const humai = await page.evaluate(() => {
    const p = Game.player;
    Bag.addItem('pill_humai', 1);
    Bag.use('pill_humai');
    return { aid: (p.flags.tribAid || 0) };
  });
  humai.aid >= 10 ? pass('P5 护脉丹：下次渡劫成算 +10% 已入旗标') : fail('P5 护脉丹', JSON.stringify(humai));

  /* P6 奇遇扩池 */
  const luck = await page.evaluate(() => {
    let ok = 0;
    for (let i = 0; i < 40; i++) { try { EventSys.fortune(GameData.MAPS[1]); ok++; } catch (e) { return { ok, err: String(e).slice(0, 120) }; } }
    return { ok };
  });
  luck.ok === 40 ? pass('P6 奇遇扩池 40 次抽取无异常') : fail('P6 奇遇扩池', JSON.stringify(luck));

} catch (e) {
  fail('探针流程异常', String(e).slice(0, 200));
}
console.log('console errors:', consoleErrors.length ? consoleErrors : '无');
const np = results.filter(x => x[0] === 'PASS').length;
console.log(`\n==== 探针结果：${np}/${results.length} 通过 ====`);
await browser.close();
process.exit(np === results.length && !consoleErrors.length ? 0 : 1);
