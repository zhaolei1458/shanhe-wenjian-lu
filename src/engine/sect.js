// ============================================================
// 山河问剑录 · 引擎/门派（拜师系统 · P3-4）
// 引擎薄、内容厚：门槛与考验全在 events 层（ev_kaoyan_*），
// 这里只管拜入记账、师门日常、传功进阶、年事、仇怨、叛门。
// ============================================================

import { SECTS, sectOf } from '../content/sects.js';

export function joinSect(game, sectId) {
  const sect = SECTS[sectId];
  if (!sect) return;
  const life = game.state.life;
  if (life.sect) return game.say('（你已有师门在身。江湖规矩：一仆不事二主——除非先叛。）', 'system');
  life.sect = { id: sectId, joinedYear: game.state.world.year, dutyCount: 0 };
  game.say(`【拜入${sect.name}】${sect.motto}`, 'system');
  // 传功：入门功法
  if (sect.gongfa && !life.gongfa.some(g => g.id === sect.gongfa.id)) {
    life.gongfa.push({ ...sect.gongfa });
    game.say(`（师父传你功法【${sect.gongfa.name}】。${sect.gongfa.desc}）`, 'item');
  }
  // 仇怨网：拜入即接进网
  for (const [k, text] of Object.entries(sect.grudges || {})) game.say(`（${text}）`, 'system');
  game.book('诺', `拜入${sect.name}门墙——师门的名声，从此也有你一份`);
}

// 师门日常：每季限领一次；做满三次且入门满一年，师父传第二部功法
export function sectDuty(game) {
  const sect = sectOf(game.state);
  const life = game.state.life;
  if (!sect) return { ok: false, text: '你无门无派。江湖上讨生活的路子多，看家本事的门路少。' };
  const node = game.sceneNode();
  if (!node || node.id !== sect.node) return { ok: false, text: `师门的日常，得回${sect.name}去做。人在外头，心就散了。` };
  if (life.flags.dutySeason === game.state.world.year * 4 + life.season) {
    return { ok: false, text: '功课做一遍是修行，做两遍是应付。师父没说什么，但你过不了自己这关——下季再来。' };
  }
  life.flags.dutySeason = game.state.world.year * 4 + life.season;
  life.sect.dutyCount++;
  const duty = game.rng.pick(sect.duties);
  game.applyEffect(duty.effect, 'sect');
  if (duty.dutyFlag) life.flags[duty.dutyFlag] = (life.flags[duty.dutyFlag] || 0) + 1;
  // 进阶传功：三次日常 + 入门满一年
  if (sect.secondGongfa && life.sect.dutyCount >= 3 && game.state.world.year - life.sect.joinedYear >= 1
      && !life.gongfa.some(g => g.id === sect.secondGongfa.id)) {
    life.gongfa.push({ ...sect.secondGongfa });
    game.say(`（师父把你叫到跟前，传了第二部功法【${sect.secondGongfa.name}】。${sect.secondGongfa.desc}）`, 'item');
    game.book('恩', `${sect.name}师父传下第二部功法`);
  }
  return { ok: true, text: duty.text };
}

export function leaveSect(game) {
  const sect = sectOf(game.state);
  const life = game.state.life;
  if (!sect) return { ok: false, text: '你本就无门无派——孤身一人，来去也干净。' };
  life.flags.betrayed = [...(life.flags.betrayed || []), life.sect.id];
  game.state.ledger.push({ year: game.state.world.year, season: game.state.life.season, type: '怨', text: `叛出${sect.name}——${sect.rule}`, resolved: false });
  game.say(`（你叛出了${sect.name}。${sect.rule}）`, 'system');
  game.say('（旧账册添了一笔，墨比平时重。）', 'ledger');
  life.sect = null;
  return { ok: true, text: '路，是自己选的。账，也是自己背的。' };
}

// 师门年事：每年岁末一桩，递到袖中录或眼前
export function annualSectTick(game) {
  const sect = sectOf(game.state);
  if (!sect) return;
  const life = game.state.life;
  // 入门未满一年无年事
  if (game.state.world.year - life.sect.joinedYear < 1) return;
  const text = game.rng.pick(sect.annual);
  game.state.sleeve.events.push({ year: game.state.world.year, text: `${sect.name}——${text}` });
  game.say(`【师门${game.rng.pick(['书信', '音讯', '旧闻'])}】${text}`, 'ambient');
}

// 师父离场（大事伤亡）后的口径
export function masterGoneText(sectId) {
  const sect = SECTS[sectId];
  if (!sect) return null;
  return `（${sect.name}的${'师尊'}已不在了。山门还在，功课还在——只是再没人拍着你的肩说"坐得住"了。）`;
}
