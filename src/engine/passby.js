// ============================================================
// 山河问剑录 · 二十二期引擎助手：路过事件 / 出村保底 / 时间标价 / 复读保鲜
// 依赖 game 实例 G（duck-typing，不 import Game 防循环）
// ============================================================
import { PASSBY_EVENTS, pocketLineFor } from '../content/passby.js';

// ---- B/C：路过事件（小惊喜 + 江湖主动上门）----
// chance：动作附带的触发概率（打坐/练武 6%，闲逛 12%）
// 二十三期修 F：保底——每步计数，十八步没遇上任何事件就强推一条（磨盘破除）
export function maybePassBy(G, chance) {
  if (G.pending || G.state.afterlife || G.state.combat || !G.state.alive) return false;
  const life = G.state.life;
  life.flags ||= {};
  const since = (life.flags.stepsSinceEvent = (life.flags.stepsSinceEvent || 0) + 1);
  const force = since >= 18;
  if (!force && !G.rng.chance(chance)) return false;
  const seen = (life.flags.passbySeen ||= {});
  const pool = PASSBY_EVENTS.filter(e => (seen[e.id] || 0) < 3);
  if (!pool.length) return false;
  const ev = G.rng.pick(pool);
  seen[ev.id] = (seen[ev.id] || 0) + 1;
  life.flags.stepsSinceEvent = 0;
  G.fireEvent({ ...ev });
  return true;
}

// ---- E-2：初到一地的「此地可为之事」----
export function maybePocketGuide(G, node) {
  const life = G.state.life;
  life.flags.visitedNodes ||= [];
  if (life.flags.visitedNodes.includes(node.id)) return;
  life.flags.visitedNodes.push(node.id);
  const line = pocketLineFor(node);
  if (line) G.say(`（初来乍到。此地可为之事：${line}）`, 'ambient');
}

// ---- E-1：出村保底——十八岁还没出过本城，江湖亲自上门 ----
export function maybeGateway(G, GATEWAY_EVENTS, EVENTS) {
  const life = G.state.life;
  if (G.state.afterlife || !G.state.alive) return false;
  if (life.flags.gatewayDone) return false;
  const traveled = (life.flags.visitedCities || []).length > 0;
  if (traveled && life.age >= 16) { life.flags.gatewayDone = true; return false; } // 出过门就不用保底
  if (life.age < 18) return false;
  const done = life.flags.doneEvents || [];
  const gw = Object.values(GATEWAY_EVENTS).find(e => !done.includes(e.id));
  if (!gw) { life.flags.gatewayDone = true; return false; }
  life.flags.gatewayDone = true;
  G.fireEvent(gw);
  return true;
}

// ---- D-2：时间标价——把"这步棋走了多久"明示给玩家 ----
export function timeTag(parts) {
  if (parts >= 4) return '（这一去，一整日。）';
  if (parts >= 2) return '（这一步，耗了一日。）';
  return '（这一步，耗了半日。）';
}
