// ============================================================
// 山河问剑录 · NPC 私人史引擎（十七期）
// npcYearTick：岁月推进——履历翻页、老去、身后事
// npcLifeCard：对话时的私人史卡（首见必出，再见掷签）
// npcMemoryEcho：账册记忆——NPC 亲自提起与你之间的恩怨旧账
// 口径：NPC 不跨世（跨世是主线人物的事，见十八期）；deadNpcs 由本层与 worldsim 共管。
// ============================================================
import { NPC_LIVES, NPC_MEMORY_TONES } from '../content/npcLives.js';

export function npcAgeOf(id, year) {
  const d = NPC_LIVES[id];
  return d ? year - d.born : -1;
}

// ---------- 对话时的私人史卡 ----------
export function npcLifeCard(game, npc) {
  const d = NPC_LIVES[npc.id];
  if (!d) return;
  const year = game.state.world.year;
  const age = npcAgeOf(npc.id, year);
  const past = d.beats.filter(b => b.age <= age);
  game.state.life.flags.npcMet ||= {};
  const firstMeet = !game.state.life.flags.npcMet[npc.id];
  if (firstMeet || game.rng.chance(0.35)) {
    game.state.life.flags.npcMet[npc.id] = true;
    if (past.length) {
      const b = past[past.length - 1]; // 最新的履历一页
      game.say(`（${npc.name}今年${age}。${b.text}）`, 'ambient');
    } else if (age < d.beats[0].age) {
      game.say(`（${npc.name}还很年轻，往后的事，岁月会讲。）`, 'ambient');
    }
  }
}

// ---------- 账册记忆：NPC 提起与你之间的旧账 ----------
export function npcMemoryEcho(game, npc) {
  if (!game.rng.chance(0.22)) return;
  const hits = game.state.ledger.filter(l => !l.resolved && (l.text || '').includes(npc.name));
  if (!hits.length) return;
  const l = game.rng.pick(hits);
  const tone = game.rng.pick(NPC_MEMORY_TONES[l.type] || NPC_MEMORY_TONES.恩);
  game.say(tone.replace(/\$\{name\}/g, npc.name).replace(/\$\{ledger\}/g, l.text), 'dialog');
}

// ---------- 年轮：老去与身后 ----------
export function npcYearTick(game) {
  const world = game.state.world;
  const life = game.state.life;
  for (const [id, d] of Object.entries(NPC_LIVES)) {
    const age = world.year - d.born;
    if (age < 0) continue;
    // 身后事：到寿入 deadNpcs（与 worldsim 共管，防重）
    if (d.deathAge !== undefined && age >= d.deathAge && !world.deadNpcs.includes(id)) {
      world.deadNpcs.push(id);
      const met = game.state.sleeve.people[id];
      if (met) {
        game.say(`（讣闻）${d.deathText}`, 'ambient');
        if (d.legacy) game.say(`（${d.legacy}）`, 'ambient');
        game.book('闻', `${met.name}故去，身后留了一句：${d.legacy || '岁月记得他'}`);
      }
      continue;
    }
    // 履历翻页：相熟的人履历到了新的一页，有几率从风里听到
    const met = game.state.sleeve.people[id];
    if (!met || !game.rng.chance(0.06)) continue;
    const past = d.beats.filter(b => b.age <= age);
    if (!past.length) continue;
    const b = past[past.length - 1];
    const key = 'npclife_' + id + '_' + b.age;
    if ((life.flags.heardNpcBeats || []).includes(key)) continue;
    (life.flags.heardNpcBeats ||= []).push(key);
    game.say(`（风声）听人说起${met.name}——${b.text}（袖中录·人物谱添了一笔岁月）`, 'ambient');
  }
}
