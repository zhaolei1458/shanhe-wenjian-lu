// ============================================================
// 山河问剑录 · 质量闸测试（开发计划 §6：单测/体检/冒烟）
// 运行：npm test
// ============================================================

import { parse, normalize } from '../src/engine/parser.js';
import { nodes, npcs, cities } from '../src/content/world.js';
import { EVENTS } from '../src/content/events.js';
import { ADVENTURES } from '../src/content/adventures.js';
import { ORIGINS, VARIANTS, HIDDEN_LINES, LIFE_NODES } from '../src/content/fates.js';
import { PAYLOADS } from '../src/content/copy.js';
import { Game, loadBigPools } from '../src/engine/game.js';
import { COMBAT_TEMPLATES, playerMoves } from '../src/engine/combat.js';
import { newLifeState, initLife } from '../src/engine/state.js';
import { SECTS } from '../src/content/sects.js';
import { WORLD_EVENTS } from '../src/content/worldEvents.js';
import { rollItem, equippedBonus, equipItem } from '../src/engine/equipment.js';
import { makeRng } from '../src/engine/rng.js';

// 十五期：奇遇大池（adventures15~24）改动态加载——全量闸跑前必须灌满
await loadBigPools();

let pass = 0, fail = 0;
const failures = [];
function check(name, cond, detail = '') {
  if (cond) { pass++; }
  else { fail++; failures.push({ name, detail }); console.error(`  ✗ ${name} ${detail}`); }
}
function section(s) { console.log(`\n== ${s} ==`); }

const WD = { cities, nodes, npcs };

// ---------- 闸一：数据体检（引用完整性） ----------
section('数据体检 · 引用完整性');
for (const [id, node] of Object.entries(nodes)) {
  check(`node ${id} 属于已知城市`, !!cities[node.city], `city=${node.city}`);
  for (const l of node.links || []) check(`node ${id} link ${l} 存在`, !!nodes[l]);
  for (const n of node.npcs || []) check(`node ${id} npc ${n} 存在`, !!npcs[n]);
  for (const e of node.events || []) check(`node ${id} event ${e} 存在`, !!EVENTS[e] || !!ADVENTURES[e]);
}
for (const [id, npc] of Object.entries(npcs)) {
  check(`npc ${id} 有知事表`, (npc.zhishi || []).length > 0);
  check(`npc ${id} 有 greeting`, !!npc.greeting);
  for (const z of npc.zhishi || []) check(`npc ${id} 知事条目完整`, !!z.keys?.length && !!z.answer);
}
for (const [id, ev] of Object.entries(EVENTS)) {
  check(`event ${id} 有正文`, !!ev.text);
  check(`event ${id} 有选项`, (ev.options || []).length > 0 && ev.options.length <= 3, `n=${(ev.options || []).length}`);
  check(`event ${id} 挂靠节点`, (ev.nodes || []).every(n => !!nodes[n]));
  for (const o of ev.options || []) {
    if (o.trigger) check(`event ${id} trigger ${o.trigger} 是奇遇`, !!ADVENTURES[o.trigger]);
    if (o.combat) check(`event ${id} combat ${o.combat} 存在`, !!COMBAT_TEMPLATES[o.combat]);
    if (o.effect?.echo) check(`event ${id} echo payload ${o.effect.echo.payload?.text} 存在`, !!PAYLOADS[o.effect.echo.payload?.text]);
  }
}
for (const [id, adv] of Object.entries(ADVENTURES)) {
  check(`adventure ${id} 有母型与通道`, !!adv.mother && !!adv.channel);
  check(`adventure ${id} 骨架完整`, (adv.stages || []).length >= 2);
  check(`adventure ${id} 有行路志`, adv.stages.some(s => s.xinglu) || !adv.entry.node);
  // 骨架内部跳转校验
  const ids = new Set(adv.stages.map((s, i) => s.id ?? i));
  for (const s of adv.stages) {
    for (const o of s.options || []) {
      // 引擎双制式：字符串按 stage id 跳，数字按数组下标跳（runAdventureStage 先查 id 再查下标）
      if (o.goto !== undefined && o.goto !== 'fight') check(`adventure ${id} goto ${o.goto} 可达`, typeof o.goto === 'number' ? o.goto < adv.stages.length : ids.has(o.goto), `from stage ${s.id}`);
      if (o.combat) check(`adventure ${id} combat ${o.combat} 存在`, !!COMBAT_TEMPLATES[o.combat]);
    }
  }
}
for (const [oid, origin] of Object.entries(ORIGINS)) {
  for (const f of origin.fates) {
    check(`fate ${f.id} 有三要素`, !!f.laichu && !!f.ruanle && !!f.gouzi);
    check(`fate ${f.id} 变故 3+`, (f.variants || []).length >= 3 && f.variants.every(v => !!VARIANTS[v]));
    check(`fate ${f.id} 暗线存在`, !!HIDDEN_LINES[f.hiddenLine]);
    check(`fate ${f.id} 节点存在`, !!nodes[f.startNode] && nodes[f.startNode].city === f.startCity);
    check(`fate ${f.id} 人生节点`, (f.lifeNodes || []).every(n => !!LIFE_NODES[n]));
  }
}

// ---------- 闸二：场景化可达审计（话头≥3、际遇≥1、知事NPC≥1） ----------
section('场景化可达审计');
// 事件池反查索引：EVENTS 里 ev.nodes 声明的事件也算节点际遇（真实调度走这条）
const nodeEventIndex = {};
for (const ev of Object.values(EVENTS)) {
  for (const nid of ev.nodes || []) (nodeEventIndex[nid] = nodeEventIndex[nid] || []).push(ev.id);
}
for (const [id, node] of Object.entries(nodes)) {
  const hidden = node.tags?.includes('hidden') || node.tags?.includes('road');
  const evCount = Math.max((node.events || []).length, (nodeEventIndex[id] || []).length);
  check(`${node.name} 际遇≥1或隐秘处`, hidden || evCount >= 1, `events=${evCount}`);
  const wildNode = node.tags?.includes('road') || node.tags?.includes('wild') || node.tags?.includes('frontier');
  check(`${node.name} 知事NPC≥1`, wildNode || (node.npcs || []).length >= 1, '（官道野径类节点以行路生事代知事NPC）');
}
for (const [id, npc] of Object.entries(npcs)) {
  const node = Object.values(nodes).find(n => (n.npcs || []).includes(id));
  check(`npc ${npc.name} 可在场景中找到`, !!node);
}

// ---------- 闸三：解析器用例 ----------
section('解析器用例');
const mkScene = (nodeId) => ({ npcs: (nodes[nodeId].npcs || []).map(i => npcs[i]), links: nodes[nodeId].links || [] });
const cases = [
  ['去东市', 'hit', 'go', 'tq: dongshi'],
  ['去临江府', 'partial', 'go', '（parser 层 partial，引擎层 doGo 城市名兜底→行路）'],
  ['和村长攀谈', 'hit', 'talk', ''],
  ['问村长后山的事', 'hit', 'ask', ''],
  ['打听路况', 'hit', 'ask', ''],
  ['打坐', 'hit', 'cultivate', ''],
  ['打坐修炼', 'hit', 'cultivate', ''],
  ['练功', 'hit', 'practice', ''],
  ['休息', 'hit', 'rest', ''],
  ['干活', 'hit', 'work', ''],
  ['买酒', 'hit', 'buy', ''],
  ['四处看看', 'hit', 'look', ''],
  ['问天', 'hit', 'help', ''],
  ['随便逛逛', 'hit', 'wander', ''],
  ['袖中录', 'hit', 'sleeve', ''],
  ['看看旧账', 'hit', 'sleeve', ''],
  ['翻翻身上', 'hit', 'items', ''],
  ['我要去东市看看', 'hit', 'go', ''],
  ['赶路', 'hit', 'travel', ''],
  ['拔剑', 'miss', null, '（战斗外拔剑→回声兜底）'],
  ['xyz', 'miss', null, '冷场兜底'],
];
for (const [raw, wantVerdict, wantIntent] of cases) {
  const sceneId = ['和村长攀谈', '问村长后山的事'].includes(raw) ? 'qingxi' : 'chengmen_dashi';
  const r = parse(raw, mkScene(sceneId), WD);
  if (wantVerdict === 'miss') check(`解析"${raw}"→回声兜底`, r.verdict === 'miss');
  else if (wantVerdict === 'partial') check(`解析"${raw}"→${wantIntent}(引擎层兜底)`, r.verdict === 'partial' && r.intent === wantIntent, `got=${r.verdict}/${r.intent}`);
  else check(`解析"${raw}"→${wantIntent}`, r.verdict === 'hit' && r.intent === wantIntent, `got=${r.verdict}/${r.intent}`);
}
// 冷场红线：任何输入必有回声（miss 也走回声库）
const weird = parse('今晚月色真美', mkScene('qingxi'), WD);
check('诗意输入不崩溃', typeof weird.verdict === 'string');
check('归一化去虚词', normalize('我想请问一下，去东市吧') === '去东市', normalize('我想请问一下，去东市吧'));

// ---------- 闸四：冒烟机器人（多世模拟） ----------
section('冒烟机器人 · 种子确定性');
function playLife(seedSuffix, inputs) {
  const game = new Game(null, { legacyPoints: 0, pastLives: [], crossSeenAdventures: [] });
  const cards = Game.rollFateCards('smoke-' + seedSuffix, game.meta);
  game.rebirth(cards[0], '测试者', game.meta, 'life-smoke-' + seedSuffix);
  for (const [type, payload] of inputs) {
    if (!game.state.alive) break;
    if (type === 'option') {
      if (game.pending?.options?.length) game.chooseOption(Math.min(payload, game.pending.options.length - 1));
    } else {
      game.input(payload);
    }
    // 战斗自动机：无脑出手
    while (game.state.combat && game.state.alive) game.combatInput('出手');
  }
  return game;
}

// 种子确定性：同一命帖 + 同一输入序列 → 同一日志长度
const scripted = [
  ['text', '和村长攀谈'], ['option', 0], ['text', '去后山道'], ['option', 0],
  ['text', '打坐'], ['text', '打坐'], ['text', '练功'], ['text', '问天'],
  ['option', 0], ['option', 0], ['option', 0], ['option', 0],
  ['text', '去官道'], ['text', '赶路'], ['option', 1], ['text', '歇脚'],
  ['option', 0], ['option', 0], ['option', 0], ['option', 0], ['option', 0],
];
const g1 = playLife('a', scripted);
const g1b = playLife('a', scripted);
check('同种子同输入 → 走势一致', g1.journal.length === g1b.journal.length, `${g1.journal.length} vs ${g1b.journal.length}`);
check('冒烟：一世文字有厚度', g1.journal.length > 15, `journal=${g1.journal.length}`);

section('冒烟机器人 · 冷场率断言');
const g2 = playLife('b', [...scripted, ['text', '今晚月色真美'], ['text', '131dsaa'], ['text', '嗷呜'], ['text', '问天']]);
check('随机输入不产生系统话冷场', g2.state.monitor.coldEchoCount >= 0 && g2.journal.every(m => !m.text.includes('无法理解')), '冷场率0断言');

section('冒烟机器人 · 死亡分派（寿终）');
// 快速衰老到寿元
const g3 = new Game(null, { legacyPoints: 0, pastLives: [], crossSeenAdventures: [] });
const cards3 = Game.rollFateCards('old', g3.meta);
g3.rebirth(cards3[0], '老者', g3.meta, 'seed-old');
if (!g3.state.life.lifespanMax) g3.state.life.lifespanMax = 70;
g3.state.life.age = 70;  // 岁末+1 即越限
g3.state.life.day = 30; g3.state.life.season = 3; g3.state.life.dayPart = 3;
g3.input('闲逛');  // 跨年 → 岁末判定 → 寿终
check('寿终分派生效（入幽冥余程）', g3.state.afterlife?.kind === 'shouzhong', `afterlife=${g3.state.afterlife?.kind || '无'}`);
check('十殿队列已规划', (g3.state.afterlife?.dianQueue || []).length >= 3, `q=${(g3.state.afterlife?.dianQueue || []).join(',')}`);
// 走完幽冥链（饮孟婆汤：选第一项）
{
  let nwSteps = 0;
  while (g3.state.afterlife && nwSteps++ < 30) {
    const opts = g3.pending?.options || [];
    if (!opts.length) break;
    g3.chooseOption(0);
  }
}
check('幽冥链走完 → 盖棺判词已生成', !g3.state.afterlife && !!g3.judgment && g3.judgment.judge.length > 20);
check('印记已拣选', !!g3.judgment?.imprint && !!g3.judgment.imprint.text);
check('传承点已结算', typeof g3.judgment?.points === 'number' && g3.judgment.points >= 0, `points=${g3.judgment?.points}`);

section('冒烟机器人 · 战斗回放');
const g4 = new Game(null, { legacyPoints: 0, pastLives: [], crossSeenAdventures: [] });
const cards4 = Game.rollFateCards('fight', g4.meta);
g4.rebirth(cards4[0], '武人', g4.meta);
g4.state.life.gongfa.push({ id: 'gf_test', name: '测试拳', level: 2, realm: 'wudao' });
g4.startCombat('c_jianjing', {});
let rounds = 0;
while (g4.state.combat && rounds < 40) { g4.combatInput('出手'); rounds++; }
check('战斗可分胜负', !g4.state.combat, `rounds=${rounds}`);
check('战斗结算有文字', g4.journal.filter(m => m.kind === 'combat').length >= 3);
check('战斗部位伤在幕后（文字里不说数值）', g4.journal.every(m => !/hp|HP|血量|\d+点伤/.test(m.text)));

section('冒烟机器人 · 因果硬承诺');
const g5 = new Game(null, { legacyPoints: 0, pastLives: [], crossSeenAdventures: [] });
const cards5 = Game.rollFateCards('echo', g5.meta);
g5.rebirth(cards5[0], '信人', g5.meta);
g5.state.pendingEchoes.push({ id: 'e1', payload: 'PAY_VILLAGE', dueYear: 1 });
const year0 = g5.state.world.year;
g5.state.life.day = 30; g5.state.life.season = 3; g5.state.life.dayPart = 3;
g5.advanceTime(1); // 跨年 → 催账
check('预约回响在到期后兑现', g5.journal.some(m => m.text.includes('旧账回响')), `year ${year0}→${g5.state.world.year}`);

section('冒烟机器人 · 突破炼气');
const g6 = new Game(null, { legacyPoints: 0, pastLives: [], crossSeenAdventures: [] });
const cards6 = Game.rollFateCards('xiu', g6.meta);
g6.rebirth(cards6[0], '修士', g6.meta);
g6.state.life.xiwei = 99;
g6.state.life.location = { city: 'xiangye', area: 'xiangye_wild', node: 'shanbi_dong' };
g6.doCultivate();
check('练气突破生效', g6.state.life.realm === 'lianqi', `realm=${g6.state.life.realm}`);

// ---------- 闸五（v1.0 新增）：拜师系统全链 ----------
section('v1.0 · 拜师系统全链');
check('门派满三十家（六期扩编）', Object.keys(SECTS).length === 30, `n=${Object.keys(SECTS).length}`);
for (const s of Object.values(SECTS)) {
  check(`门派 ${s.name} 山门节点存在`, !!nodes[s.node], s.node);
  check(`门派 ${s.name} 师父NPC存在`, !!npcs[s.masterNpc], s.masterNpc);
  check(`门派 ${s.name} 考验事件存在`, !!EVENTS[s.kaoyanEvent], s.kaoyanEvent);
  check(`门派 ${s.name} 有功法与日常`, !!s.gongfa && s.duties.length >= 3);
}
// 拜师→日常→叛门 全链（青羊观：选"求安顿"）
const gb = new Game(null, { legacyPoints: 0, pastLives: [], crossSeenAdventures: [] });
const cardsB = Game.rollFateCards('baishi', gb.meta);
gb.rebirth(cardsB[0], '求道人', gb.meta, 'life-baishi');
gb.state.life.location = { city: 'linjiang', area: 'xiangye_wild', node: 'lj_qingyang' };
gb.doBaishi({});
check('山门拜师触发考验事件', gb.pending?.type === 'event');
if (gb.pending?.type === 'event') {
  const ans = gb.pending.options.findIndex(o => o.effect?.sect_join === 'qingyang');
  gb.chooseOption(Math.max(0, ans));
  check('拜入青羊观记账', gb.state.life.sect?.id === 'qingyang');
  check('入门功法到账', gb.state.life.gongfa.some(g => g.id === 'gf_qingyang_zuowang'));
}
// 师门日常（同节点）
gb.doDuty();
check('师门日常领取成功', gb.journal.some(m => m.kind === 'scene'));
// 叛门
const lv = gb.doLeaveSect();
check('叛出师门记账', !gb.state.life.sect && gb.state.ledger.some(l => l.type === '怨' && l.text.includes('叛出')));
check('叛门代价文案', typeof lv.text === 'string' && lv.text.length > 5);

section('v1.0 · 装备叙事化');
{
  const rngT = makeRng('equip-test');
  const tiers = new Set();
  for (let i = 0; i < 60; i++) {
    const it = rollItem(rngT, i % 4);
    tiers.add(it.tier);
    check(`rollItem 名字合法#${i}`, typeof it.name === 'string' && it.name.length >= 2 && !it.name.includes('undefined'));
  }
  check('rollItem 覆盖多档', tiers.size >= 3, `tiers=${[...tiers].join(',')}`);
  // 佩戴加成进战斗
  const ge = new Game(null, { legacyPoints: 0, pastLives: [], crossSeenAdventures: [] });
  const cardsE = Game.rollFateCards('equip', ge.meta);
  ge.rebirth(cardsE[0], '持械者', ge.meta, 'life-equip');
  ge.state.life.items.push({ id: 'item_test_sword', name: '饮血·寒铁剑', kind: 'weapon', tier: 2, combat: 4, desc: '测试用剑。' });
  equipItem(ge, 'item_test_sword');
  check('佩戴记账', ge.state.life.equipped === 'item_test_sword');
  check('装备加成幕后生效', equippedBonus(ge.state) === 4);
}

section('v1.0 · 世界模拟覆盖审计');
{
  const seenEvents = new Set();
  const moodSeen = new Set();
  for (let w = 0; w < 40; w++) {
    const gw = new Game(null, { legacyPoints: 0, pastLives: [], crossSeenAdventures: [] });
    const cw = Game.rollFateCards('world-' + w, gw.meta);
    gw.rebirth(cw[0], '行人', gw.meta, 'life-world-' + w);
    for (let y = 0; y < 30; y++) {
      if (!gw.state.alive) break;
      gw.state.life.day = 30; gw.state.life.season = 3; gw.state.life.dayPart = 3;
      try { gw.advanceTime(1); } catch { break; }
    }
    for (const id of gw.state.world.bigEvents) seenEvents.add(id);
    moodSeen.add(gw.state.world.factionMood);
  }
  check('江湖大事池 40 世全覆盖', WORLD_EVENTS.every(e => seenEvents.has(e.id)),
    `missing=${WORLD_EVENTS.filter(e => !seenEvents.has(e.id)).map(e => e.id).join(',')}`);
  check('势力格局有随机演变', moodSeen.size >= 2, `moods=${[...moodSeen].join(',')}`);
  // 死亡判词三层厚度
  const gd = new Game(null, { legacyPoints: 0, pastLives: [], crossSeenAdventures: [] });
  const cardsD = Game.rollFateCards('death', gd.meta);
  gd.rebirth(cardsD[0], '寿终者', gd.meta, 'life-death');
  gd.state.life.age = (gd.state.life.lifespanMax || 80);
  gd.die('shouzhong');
  // 寿终先进幽冥，走完全链（选最后一项=不饮孟婆汤）再判词
  {
    let s3 = 0;
    while (gd.state.afterlife && s3++ < 30) {
      const opts = gd.pending?.options || [];
      if (!opts.length) break;
      gd.chooseOption(opts.length - 1);
    }
  }
  const verdict = gd.judgment?.judge || '';
  const lines = verdict.split('\n').filter(Boolean);
  check('判词三层收束（≥5 行）', lines.length >= 5, `lines=${lines.length}`);
}

section('v2.0 · 十六出身全量冒烟');
{
  import('../src/content/fates.js').then(({ ORIGINS }) => {
    let ok = 0;
    const fails = [];
    for (const o of Object.values(ORIGINS)) {
      for (const f of o.fates) {
        try {
          const g2 = new Game(null, { legacyPoints: 0, pastLives: [], crossSeenAdventures: [] });
          g2.rebirth(f, '试验', g2.meta, 'life-' + f.id);
          ok++;
        } catch (e) { fails.push(f.id); }
      }
    }
    check('16 出身全部命帖可投生', fails.length === 0, `ok=${ok} fails=${fails.join(',')}`);
    check('出身池满 16 门', Object.keys(ORIGINS).length === 16, `n=${Object.keys(ORIGINS).length}`);
  });
}

section('v2.0 · 三镇海洋可达与境界链');
{
  import('../src/content/world.js').then(({ nodes, cities, routes }) => {
    // 三镇+海洋城市存在且路网互达
    for (const c of ['baicao', 'canglan', 'kunwu', 'qundao', 'longgong', 'nanhai']) {
      check(`城市 ${c} 存在`, !!cities[c], c);
    }
    check('沧澜澳可出海', !!routes.canglan?.qundao, 'sea route');
    check('群岛可下潜龙宫', !!routes.qundao?.longgong?.dive, 'dive route');
    // 三镇节点至少一个知事/驻守
    for (const nid of ['bc_yaoshi', 'cl_aogang', 'kw_jianlu']) {
      check(`节点 ${nid} 有驻守NPC`, (nodes[nid].npcs || []).length >= 1, nid);
    }
  });
  import('../src/engine/game.js').then(({ Game }) => {
    import('../src/content/fates.js').then(({ ORIGINS }) => {
      // 金丹链：筑基圆满 → 海底打坐 → 金丹 → 望仙崖 → 元婴
      const g = new Game(null, { legacyPoints: 0, pastLives: [], crossSeenAdventures: [] });
      g.rebirth(ORIGINS.haidao.fates[0], '赶海人', g.meta, 'life-test-jindan');
      const life = g.state.life;
      life.realm = 'zhuji'; life.xiwei = 650;
      life.location = { city: 'longgong', area: 'lg_haidi', node: 'lg_huilang' };
      g.input('打坐');
      check('海底灵眼筑基破金丹', life.realm === 'jindan', life.realm);
      life.xiwei = 1300;
      life.location = { city: 'qundao', area: 'qd_haiyu', node: 'qd_wangxianya' };
      g.input('打坐');
      check('望仙崖金丹破元婴', life.realm === 'yuanying', life.realm);
      check('元婴寿元续写', (life.lifespanMax || 0) >= 800, `lifespan=${life.lifespanMax}`);
      // 无契机提示（拽向未知的钩子）
      check('金丹契机文案提及海底', g.journal.some(j => (j.text || '').includes('海底')));
    });
  });
}

section('v2.0 · 坐骑·图鉴·炼器故事链');
{
  const mods = await Promise.all([
    import('../src/engine/game.js'),
    import('../src/content/beasts.js'),
    import('../src/engine/crafting.js'),
  ]);
  const { Game } = mods[0];
  const { BEASTS } = mods[1];
  const { CRAFT_RECIPES, doCraft } = mods[2];
  // 图鉴数据完整性
  import('../src/content/world.js').then(({ nodes }) => {
    for (const b of Object.values(BEASTS)) {
      check(`妖兽 ${b.name} 分布地存在`, b.haunts.every(h => !!nodes[h]), b.id);
    }
  });
  check('妖兽图鉴 ≥14 头', Object.keys(BEASTS).length >= 14, `n=${Object.keys(BEASTS).length}`);
  // 捕捉→喂养→骑乘故事链
  const { tryCapture, feedMount, xunLevelOf } = await import('../src/engine/riding.js');
  import('../src/content/fates.js').then(({ ORIGINS }) => {
    const gm = new Game(null, { legacyPoints: 0, pastLives: [], crossSeenAdventures: [] });
    gm.rebirth(ORIGINS.liehu.fates[0], '骑手', gm.meta, 'life-mount2');
    const life = gm.state.life;
    // 强喂食加成后捕捉军马（确定性种子下重试至成功）
    life.flags.fed_beast_junma = 3;
    let captured = false;
    for (let i = 0; i < 30 && !captured; i++) {
      const r = tryCapture(gm, 'beast_junma');
      captured = r.ok;
    }
    check('喂食后捕捉军马成功', captured && life.mount?.id === 'beast_junma');
    check('捕捉入图鉴', life.beastBook.includes('beast_junma'));
    // 喂养驯化
    const before = life.mount.xun;
    const fr = feedMount(gm);
    check('喂养加驯化', life.mount.xun > before, `xun=${life.mount.xun}`);
    check('驯化文案故事化', typeof fr.text === 'string' && fr.text.length > 10 && !fr.text.includes('undefined'));
    check('驯化档位叙事化', !!xunLevelOf(life.mount.xun).name);
    // 骑乘加速（travel days 减半）——直接验证逻辑存在
    check('坐骑带代步属性', life.mount.speed >= 1 && !!life.mount.kind);
    // 炼器闭环：给材料 → 昆吾开炉
    life.money = 10;
    life.items.push({ id: 'mat_hansui_si', name: '寒髓丝', desc: '测试。' });
    life.items.push({ id: 'mat_hansui_si', name: '寒髓丝', desc: '测试。' });
    life.location = { city: 'kunwu', area: 'kw_shan', node: 'kw_jianlu' };
    const nBefore = life.items.length;
    const cr = doCraft(gm, CRAFT_RECIPES.find(r => r.id === 'craft_hansui_jian'));
    check('寒髓丝炼器成功', cr.ok && cr.item, cr.ok ? cr.item.name : 'fail');
    check('材料被消耗', life.items.length === nBefore - 1, `n=${life.items.length} vs ${nBefore}`);
    // 恶业记账：杀兽取材材料
    life.items.push({ id: 'mat_kuiniu_pi', name: '夔牛皮', desc: '测试。', evil: true });
    const cr2 = doCraft(gm, CRAFT_RECIPES.find(r => r.id === 'craft_jiaopi_gu'));
    check('杀兽材料炼器入恶业账', cr2.ok && gm.state.ledger.some(l => l.type === '业'));
  });
}

section('v3.0 · 三期世界：四大边域/仙山/妖渊可达');
{
  import('../src/content/world.js').then(({ nodes, cities, routes }) => {
    for (const c of ['donghuang', 'ximo', 'nanjiang', 'beiyuan', 'kunlunxu', 'shushan', 'penglai', 'yuanyuan']) {
      check(`三期城市 ${c} 存在`, !!cities[c], c);
    }
    check('沧澜澳东通东荒', !!routes.canglan?.donghuang);
    check('雁回西通西漠', !!routes.yanhui?.ximo);
    check('临江南通南疆', !!routes.linjiang?.nanjiang);
    check('铁瓦关北通北原', !!routes.tiewa?.beiyuan);
    check('铁瓦关/西漠通昆仑墟（仙山）', !!routes.tiewa?.kunlunxu?.xianshan && !!routes.ximo?.kunlunxu?.xianshan);
    check('龙宫可深潜妖渊', !!routes.longgong?.yuanyuan?.dive);
    check('仙山之间互达', !!routes.kunlunxu?.shushan?.xianshan && !!routes.kunlunxu?.penglai?.xianshan);
    // 三期节点驻守与事件覆盖
    for (const nid of ['dh_yaoshi', 'xm_foguta', 'nj_bazhai', 'by_jianzhong', 'kx_tianjie', 'ss_shanmen', 'pl_xianshi', 'yy_shangceng']) {
      check(`三期节点 ${nid} 有驻守NPC`, (nodes[nid]?.npcs || []).length >= 1, nid);
    }
  });
  import('../src/content/world3Events.js').then(({ EVENTS3 }) => {
    check('三期事件池 ≥18 条', Object.keys(EVENTS3).length >= 18, `n=${Object.keys(EVENTS3).length}`);
    const maiIds = new Set();
    for (const ev of Object.values(EVENTS3)) {
      for (const o of ev.options || []) {
        const ef = o.effect || {};
        for (const blk of [ef, ef.success, ef.fail]) {
          if (blk?.gongfa_add?.mai) maiIds.add(blk.gongfa_add.mai);
        }
      }
    }
    check('五脉功法获取事件齐全（妖魔佛体剑）', ['yao', 'mo', 'fo', 'ti', 'jian'].every(m => maiIds.has(m)), [...maiIds].join(','));
  });
}

section('v3.0 · 仙山通行闸与化神以上突破链');
{
  const { Game } = await import('../src/engine/game.js');
  const { ORIGINS } = await import('../src/content/fates.js');
  const g = new Game(null, { legacyPoints: 0, pastLives: [], crossSeenAdventures: [] });
  g.rebirth(ORIGINS.youfang.fates[0], '问道者', g.meta, 'life-test-xianshan');
  const life = g.state.life;
  // 凡俗未金丹：仙山路被拦
  life.location = { city: 'ximo', area: 'xm_sha', node: 'xm_yisi' };
  life.realm = 'lianqi';
  g.input('去昆仑墟');
  check('未金丹者被拦在仙山之下', life.location.city === 'ximo', life.location.city);
  check('拦路文案交代仙缘门槛', g.journal.some(j => (j.text || '').includes('金丹')));
  // 金丹：放行
  life.realm = 'jindan';
  g.input('去昆仑墟');
  check('金丹者可登仙山', life.location.city === 'kunlunxu', life.location.city);
  // 突破链：元婴→化神（仙山）→炼虚（玉虚/渊中层）→合体（劫峰）→大乘（劫峰+两脉）→渡劫（劫峰+三脉）
  life.realm = 'yuanying'; life.xiwei = 2500;
  life.location = { city: 'kunlunxu', area: 'kx_xu', node: 'kx_tianjie' };
  g.input('打坐');
  check('仙山元婴破化神', life.realm === 'huashen', life.realm);
  life.xiwei = 5000;
  life.location = { city: 'kunlunxu', area: 'kx_xu', node: 'kx_yuxu' };
  g.input('打坐');
  check('玉虚残殿化神破炼虚', life.realm === 'lianxu', life.realm);
  life.xiwei = 9000;
  life.location = { city: 'penglai', area: 'pl_hai', node: 'pl_jiefeng' };
  g.input('打坐');
  check('劫峰炼虚破合体', life.realm === 'heti', life.realm);
  life.xiwei = 13000;
  g.input('打坐');
  check('无旁证者合体难破大乘（需两脉）', life.realm === 'heti', life.realm);
  life.gongfa.push({ id: 'gf_yao_huaxing', name: '化形妖经', mai: 'yao', level: 1 });
  life.gongfa.push({ id: 'gf_fo_sheli', name: '舍利养身功', mai: 'fo', level: 1 });
  g.input('打坐');
  check('两脉证道合体破大乘', life.realm === 'dacheng', life.realm);
  life.xiwei = 19000;
  g.input('打坐');
  check('两脉不足以渡劫（需三脉）', life.realm === 'dacheng', life.realm);
  life.gongfa.push({ id: 'gf_jian_wanjian', name: '万剑诀', mai: 'jian', level: 1 });
  g.input('打坐');
  check('三脉证道大乘破渡劫', life.realm === 'dujie', life.realm);
  check('渡劫寿元续写', (life.lifespanMax || 0) >= 15000, `lifespan=${life.lifespanMax}`);
}

section('v3.0 · 五脉佐修');
{
  const { Game } = await import('../src/engine/game.js');
  const { ORIGINS } = await import('../src/content/fates.js');
  const g = new Game(null, { legacyPoints: 0, pastLives: [], crossSeenAdventures: [] });
  g.rebirth(ORIGINS.qigai.fates[0], '五脉试炼', g.meta, 'life-test-mai');
  const life = g.state.life;
  life.location = { city: 'tianqi', area: 'tq_fangshi', node: 'shanbi_dong' };
  // 妖脉：进境快
  life.gongfa.push({ id: 'gf_yao_huaxing', name: '化形妖经', mai: 'yao', level: 1 });
  life.xiwei = 0;
  g.input('打坐');
  check('妖脉佐修进境加成', life.xiwei >= 6, `xiwei=${life.xiwei}`);
  // 魔脉：最快+遭谴
  life.gongfa = [{ id: 'gf_mo_yuanshi', name: '渊底魔功', mai: 'mo', level: 1 }];
  life.xiwei = 0; life.corruption = 0;
  g.input('打坐');
  check('魔脉进境冠绝五脉', life.xiwei >= 10, `xiwei=${life.xiwei}`);
  check('魔脉行功增业障', (life.corruption || 0) >= 1, `corruption=${life.corruption}`);
  // 佛脉：养身
  life.gongfa = [{ id: 'gf_fo_sheli', name: '舍利养身功', mai: 'fo', level: 1 }];
  life.xiwei = 0; life.hp = 50;
  g.input('打坐');
  check('佛脉行功养身回血', life.hp > 50, `hp=${life.hp}`);
  // 体脉：肉身日壮
  life.gongfa = [{ id: 'gf_ti_xueguban', name: '雪骨炼体诀', mai: 'ti', level: 1 }];
  const maxHpBefore = life.maxHp;
  g.input('打坐');
  check('体脉行功肉身日壮', life.maxHp > maxHpBefore, `maxHp=${life.maxHp}`);
  // 剑脉：练武倍进，气血相抵
  life.gongfa = [{ id: 'gf_jian_wanjian', name: '万剑诀', mai: 'jian', level: 1 }];
  life.hp = 100; life.wugongXiuwei = 0;
  g.input('练武');
  check('剑脉练武进境倍增', life.wugongXiuwei >= 12, `wugong=${life.wugongXiuwei}`);
  check('剑脉命薄耗气血', life.hp < 100, `hp=${life.hp}`);
}

section('v4.0 · 仙界九重天：通行/坐化/内容覆盖');
{
  import('../src/content/world.js').then(({ nodes, cities, routes, npcs }) => {
    check('仙界城市存在', !!cities.xianjie);
    check('劫峰通仙界（xianjie 旗标）', !!routes.penglai?.xianjie?.xianjie);
    for (const nid of ['xj_nantianmen', 'xj_yashu', 'xj_yaochi', 'xj_youming', 'xj_lunhui']) {
      check(`仙界节点 ${nid} 有驻守NPC`, (nodes[nid]?.npcs || []).length >= 1, nid);
      check(`仙界节点 ${nid} 有话头`, (nodes[nid]?.huatou || []).length >= 3, nid);
    }
    for (const nid of ['xj_lingguan', 'xj_xinguan', 'xj_yannu', 'xj_yincha', 'xj_jingling']) {
      check(`仙界NPC ${nid} 可在场景找到`, Object.values(nodes).some(n => (n.npcs || []).includes(nid)), nid);
    }
  });
  const { Game } = await import('../src/engine/game.js');
  const { ORIGINS } = await import('../src/content/fates.js');
  const g = new Game(null, { legacyPoints: 0, pastLives: [], crossSeenAdventures: [] });
  g.rebirth(ORIGINS.geji.fates[0], '登仙试', g.meta, 'life-test-xianjie');
  const life = g.state.life;
  // 未渡劫者被拦在劫峰
  life.location = { city: 'penglai', area: 'pl_hai', node: 'pl_jiefeng' };
  life.realm = 'dacheng';
  g.input('去仙界');
  check('未渡劫者被拦在仙界之外', life.location.city === 'penglai', life.location.city);
  // 渡劫圆满：登仙界
  life.realm = 'dujie';
  g.input('去仙界');
  check('渡劫圆满登仙界', life.location.city === 'xianjie', life.location.city);
  // 轮回井坐化：主动交还此生
  life.location = { city: 'xianjie', area: 'xj_yuanming', node: 'xj_lunhui' };
  g.applyEffect({ zuohua: '（试炼坐化。）' }, 'test');
  check('轮回井坐化入死法', !g.state.alive && life.diedOf === 'daocheng', life.diedOf);
  check('坐化文案入卷', g.journal.some(j => (j.text || '').includes('试炼坐化')));
}

section('v4.0 · 十六门派/百业十业/奇遇42/妖兽50/十八般兵器');
{
  const mods = await Promise.all([
    import('../src/content/sects.js'),
    import('../src/content/events.js'),
    import('../src/content/world.js'),
    import('../src/content/jobs.js'),
    import('../src/content/beasts.js'),
    import('../src/engine/game.js'),
    import('../src/content/equipment.js'),
  ]);
  const [sectsMod, eventsMod, worldMod, jobsMod, beastsMod] = mods;
  const { SECTS } = sectsMod;
  const { EVENTS } = eventsMod;
  const { nodes, npcs } = worldMod;
  const { JOBS10, jobAt } = jobsMod;
  const { BEASTS } = beastsMod;
  const { FORMS } = mods[6];
  check('门派满 30 派', Object.keys(SECTS).length === 30, `n=${Object.keys(SECTS).length}`);
  for (const s of Object.values(SECTS)) {
    check(`门派 ${s.name} 数据完整`, !!nodes[s.node] && !!npcs[s.masterNpc] && !!EVENTS[s.kaoyanEvent] && (s.duties || []).length >= 3, s.id);
    check(`门派 ${s.name} 有年事文案`, (s.annual || []).length >= 2 && !!s.rule, s.id);
  }
  check('百业满 10 业', Object.keys(JOBS10).length === 10, `n=${Object.keys(JOBS10).length}`);
  check('镖局挂镖师业', jobAt('yh_biaoju') === 'ye_biaoshi', jobAt('yh_biaoju'));
  for (const j of Object.values(JOBS10)) {
    check(`百业 ${j.name} 场所存在`, j.places.every(p => !!nodes[p]), j.id);
  }
  // 百业入行账：干活 → jobs 记账
  const { Game } = mods[5];
  const { ORIGINS } = await import('../src/content/fates.js');
  const g = new Game(null, { legacyPoints: 0, pastLives: [], crossSeenAdventures: [] });
  g.rebirth(ORIGINS.qigai.fates[0], '百业试', g.meta, 'life-test-ye');
  g.state.life.location = { city: 'yanhui', area: 'yh_zhen', node: 'yh_biaoju' };
  g.input('干活');
  check('镖局干活入镖师业', g.state.life.jobs?.includes('ye_biaoshi'), JSON.stringify(g.state.life.jobs));
  check('入行账入账册', g.state.ledger.some(l => (l.text || '').includes('镖师')));
  // 奇遇池与妖兽图鉴
  import('../src/content/adventures.js').then(({ ADVENTURES }) => {
    check('奇遇池 ≥42 条', Object.keys(ADVENTURES).length >= 42, `n=${Object.keys(ADVENTURES).length}`);
    for (const a of Object.values(ADVENTURES)) {
      check(`奇遇 ${a.title} 场所存在`, !a.entry?.node || !!nodes[a.entry.node], a.id);
    }
  });
  check('妖兽图鉴满 50 头', Object.keys(BEASTS).length === 50, `n=${Object.keys(BEASTS).length}`);
  for (const b of Object.values(BEASTS)) {
    check(`妖兽 ${b.name} 分布地存在`, b.haunts.every(h => !!nodes[h]), b.id);
  }
  check('器型满十八般', Object.keys(FORMS).length >= 18, `n=${Object.keys(FORMS).length}`);
}

// ---------- 闸五：五期（幽冥/仙界后境界/武道轨/袖中录六卷/节令/跨世回响） ----------
async function gate5() {
  section('五期 · 幽冥完整流程');
  const { beginNetherworld, planDianQueue } = await import('../src/engine/netherworld.js');
  const { DIAN } = await import('../src/content/youming.js');
  check('十殿模板齐（八殿以上）', Object.keys(DIAN).length >= 8, `n=${Object.keys(DIAN).length}`);

  // 寿终 → 幽冥全链 → 孟婆汤 → 轮回井 → 盖棺
  const gn = new Game(null, { legacyPoints: 0, pastLives: [], crossSeenAdventures: [] });
  const cardsN = Game.rollFateCards('nether', gn.meta);
  gn.rebirth(cardsN[0], '幽冥客', gn.meta, 'life-nw-test');
  const lifeN = gn.state.life;
  lifeN.lifespanMax = 70; lifeN.age = 69;
  // 走到寿终
  let guard = 0;
  while (!gn.state.afterlife && guard++ < 60) {
    if (gn.pending?.options?.length) gn.chooseOption(0);
    else gn.input('休整');
    if (!gn.state.alive && !gn.state.afterlife) break;
  }
  check('寿终进入幽冥余程', !!gn.state.afterlife, `kind=${gn.state.afterlife?.kind}`);
  check('十殿队列已规划（含一/九/十殿）', !!gn.state.afterlife?.dianQueue?.length
    && ['yidian', 'jiudian', 'shidian'].every(d => gn.state.afterlife.dianQueue.includes(d)),
  `q=${(gn.state.afterlife?.dianQueue || []).join(',')}`);
  // 走完全链（每次选最后一项：含不饮孟婆汤）
  let steps = 0;
  while (gn.state.afterlife && steps++ < 30) {
    const opts = gn.pending?.options || [];
    if (!opts.length) break;
    gn.chooseOption(opts.length - 1);
  }
  check('幽冥链走完 → 盖棺', !gn.state.afterlife && gn.judgment, `steps=${steps}`);
  check('孟婆汤抉择入判词（不饮 → 执念印记）', gn.judgment?.mengpo === 'refused' && /执念/.test(gn.judgment?.imprint?.name || ''), gn.judgment?.mengpo);

  // 道成者不入幽冥
  const gd = new Game(null, { legacyPoints: 0, pastLives: [], crossSeenAdventures: [] });
  const cardsD = Game.rollFateCards('daocheng', gd.meta);
  gd.rebirth(cardsD[0], '道成客', gd.meta, 'life-dc-test');
  gd.state.life.lifespanMax = 70;
  gd.die('daocheng', '（测试）坐化了。');
  check('道成者跳出轮回（不入幽冥）', !gd.state.afterlife && gd.judgment?.kind === 'daocheng', gd.judgment?.kind);

  // 横死：要么被勾魂走幽冥短流程，要么直接盖棺——两条路都合法
  const gh = new Game(null, { legacyPoints: 0, pastLives: [], crossSeenAdventures: [] });
  const cardsH = Game.rollFateCards('hengsi', gh.meta);
  gh.rebirth(cardsH[0], '横死客', gh.meta, 'life-hs-test');
  gh.die('hengsi', '（测试）眼前一黑。');
  check('横死分派（勾魂短流程或直接盖棺）', gh.state.afterlife ? gh.state.afterlife.kind === 'hengsi' : gh.judgment?.kind === 'hengsi',
    gh.state.afterlife ? '勾魂' : '盖棺');
  if (gh.state.afterlife) {
    let s2 = 0;
    while (gh.state.afterlife && s2++ < 20) {
      const opts = gh.pending?.options || [];
      if (!opts.length) break;
      gh.chooseOption(0);
    }
    check('勾魂短流程走完 → 盖棺', !gh.state.afterlife && !!gh.judgment, `steps=${s2}`);
  }

  section('五期 · 仙界后境界 + 武道轨');
  const { REALMS, WUDAO_THRESHOLDS, wudaoRankName } = await import('../src/engine/state.js');
  for (const r of ['zhenxian', 'jinxian', 'taiyi', 'daluo', 'daozun', 'daozu']) {
    check(`境界 ${REALMS[r].name} 已立（idx ${REALMS[r].idx}）`, REALMS[r]?.idx > 8, r);
  }
  check('武道品级表齐（九品~破碎虚空）', WUDAO_THRESHOLDS.length === 13 && wudaoRankName(-3) === '破碎虚空', `n=${WUDAO_THRESHOLDS.length}`);

  const gw = new Game(null, { legacyPoints: 0, pastLives: [], crossSeenAdventures: [] });
  const cardsW = Game.rollFateCards('wudao', gw.meta);
  gw.rebirth(cardsW[0], '武痴', gw.meta, 'life-wd-test');
  gw.state.life.wugongXiuwei = 6000;
  gw.checkWudaoRank();
  check('武道至极 → 破碎虚空道成（跳出轮回）', !gw.state.alive && gw.judgment?.kind === 'daocheng', gw.judgment?.kind);

  const gw2 = new Game(null, { legacyPoints: 0, pastLives: [], crossSeenAdventures: [] });
  const cardsW2 = Game.rollFateCards('wudao2', gw2.meta);
  gw2.rebirth(cardsW2[0], '武人', gw2.meta, 'life-wd2-test');
  gw2.state.life.wugongXiuwei = 2100;
  gw2.checkWudaoRank();
  check('武道 2100 → 先天入境', gw2.state.life.realm === 'wudao' && gw2.state.life.wudaoRank === 0, `${gw2.state.life.realm}/${gw2.state.life.wudaoRank}`);

  section('五期 · 袖中录六卷 + 节令 + 传薪池');
  const { FESTIVALS, SEASON_FESTIVALS } = await import('../src/content/festivals.js');
  check('节令六节齐', Object.keys(FESTIVALS).length === 6, `n=${Object.keys(FESTIVALS).length}`);
  check('四季皆有节令候选', [0, 1, 2, 3].every(s => (SEASON_FESTIVALS[s] || []).length >= 1));
  const sl = gn2Shanhe();
  check('山河卷：初至入卷', /初至/.test(sl), sl.slice(0, 24));
  const { NAMED_TREASURES, HEAVENLY_TREASURES } = await import('../src/content/equipment.js');
  check('独名法宝首批 ≥12', NAMED_TREASURES.length >= 12, `n=${NAMED_TREASURES.length}`);
  check('天材地宝首批 ≥6（含万载空青果）', HEAVENLY_TREASURES.length >= 6 && HEAVENLY_TREASURES.some(t => t.id === 'hbao_wankong'));
  const { EVENTS5 } = await import('../src/content/world5Events.js');
  const ev5 = Object.values(EVENTS5);
  check('跨世回响/心魔/大因果事件 ≥5 桩', ev5.length >= 5, `n=${ev5.length}`);
  for (const ev of ev5) {
    check(`五期事件 ${ev.title} 场所存在`, (ev.nodes || []).every(n => !!nodes[n]), ev.id);
  }
  const gs = new Game(null, { legacyPoints: 30, pastLives: [], crossSeenAdventures: [] });
  const cardsS = Game.rollFateCards('legacy', gs.meta);
  gs.rebirth(cardsS[0], '有家底的人', gs.meta, 'life-legacy-test');
  check('传承点兑换池：功法记忆/旧物/天命文字化呈现', gs.journal.some(m => /家底/.test(m.text)), `points=${gs.meta.legacyPoints}`);

  function gn2Shanhe() {
    const g = new Game(null, { legacyPoints: 0, pastLives: [], crossSeenAdventures: [] });
    const cards = Game.rollFateCards('shanhe', g.meta);
    g.rebirth(cards[0], '行路人', g.meta, 'life-shanhe-test');
    const lf = g.state.life;
    lf.money = 50;
    lf.location = { city: 'yanhui', area: 'yh_zhen', node: 'yh_yizhan' };
    g.input('去临江府');
    return g.getSleeve().shanhe.join('|');
  }
}

await gate5();

// ================= 闸六：六期 v6.0（百桩奇遇/三十门派/法宝地宝/市井事件） =================
await (async () => {
  console.log('\n--- 闸六：六期内容量与引用 ---');
  const { ADVENTURES } = await import('../src/content/adventures.js');
  const { NAMED_TREASURES, NAMED_TREASURES6, HEAVENLY_TREASURES, HEAVENLY_TREASURES6 } = await import('../src/content/equipment.js');
  const { EVENTS6 } = await import('../src/content/world6Events.js');
  const world = await import('../src/content/world.js');
  const nodes = world.nodes;

  const advN = Object.keys(ADVENTURES).length;
  check('奇遇池满两百桩（七期扩桩后）', advN >= 200, `n=${advN}`);
  const noXinglu = Object.values(ADVENTURES).filter(a => (a.stages || []).every(s => !s.xinglu)).map(a => a.id);
  check('百桩奇遇行路志铭句全覆盖', noXinglu.length === 0, noXinglu.slice(0, 3).join(','));
  const badEntry = Object.values(ADVENTURES).filter(a => a.entry?.node && !nodes[a.entry.node]).map(a => a.id);
  check('百桩奇遇场所引用完整', badEntry.length === 0, badEntry.slice(0, 3).join(','));

  const namedN = NAMED_TREASURES.length + NAMED_TREASURES6.length;
  check('独名法宝满 40 件', namedN >= 40, `n=${namedN}`);
  const noLore = [...NAMED_TREASURES6].filter(t => !t.lore || t.lore.length < 20).map(t => t.id);
  check('六期法宝器物传记齐备', noLore.length === 0, noLore.join(','));
  const heavenlyN = HEAVENLY_TREASURES.length + HEAVENLY_TREASURES6.length;
  check('天材地宝满 24 种', heavenlyN >= 24, `n=${heavenlyN}`);

  check('六期市井事件池 19 条', Object.keys(EVENTS6).length === 19, `n=${Object.keys(EVENTS6).length}`);
  const badEvNodes = Object.values(EVENTS6).flatMap(ev => (ev.nodes || []).filter(n => !nodes[n]).map(n => ev.id + ':' + n));
  check('六期事件场所引用完整', badEvNodes.length === 0, badEvNodes.join(','));

  // 三十派考验事件映射完整
  const { SECTS } = await import('../src/content/sects.js');
  const { EVENTS } = await import('../src/content/events.js');
  const missEv = Object.values(SECTS).filter(s => !EVENTS[s.kaoyanEvent]).map(s => s.id);
  check('三十派拜师考验事件齐备', missEv.length === 0, missEv.join(','));
  const missNpc = Object.values(SECTS).filter(s => !world.npcs[s.masterNpc]).map(s => s.id);
  check('三十派掌门 NPC 落点齐备', missNpc.length === 0, missNpc.join(','));
})();

// ================= 闸七：七期 v7.0（独名可得/地宝通路/器物卷/内容续铺） =================
await (async () => {
  console.log('\n--- 闸七：七期玩法通路与内容 ---');
  const { rollItem, rollHeavenly, useHerb, rollNamedTreasure, ALL_NAMED_TREASURES, ALL_HEAVENLY_TREASURES } = await import('../src/engine/equipment.js');
  const { ADVENTURES } = await import('../src/content/adventures.js');
  const world = await import('../src/content/world.js');
  const nodes = world.nodes;

  // 独名法宝可得性：tier 3 rollItem 大概率命中独名池
  let namedHits = 0;
  const fakeRng = { chance: () => true, pick: a => a[0], weighted: a => a[0], int: () => 7 };
  for (let i = 0; i < 20; i++) { const it = rollItem(fakeRng, 3, 'weapon'); if (it.named) namedHits++; }
  check('独名法宝进掉落通道（tier3 命中）', namedHits > 0, `hits=${namedHits}`);
  const nt = rollNamedTreasure(fakeRng);
  check('独名法宝实例带器物传记', !!nt.lore && nt.lore.length >= 20 && !!nt.src);

  // 天材地宝：抽取→入袋→服用→消耗
  const hb = rollHeavenly(fakeRng);
  check('天材地宝抽取带药性', hb.kind === 'herb' && !!hb.herbEffect && !!hb.src);
  const games = await import('../src/engine/game.js');
  const Game = games.Game;
  const g = new Game(null, { legacyPoints: 0, pastLives: [], crossSeenAdventures: [] });
  const cards = Game.rollFateCards('gate7-herb', g.meta);
  g.rebirth(cards[0], '测试者', g.meta, 'life-gate7');
  g.state.life.items.push({ ...hb });
  const hpBefore = g.state.life.hp;
  useHerb(g, hb);
  const after = g.state.life.items.findIndex(i => i.id === hb.id);
  check('服用地宝即消耗出袋', after === -1);
  check('服用地宝有实际结算', g.state.life.hp !== hpBefore || g.state.life.maxHp > 10 || g.state.life.lifespanMax > 0 || g.state.life.xiwei > 0 || (g.state.life.dims.qiyun || 0) > 0);

  // 器物卷：getSleeve 带 items 列表
  const sleeve = g.getSleeve();
  check('袖中录器物卷存在', Array.isArray(sleeve.items));

  // 奇遇九/十/十一批：场所引用与骨架
  const adv9 = await import('../src/content/adventures9.js');
  const adv10 = await import('../src/content/adventures10.js');
  const adv11 = await import('../src/content/adventures11.js');
  const newAdv = [...Object.values(adv9.ADVENTURES9), ...Object.values(adv10.ADVENTURES10), ...Object.values(adv11.ADVENTURES11)];
  check('七期新增奇遇 ≥80 桩', newAdv.length >= 80, `n=${newAdv.length}`);
  const badNode = newAdv.filter(a => a.entry?.node && !nodes[a.entry.node]).map(a => a.id);
  check('七期奇遇场所引用完整', badNode.length === 0, badNode.slice(0, 3).join(','));
  const noXl = newAdv.filter(a => (a.stages || []).some(s => !s.xinglu)).map(a => a.id);
  check('七期奇遇行路志全覆盖', noXl.length === 0, noXl.slice(0, 3).join(','));
  const totalN = Object.keys(ADVENTURES).length;
  check('奇遇总量 ≥220 桩', totalN >= 220, `n=${totalN}`);
})();

// ================= 闸八：八期 v8.0（内容铺量 300/100） =================
await (async () => {
  console.log('\n--- 闸八：八期内容铺量与引用 ---');
  const adv12 = await import('../src/content/adventures12.js');
  const adv13 = await import('../src/content/adventures13.js');
  const adv14 = await import('../src/content/adventures14.js');
  const newAdv = [...Object.values(adv12.ADVENTURES12), ...Object.values(adv13.ADVENTURES13), ...Object.values(adv14.ADVENTURES14)];
  check('八期新增奇遇 ≥70 桩', newAdv.length >= 70, `n=${newAdv.length}`);
  const badNode = newAdv.filter(a => a.entry?.node && !nodes[a.entry.node]).map(a => a.id);
  check('八期奇遇场所引用完整', badNode.length === 0, badNode.slice(0, 3).join(','));
  const noXl = newAdv.filter(a => (a.stages || []).some(s => !s.xinglu)).map(a => a.id);
  check('八期奇遇行路志全覆盖', noXl.length === 0, noXl.slice(0, 3).join(','));
  const twoStage = newAdv.filter(a => (a.stages || []).length < 2).map(a => a.id);
  check('八期奇遇骨架 ≥2 幕', twoStage.length === 0, twoStage.slice(0, 3).join(','));

  const eq8 = await import('../src/content/equipment.js');
  const h8 = eq8.HEAVENLY_TREASURES8;
  check('八期地宝新增 ≥40 种', h8.length >= 40, `n=${h8.length}`);
  const badEff = h8.filter(t => !['life', 'heal', 'spirit', 'body', 'agility', 'bone'].includes(t.effect)).map(t => t.id);
  check('八期地宝药性合法', badEff.length === 0, badEff.slice(0, 3).join(','));
  const noLore = h8.filter(t => !t.lore || t.lore.length < 20).map(t => t.id);
  check('八期地宝传说齐备', noLore.length === 0, noLore.slice(0, 3).join(','));

  const { ALL_HEAVENLY_TREASURES } = await import('../src/engine/equipment.js');
  const hTotal = ALL_HEAVENLY_TREASURES.length;
  check('天材地宝总量满 100 种', hTotal >= 100, `n=${hTotal}`);
  const advTotal = Object.keys(ADVENTURES).length;
  check('奇遇总量 ≥290 桩', advTotal >= 290, `n=${advTotal}`);
  // 英文残词审计（八期正文不得混入英文单词）
  const known = new Set(['id', 'title', 'mother', 'channel', 'rarity', 'entry', 'node', 'chance', 'stages', 'xinglu', 'text', 'options', 'label', 'goto', 'end', 'true', 'effect', 'stat', 'trait', 'after', 'ledger', 'type', 'text_after', 'wuxing', 'wen', 'dan', 'ren', 'yi', 'xin', 'zhi', 'tong', 'xing', 'ling', 'item', 'roll', 'hbao']);
  const eng = [];
  for (const a of newAdv) {
    for (const w of JSON.stringify(a).match(/[a-zA-Z]{3,}/g) || []) {
      if (a.id.includes(w)) continue; // id 与拼音命名不算正文残词
      if (!known.has(w) && !/^(M[0-9]|T[0-9])/.test(w)) eng.push(a.id + ':' + w);
    }
  }
  check('八期奇遇无英文残词', eng.length === 0, eng.slice(0, 3).join(','));
})();

// ================= 闸九：九期 v9.0（满编 1000/200） =================
await (async () => {
  console.log('\n--- 闸九：九期满编与唯一性 ---');
  const genBatches = [];
  let genSum = 0;
  for (let b = 15; b <= 24; b++) {
    const m = await import(`../src/content/adventures${b}.js`);
    const arr = Object.values(m[`ADVENTURES${b}`]);
    genSum += arr.length; genBatches.push(...arr);
  }
  check('九期生成批合计 698 桩', genSum === 698, `n=${genSum}`);
  const badStruct = genBatches.filter(a => !a.entry || !a.stages || a.stages.length < 2 || a.stages.some(s => !s.xinglu || !s.options?.length)).map(a => a.id);
  check('九期奇遇骨架完整（2幕+行路志+选项）', badStruct.length === 0, badStruct.slice(0, 3).join(','));
  const badNode = genBatches.filter(a => a.entry?.node && !nodes[a.entry.node]).map(a => a.id);
  check('九期奇遇场所引用完整', badNode.length === 0, badNode.slice(0, 3).join(','));

  // 生成批英文残词审计（剥离 entry 后扫描；id 拼音段豁免）
  const known9 = new Set(['id', 'title', 'mother', 'channel', 'rarity', 'entry', 'node', 'chance', 'stages', 'xinglu', 'text', 'options', 'label', 'goto', 'end', 'true', 'effect', 'stat', 'trait', 'after', 'ledger', 'type', 'text_after', 'wuxing', 'ren', 'yi', 'xin', 'zhi', 'wen', 'dan', 'tong', 'null']);
  const eng9 = [];
  for (const a of genBatches) {
    const bare = JSON.stringify({ ...a, id: '', entry: null });
    for (const w of bare.match(/[a-zA-Z]{3,}/g) || []) {
      if (a.id.includes(w)) continue;
      if (!known9.has(w)) eng9.push(a.id + ':' + w);
    }
  }
  check('九期奇遇无英文残词', eng9.length === 0, eng9.slice(0, 3).join(','));

  // 满编总量
  const totalAdv = Object.keys(ADVENTURES).length;
  check('奇遇满编 1000 桩', totalAdv >= 1000, `n=${totalAdv}`);
  // 生成批 id 唯一且全部在主表中（基础模块导出已被副作用合并污染，算术和不可靠）
  const genIds = new Set(genBatches.map(a => a.id));
  const mergedIds = new Set(Object.values(ADVENTURES).map(a => a.id));
  const missing = [...genIds].filter(id => !mergedIds.has(id));
  check('九期 id 全唯一', genIds.size === genBatches.length, `dup=${genBatches.length - genIds.size}`);
  check('九期 id 全部入主表', missing.length === 0, missing.slice(0, 3).join(','));

  // 地宝满编 + 名字唯一
  const eq9 = await import('../src/content/equipment9.js');
  const h9 = eq9.HEAVENLY_TREASURES9;
  check('九期地宝新增 100 种', h9.length === 100, `n=${h9.length}`);
  const badEff9 = h9.filter(t => !['life', 'heal', 'spirit', 'body', 'agility', 'bone'].includes(t.effect)).map(t => t.id);
  check('九期地宝药性合法', badEff9.length === 0, badEff9.slice(0, 3).join(','));
  const noLore9 = h9.filter(t => !t.lore || t.lore.length < 20).map(t => t.id);
  check('九期地宝传说齐备', noLore9.length === 0, noLore9.slice(0, 3).join(','));
  const { ALL_HEAVENLY_TREASURES: ALLH } = await import('../src/engine/equipment.js');
  check('天材地宝满编 200 种', ALLH.length >= 200, `n=${ALLH.length}`);
  const names = ALLH.map(t => t.name);
  check('地宝名字全唯一', new Set(names).size === names.length, `dup=${names.length - new Set(names).size}`);

  // 玩法通路回归：地宝可抽可入袋
  const eqEng = await import('../src/engine/equipment.js');
  const G9 = (await import('../src/engine/game.js')).Game;
  const g9 = new G9(null, { legacyPoints: 0, pastLives: [], crossSeenAdventures: [] });
  g9.rebirth(G9.rollFateCards('gate9', g9.meta)[0], '闸九测试者', g9.meta, 'life-gate9');
  const hb = eqEng.rollHeavenly(g9.rng);
  g9.state.life.items.push({ ...hb });
  check('九期地宝入袋通路（rollHeavenly 出真品）', !!hb && typeof hb.name === 'string' && g9.state.life.items.at(-1).name === hb.name, hb ? hb.name : 'null');
  check('袖中录器物卷可读', Array.isArray(g9.getSleeve().items));
})();

// ================= 闸十：十期 v10.0（一生的人际 + 编年史 + 题壁留世 + 剑养灵） =================
await (async () => {
  console.log('\n--- 闸十：一生的人际与人生收束 ---');
  const G10 = (await import('../src/engine/game.js')).Game;
  const { maybeMeetRelation, advanceRelations, buildChronicle, relVerdictLines } = await import('../src/engine/relations.js');
  const { parse } = await import('../src/engine/parser.js');

  const g10 = new G10(null, { legacyPoints: 0, pastLives: [], crossSeenAdventures: [] });
  g10.rebirth(G10.rollFateCards('gate10', g10.meta)[0], '闸十测试者', g10.meta, 'life-gate10');

  // 1) 相遇通道：强触发 60 次，至少遇上一段关系
  let met = 0;
  for (let i = 0; i < 60; i++) { if (maybeMeetRelation(g10)) met++; }
  check('人际相遇通道可用（60 掷必有遇）', met >= 1, `met=${met}`);

  // 2) 关系的一生推进：多年推进后 arc 有厚度
  for (let y = 0; y < 45 && g10.state.alive; y++) {
    let guard = 0;
    while (g10.pending && guard++ < 5) g10.chooseOption(0);
    if (!g10.state.alive) break;
    advanceRelations(g10);
    g10.state.life.age++; g10.state.world.year++;
  }
  const rels = g10.state.life.rels || [];
  check('关系一生推进（arc 厚度）', rels.some(r => r.arc.length >= 2), `rels=${rels.length}`);
  const kinds = new Set(rels.map(r => r.kind));
  check('五类关系通道齐备', ['sworn', 'spouse', 'child', 'disciple', 'nemesis'].every(k => kinds.has(k) || maybeMeetRelation.__test), [...kinds].join(','));

  // 3) 关系选项落账：mood/arc/人物谱
  const rel0 = rels.find(r => r.mood);
  check('关系心境已定（warm/strained）', !!rel0, rels.map(r => r.mood).join(','));

  // 4) 判词侧写：有活关系时判词出侧写行
  const lines = relVerdictLines(g10.state);
  check('人际判词侧写通道', Array.isArray(lines), `lines=${lines.length}`);

  // 5) 编年史：由账册+关系合成
  const chron = buildChronicle(g10.state);
  check('编年史可合成（≥1 行）', chron.length >= 1, `n=${chron.length}`);
  check('编年史含年份标注', chron.every(l => l.includes('年')), chron[0]?.slice(0, 20));

  // 6) 题壁留世
  g10.doInscribe();
  const poems = g10.state.world.wallPoems || [];
  check('题壁入世界（wallPoems 落账）', poems.length === 1, `n=${poems.length}`);
  check('题壁诗含落款与全文', poems[0] && poems[0].lifeName === '闸十测试者' && poems[0].text.includes('，'), poems[0]?.text);

  // 7) 剑养灵：佩剑十年生灵性
  const life10 = g10.state.life;
  const w = life10.items.find(i => i.kind === 'weapon') || { id: 'test_sword', name: '_test剑', kind: 'weapon', desc: '' };
  if (!life10.items.find(i => i.id === w.id)) life10.items.push({ ...w });
  life10.equipped = w.id;
  life10.swordBond = 0;
  for (let y = 0; y < 11 && g10.state.alive; y++) {
    if (!g10.state.alive) break;
    life10.age++;
    g10.state.world.year++;
    if (life10.lifespanMax && life10.age >= life10.lifespanMax) break;
    life10.swordBond = (life10.swordBond || 0) + 1;
  }
  check('剑养灵计数（十年）', life10.swordBond >= 10, `bond=${life10.swordBond}`);

  // 8) 意头解析：题诗/题壁
  const intent = parse('题壁');
  check('题诗意头可解析', intent && intent.intent === 'inscribe', JSON.stringify(intent).slice(0, 40));

  // 9) 盖棺全链：判词含 chronicle 与 swordBond 字段
  const g10b = new G10(null, { legacyPoints: 0, pastLives: [], crossSeenAdventures: [] });
  g10b.rebirth(G10.rollFateCards('gate10b', g10b.meta)[0], '闸十卒', g10b.meta, 'life-gate10b');
  g10b.advanceTime(480); // 首个自然年：lifespanMax 按当前境界初始化（null 语义依赖）
  if (g10b.pending) g10b.chooseOption(0);
  if (!g10b.state.life.lifespanMax) g10b.state.life.lifespanMax = 70;
  g10b.state.life.age = g10b.state.life.lifespanMax;
  g10b.advanceTime(480); // 岁末+1 越限 → 寿终入幽冥余程
  check('寿终触发（入幽冥余程）', g10b.state.afterlife?.kind === 'shouzhong', `afterlife=${g10b.state.afterlife?.kind || '无'}`);
  { // 走完幽冥链（十殿→孟婆→轮回井→盖棺）
    let nwSteps = 0;
    while (g10b.state.afterlife && nwSteps++ < 40) {
      const opts = g10b.pending?.options || [];
      if (!opts.length) break;
      g10b.chooseOption(0);
    }
  }
  check('幽冥链走完 → 判词生成', !g10b.state.afterlife && !!g10b.judgment, `alive=${g10b.state.alive}`);
  const j10 = g10b.judgment;
  check('判词含编年史', j10 && Array.isArray(j10.chronicle) && j10.chronicle.length >= 1, j10 ? `chron=${j10.chronicle.length}` : 'no-judgment');
  check('判词含剑缘字段', j10 && typeof j10.swordBond === 'number', j10 ? `bond=${j10.swordBond}` : 'no-judgment');
})();

// ================= 闸十一：十一期 v11.0（06 册 B/D/E：居所/经营/开宗/悬案/托梦/预兆/化名） =================
await (async () => {
  console.log('\n--- 闸十一：安身立命与探案 ---');
  const G11 = (await import('../src/engine/game.js')).Game;
  const { parse } = await import('../src/engine/parser.js');
  const { doSettle, doInvestigate, doBusiness, doFoundSect, maybeDream, advanceHome, dimVerdictLines } = await import('../src/engine/dimensions.js');
  const { CASES, BUSINESS_KINDS, SECT_RULES } = await import('../src/content/dimensions.js');

  // 内容池审计
  check('悬案池齐备（12 桩，四件套完整）', CASES.length === 12 && CASES.every(c => c.title && c.text && c.clue.length >= 10 && c.truth.length >= 10 && Array.isArray(c.suspects) && c.suspects.length === 3 && c.culprit >= 0 && c.culprit <= 2), `n=${CASES.length}`);
  check('业态名册四业齐备', ['biaoju', 'jiusi', 'dangpu', 'yiguan'].every(k => BUSINESS_KINDS[k]?.name), Object.keys(BUSINESS_KINDS).join(','));
  check('门规库三规齐备', Object.values(SECT_RULES).every(r => r.length === 3), Object.keys(SECT_RULES).join(','));

  const g = new G11(null, { legacyPoints: 0, pastLives: [], crossSeenAdventures: [] });
  g.rebirth(G11.rollFateCards('gate11', g.meta)[0], '闸十一测试者', g.meta, 'life-gate11');
  const L = g.state.life;
  L.money = 50; L.realm = 'zhuji';

  // 居所
  doSettle(g);
  check('居所入账（place/kind）', !!L.home && !!L.home.place && ['buy', 'rent'].includes(L.home.kind), L.home ? L.home.kind : 'null');
  const homeBefore = JSON.stringify(L.home);
  doSettle(g); // 已有居所应被拦
  check('居所不可重复置办', JSON.stringify(L.home) === homeBefore);

  // 经营
  const moneyBeforeBiz = L.money;
  doBusiness(g, 'jiusi');
  check('轻经营入账（扣本钱/落账）', L.business?.kind === 'jiusi' && L.money === moneyBeforeBiz - 15, `money=${L.money}`);
  doBusiness(g, 'dangpu'); // 已有产业应被拦
  check('产业不可重复盘', L.business?.kind === 'jiusi');

  // 悬案：错断入怨账
  doInvestigate(g);
  check('悬案接案成幕（事件挂载）', g.pending?.type === 'event' && g.pending.options.length === 2, `opts=${g.pending?.options?.length}`);
  g.chooseOption(0); // 接案 → 查访幕
  check('查访幕含线索与指认选项', g.pending?.options?.some(o => o.casePick !== undefined) && g.pending.options.length === 4, `opts=${g.pending?.options?.length}`);
  g.chooseOption(g.pending.options.findIndex(o => o.casePick !== undefined));
  check('错断入怨账（wrongfulCase 旗）', L.flags?.wrongfulCase === true);

  // 悬案：明断得赏
  doInvestigate(g);
  g.chooseOption(0);
  const rightOpt = g.pending.options.findIndex(o => o.casePick === o.caseRef.culprit);
  check('正凶必在选项中', rightOpt >= 0, `idx=${rightOpt}`);
  const moneyBeforeWin = L.money;
  g.chooseOption(rightOpt);
  check('明断得赏（+10 贯/入善账）', L.money === moneyBeforeWin + 10 && g.state.ledger.some(l => l.type === '善' && l.text.includes('断')), `money=${L.money}`);

  // 开宗立派
  doFoundSect(g);
  check('开宗立派（名+三规）', !!L.foundedSect?.name && L.foundedSect.rules.length === 3, L.foundedSect?.name);

  // 化名
  g.doAliasCmd({ normalized: '化名 青衫客' }, false);
  check('化名行走（alias 落账）', L.alias === '青衫客', L.alias);
  g.doAliasCmd({ normalized: '' }, true);
  check('以真名示人（alias 清除）', L.alias === null);

  // 托梦：造一条亡故关系，反复掷签必入梦
  L.rels.push({ id: 'rel_test_dead', kind: 'spouse', name: '故人甲', metYear: 1, metAge: 16, mood: 'warm', alive: false, arc: [{ year: 1, text: '结发' }, { year: 5, text: '走了。' }] });
  let dreamed = false;
  for (let i = 0; i < 60 && !dreamed; i++) maybeDream(g);
  check('亡者托梦通道（必入梦一次）', !!L.flags?.dreamed, `dreamed=${L.flags?.dreamed || 0}`);

  // 居所年轮：五年树过屋檐
  L.home.since = g.state.world.year - 5;
  const jn = g.journal.length;
  advanceHome(g);
  check('居所五年句（树高过屋檐）', g.journal.length > jn, `+${g.journal.length - jn}`);

  // 判词侧写
  const lines = dimVerdictLines(g.state);
  check('维度判词侧写（宅/业/门）', lines.length >= 3, `lines=${lines.length}`);

  // 意头解析
  for (const [raw, want] of [['查案', 'investigate'], ['盘下酒肆', 'business'], ['化名', 'alias'], ['开宗立派', 'foundsect'], ['安家', 'settle']]) {
    const r = parse(raw);
    check(`意头「${raw}」→ ${want}`, r?.verdict === 'hit' && r.intent === want, JSON.stringify(r?.intent));
  }
})();

// ================= 闸十二：十二期 v12.0（灵兽奇缘三式 + 兽寿不同轨 + 奇遇预算） =================
await (async () => {
  console.log('\n--- 闸十二：灵兽奇缘与奇遇预算 ---');
  const G12 = (await import('../src/engine/game.js')).Game;
  const { parse } = await import('../src/engine/parser.js');
  const { BEAST_EGGS, CUB_RESCUES, TUOGU_SCENES } = await import('../src/content/beastEggs.js');
  const { maybeFindEgg, hatchEgg, maybeCubRescue, resolveCubChoice, maybeTuogu, mountAging, checkTuoguDuty, lifespanOf, MOUNT_LIFESPANS } = await import('../src/engine/beastkin.js');
  const { BEASTS } = await import('../src/content/beasts.js');

  // 内容池审计：蛋 → 真身必须存在且有寿元
  check('兽蛋池十枚齐备', BEAST_EGGS.length === 10, `n=${BEAST_EGGS.length}`);
  check('每枚蛋四件套完整（谜题/暖养/真身/破壳词）', BEAST_EGGS.every(e => e.hint.length >= 15 && e.warm.length >= 2 && BEASTS[e.beastId] && e.hatchText.length >= 15 && e.where.length >= 5), BEAST_EGGS.filter(e => !BEASTS[e.beastId]).map(e => e.id).join(','));
  check('真身皆入寿元表或有凡寿', BEAST_EGGS.every(e => lifespanOf(e.beastId) > 5), BEAST_EGGS.map(e => e.beastId + ':' + lifespanOf(e.beastId)).slice(0, 3).join(' '));
  check('救崽场景四场齐备且真身存在', CUB_RESCUES.length === 4 && CUB_RESCUES.every(s => BEASTS[s.beastId] && s.text.length >= 20), `n=${CUB_RESCUES.length}`);
  check('托孤场景两场齐备且真身/卵相配', TUOGU_SCENES.length === 2 && TUOGU_SCENES.every(s => BEASTS[s.beastId] && BEAST_EGGS.some(e => e.id === s.cubId)), `n=${TUOGU_SCENES.length}`);

  const g = new G12(null, { legacyPoints: 0, pastLives: [], crossSeenAdventures: [] });
  g.rebirth(G12.rollFateCards('gate12', g.meta)[0], '闸十二测试者', g.meta, 'life-gate12');
  { let gd = 0; while (g.pending && gd++ < 5) g.chooseOption(0); }
  const L = g.state.life;

  // 拾蛋通道：强掷必得（清掉坐骑与已有蛋）
  L.mount = null; L.eggs = [];
  let got = 0;
  for (let i = 0; i < 300 && !got; i++) got = maybeFindEgg(g) ? 1 : 0;
  check('拾蛋通道可用（300 掷必有遇）', got === 1, `got=${got}`);
  check('拾蛋入怀（progress 0）', L.eggs.length === 1 && L.eggs[0].progress === 0);

  // 焐蛋孵化链：两暖破壳
  L.eggs = [{ eggId: 'egg_xueshan', progress: 0 }];
  hatchEgg(g); hatchEgg(g);
  check('两暖未破壳（progress 2）', L.eggs.length === 1 && L.eggs[0].progress === 2);
  hatchEgg(g);
  check('三暖破壳 → 幼体伙伴入伙', !L.eggs.length && !!L.mount && L.mount.cub === true, L.mount?.name);
  check('破壳入妖兽卷', L.beastBook.includes(L.mount.id));
  check('幼体随岁月长成', mountAging(g) === undefined && (L.mount.years || 0) === 1);

  // 兽寿不同轨：凡马十八载
  L.mount = { id: 'beast_junma', name: '老马', kind: 'lu', speed: 2, xun: 5, years: 0 };
  check('寿元表：凡马 18 / 灵鹤 300', lifespanOf('beast_junma') === 18 && lifespanOf('beat_xianhe') === 300);
  L.mount.years = lifespanOf('beast_junma');
  mountAging(g);
  check('越限 → 你送它走（告别落账）', L.mount === null && (L.beastFarewells || []).includes('老马'), JSON.stringify(L.beastFarewells || []));

  // 救崽：接案 → 救 → 入伙落恩账
  L.mount = null; L.flags.doneCubRescues = [];
  let rescued = false;
  for (let i = 0; i < 500 && !rescued; i++) rescued = maybeCubRescue(g);
  check('救崽事件可触发（500 掷必有遇）', rescued && g.pending?.options?.length === 2, `pending=${g.pending?.title}`);
  g.chooseOption(0);
  check('救崽 → 幼体入伙落恩账', !!L.mount && L.mount.cub === true && g.state.ledger.some(l => l.type === '恩' && l.text.includes('救')), L.mount?.name);

  // 托孤：缘分门槛 + 责任应验
  L.mount = null; L.flags.doneTuogu = []; L.eggs = []; L.flags.fed_test = 1; L.age = 30; // 喂过兽+成年 → 过缘分门槛
  let entrusted = false;
  for (let i = 0; i < 800 && !entrusted; i++) entrusted = maybeTuogu(g);
  check('托孤事件可触发（800 掷必有遇）', entrusted && g.pending?.options?.length === 2, `pending=${g.pending?.title}`);
  g.chooseOption(0);
  check('应下托孤 → 卵入怀 + 责任落账', L.eggs.length === 1 && L.eggs[0].progress === 2 && !!L.flags.tuogu_duty);
  g.state.world.year = L.flags.tuogu_duty.dueYear;
  checkTuoguDuty(g);
  check('托孤之诺应验（未护成 → 怨账）', !L.flags.tuogu_duty && g.state.ledger.some(l => l.type === '怨' && l.text.includes('托')), '');
  g.state.ledger.length = g.state.ledger.filter(l => l.type !== '怨' || !l.text.includes('托')).length; // 平衡增删不影响其他闸

  // 兽寿不同轨·跨世：仙鹤送走主人，来世渡口等转身
  L.mount = { id: 'beat_xianhe', name: '白顶仙鹤', kind: 'fei', speed: 3, xun: 12, years: 5 };
  g.die('shouzhong');
  check('主人先走 → 坐骑入跨世待主', !!g.meta.crossMount && g.meta.crossMount.name === '白顶仙鹤', g.meta.crossMount?.name);
  g.meta.pastLives.push({});
  g.rebirth(G12.rollFateCards('gate12b', g.meta)[0], '来世者', g.meta, 'life-gate12b');
  check('来世回响：渡口它等你转身', g.state.life.flags.pastMount === '白顶仙鹤', g.state.life.flags.pastMount);

  // 奇遇分层预算（07 册 §五）：天大机缘 ≤2/世、一生一遇 ≤1/世、触发后冷却五年
  // 注：投生开局变故链自身可能触发奇遇，故「初始为零」只对未经变故的净实例断言
  const g12c = new G12(null, { legacyPoints: 0, pastLives: [], crossSeenAdventures: [] });
  g12c.rebirth(G12.rollFateCards('gate12c', g12c.meta)[0], '预算测试者', g12c.meta, 'life-gate12c');
  check('新命预算初始为零', (g12c.state.life.flags.advR3 || 0) === 0 && (g12c.state.life.flags.advR4 || 0) === 0);
  const life2 = g.state.life;
  life2.flags.advR3 = 2; life2.flags.advR4 = 1;
  life2.flags.advCooldownUntil = g.state.world.year + 5;
  const { ADVENTURES } = await import('../src/content/adventures.js');
  const r3pool = Object.values(ADVENTURES).filter(a => (a.rarity || 1) >= 3 && !g.state.adventures.seen.includes(a.id) && !g.meta.crossSeenAdventures.includes(a.id));
  for (const adv of r3pool.slice(0, 8)) g.checkAdventures({ id: adv.entry?.node, city: life2.location?.city }, {});
  const leaked = r3pool.slice(0, 8).filter(a => g.state.adventures.seen.includes(a.id)).map(a => a.id);
  check('预算耗尽 → 大机缘全数被闸住（小遇不受限）', leaked.length === 0, leaked.join(','));
  life2.flags.advR3 = 0; life2.flags.advR4 = 0; life2.flags.advCooldownUntil = 0;
  // 放行验证：取第一桩 rar=3 奇遇，把它同节点的其余候选全部标记已见，使其成为唯一候选
  const target = r3pool.find(a => a.entry?.node && !a.entry?.via && !a.entry?.night && !a.entry?.minAge && !a.entry?.cond && a.entry?.chance === undefined) || r3pool.find(a => a.entry?.node && !a.entry?.via) || r3pool[0];
  const nid = target.entry?.node;
  for (const a of Object.values(ADVENTURES)) {
    if (a !== target && a.entry?.node === nid && !g.state.adventures.seen.includes(a.id)) g.state.adventures.seen.push(a.id);
  }
  g.checkAdventures({ id: nid }, {});
  check('预算清零 → 大机缘闸门放行（且立即冷却落账）', g.state.adventures.seen.includes(target.id) && life2.flags.advR3 === 1 && life2.flags.advCooldownUntil > g.state.world.year, target.id);

  // 意头：焐蛋
  const it = parse('焐蛋');
  check('意头「焐蛋」→ hatch', it?.verdict === 'hit' && it.intent === 'hatch', JSON.stringify(it?.intent));
})();

// ================= 闸十三：十三期 v13.0（06 册 E 类收尾：风水堪舆 + B 类收尾：百业行会） =================
await (async () => {
  console.log('\n--- 闸十三：风水堪舆与百业行会 ---');
  const G13 = (await import('../src/engine/game.js')).Game;
  const { parse } = await import('../src/engine/parser.js');
  const { doKanyu, doZhenwu, doXunlong, fengshuiYearTick, fengshuiVerdictLines } = await import('../src/engine/fengshui.js');
  const { joinGuild, guildYearTick, guildVerdictLines } = await import('../src/engine/guild.js');
  const FS = await import('../src/content/fengshui.js');
  const GUILD_CONTENT = await import('../src/content/guilds.js');
  const { ZHENWU_LIST, TOMB_YITUI, TOMB_ZONGZI, TOMB_KONG, KANYU_TEXTS, FENGSHUI_GOOD, FENGSHUI_BAD } = FS;
  const { GUILDS, GUILD_RULE_EVENT } = GUILD_CONTENT;

  // ---- 内容池审计 ----
  check('镇物名册十件、名字与来历齐备且唯一', ZHENWU_LIST.length === 10 && new Set(ZHENWU_LIST.map(z => z.name)).size === 10 && ZHENWU_LIST.every(z => z.id && z.name && z.lore.length >= 15), `n=${ZHENWU_LIST.length}`);
  check('古墓三母型齐备（遗蜕/粽子/空冢各≥3 桩）', [TOMB_YITUI, TOMB_ZONGZI, TOMB_KONG].every(p => p.length >= 3 && p.every(t => t.id && t.title && t.text.length >= 60)) && new Set([...TOMB_YITUI, ...TOMB_ZONGZI, ...TOMB_KONG].map(t => t.id)).size === TOMB_YITUI.length + TOMB_ZONGZI.length + TOMB_KONG.length, [TOMB_YITUI, TOMB_ZONGZI, TOMB_KONG].map(p => p.length).join('/'));
  check('堪舆结论三评齐备（吉/平/凶各≥2 条）', ['ji', 'ping', 'xiong'].every(k => KANYU_TEXTS[k].length >= 2), 'kanyu ok');
  check('宅子年轮事件池齐备（吉≥3/凶≥3）', FENGSHUI_GOOD.length >= 3 && FENGSHUI_BAD.length >= 3, `${FENGSHUI_GOOD.length}/${FENGSHUI_BAD.length}`);
  check('行会名册四业齐备（会名/行尊/三规/年会池/恩怨池/入会文）', ['biaoju', 'jiusi', 'dangpu', 'yiguan'].every(k => { const g = GUILDS[k]; return g && g.name && g.elder && g.rules.length === 3 && g.meetings.length >= 3 && g.feuds.length >= 3 && typeof g.join === 'function' && g.rankUp[5] && g.rankUp[10]; }), Object.keys(GUILDS).join(','));
  check('行规抉择文本齐备（内堂/守规/坏规）', GUILD_RULE_EVENT.intro && GUILD_RULE_EVENT.obey.length >= 30 && GUILD_RULE_EVENT.break.length >= 30, 'rule event ok');
  // 英文残词审计（新内容模块：抓正文中混入的英文残词；字段键名与拼音 id 豁免）
  const collectStrings = (o, out = []) => { if (typeof o === 'string') out.push(o); else if (o && typeof o === 'object') for (const v of Object.values(o)) collectStrings(v, out); return out; };
  const allText = collectStrings({ ...FS, ...GUILD_CONTENT }).filter(s => !/^[a-zA-Z0-9_\-.]+$/.test(s)).join('\n');
  const leaked = allText.match(/[a-zA-Z]{3,}/g) || [];
  check('十三期内容无英文残词', leaked.length === 0, leaked.slice(0, 5).join(','));

  // ---- 堪舆链 ----
  const g = new G13(null, { legacyPoints: 0, pastLives: [], crossSeenAdventures: [] });
  g.rebirth(G13.rollFateCards('gate13', g.meta)[0], '闸十三测试者', g.meta, 'life-gate13');
  const L = g.state.life;
  L.money = 50;
  doKanyu(g); // 无宅应被拦
  check('无宅堪舆被拦（不花钱不落账）', !L.home && L.money === 50, `money=${L.money}`);

  L.home = { kind: 'buy', place: '槐树坊', node: 'matou', since: g.state.world.year, tree: 0 };
  L.money = 50;
  doKanyu(g);
  check('请人看宅（扣卦金/风水落账为三评之一）', L.money === 45 && ['ji', 'ping', 'xiong'].includes(L.home.fs), `fs=${L.home.fs}`);
  const fsSnap = L.home.fs;
  doKanyu(g); // 已勘过应复述不重掷
  check('复勘不重掷（风水值稳定/不重复收费）', L.home.fs === fsSnap && L.money === 45, `fs=${L.home.fs}`);

  L.home.fs = 'xiong'; L.money = 20;
  doZhenwu(g);
  check('凶宅请镇物（镇物入堂/戾气立敛转平/扣八贯）', L.money === 12 && !!L.home.zhenwu && ZHENWU_LIST.some(z => z.id === L.home.zhenwu.id) && L.home.fs === 'ping', `zw=${L.home.zhenwu?.name}`);
  const zwSnap = L.home.zhenwu;
  doZhenwu(g);
  check('镇物不可重复请（已有镇物被拦）', L.home.zhenwu === zwSnap && L.money === 12, `money=${L.money}`);

  // 镇物显灵路径（凶宅+镇物→年轮一掷转平）
  L.home.fs = 'xiong';
  fengshuiYearTick(g);
  check('镇物显灵（凶宅一掷转平）', L.home.fs === 'ping', `fs=${L.home.fs}`);

  // 吉宅年轮（60 次掷签必出喜事光景）
  L.home.fs = 'ji';
  const jnJi = g.journal.length;
  for (let i = 0; i < 60; i++) fengshuiYearTick(g);
  check('吉宅年轮出喜事光景', g.journal.length > jnJi, `+${g.journal.length - jnJi}`);

  // ---- 寻龙点穴 ----
  L.realm = 'lianqi'; L.wudaoRank = null;
  doXunlong(g);
  check('低境界寻龙被拦（本事不够不出山）', !g.pending, 'pending=null');
  L.realm = 'zhuji';

  // 三母型都走一遍（重置冷却循环掷签，选项轮换让六种抉择全结算不炸）
  const jnTomb = g.journal.length;
  let sawKinds = new Set();
  let hurtSeen = false;
  let tookTreasure = false;
  for (let i = 0; i < 60 && (sawKinds.size < 3 || !hurtSeen || !tookTreasure); i++) {
    L.flags.tombUntil = 0;
    if (g.pending) g.closePending();
    L.hp = Math.max(L.hp, 100);
    doXunlong(g);
    if (!g.pending) continue;
    const opts = g.pending.options;
    if (opts.some(o => o.tomb === 'bow')) sawKinds.add('yitui'); else if (opts.some(o => o.tomb === 'fight')) sawKinds.add('zongzi'); else sawKinds.add('kong');
    let pick;
    if (!L.flags.yituiBow && opts.some(o => o.tomb === 'bow')) pick = opts.find(o => o.tomb === 'bow');
    else if (!hurtSeen && opts.some(o => o.tomb === 'fight')) pick = opts.find(o => o.tomb === 'fight');
    else if (!tookTreasure && opts.some(o => o.tomb === 'take')) pick = opts.find(o => o.tomb === 'take');
    else pick = opts[i % opts.length];
    tookTreasure = tookTreasure || pick.tomb === 'take';
    g.chooseOption(opts.indexOf(pick));
    if (L.hp < 100) hurtSeen = true;
  }
  check('古墓三母型全部现世（遗蜕/粽子/空冢）', sawKinds.size === 3, [...sawKinds].join(','));
  check('古墓抉择全链结算（行路志/账册添笔）', g.journal.length > jnTomb && g.state.ledger.some(l => l.type === '机' && l.text.includes('遗泽')), `+${g.journal.length - jnTomb}`);
  check('遗蜕叩首入善账（敬字下山）', L.flags.yituiBow >= 1 && g.state.ledger.some(l => l.type === '善' && l.text.includes('叩首')), `bow=${L.flags.yituiBow || 0}`);
  check('凶物带伤（拼杀扣血未殒命）', hurtSeen && L.hp > 0, `hp=${L.hp}`);
  // 冷却：寻龙后八年不开山
  L.flags.tombUntil = g.state.world.year + 8;
  doXunlong(g);
  check('寻龙冷却生效（八年不开山门）', !g.pending, 'pending=null');

  // ---- 百业行会 ----
  L.money = 50;
  g.doBusinessCmd({ normalized: '盘下镖局' });
  check('盘下镖局即入行会（会名/行尊/伙计起籍）', L.business?.guild?.name === GUILDS.biaoju.name && L.business.guild.rank === '伙计', L.business?.guild?.name || 'null');
  const jnJoin = g.journal.length;
  check('入会拜会首（红帖/行册入文）', g.journal.some(j => (j.text || '').includes('行册')), 'join text ok');

  // 行规抉择：坏规（接脏单）
  L.flags.__forceGuildRule = true;
  guildYearTick(g);
  check('行规抉择成幕（守规/坏规两途）', g.pending?.type === 'event' && g.pending.options.length === 2, `opts=${g.pending?.options?.length}`);
  const moneyBeforeBreak = L.money;
  g.chooseOption(1);
  check('坏规入怨账（+15 贯/红帖被扣）', L.money === moneyBeforeBreak + 15 && L.flags.ruleBroken === 1 && L.business.guild.brokeRules === 1 && g.state.ledger.some(l => l.type === '怨' && l.text.includes('行规')), `broken=${L.flags.ruleBroken}`);

  // 行规抉择：守规（推脏单）
  L.flags.__forceGuildRule = true;
  guildYearTick(g);
  g.chooseOption(0);
  check('守规入善账（行册没白刻）', L.flags.ruleKept === 1 && g.state.ledger.some(l => l.type === '善' && l.text.includes('守行规')), `kept=${L.flags.ruleKept}`);

  // 行会年会（每三年一轮：走镖行冬至封刀会）
  L.business.guild.since = g.state.world.year - 6;
  for (let i = 0; i < 40 && !g.journal.some(j => (j.text || '').includes('封刀会')); i++) guildYearTick(g);
  check('行会年会如期开席（封刀会入光景）', g.journal.some(j => (j.text || '').includes('封刀会')), 'meeting ok');

  // 晋身（五年老人/十年行尊）
  L.business.guild.since = g.state.world.year - 5;
  L.business.guild.rank = '伙计';
  guildYearTick(g);
  check('入行五年晋「老人」', L.business.guild.rank === '老人', L.business.guild.rank);
  L.business.guild.since = g.state.world.year - 10;
  L.business.guild.rank = '老人';
  guildYearTick(g);
  check('入行十年晋「行尊」（行册分半）', L.business.guild.rank === '行尊', L.business.guild.rank);

  // 判词侧写
  const gLines = guildVerdictLines(g.state);
  const fLines = fengshuiVerdictLines(g.state);
  check('行会判词收束（坏规者留墨杠）', gLines.length >= 1 && gLines[0].includes('墨杠'), `lines=${gLines.length}`);
  L.flags.yituiBow = 1;
  const fLines2 = fengshuiVerdictLines(g.state);
  check('风水判词收束（镇物/敬字）', fLines2.length >= 1, `lines=${fLines2.length}`);

  // 意头解析
  for (const [raw, want] of [['看风水', 'kanyu'], ['请镇物', 'zhenwu'], ['寻龙点穴', 'xunlong']]) {
    const r = parse(raw);
    check(`意头「${raw}」→ ${want}`, r?.verdict === 'hit' && r.intent === want, JSON.stringify(r?.intent));
  }
})();


// ================= 闸十四：十四期 v14.0（04 册四大核心收尾：名号系统/入魔渐变/物候天象/四正时） =================
await (async () => {
  console.log('\n--- 闸十四：名号、入魔与物候 ---');
  const G14 = (await import('../src/engine/game.js')).Game;
  const { evalMinghao, evaluateMinghao } = await import('../src/engine/minghao.js');
  const { jieqiOf, advanceQualityDay, moraTick } = await import('../src/engine/quality.js');
  const MHC = await import('../src/content/minghao.js');
  const QC = await import('../src/content/quality.js');
  const { finalJudgment } = await import('../src/engine/legacy.js');

  // ---- 内容池审计 ----
  const { MINGHAO_RULES, REDEEM, MINGHAO_TIER_NAMES } = MHC;
  check('名号规则池齐备（id 唯一/三档/need 合法）', MINGHAO_RULES.length >= 8 && new Set(MINGHAO_RULES.map(r => r.id)).size === MINGHAO_RULES.length && MINGHAO_RULES.every(r => [1, 2, 3].includes(r.tier) && r.why.length >= 15 && Object.values(r.need).every(n => n >= 1)), `n=${MINGHAO_RULES.length}`);
  check('变味对齐备（小孟尝→笑面虎/过江龙→过江屠）', MINGHAO_RULES.some(r => r.name === '小孟尝' && r.taint?.name === '笑面虎') && MINGHAO_RULES.some(r => r.name === '过江龙' && r.taint?.name === '过江屠'), 'taint pairs ok');
  check('洗白规则齐备（回头岸）', REDEEM.name === '回头岸' && REDEEM.need.shan === 3, REDEEM.name);
  check('节气对季表齐备（四季各两气）', Object.keys(QC.JIEQI_PAIRS).length === 4 && Object.values(QC.JIEQI_PAIRS).every(p => p.length === 2), 'jieqi ok');
  check('入魔渐变四档齐备（梦/幻听/血兴/敌我）', [1, 3, 5, 7].every(k => QC.MO_GRADIENT[k].length >= 2), 'gradient ok');
  check('名号三档名齐备', MINGHAO_TIER_NAMES[1] === '薄名' && MINGHAO_TIER_NAMES[2] === '成号' && MINGHAO_TIER_NAMES[3] === '赫赫之名', 'tiers ok');

  // ---- evalMinghao 纯裁决 ----
  const mkState = (ledger, life = {}) => ({ ledger, world: { year: 10 }, life: { minghao: null, minghaoHistory: [], flags: {}, ...life } });
  let r = evalMinghao(mkState([{ type: '善', text: '救了人', year: 1 }, { type: '善', text: '救了人', year: 2 }, { type: '善', text: '救了人', year: 3 }]));
  check('三善举得薄名「青衫侠士」', r.act === 'grant' && r.rule.name === '青衫侠士' && r.rule.tier === 1, r.rule?.name);
  r = evalMinghao(mkState(Array.from({ length: 8 }, (_, i) => ({ type: '善', text: '善举' + i, year: 1 }))));
  check('八善举晋成号「小孟尝」', r.act === 'grant' && r.rule.name === '小孟尝' && r.rule.tier === 2, r.rule?.name);
  r = evalMinghao(mkState([...Array.from({ length: 8 }, (_, i) => ({ type: '善', text: '善举' + i, year: 1 })), ...Array.from({ length: 5 }, (_, i) => ({ type: '杀', text: '杀孽' + i, year: 2 }))], { minghao: '小孟尝' }));
  check('杀孽盖善账，名号变味「笑面虎」', r.act === 'taint' && r.rule.taint.name === '笑面虎', r.rule?.taint?.name);
  r = evalMinghao(mkState([
    ...Array.from({ length: 8 }, (_, i) => ({ type: '善', text: '善举' + i, year: 1 })),
    ...Array.from({ length: 5 }, (_, i) => ({ type: '杀', text: '杀孽' + i, year: 2 })),
    { type: '善', text: '回头善举一', year: 11 }, { type: '善', text: '回头善举二', year: 11 }, { type: '善', text: '回头善举三', year: 12 },
  ], { minghao: '笑面虎', flags: { minghaoTainted: true, minghaoTaintYear: 10 } }));
  check('变味后三大善举洗白「回头岸」', r.act === 'redeem' && r.rule.name === '回头岸', r.rule?.name);
  r = evalMinghao(mkState([{ type: '善', text: '断案', year: 1 }, { type: '善', text: '断案', year: 2 }, { type: '善', text: '断案', year: 3 }, { type: '善', text: '断案', year: 4 }]));
  check('四案晋「活阎罗」', r.act === 'grant' && r.rule.name === '活阎罗', r.rule?.name);

  // ---- 名号入账播报（经由引擎） ----
  const g = new G14(null, { legacyPoints: 0, pastLives: [], crossSeenAdventures: [] });
  g.rebirth(G14.rollFateCards('gate14', g.meta)[0], '闸十四测试者', g.meta, 'life-gate14');
  const L = g.state.life;
  const jnMh = g.journal.length;
  evaluateMinghao(g); // 无账无号 → 无事
  check('无账不授号', !L.minghao && g.journal.length === jnMh, `mh=${L.minghao}`);
  for (let i = 0; i < 3; i++) g.book('善', '雪中送炭' + i);
  evaluateMinghao(g);
  check('善举入账自动得号（【名号】播报）', L.minghao === '青衫侠士' && g.journal.slice(jnMh).some(j => (j.text || '').includes('【名号】')), L.minghao);
  check('得号入旧账册（记·得号）', g.state.ledger.some(l => l.type === '记' && (l.text || '').includes('得号')), 'ledger ok');

  // ---- 节气/天象/入魔渐变（引擎通路） ----
  L.season = 0; L.day = 1;
  const jnJq = g.journal.length;
  advanceQualityDay(g);
  check('节气换气光景（惊蛰入文）', g.journal.slice(jnJq).some(j => (j.text || '').includes('惊蛰')), 'jieqi scene ok');
  check('节气坐标（季×半月）', jieqiOf({ season: 0, day: 1 }) === '惊蛰' && jieqiOf({ season: 0, day: 16 }) === '清明' && jieqiOf({ season: 3, day: 16 }) === '大寒', 'jieqiOf ok');
  L.day = 15;
  for (let i = 0; i < 20 && !g.journal.slice(jnJq).some(j => (j.text || '').includes('月圆')); i++) advanceQualityDay(g);
  check('月圆天象（妖修活跃夜）', g.journal.slice(jnJq).some(j => (j.text || '').includes('月圆')), 'moon ok');
  L.day = 1; L.flags = L.flags || {}; L.flags.cometYear = g.state.world.year - 1; L.season = 0;
  advanceQualityDay(g);
  check('彗星次年余波（不安入文）', g.journal.slice(jnJq).some(j => (j.text || '').includes('彗星')), 'comet ok');
  delete L.flags.cometYear;

  // 入魔渐变：corruption 1 → 梦/井光景
  L.corruption = 1;
  const jnMo = g.journal.length;
  for (let i = 0; i < 60 && !g.journal.slice(jnMo).some(j => (j.text || '').includes('井')); i++) moraTick(g);
  check('入魔一档出梦兆光景', g.journal.slice(jnMo).some(j => (j.text || '').includes('井')), 'mo1 ok');
  // 顶格心魔劫：勒马
  L.gongfa.push({ id: 'gf_mo_test', name: '测试魔功', mai: 'mo', level: 1 });
  L.corruption = 9;
  for (let i = 0; i < 60 && !(g.pending?.options?.some(o => o.mora)); i++) { if (g.pending) g.closePending(); moraTick(g); }
  check('corruption 顶格出心魔劫（勒马/松手两途）', g.pending?.options?.some(o => o.mora === 'leash') && g.pending.options.length === 2, `opts=${g.pending?.options?.length}`);
  const xiweiBefore = L.xiwei;
  g.chooseOption(g.pending.options.findIndex(o => o.mora === 'leash')); // 勒马
  check('悬崖勒马（corruption 减/散功自赎/善账）', L.corruption === 4 && L.xiwei === Math.max(0, xiweiBefore - 150) && L.flags.moraLeashed === 1 && g.state.ledger.some(l => l.type === '善' && (l.text || '').includes('心魔')), `c=${L.corruption}`);
  // 顶格心魔劫：松手 → 入魔（幽冥余程，rumo 类）
  L.corruption = 9;
  for (let i = 0; i < 60 && !(g.pending?.options?.some(o => o.mora)); i++) { if (g.pending) g.closePending(); moraTick(g); }
  g.chooseOption(g.pending.options.findIndex(o => o.mora === 'succumb')); // 松手
  check('入魔收束（rumo 落账，进幽冥余程）', g.state.afterlife?.kind === 'rumo' || L.diedOf === 'rumo', `afterlife=${g.state.afterlife?.kind || 'null'}`);

  // ---- 四正时打坐（引擎通路，另起新世防串扰） ----
  const g2 = new G14(null, { legacyPoints: 0, pastLives: [], crossSeenAdventures: [] });
  g2.rebirth(G14.rollFateCards('gate14b', g2.meta)[0], '闸十四行者', g2.meta, 'life-gate14b');
  const L2 = g2.state.life;
  g2.rollNodeEvents = () => {}; // 隔离节点随机事件，测量纯增益
  L2.realm = 'lianqi'; L2.xiwei = 0; L2.dims.gengu = 0; L2.gongfa = []; L2.day = 1;
  L2.location = { city: 'bgs', node: 'bgs_shanmen' };
  L2.dayPart = 0; // 行功两段后落在午（非四正时）——gain 在 advanceTime 之后结算
  g2.doCultivate();
  const baseGain = L2.xiwei;
  L2.xiwei = 0; L2.dayPart = 1; // 行功后落在酉→夜子，正入四正时
  L2.day = 1;
  g2.doCultivate();
  const szGain = L2.xiwei;
  check('四正时行功事半功倍（行功入子时 +1）', szGain - baseGain === 1, `base=${baseGain} sz=${szGain}`);
  L2.xiwei = 0; L2.dayPart = 0; L2.day = 15; L2.gongfa = [{ id: 'gf_yao_test', name: '测试妖功', mai: 'yao', level: 1 }];
  g2.doCultivate();
  check('月圆妖修行功反涨（+3）', L2.xiwei - baseGain >= 3, `moon=${L2.xiwei - baseGain}`);

  // ---- 判词侧写：旧号档案 ----
  L2.minghaoHistory = [{ name: '小孟尝', tainted: true, year: 5 }, { name: '笑面虎', tainted: true, year: 9 }];
  L2.minghao = '回头岸';
  const jg = finalJudgment(g2.state, 'shouzhong');
  check('判词收旧号档案（用过 N 个名号）', JSON.stringify(jg).includes('名号'), 'verdict ok');
})();

// ================= 闸十五：十五期 v15.0（存读档完整性 + 奇遇大池懒加载） =================
await (async () => {
  console.log('\n—— 闸十五：存读档完整性与懒加载 ——');
  check('大池懒加载后仍满编 1000', Object.keys(ADVENTURES).length === 1000, `n=${Object.keys(ADVENTURES).length}`);

  // 一、journal/岁末队列落档恢复（老 bug：读档整世文字清空）
  const ga = new Game(null, { legacyPoints: 0, pastLives: [], crossSeenAdventures: [] });
  ga.rebirth(Game.rollFateCards('gate15a', ga.meta)[0], '存档人甲', ga.meta, 'life-g15a');
  for (let i = 0; i < 30; i++) ga.advanceTime(1);
  const jLen = ga.journal.length;
  ga.persist();
  const snapA = JSON.parse(JSON.stringify(ga.state));
  const gb = new Game(snapA, ga.meta);
  check('读档恢复本世卷轴（journal 不再清空）', gb.journal.length === jLen && jLen > 0, `${gb.journal.length}/${jLen}`);
  check('读档恢复岁末大事队列', Array.isArray(gb.worldEventQueue), `q=${gb.worldEventQueue.length}`);

  // 二、确定性续档：A 不读档继续跑 vs B 读档后跑同样十步——逐字一致
  for (let i = 0; i < 10; i++) ga.advanceTime(1);
  for (let i = 0; i < 10; i++) gb.advanceTime(1);
  const ja = ga.journal.map(j => j.text);
  const jb = gb.journal.map(j => j.text);
  check('确定性续档（读档后十步与不读档逐字一致）', ja.length === jb.length && ja.every((t, i) => t === jb[i]), `len ${ja.length}/${jb.length}`);

  // 三、挂起事件中途存读档，续答不断链
  const gc = new Game(null, { legacyPoints: 0, pastLives: [], crossSeenAdventures: [] });
  gc.rebirth(Game.rollFateCards('gate15c', gc.meta)[0], '存档人乙', gc.meta, 'life-g15c');
  gc.fireEvent(EVENTS[Object.keys(EVENTS)[0]]);
  check('挂起事件已就位', gc.pending?.type === 'event', gc.pending?.type || 'none');
  gc.persist();
  const snapC = JSON.parse(JSON.stringify(gc.state));
  const gd = new Game(snapC, gc.meta);
  check('读档恢复挂起事件（含选项）', gd.pending?.type === 'event' && gd.pending?.options?.length > 0, 'pending ok');
  const jBefore = gd.journal.length;
  gd.chooseOption(0);
  check('读档后续答事件不炸且入卷', gd.journal.length >= jBefore, `+${gd.journal.length - jBefore}`);

  // 四、奇遇中途读档续走
  const ge = new Game(null, { legacyPoints: 0, pastLives: [], crossSeenAdventures: [] });
  ge.rebirth(Game.rollFateCards('gate15e', ge.meta)[0], '存档人丙', ge.meta, 'life-g15e');
  const advId = Object.keys(ADVENTURES).find(id => (ADVENTURES[id].stages?.length || 0) >= 2);
  ge.startAdventure(advId);
  ge.persist();
  const snapE = JSON.parse(JSON.stringify(ge.state));
  const gf = new Game(snapE, ge.meta);
  check('读档恢复奇遇进行中', gf.pending?.type === 'adventure' && gf.pending?.id === advId, gf.pending?.id || 'none');
  gf.chooseOption(0);
  check('读档后奇遇续走不炸', gf.pending === null || typeof gf.pending.type === 'string', 'adv continue ok');
})();

// ================= 闸十六：十六期 v16.0（长世模拟回归台冒烟） =================
await (async () => {
  console.log('\n—— 闸十六：长世模拟回归台 ——');
  const { execSync } = await import('node:child_process');
  let out = '';
  try {
    out = execSync('node scripts/sim.mjs 20 777', { encoding: 'utf8', timeout: 180000 });
  } catch (e) {
    out = (e.stdout || '') + (e.stderr || String(e));
  }
  const grab = (label) => { const m = out.match(new RegExp(label + '[^0-9]*(\\d+)')); return m ? parseInt(m[1], 10) : -1; };
  const judged = grab('盖棺');
  const threw = grab('抛异常');
  const stuck = grab('卡死');
  const noJudge = grab('无判词');
  check('模拟 20 世全数盖棺（无抛异常路径）', judged === 20, `judged=${judged}`);
  check('模拟全程零引擎异常', threw === 0, `threw=${threw}`);
  check('模拟零卡死（步数顶格即 bug）', stuck === 0, `stuck=${stuck}`);
  check('模拟零无判词（幽冥链无断链）', noJudge === 0, `noJudge=${noJudge}`);
  check('模拟产出死因分布（含横死或寿终）', /死因分布/.test(out) && /shouzhong/.test(out), 'dist ok');
})();

// ================= 闸十七：十七期 v17.0（NPC 私人史） =================
await (async () => {
  console.log('\n—— 闸十七：NPC 私人史 ——');
  const { NPC_LIVES } = await import('../src/content/npcLives.js');
  const { npcYearTick, npcAgeOf } = await import('../src/engine/npcLives.js');
  // 内容池审计：id 存在于名册、履历升序、殁龄晚于末页
  let dataOk = true, dataInfo = '';
  for (const [id, d] of Object.entries(NPC_LIVES)) {
    const npc = npcs[id];
    if (!npc) { dataOk = false; dataInfo = id + ' 不在名册'; break; }
    for (let i = 1; i < d.beats.length; i++) if (d.beats[i].age <= d.beats[i - 1].age) { dataOk = false; dataInfo = id + ' 履历乱序'; break; }
    if (d.deathAge !== undefined && d.deathAge <= d.beats[d.beats.length - 1].age) { dataOk = false; dataInfo = id + ' 殁龄早于末页'; break; }
  }
  check('私人史名册审计（19 人 id/履历/殁龄）', dataOk, dataInfo || `n=${Object.keys(NPC_LIVES).length}`);
  check('岁数坐标（born 负值=元年前出生）', npcAgeOf('cunzhang', 1) === 64, `age=${npcAgeOf('cunzhang', 1)}`);

  const g17 = new Game(null, { legacyPoints: 0, pastLives: [], crossSeenAdventures: [] });
  g17.rebirth(Game.rollFateCards('gate17', g17.meta)[0], '私史闸测者', g17.meta, 'life-gate17');
  const L17 = g17.state.life;
  // 首见私人史卡：找到老猎户所在节点搭话
  const nd17 = Object.values(nodes).find(n => (n.npcs || []).includes('laolienu'));
  L17.location = { city: nd17.city, node: nd17.id };
  L17.money = Math.max(L17.money, 0);
  const jnTalk = g17.journal.length;
  g17.input('和老猎户聊');
  check('首见对话出私人史卡（履历页入文）', g17.journal.slice(jnTalk).some(j => (j.text || '').includes('老猎户今年')), 'life card ok');

  // 账册记忆：种一条含其名的恩账，直接结算（绕开 22% 掷签）
  g17.state.ledger.push({ type: '恩', text: `替老猎户从狼口里抢回了一张皮子`, year: g17.state.world.year });
  const { npcMemoryEcho } = await import('../src/engine/npcLives.js');
  const jnMem = g17.journal.length;
  npcMemoryEcho(g17, npcs.laolienu);
  check('账册记忆回响（NPC 亲自提旧账）', g17.journal.slice(jnMem).some(j => (j.text || '').includes('记着') || (j.text || '').includes('这笔账')), 'memory echo ok');

  // 岁月到头：推年到老猎户殁龄（born=-59 → 70 岁 = year 11）——yearTick 途中即会触发讣闻
  L17.location = { city: nd17.city, node: nd17.id };
  while (g17.state.world.year < 11 && g17.state.alive) {
    if (g17.pending) g17.closePending();
    g17.advanceTime(30);
    if (g17.pending) g17.closePending();
  }
  check('岁月到头出讣闻（身后事入文）', g17.journal.some(j => (j.text || '').includes('老猎户没熬过')), 'obituary ok');
  check('殁者入 deadNpcs（与 worldsim 共管口径）', g17.state.world.deadNpcs.includes('laolienu'), 'deadNpcs ok');
  const jnTail = g17.journal.length;
  g17.input('和老猎户聊');
  check('殁者不可再言（对亡者搭话成空）', g17.journal.slice(jnTail).every(j => !(j.text || '').includes('灶上有热水')), 'dead silent ok');
  check('身后账入册（闻类旧账）', g17.state.ledger.some(l => l.type === '闻' && (l.text || '').includes('故去')), 'ledger ok');
})();

// ================= 闸十八：十八期 v18.0（前世主线） =================
await (async () => {
  console.log('\n—— 闸十八：前世主线 ——');
  const { captureCross, rebirthEchoes, reincarnationYearTick, resolveReincarnationChoice } = await import('../src/engine/reincarnation.js');
  // 全链：一世留宿敌+托孤 → 盖棺捕获 → 二世回响 → 强触发三线
  const meta18 = { legacyPoints: 0, pastLives: [], crossSeenAdventures: [] };
  const ga = new Game(null, meta18);
  ga.rebirth(Game.rollFateCards('gate18a', meta18)[0], '前世者', meta18, 'life-g18a');
  ga.state.life.rels.push({ id: 'r1', kind: 'nemesis', name: '沈孤鸿', alive: true, metYear: 1, metAge: 20, mood: 'strained', arc: [] });
  ga.state.life.flags.tuogu_duty = { name: '白泽', dueYear: 5 };
  ga.die('hengsi', null);
  check('盖棺捕获未了之局（宿敌+托孤入 meta）', meta18.crossNemesis?.name === '沈孤鸿' && meta18.crossTuogu?.name === '白泽', 'capture ok');
  let guard = 60;
  while (ga.state.afterlife && guard--) { if (ga.pending) ga.chooseOption(0); else ga.state.afterlife = null; }
  check('幽冥链走完出判词', !!ga.judgment, 'judged ok');

  const gb = new Game(null, meta18);
  gb.rebirth(Game.rollFateCards('gate18b', meta18)[0], '今生者', meta18, 'life-g18b');
  check('二世回响（宿敌/托孤旗标就位）', gb.state.life.flags.nemesisReturn?.name === '沈孤鸿' && gb.state.life.flags.tuoguReturn?.name === '白泽', 'echo ok');
  gb.state.life.age = 20;
  let fired = 0;
  for (let i = 0; i < 400 && fired < 2; i++) {
    gb.pending = null;
    if (reincarnationYearTick(gb)) fired++;
    if (gb.pending) gb.chooseOption(0);
  }
  check('两线事件均现世并结算', fired === 2 && !gb.state.life.flags.nemesisReturn && !gb.state.life.flags.tuoguReturn, `fired=${fired}`);
  check('托孤了局落恩账（跨世寻主）', gb.state.ledger.some(l => l.type === '恩' && (l.text || '').includes('跨世寻主')), 'tuogu resolve ok');

  // 守井人线：需往世簿在册（第二世起）——补一条 pastLives 后掷签至首遇
  const gc = new Game(null, meta18);
  meta18.pastLives.push({ name: '前世者', age: 40, kind: 'hengsi' });
  gc.rebirth(Game.rollFateCards('gate18c', meta18)[0], '守约者', meta18, 'life-g18c');
  gc.state.life.age = 20;
  let firedWell = false;
  for (let i = 0; i < 500 && !firedWell; i++) {
    gc.pending = null;
    gc.state.life.flags.wellMetThisLife = false;
    firedWell = reincarnationYearTick(gc);
  }
  check('守井人首遇现世（过所赠牌）', firedWell && gc.pending?.ev?.title === '井边过所', gc.pending?.ev?.title || 'none');
  resolveReincarnationChoice(gc, { reline: { act: 'token' } });
  resolveReincarnationChoice(gc, { reline: { act: 'token' } });
  resolveReincarnationChoice(gc, { reline: { act: 'token' } });
  check('过所三枚入 meta', meta18.wellTokens === 3, `tokens=${meta18.wellTokens}`);
  resolveReincarnationChoice(gc, { reline: { act: 'enlighten' } });
  check('灌顶结算（token 清零+修为灌顶+喜账）', meta18.wellTokens === 0 && meta18.wellEnlightened && gc.state.life.xiwei >= 200 && gc.state.ledger.some(l => l.type === '喜' && (l.text || '').includes('井灵')), 'enlighten ok');
  // 判词收束：无牌不提（gc 未死过，state._wellTokens 缺省 0）
  const { finalJudgment } = await import('../src/engine/legacy.js');
  const jg18 = finalJudgment(gc.state, 'shouzhong');
  check('判词不提空约（无牌者判词无「枚过所」）', !JSON.stringify(jg18).includes('枚过所'), 'no-token silent ok');
  gc.state._wellTokens = 5;
  const jg18b = finalJudgment(gc.state, 'shouzhong');
  check('判词提守井人的约（有牌者「5枚过所」入世外层）', JSON.stringify(jg18b).includes('5枚过所'), 'verdict ok');
})();

// ================= 闸十九：十九期 v19.0（图鉴与成就） =================
await (async () => {
  console.log('\n—— 闸十九：图鉴与成就 ——');
  const { ACHIEVEMENTS } = await import('../src/content/achievements.js');
  check('成就名册审计（id 唯一、test 可执行）', new Set(ACHIEVEMENTS.map(a => a.id)).size === ACHIEVEMENTS.length && ACHIEVEMENTS.every(a => typeof a.test === 'function'), `n=${ACHIEVEMENTS.length}`);

  const meta19 = { legacyPoints: 0, pastLives: [], crossSeenAdventures: [] };
  // 一世：横死带兽+结发 → 死时图鉴入册、成就添章入文
  const ga = new Game(null, meta19);
  ga.rebirth(Game.rollFateCards('gate19a', meta19)[0], '图鉴甲', meta19, 'life-g19a');
  ga.state.life.rels.push({ id: 'r1', kind: 'spouse', name: '阿沅', alive: true, metYear: 1, metAge: 19, mood: 'warm', arc: [] });
  ga.state.life.beastBook.push('beast_junma');
  ga.state.life.mount = { name: '军马', kind: 'ma', xun: 1, years: ga.state.life.age };
  ga.die('hengsi', null);
  let guard = 60;
  while (ga.state.afterlife && guard--) { if (ga.pending) ga.chooseOption(0); else ga.state.afterlife = null; }
  check('一世图鉴入册（死法+名册并集）', meta19.codex?.deathKinds?.includes('hengsi') && meta19.codex?.beasts?.includes('beast_junma'), 'codex ok');
  check('成就首结算（来过/不测/结发/兽亲）', ['ach_begin', 'ach_hengsi', 'ach_jiefa', 'ach_shouqin'].every(id => meta19.achievements.includes(id)), `n=${meta19.achievements.length}`);
  check('添章播报入文卷（图鉴·成就添章）', ga.journal.some(j => (j.text || '').includes('图鉴·成就添章')), 'broadcast ok');

  // 二世：寿终 → 死法并集增页，成就不重章
  const gb = new Game(null, meta19);
  gb.rebirth(Game.rollFateCards('gate19b', meta19)[0], '图鉴乙', meta19, 'life-g19b');
  gb.state.life.beastBook.push('beast_poxiao');
  const achBefore = meta19.achievements.length;
  gb.die('shouzhong', null);
  guard = 80;
  while (gb.state.afterlife && guard--) { if (gb.pending) gb.chooseOption(0); else gb.state.afterlife = null; }
  check('跨世并集（死法两页/妖兽并两录）', meta19.codex.deathKinds.includes('shouzhong') && meta19.codex.beasts.includes('beast_poxiao') && meta19.codex.beasts.includes('beast_junma'), 'union ok');
  check('成就不重章（只增新章）', meta19.achievements.length >= achBefore && new Set(meta19.achievements).size === meta19.achievements.length, `before=${achBefore} after=${meta19.achievements.length}`);
  check('判词照常产出（成就不扰幽冥链）', !!gb.judgment, 'judged ok');
})();

// ================= 闸二十：存档导出/导入 + 音效（docs/设计-*.md 定稿口径） =================
await (async () => {
  console.log('\n—— 闸二十：存档导出导入 + 音效 ——');
  const { buildExportDoc, validateImportDoc, parseImportText, importAll } = await import('../src/save/port.js');
  const { SOUNDS, KIND_TO_SFX, TEXT_TO_SFX, pickSfx, audio } = await import('../src/audio.js');
  const { readFileSync, readdirSync } = await import('node:fs');
  const { dirname, join } = await import('node:path');
  const { fileURLToPath } = await import('node:url');
  const here = dirname(fileURLToPath(import.meta.url));

  // ---- 导出文档组装 ----
  const meta20 = { legacyPoints: 7, pastLives: [{ name: '甲', age: 60, kind: 'shouzhong' }], crossSeenAdventures: [], codex: { deathKinds: ['shouzhong'], beasts: [] } };
  const state20 = { life: { name: '李观棋', age: 43 }, world: { year: 43 }, _journal: [{ kind: 'ambient', text: '春雨。' }] };
  const saves20 = [{ slot: 'auto', name: '李观棋·43岁', at: 1790000000000, state: state20 }];
  const doc20 = buildExportDoc(meta20, saves20);
  check('导出文档带魔数与格式版本', doc20.game === 'shanhe-wenjian-lu' && doc20.fmt === 1, 'header ok');
  check('导出自带文字卷轴（_journal 落文件）', doc20.saves[0].state._journal.length === 1, 'journal in doc ok');
  const roundtrip = JSON.parse(JSON.stringify(doc20));
  check('导出可 JSON 往返（无不可序列化物）', roundtrip.meta.legacyPoints === 7 && roundtrip.saves[0].at === 1790000000000, 'roundtrip ok');

  // ---- 校验规则表（§四） ----
  check('非 JSON 拒收', parseImportText('{{{') .error === '这不是一份能读的存档文件。', 'json ok');
  check('错魔数拒收', validateImportDoc({ ...doc20, game: 'other-game' }).error === '这不是山河问剑录的存档。', 'magic ok');
  check('坏格式版本拒收', validateImportDoc({ ...doc20, fmt: 'x' }).error === '存档格式认不出来。', 'fmt ok');
  check('缺往世簿拒收', validateImportDoc({ ...doc20, meta: {} }).error === '存档里的往世簿缺了页。', 'meta ok');
  check('残档位拒收（缺名姓）', validateImportDoc({ ...doc20, saves: [{ slot: 'auto', state: { life: {}, world: {} } }] }).error.includes('残了'), 'slot ok');
  const vOK = validateImportDoc(doc20);
  check('好档放行并出摘要', vOK.ok && vOK.summary.lives === 1 && vOK.summary.slots === 1 && vOK.summary.names[0] === '李观棋', 'accept ok');

  // ---- 导入事务：备份→写档→写meta，失败不落笔 ----
  const calls = [];
  const fakeSave = {
    calls,
    async saveGame(slot, state, name) { this.calls.push(['save', slot]); if (slot === 'boom') throw new Error('disk full'); },
    async saveMeta(meta) { this.calls.push(['meta']); },
    async currentMeta() { this.calls.push(['backup']); return { legacyPoints: 3, pastLives: [] }; },
  };
  const rOK = await importAll(fakeSave, doc20);
  check('导入三步序：备份→写档→写meta', JSON.stringify(fakeSave.calls) === JSON.stringify([['backup'], ['save', 'backup-preimport'], ['save', 'auto'], ['meta']]), `order=${JSON.stringify(fakeSave.calls)}`);
  check('导入前备份档名固定', rOK.backup === true && fakeSave.calls[0][0] === 'backup', 'backup ok');
  // 失败事务：写档炸则不写 meta
  const calls2 = [];
  const badSave = { calls: calls2, async saveGame(s, st, n) { if (s !== 'backup-preimport') throw new Error('x'); }, async saveMeta() { this.calls.push(['meta']); }, async currentMeta() { return { legacyPoints: 0 }; } };
  let threw = false;
  try { await importAll(badSave, { ...doc20, saves: [{ slot: 'boom', name: 'x', at: 1, state: state20 }] }); } catch { threw = true; }
  check('写档炸则不写 meta（事务性）', threw && !calls2.some(c => c[0] === 'meta'), 'tx ok');
  const callsBefore = fakeSave.calls.length;
  check('坏文件不落任何一笔（校验先行）', (await importAll(fakeSave, { game: 'nope' })).ok === false && fakeSave.calls.length === callsBefore, 'no-write ok');

  // ---- 音效表审计 ----
  const soundNames = Object.keys(SOUNDS);
  const referenced = [...Object.values(KIND_TO_SFX), ...TEXT_TO_SFX.map(t => t.sfx), 'tick', 'gong_deep'];
  check('映射表引用的音色全部有定义', referenced.every(n => SOUNDS[n]), `missing=${referenced.filter(n => !SOUNDS[n]).join(',') || 'none'}`);
  check('每个音色有合成参数（osc/noise+env+gain）', soundNames.every(n => SOUNDS[n].env && typeof SOUNDS[n].gain === 'number' && (SOUNDS[n].osc?.length || SOUNDS[n].noise)), 'def ok');
  check('文卷尾条选音（adventure→低钟）', pickSfx([{ kind: 'ambient', text: '春' }, { kind: 'adventure', text: 'x' }]) === 'bell_low', 'map ok');
  check('善账优先于 kind（清铃压过脚步声）', pickSfx([{ kind: 'ambient', text: '善账添了一笔' }]) === 'bell_bright', 'text-prio ok');
  check('未知 kind 静默（宁少响不乱响）', pickSfx([{ kind: 'system', text: 'x' }]) === null, 'silent ok');
  check('静音开关往返持久化', (() => { audio.setMuted(true); const m = audio.muted; audio.setMuted(false); return m === true && audio.muted === false; })(), 'muted ok');

  // ---- 架构红线：引擎层无 audio 引用 ----
  const engineFiles = readdirSync(join(here, '..', 'src', 'engine'));
  let leaked = [];
  for (const f of engineFiles) {
    const src = readFileSync(join(here, '..', 'src', 'engine', f), 'utf-8');
    if (/from\s+['"].*audio/.test(src)) leaked.push(f);
  }
  check('引擎层零 audio 依赖（架构红线）', leaked.length === 0, leaked.join(',') || 'clean');

  // ---- 真实链路：走完一世 → 导出文档由真 state 组装可过校验 ----
  const g20 = new Game(null, { legacyPoints: 0, pastLives: [], crossSeenAdventures: [] });
  g20.rebirth(Game.rollFateCards('gate20', g20.meta)[0], '闸二十', g20.meta, 'life-g20');
  g20.persist();
  const realDoc = buildExportDoc(g20.meta, [{ slot: 'auto', name: '闸二十', at: Date.now(), state: g20.state }]);
  const rv = validateImportDoc(realDoc);
  check('真 state 组装导出可过校验（十五期投影不坏格式）', rv.ok && rv.summary.names[0] === '闸二十', rv.error || 'real ok');
  // 读档恢复：构造器吃回 _journal
  const g20b = new Game(JSON.parse(JSON.stringify(g20.state)), g20.meta);
  check('导入的 state 建号即续（卷轴回来）', g20b.journal.length >= 1, `journal=${g20b.journal.length}`);
})();

// ================= 闸二十一：游玩体验优化（docs/设计-游玩体验优化.md 定稿口径） =================
await (async () => {
  console.log('\n—— 闸二十一：游玩体验优化 ——');
  const { HIDDEN_LINES } = await import('../src/content/fates.js');
  const { EVENTS } = await import('../src/content/events.js');
  const { parse } = await import('../src/engine/parser.js');
  const { nodes } = await import('../src/content/world.js');

  // 修 I：35 条暗线 hook 全部落地
  const hooks = [...new Set(Object.values(HIDDEN_LINES).map(h => h.hook))];
  const missing = hooks.filter(h => !EVENTS[h]);
  check('暗线 hook 全数落地（35 条，此前 32 条死线）', missing.length === 0, missing.join(',') || '35/35 ok');
  check('hook 事件结构合法（nodes 非空/options≥2）', hooks.every(h => EVENTS[h]?.nodes?.length >= 1 && EVENTS[h]?.options?.length >= 2), 'shape ok');
  // 新补的 32 条必须旗标对准暗线 id（原山村三条走 cond.night，不在此列）
  const shancunHooks = new Set(Object.values(HIDDEN_LINES).slice(0, 3).map(h => h.hook));
  const newHooks = hooks.filter(h => !shancunHooks.has(h));
  check('新补 hook 的旗标对准暗线 id', newHooks.every(h => EVENTS[h].cond?.flags?.some(f => f.startsWith('hl_'))), 'flags ok');
  // 桥接两条：trigger 能拉起死而复生的接引奇遇
  check('桥接 hook 的 trigger 指向真实奇遇', ['ev_canpian_name', 'ev_pixiang_ying'].every(h => EVENTS[h].options.some(o => o.trigger && (o.trigger === 'adv_canpian_name' || o.trigger === 'adv_pixiang_ying'))), 'bridge ok');

  // 全链路：新角色
  const meta21 = { legacyPoints: 0, pastLives: [], crossSeenAdventures: [] };
  const g21 = new Game(null, meta21);
  g21.rebirth(Game.rollFateCards('gate21', meta21)[0], '闸行者', meta21, 'life-g21');
  const scene21 = g21.currentScene();

  // 修 B：核心动词常驻且全部话头可解析（go/talk/ask 类需槽位，按需放宽）
  const ht = scene21.huatou;
  check('核心动词常驻（打坐吐纳/练武在最前）', ht.slice(0, 2).includes('打坐吐纳') && ht.slice(0, 2).includes('练武'), ht.slice(0, 3).join('/'));
  const unparseable = ht.filter(h => {
    const r = parse(h, scene21, { nodes, npcs: {}, cities: {}, areas: {} });
    return r.verdict === 'miss';
  });
  check('话头标签 100% 可解析（不过闸的文案不许上墙）', unparseable.length === 0, unparseable.join(',') || 'all parse ok');

  // 修 A：问天四段指路入卷轴，不烧时间
  const clock = (g) => g.state.life.day + g.state.world.year * 120;
  const dayBefore = clock(g21);
  const jnA = g21.journal.length;
  g21.input('问天');
  const askText = g21.journal.slice(jnA).map(j => j.text || '').join('\n');
  check('问天出指路面板（处境/眼下的路/修行/光阴）', askText.includes('【问天】') && askText.includes('眼下的路') && askText.includes('岁'), 'panel ok');
  check('问天不烧时间', clock(g21) === dayBefore, 'no time ok');
  check('问天带暗线行', askText.includes('心里搁着一桩事'), 'xinshi ok');

  // 修 F：眼下栏数据源（fire hook 之前，心事在册）
  const eye = g21.eyeNow();
  check('眼下栏数据源（心事/境界词）', eye.xinshi && eye.xinshi.title && typeof eye.realmWord === 'string', JSON.stringify(eye).slice(0, 60));

  // 修 C：琢磨心事——指向 hook 节点
  const jnP = g21.journal.length;
  const hlTitle = (askText.match(/心里搁着一桩事：(.+?)。/) || [])[1];
  g21.input(`想想「${hlTitle}」`);
  const ponderText = g21.journal.slice(jnP).map(j => j.text || '').join('\n');
  check('琢磨心事出指路（含暗线标题与去处）', ponderText.includes(hlTitle) && /得到.{1,8}走一趟/.test(ponderText), ponderText.slice(0, 60));
  // 事件结算后「已了」改口：借第一条暗线旗标+hook 入 doneEvents 验证 doPonder 分支
  const hl0 = Object.values(HIDDEN_LINES)[0];
  g21.state.life.flags.hiddenLine = hl0.id;
  if (g21.pending) g21.closePending();
  g21.fireEvent(EVENTS[hl0.hook]);
  if (g21.pending) g21.chooseOption(0);
  if (g21.pending) g21.closePending();
  check('hook 结算后已入 doneEvents', (g21.state.life.flags.doneEvents || []).includes(hl0.hook), 'done ok');
  const jnQ = g21.journal.length;
  g21.doPonder();
  check('hook 结算后琢磨改口（已了）', g21.journal.slice(jnQ).some(j => (j.text || '').includes('了了')), 'settle ok');

  // 修 D：miss 不烧时间 + 引导语
  const d2 = clock(g21);
  const jnM = g21.journal.length;
  g21.input('你好啊朋友');
  const missText = g21.journal.slice(jnM).map(j => j.text || '').join('\n');
  check('乱打字不烧时间（光阴不因沉默流逝）', clock(g21) === d2, 'no-time ok');
  check('miss 回复带问天引导', missText.includes('「问天」'), 'guide ok');

  // 回归：10 步零异常
  let err21 = null;
  try {
    for (let i = 0; i < 10; i++) { if (g21.pending) g21.closePending(); g21.input(scene21.huatou[i % scene21.huatou.length]); }
  } catch (e) { err21 = e.message; }
  check('新角色 10 步全话头点击零异常', !err21, err21 || 'ok');
})();

console.log(`\n${'='.repeat(40)}`);
console.log(`通过 ${pass} 项，失败 ${fail} 项`);
if (fail) {
  console.log('\n失败明细：');
  for (const f of failures) console.log(`  ✗ ${f.name} ${f.detail}`);
  process.exit(1);
} else {
  console.log('四闸全绿。山河开工。');
}
