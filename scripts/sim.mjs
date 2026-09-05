// ============================================================
// 山河问剑录 · 长世模拟回归台（十六期）
// 用法：node scripts/sim.mjs [N] [seed]
// headless 连跑 N 世（轮回传承链：judgment 入 pastLives，跨世回响生效），
// 聚合死因/寿数/境界/银钱/奇遇/关系分布，暴露潜伏 bug 与平衡异常。
// 输出：stdout 人读摘要 + 模拟回归报告.json
// ============================================================
import { Game } from '../src/engine/game.js';
import { REALMS } from '../src/engine/state.js';
import { cities } from '../src/content/world.js';
import { writeFileSync } from 'node:fs';

// ---------- 可复现随机（与引擎 RNG 分离，只驱动模拟台自身） ----------
function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function makeSimRng(seed) {
  const next = mulberry32(seed);
  return {
    next,
    int(n) { return Math.floor(next() * n); },
    pick(arr) { return arr[Math.floor(next() * arr.length)]; },
    chance(p) { return next() < p; },
  };
}

const N = parseInt(process.argv[2] || '200', 10);
const SEED = parseInt(process.argv[3] || '20260905', 10);
const simRng = makeSimRng(SEED);
const DAY_CHUNKS = [1, 1, 2, 3, 5, 8, 13, 21, 34];
const COMBAT_CMDS = ['攻', '守', '看破破绽', '逃'];
const MAX_STEPS = 60000; // 每世步数上限——到顶视为「卡死」，是 bug 信号

const realmName = (id) => REALMS[id]?.name || id || '凡人';

function runOneLife(lifeIdx, meta) {
  const g = new Game(null, meta);
  const card = Game.rollFateCards(`sim-${SEED}-${lifeIdx}`, meta)[simRng.int(3)];
  const name = ['沈青山', '陆惊鸿', '白观棋', '燕辞归', '程无名'][lifeIdx % 5] + (lifeIdx > 4 ? String(lifeIdx) : '');
  g.rebirth(card, name, meta);

  let steps = 0, threw = null;
  try {
    while (g.state.alive && steps < MAX_STEPS) {
      steps++;
      const p = g.pending;
      if (p) {
        if (p.type === 'combat') {
          g.combatInput(simRng.pick(COMBAT_CMDS));
        } else {
          const opts = p.options || [];
          if (!opts.length) g.closePending();
          else g.chooseOption(simRng.int(opts.length));
        }
        continue;
      }
      const r = simRng.next();
      if (r < 0.52) g.advanceTime(simRng.pick(DAY_CHUNKS));
      else if (r < 0.72) { // 赶路：随机去处（战斗/奇遇/恩怨多在路上与节点）
        const list = Object.values(cities).filter(c => c.id !== g.state.life.location.city);
        if (list.length) g.input('赶路去' + simRng.pick(list).name);
      }
      else if (r < 0.80) g.input('闲逛');
      else if (r < 0.90) g.doCultivate();
      else if (r < 0.96) g.input('练武');
      else g.input('看看四周');
    }
  } catch (e) {
    threw = (e && e.stack || String(e)).split('\n').slice(0, 3).join(' | ');
    // 诊断快照：崩时幕面状态
    try {
      threw += `\n    [diag] pending=${JSON.stringify(g.pending && { type: g.pending.type, id: g.pending.id, stage: typeof g.pending.stage, returnStage: g.pending.returnStage })} seenTail=${JSON.stringify(g.state.adventures.seen.slice(-3))}`;
    } catch {}
  }

  const life = g.state.life;
  const j = g.judgment;
  // 与 main.js onDeath 同口径：判词入往世簿，下一世带跨世回响
  if (j) {
    meta.legacyPoints += j.points || 0;
    meta.crossSeenAdventures = [...new Set([...(meta.crossSeenAdventures || []), ...(j.adventures || [])])].slice(-24);
    meta.pastLives = [...(meta.pastLives || []), { name: j.name, age: j.age, kind: j.kind, judge: j.judge, imprint: j.imprint, points: j.points, mengpo: j.mengpo || null, minghao: j.minghao || null, topGongfa: j.topGongfa || null, chronicle: j.chronicle || [], swordBond: j.swordBond || 0 }].slice(-12);
  }
  const stuck = g.state.alive && steps >= MAX_STEPS;
  const rels = life.rels || [];
  return {
    idx: lifeIdx, name,
    seed: `sim-${SEED}-${lifeIdx}`,
    ok: !threw && !stuck && !!j,
    threw, stuck,
    judged: !!j,
    age: j ? j.age : life.age,
    diedOf: j ? j.kind : (life.diedOf || '未终'),
    realm: realmName(life.realm),
    money: Math.round(life.money),
    xiuwei: life.xiwei,
    corruption: life.corruption || 0,
    advSeen: g.state.adventures.seen.length,
    rels: rels.length,
    children: rels.filter(r => r.kind === 'child').length,
    enemies: rels.filter(r => r.kind === 'nemesis').length,
    spouse: rels.some(r => r.kind === 'spouse'),
    minghao: life.minghao || null,
    points: j ? j.points : 0,
    steps,
  };
}

// ---------- 主循环：轮回传承链 ----------
const meta = { legacyPoints: 0, pastLives: [], crossSeenAdventures: [] };
const lives = [];
for (let i = 0; i < N; i++) {
  lives.push(runOneLife(i, meta));
}

// ---------- 聚合统计 ----------
const dead = lives.filter(l => l.judged);
const sum = (a) => a.reduce((x, y) => x + y, 0);
const ages = dead.map(l => l.age).sort((a, b) => a - b);
const pct = (p) => ages.length ? ages[Math.min(ages.length - 1, Math.floor(p * ages.length))] : 0;
const dist = {};
dead.forEach(l => { dist[l.diedOf] = (dist[l.diedOf] || 0) + 1; });
const realms = {};
dead.forEach(l => { realms[l.realm] = (realms[l.realm] || 0) + 1; });
const errs = lives.filter(l => l.threw);
const stuck = lives.filter(l => l.stuck);
const noJudge = lives.filter(l => !l.judged && !l.threw && !l.stuck);

const report = {
  meta: { N, seed: SEED, generatedAt: new Date().toISOString(), version: '16.0.0' },
  summary: {
    judged: dead.length, threw: errs.length, stuck: stuck.length, noJudge: noJudge.length,
    age: { min: ages[0] ?? 0, p10: pct(0.10), median: pct(0.5), p90: pct(0.90), max: ages[ages.length - 1] ?? 0, mean: ages.length ? Math.round(sum(ages) / ages.length * 10) / 10 : 0 },
    diedOf: dist,
    realms,
    avgAdvSeen: dead.length ? Math.round(sum(dead.map(l => l.advSeen)) / dead.length * 10) / 10 : 0,
    avgMoney: dead.length ? Math.round(sum(dead.map(l => l.money)) / dead.length) : 0,
    avgRels: dead.length ? Math.round(sum(dead.map(l => l.rels)) / dead.length * 10) / 10 : 0,
    avgPoints: dead.length ? Math.round(sum(dead.map(l => l.points)) / dead.length * 10) / 10 : 0,
    spouseRate: dead.length ? Math.round(dead.filter(l => l.spouse).length / dead.length * 100) + '%' : '0%',
    minghaoRate: dead.length ? Math.round(dead.filter(l => l.minghao).length / dead.length * 100) + '%' : '0%',
  },
  exceptions: errs.slice(0, 10).map(l => ({ idx: l.idx, seed: l.seed, stack: l.threw })),
  stuckLives: stuck.map(l => ({ idx: l.idx, seed: l.seed, steps: l.steps, age: l.age })),
  lives: lives.map(l => ({ idx: l.idx, name: l.name, age: l.age, diedOf: l.diedOf, realm: l.realm, money: l.money, adv: l.advSeen, rels: l.rels, pts: l.points, ok: l.ok })),
};
writeFileSync(new URL('./sim-report.json', import.meta.url), JSON.stringify(report, null, 2));

// ---------- 人读摘要 ----------
console.log(`\n===== 长世模拟回归（${N} 世，seed=${SEED}）=====`);
console.log(`盖棺 ${dead.length} ｜ 抛异常 ${errs.length} ｜ 卡死 ${stuck.length} ｜ 无判词 ${noJudge.length}`);
console.log(`寿数：min=${report.summary.age.min} p10=${report.summary.age.p10} 中位=${report.summary.age.median} p90=${report.summary.age.p90} max=${report.summary.age.max} 均=${report.summary.age.mean}`);
console.log(`死因分布：${JSON.stringify(dist)}`);
console.log(`殁时境界：${JSON.stringify(realms)}`);
console.log(`均奇遇=${report.summary.avgAdvSeen} 均银钱=${report.summary.avgMoney} 均关系=${report.summary.avgRels} 均传承点=${report.summary.avgPoints}`);
console.log(`姻缘率=${report.summary.spouseRate} 得名号率=${report.summary.minghaoRate}`);
if (errs.length) {
  console.log(`\n—— 异常（前 10）——`);
  errs.slice(0, 10).forEach(l => console.log(`  #${l.idx} seed=${l.seed}\n    ${l.threw}`));
}
if (stuck.length) console.log(`\n—— 卡死（未到寿数且步数顶格）：${stuck.map(l => '#' + l.idx).join(' ')}`);
