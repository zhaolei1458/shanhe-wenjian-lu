// ============================================================
// 山河问剑录 · 2.0 第一层：任务核（章节链 + 目标检查 + 奖励）
// 设计：specs/2026-09-06-shanhe-2.0-design.md 新内核第 5 块
// 纪律：目标字段即消费面（questTick 读什么，questline 就写什么）
// ============================================================
import { VILLAGE_ORPHAN } from '../content/questlines/village_orphan.js';
import { MODAO } from '../content/questlines/modao.js'; // 2.0 第四层：魔道余孽身世局
import { HUANGZU } from '../content/questlines/huangzu.js'; // 2.0 第四层：皇族庶子身世局
import { LONGEVITY, appendLongevity } from '../content/questlines/longevity.js'; // 2.0 第三层：长生引导线

const QUESTLINES = [VILLAGE_ORPHAN, MODAO, HUANGZU];

function currentQuestline(life) {
  return QUESTLINES.find(q => q.matchFate.test(life.fateId || ''));
}
function chapterDef(ql, id) {
  if (ql) { const c = ql.chapters.find(c => c.id === id); if (c) return c; }
  // 2.0 第三层：长生线是 append 型续线（不在 matchFate 体系内），章定义在此兜底
  return LONGEVITY.chapters.find(c => c.id === id) || null;
}
function activeChapter(life) {
  return (life.questLog || []).find(q => q.status === 'active');
}

// 投生后初始化（幂等：已有日志/旧档不覆盖；无匹配命帖则不出主线）
export function initQuests(game) {
  const life = game.state.life;
  if (!life) return;
  if (!Array.isArray(life.questLog)) life.questLog = [];
  if (life.questLog.length) return;
  const ql = currentQuestline(life);
  if (!ql) return;
  life.questLog = ql.chapters.map((c, i) => ({
    id: c.id,
    chapter: c.chapter,
    title: c.title,
    desc: c.brief,
    goals: (c.goals || []).map(g => ({ ...g, done: false })),
    status: i === 0 ? 'active' : 'locked',
  }));
  const first = life.questLog[0];
  game.say(`【主线·${ql.title}】第一章·${first.title}\n${first.desc}`, 'system');
  fireOnStart(game, ql, first.id);
}

function fireOnStart(game, ql, chId) {
  const def = chapterDef(ql, chId);
  if (!def || !def.onStart || !def.onStart.fire) return;
  if (game.pending) return; // 坑册 3.6：不抢玩家手上的幕（下一拍 questTick 会补发）
  game.fireEvent(def.onStart.fire);
}

// 目标推进：input()/行动后调用（幂等、廉价）
export function questTick(game) {
  const life = game.state.life;
  if (!life) return;
  if (!Array.isArray(life.questLog)) life.questLog = [];
  if (!life.questLog.length) { initQuests(game); return; }
  const ql = currentQuestline(life);
  const act = activeChapter(life);
  if (!ql || !act) return;
  const def = chapterDef(ql, act.id);
  if (!def) return; // 2.0 第四层：幽冥章等非常规章无定义——不入章结管道（身后程由幽冥流程自管）
  let allDone = true;
  for (const g of act.goals) {
    if (g.done) continue;
    if (g.type === 'node') g.done = life.location.node === g.target;
    else if (g.type === 'city') g.done = Array.isArray(g.target) ? g.target.includes(life.location.city) : life.location.city === g.target;
    else if (g.type === 'event') g.done = (life.flags.doneEvents || []).includes(g.id);
    else if (g.type === 'flag') g.done = !!life.flags[g.key];
    else if (g.type === 'realm') g.done = life.realm === g.target;
    else if (g.type === 'sect') g.done = !!life.sect; // 2.0 第三层：长生线「拜入名门」
    if (!g.done) allDone = false;
  }
  if (!allDone) return;
  // 章结：发奖励、解锁下一章
  act.status = 'completed';
  const rw = def.rewards || {};
  if (rw.money) life.money += rw.money;
  if (rw.xiwei) life.xiwei += rw.xiwei;
  if (rw.items) for (const it of rw.items) life.items.push({ ...it });
  if (rw.say) game.say(rw.say, 'system');
  game.say(`【主线】第${act.chapter}章·${act.title}——了。`, 'system');
  const nxt = life.questLog.find(q => q.id === def.next);
  if (nxt) {
    nxt.status = 'active';
    game.say(`【主线·${ql.title}】第${nxt.chapter}章·${nxt.title}\n${nxt.desc}`, 'system');
    fireOnStart(game, ql, nxt.id);
  } else {
    // 2.0 第三层：身世局破局后接长生引导线（幂等——长生线末章结也走这里，不重播）
    if (!life.flags.mainline_done) {
      life.flags.mainline_done = true;
      game.say('【主线】身世局告一段落——往前的路，往高处去。', 'system');
      appendLongevity(game);
    }
  }
}

// 给问天/任务册用的一句话提示
export function questHint(life) {
  const act = (life.questLog || []).find(q => q.status === 'active');
  if (!act) return null;
  const pend = (act.goals || []).filter(g => !g.done).map(g => g.hint || '（继续）').join('；');
  return pend ? `第${act.chapter}章·${act.title}——${pend}` : `第${act.chapter}章·${act.title}`;
}
