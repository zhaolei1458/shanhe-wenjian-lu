// ============================================================
// 山河问剑录 · 引擎/生活质感十四期（04 册 §4.2 + §5.2）
// jieqiOf（节气坐标）/ advanceQualityDay（节气光景+月圆）/ moraTick（入魔渐变线+心魔劫）
// resolveMoraChoice（悬崖勒马/入魔——横死之外最慢也最疼的收束路）
// ============================================================
import { JIEQI_PAIRS, JIEQI_SCENES, MOON_FULL, COMET_TEXT, COMET_AFTER, MO_GRADIENT, RUMO_EVENT_TEXT, RUMO_LEASH, RUMO_SUCCUMB } from '../content/quality.js';

// ---------- 节气坐标（月 30 日：1-15 上气，16-30 下气；一季两气） ----------
export function jieqiOf(life) {
  const day = ((life.day - 1 + 30) % 30);
  return (JIEQI_PAIRS[life.season || 0] || JIEQI_PAIRS[0])[Math.floor(day / 15)];
}

// ---------- 新的一天：节气光景 + 月圆天象（advanceTime 换天处调用） ----------
export function advanceQualityDay(game) {
  const life = game.state.life;
  if (!game.state.alive || game.state.afterlife) return;
  // 彗星引信的次年：光景添不安
  if (life.flags?.cometYear != null && game.state.world.year === life.flags.cometYear + 1 && life.day === 1 && life.season === 0) {
    game.say(COMET_AFTER, 'ambient');
  }
  // 月圆（每月十五）：妖修坐不住
  if (life.day === 15 && game.rng.chance(0.6)) {
    game.say(game.rng.pick(MOON_FULL), 'ambient');
  }
  // 节气换气（每月 1 日/16 日）
  if (life.day === 1 || life.day === 16) {
    const q = jieqiOf(life);
    game.say(game.rng.pick(JIEQI_SCENES)(q), 'ambient');
  }
}

// ---------- 彗星引信（yearTick 低频：钦天监异动，来年有事） ----------
export function maybeComet(game) {
  const life = game.state.life;
  if (!game.state.alive || game.state.afterlife) return;
  if (life.flags?.cometYear != null && game.state.world.year - life.flags.cometYear < 3) return; // 彗星不连年
  if (game.rng.chance(0.08)) {
    life.flags.cometYear = game.state.world.year;
    game.say(COMET_TEXT, 'ambient');
    game.book('秘', '夜见彗星，钦天监异动——来年恐有大变');
  }
}

// ---------- 走火入魔渐变线（yearTick 掷签：corruption 越深，光景越沉） ----------
export function moraTick(game) {
  const life = game.state.life;
  const c = life.corruption || 0;
  if (!game.state.alive || game.state.afterlife) return;
  if (c >= 9 && (life.gongfa.some(g => g.mai === 'mo') || life.flags?.moza_seed)) {
    // 顶格：心魔劫（每岁三成必至）
    if (game.rng.chance(0.3)) {
      game.fireEvent({
        id: 'rumo_' + game.state.world.year,
        title: '心魔劫',
        text: RUMO_EVENT_TEXT,
        options: [
          { label: '悬崖勒马——把缰绳抢回来', mora: 'leash' },
          { label: '松手。让它替你活', mora: 'succumb' },
        ],
      });
      return;
    }
  }
  // 渐变掷签：阈值档各 22%
  for (const th of [7, 5, 3, 1]) {
    if (c >= th && game.rng.chance(0.22)) {
      game.say(game.rng.pick(MO_GRADIENT[th]), 'ambient');
      return; // 一年只出一句
    }
  }
}

// ---------- 心魔劫抉择 ----------
export function resolveMoraChoice(game, opt) {
  const life = game.state.life;
  if (opt.mora === 'leash') {
    life.corruption = Math.max(0, (life.corruption || 0) - 5);
    life.xiwei = Math.max(0, life.xiwei - 150);
    game.say(RUMO_LEASH, 'event');
    game.book('善', `心魔劫悬崖勒马，散功自赎（修为大损，心志得全）`);
    life.flags.moraLeashed = (life.flags.moraLeashed || 0) + 1;
  } else {
    game.say(RUMO_SUCCUMB, 'event');
    game.die('rumo', '那夜之后，江湖上还流传着你的名号——可"你"早在那口井底就没了。它带着你的脸闯荡江湖，快意恩仇，比从前的你更像你。直到某一夜，它也听见了井底的喊声。');
  }
}
