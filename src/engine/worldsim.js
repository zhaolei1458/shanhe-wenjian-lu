// ============================================================
// 山河问剑录 · 引擎/世界模拟（P2-7）
// 玩家不在处，江湖照样翻涌。年度调度：势力 mood 漂移 + 大事池抽取。
// 大事递到玩家眼前三条路：同城际遇 / 异城传闻 / 师门利害催账。
// ============================================================

import { WORLD_EVENTS, MOOD_TICKERS } from '../content/worldEvents.js';

const MOOD_ORDER = ['承平', '暗流', '风紧'];

export function annualWorldTick(game) {
  const st = game.state, world = st.world, life = st.life;
  const out = [];

  // ---- 势力 mood 漂移（小幅随机，有向性：风紧会回落）----
  const mi = MOOD_ORDER.indexOf(world.factionMood);
  if (world.factionMood === '风紧' && game.rng.chance(0.5)) {
    world.factionMood = '暗流';
  } else if (game.rng.chance(world.factionMood === '承平' ? 0.12 : 0.2)) {
    world.factionMood = MOOD_ORDER[Math.min(2, mi + 1)];
    out.push(`（${game.rng.pick(MOOD_TICKERS[world.factionMood])}）`);
  }

  // ---- 大事池：年内可发、未发、mood 兼容 ----
  const pool = WORLD_EVENTS.filter(ev =>
    !world.bigEvents.includes(ev.id) &&
    world.year >= ev.years[0] && world.year <= ev.years[1] &&
    (!ev.mood || ev.mood.includes(world.factionMood))
  );
  // 每年约 22% 概率落一桩大事（数十世模拟覆盖全部事件由测试保证）
  if (pool.length && game.rng.chance(0.22)) {
    const ev = game.rng.weighted(pool.map(e => ({ key: e.id, weight: e.weight, ev: e }))).ev;
    world.bigEvents.push(ev.id);
    // 人物动态：伤亡入 deadNpcs（知事口径随之变化）
    for (const nid of ev.npcDeaths || []) if (!world.deadNpcs.includes(nid)) world.deadNpcs.push(nid);
    // mood 推移
    if (ev.moodShift) world.factionMood = ev.moodShift;
    // 递送：同城→际遇事件；异城→袖中录传闻
    if (ev.arriveEvent && life.location.city === ev.city && !life.flags.doneEvents?.includes(ev.arriveEvent)) {
      game.worldEventQueue.push(ev.arriveEvent);  // 岁末后递到眼前
    } else {
      st.sleeve.events.push({ year: world.year, text: `${ev.title}——${ev.news}` });
      out.push(`【江湖大事·${ev.title}】${ev.news}`);
    }
  }
  return out;
}

// npc 是否已离场（大事伤亡）
export function npcDead(state, npcId) {
  return state.world.deadNpcs.includes(npcId);
}
