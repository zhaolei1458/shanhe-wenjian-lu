// ============================================================
// 山河问剑录 · 图鉴与成就引擎（十九期）
// accumulateCodex：die() 时把此生见闻并入跨世图鉴（meta.codex，独立于防重表）
// settleAchievements：死时结算成就章，返回新添章名（供文卷播报）
// 口径：codex 是「见过的都算」，不参与玩法判定；成就盖世章，永不下架。
// ============================================================
import { ACHIEVEMENTS } from '../content/achievements.js';

const CAP = 500;

export function accumulateCodex(game, kind) {
  const meta = game.meta;
  meta.codex ||= { deathKinds: [], minghao: [], beasts: [], advSeen: [] };
  const c = meta.codex;
  if (!c.deathKinds.includes(kind)) c.deathKinds.push(kind);
  const life = game.state.life;
  if (life.minghao && !c.minghao.includes(life.minghao)) c.minghao.push(life.minghao);
  for (const b of life.beastBook || []) if (!c.beasts.includes(b)) c.beasts.push(b);
  for (const a of game.state.adventures.seen || []) if (!c.advSeen.includes(a) && c.advSeen.length < CAP) c.advSeen.push(a);
  c.deathKinds = c.deathKinds.slice(-8);
  c.minghao = c.minghao.slice(-24);
  c.beasts = c.beasts.slice(-40);
}

export function settleAchievements(game) {
  const meta = game.meta;
  const done = new Set(meta.achievements || []);
  const newly = [];
  for (const a of ACHIEVEMENTS) {
    if (done.has(a.id)) continue;
    try {
      if (a.test(game.state.life, game.state, meta, game.state.life.diedOf)) {
        done.add(a.id);
        newly.push(a);
      }
    } catch { /* 单条成就判定炸了不拖累结算 */ }
  }
  meta.achievements = [...done];
  return newly;
}
