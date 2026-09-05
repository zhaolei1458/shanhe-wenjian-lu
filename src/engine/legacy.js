// ============================================================
// 山河问剑录 · 引擎/传薪系统（盖棺结算）
// 临终光景 → 翻旧账册 → 判词 → 印记+传承点 → 落笔往世簿（GDD §4.4/4.5）
// ============================================================

import { REALMS, wudaoRankName } from './state.js';
import { VERDICTS, VERDICT_XINXING, IMPRINTS, DEATH_LAYERS } from '../content/copy.js';
import { relVerdictLines, buildChronicle } from './relations.js'; // 十期：人际判词 + 编年史
import { dimVerdictLines } from './dimensions.js'; // 十一期：居所/产业/山门判词
import { WELL_KEEPER } from '../content/reincarnation.js'; // 十八期：守井人判词
import { fengshuiVerdictLines } from './fengshui.js'; // 十三期：风水/镇物判词
import { guildVerdictLines } from './guild.js'; // 十三期：行会判词

// 心性画像：取最强心性，文字化
export function xinxingProfile(life) {
  const x = life.xinXing || {};
  const entries = Object.entries(x).filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1]);
  if (!entries.length) return { key: null, tag: '生平无大善亦无大恶，一个把日子过完的人。', verdict: VERDICT_XINXING.qian };
  const [key] = entries[0];
  return { key, tag: VERDICT_XINXING[key] || '', verdict: VERDICT_XINXING[key] || '' };
}

// 厚度分：这一世活得多扎实（引擎内部）
export function thickness(life, state) {
  const deeds = state.ledger.length;
  const adv = state.adventures.seen.length;
  const realmIdx = REALMS[life.realm]?.idx || (life.realm === 'wudao' ? 1 : 0);
  const wudaoBonus = life.wudaoRank != null ? Math.max(0, 10 - life.wudaoRank) : 0;
  const people = Object.keys(state.sleeve.people).length;
  const places = state.sleeve.places.length;
  return {
    deeds, adv, realmIdx, wudaoBonus, people, places,
    score: deeds * 3 + adv * 8 + realmIdx * 12 + wudaoBonus * 2 + people * 2 + places + Math.max(0, life.age - 40) / 4,
  };
}

// 印记拣选：天地拣一件最值得带走的东西
export function pickImprint(state) {
  const life = state.life;
  // 孟婆汤抉择（蓝图 §十三）：饮汤=抹印记重新开始（传承点保留）；不饮=带完整执念入轮回
  if (life.flags?.mengpo_drunk) {
    return { name: '一缕余温', text: '孟婆的汤很淡。你忘了大半，只留下一缕说不清的余温——像谁欠你一句话，或你欠谁一碗面。', kind: 'qingyu', light: true };
  }
  if (life.flags?.mengpo_refused) {
    return { name: '焐不化的执念', text: `你没有喝那碗汤。${life.ruanle}——这一世放不下的，来世还焐在怀里，只是它也会硌人。`, kind: 'zhinian', heavy: true };
  }
  const t = thickness(life, state);
  // 执念优先：未了之誓/深怨
  const unResolved = state.ledger.find(l => !l.resolved && (l.type === '誓' || l.type === '诺'));
  if (unResolved && t.score > 20) {
    return IMPRINTS.zhinian.make(unResolved.text.replace(/^应|^允诺/, ''));
  }
  // 遗物
  const relic = (life.items || []).find(i => i.kind === 'relic');
  if (relic) return IMPRINTS.relic.make(relic);
  // 残悟
  const topGongfa = (life.gongfa || []).sort((a, b) => (b.level || 0) - (a.level || 0))[0];
  if (topGongfa && t.score > 15) return IMPRINTS.gongfa.make(topGongfa);
  // 师门：入过师门的，师承即是烙印
  if (life.sect && t.score > 12) return IMPRINTS.guren.make('教你第一式功夫的师父');
  // 名号：江湖叫开的名号随人走
  if (life.minghao) return IMPRINTS.shihao.make(life.minghao);
  // 地名：行路厚的人，带一处最深的去处
  if (t.places >= 4 && life.location?.node && t.score > 8) {
    const deepest = state.sleeve.places?.[0]?.name || '一处旧地';
    return IMPRINTS.diming.make(deepest);
  }
  // 习惯/滋味：凡人一世也有印记
  if (t.deeds >= 3) return IMPRINTS.xiguan.make('睡前把刀擦三遍（或是别的、只有你自己知道的规矩）');
  if ((life.items || []).some(i => (i.name || '').includes('面') || (i.name || '').includes('饼'))) {
    return IMPRINTS.zhiwei.make('紧要关头的那一碗热汤面');
  }
  // 一句话：软肋/钩子里最扎心的
  return IMPRINTS.qingyu.make(life.ruanle.slice(0, 40) + '……');
}

// 传承点结算：境界、奇遇、名望（GDD：跨周目累积）
export function legacyPoints(life, state) {
  const t = thickness(life, state);
  return Math.round(t.realmIdx * 8 + t.adv * 5 + t.deeds * 1.5 + t.wudaoBonus * 1.5 + (life.minghao ? 5 : 0));
}

// 盖棺总结算
export function finalJudgment(state, deathKind, deathText) {
  const life = state.life;
  const kind = deathKind || life.diedOf || 'shouzhong';
  const base = VERDICTS[kind] ? VERDICTS[kind][state._rng.int(0, VERDICTS[kind].length - 1)] : VERDICTS.hengsi[0];
  // 三层收束：临终句之外，身后一层、世外一层（P3-6 四死法×3 厚度）
  const lay = DEATH_LAYERS[kind] || DEATH_LAYERS.shouzhong;
  const layers = {
    after: lay.after[state._rng.int(0, lay.after.length - 1)],
    beyond: lay.beyond[state._rng.int(0, lay.beyond.length - 1)],
  };
  const xx = xinxingProfile(life);
  const t = thickness(life, state);
  const realmName = REALMS[life.realm]?.name || '凡俗';
  const wudaoName = life.wudaoRank != null ? wudaoRankName(life.wudaoRank) : null;
  const minghao = life.minghao ? `江湖人称"${life.minghao}"，` : '';
  // 十四期：旧号档案——名号会臭也洗得白，但档案永不销
  const mhHist = (life.minghaoHistory || []).length
    ? `他这一生用过${life.minghaoHistory.length}个名号：${life.minghaoHistory.map(h => `"${h.name}"`).join('、')}——都收在江湖的旧档里，查得到，没人再叫。`
    : '';
  const judge = [
    `${life.name}，${life.originId === 'shancun' ? '青溪村' : life.originId === 'modao' ? '黄泉集' : '天启城'}人氏，享年${life.age}。`,
    `${minghao}殁时修为：${realmName}${wudaoName ? '·' + wudaoName : ''}。`,
    `一生入账${t.deeds}笔，撞见机缘${t.adv}桩，识人${t.people}，行路${t.places}处。`,
    deathText || '',
    base,
    layers.after,
    layers.beyond,
    ...relVerdictLines(state),
    ...dimVerdictLines(state),
    ...fengshuiVerdictLines(state), // 十三期
    ...guildVerdictLines(state), // 十三期
    ...(mhHist ? [mhHist] : []), // 十四期：旧号档案
    ...((state._wellTokens || 0) > 0 ? [WELL_KEEPER.verdict(state._wellTokens)] : []), // 十八期：守井人的约
    xx.verdict,
  ].filter(Boolean).join('\n');

  return {
    name: life.name, age: life.age, kind,
    judge,
    chronicle: buildChronicle(state),
    swordBond: life.swordBond || 0,
    xinxing: xx.key,
    imprint: pickImprint(state),
    points: legacyPoints(life, state),
    thickness: t,
    mengpo: life.flags?.mengpo_drunk ? 'drunk' : life.flags?.mengpo_refused ? 'refused' : null,
    minghao: life.minghao || null,
    topGongfa: (life.gongfa || []).slice().sort((a, b) => (b.level || 0) - (a.level || 0))[0] || null,
    ledger: state.ledger.map(l => ({ ...l })),
    adventures: state.adventures.seen.slice(),
    xinglu: state.sleeve.xingluZhi.slice(),
  };
}
