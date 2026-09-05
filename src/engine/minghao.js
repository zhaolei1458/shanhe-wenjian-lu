// ============================================================
// 山河问剑录 · 引擎/名号系统十四期（04 册 §2.2）
// evalMinghao（纯函数：算名号该不该授/变味/洗白）+ evaluateMinghao（入账播报）
// 名号不是玩家自选，是江湖看你的账册攒出来的。
// ============================================================
import { MINGHAO_RULES, REDEEM, MINGHAO_TIER_NAMES } from '../content/minghao.js';

// ---------- 计数口径（从旧账册数出来） ----------
function countMinghaoDeeds(state) {
  const ledger = state.ledger || [];
  const cnt = { sha: 0, shan: 0, case: 0, med: 0 };
  for (const l of ledger) {
    if (l.type === '杀') cnt.sha++;
    if (l.type === '善') {
      cnt.shan++;
      if ((l.text || '').includes('断')) cnt.case++;
      if ((l.text || '').includes('医') || (l.text || '').includes('救')) cnt.med++;
    }
  }
  return cnt;
}
const meets = (need, cnt) => Object.entries(need || {}).every(([k, v]) => (cnt[k] || 0) >= v);

// ---------- 纯裁决：返回 {act:'grant'|'taint'|'redeem'|null, rule, text} ----------
export function evalMinghao(state) {
  const life = state.life;
  const cnt = countMinghaoDeeds(state);
  const flags = life.flags || {};
  // 一、浪子回头：旧号臭了之后，用变味之后的新善举压回去（改号需三件大善举）
  if (flags.minghaoTainted) {
    const taintYear = flags.minghaoTaintYear ?? -1;
    const freshGood = (state.ledger || []).filter(l => l.type === '善' && (l.year ?? 0) >= taintYear).length;
    if (freshGood >= (REDEEM.need.shan || 3)) {
      return { act: 'redeem', rule: REDEEM, text: `（${REDEEM.why}）` };
    }
  }
  // 二、当前名号变味（名号会臭）
  if (life.minghao) {
    const cur = MINGHAO_RULES.find(r => r.name === life.minghao && r.taint);
    if (cur && meets(cur.taint.need, cnt)) {
      return { act: 'taint', rule: cur, text: `（${cur.taint.why}）` };
    }
  }
  // 三、授新号（高档优先；已有号则不降档授低号）
  for (const r of MINGHAO_RULES) {
    if (r.name === life.minghao) continue;
    if ((life.minghaoHistory || []).some(h => h.name === r.name)) continue;
    if (!meets(r.need, cnt)) continue;
    if (life.minghao && (MINGHAO_TIER_NAMES[r.tier] || '').length && MINGHAO_RULES.find(x => x.name === life.minghao)?.tier >= r.tier) continue;
    return { act: 'grant', rule: r, text: `（${r.why}）` };
  }
  return { act: null };
}

// ---------- 入账播报（yearTick 年检一次） ----------
export function evaluateMinghao(game) {
  const life = game.state.life;
  life.minghaoHistory ||= [];
  const r = evalMinghao(game.state);
  if (!r.act) return;
  if (r.act === 'grant') {
    life.minghao = r.rule.name;
    game.say(`【名号】${r.text}\n（${MINGHAO_TIER_NAMES[r.rule.tier]}·"${r.rule.name}"——江湖不叫你的名字了。）`, 'event');
    game.book('记', `得号"${r.rule.name}"（${MINGHAO_TIER_NAMES[r.rule.tier]}）`);
  } else if (r.act === 'taint') {
    life.minghaoHistory.push({ name: life.minghao, tainted: true, year: game.state.world.year });
    life.minghao = r.rule.taint.name;
    life.flags.minghaoTainted = true;
    life.flags.minghaoTaintYear = game.state.world.year;
    game.say(`【名号变味】${r.text}\n（"${r.rule.name}"成了"${r.rule.taint.name}"。旧号压进了档案——江湖的档案，从来不销。）`, 'event');
    game.book('怨', `名号变味："${r.rule.name}"成了"${r.rule.taint.name}"`);
  } else if (r.act === 'redeem') {
    life.minghaoHistory.push({ name: life.minghao, tainted: true, year: game.state.world.year });
    life.minghao = REDEEM.name;
    life.flags.minghaoTainted = false;
    game.say(`【名号洗白】${r.text}\n（旧号还压在档案里——查得到，但没人再叫。江湖肯给回头人留一条路，这是它难得的体面。）`, 'event');
    game.book('善', `洗白旧号，得号"${REDEEM.name}"`);
  }
}
