// ============================================================
// 山河问剑录 · 2.0 第四层：内容翻译层（实施计划 4.1）
// 职责：旧内容格式 → 新核消费面 的规范化翻译。
//   旧写法（死字段，引擎不消费）：effect.{ combat, win, lose, then }
//   新写法（消费面）：opt.combat / opt.winFx / opt.loseFx / opt.thenAdv
// 纪律（坑册 2.2）：翻译层只做字段搬家，不改语义；内容层照新格式写，
//   翻译层是给旧内容/手滑内容兜底的保险丝，不是许可。
// ============================================================

// 事件/奇遇选项规范化：返回同一引用（原地翻译），幂等
export function normalizeOpt(opt) {
  if (!opt || typeof opt !== 'object') return opt;
  const ef = opt.effect;
  if (ef) {
    if (ef.combat && !opt.combat) { opt.combat = ef.combat; delete ef.combat; } // 坑 3.1
    if (ef.win && !opt.winFx) { opt.winFx = ef.win; delete ef.win; } // 旧 effect.win（名号/赏钱）→ winFx
    if (ef.lose && !opt.loseFx) { opt.loseFx = ef.lose; delete ef.lose; } // 旧 effect.lose → loseFx
    if (ef.then && !opt.thenAdv) opt.thenAdv = ef.then; // 旧 effect.then（战胜转奇遇）→ thenAdv
  }
  if (opt.success?.combat && opt.combat === undefined) opt.combat = opt.success.combat;
  if (opt.fail?.combat && opt.combat === undefined) opt.combat = opt.fail.combat;
  return opt;
}

// chance 二段裁决里的 success/fail 也过一遍（原地翻译）
export function normalizeChancePair(opt) {
  if (!opt || typeof opt !== 'object') return opt;
  if (opt.success) normalizeOpt(opt.success);
  if (opt.fail) normalizeOpt(opt.fail);
  return opt;
}

// 开发期体检：扫描事件/奇遇池，列出仍在用死字段的内容（翻译层兜住的），用于闸测试
export function auditDeadFields(EVENTS, ADVENTURES) {
  const dead = [];
  const scanOpts = (ownerId, opts) => {
    for (const opt of opts || []) {
      const ef = opt.effect || {};
      if (ef.combat) dead.push(`${ownerId}: effect.combat`);
      if (ef.win) dead.push(`${ownerId}: effect.win`);
      if (ef.lose) dead.push(`${ownerId}: effect.lose`);
      if (ef.then) dead.push(`${ownerId}: effect.then`);
      if (opt.success?.combat) dead.push(`${ownerId}: success.combat`);
      if (opt.fail?.combat) dead.push(`${ownerId}: fail.combat`);
    }
  };
  for (const [id, ev] of Object.entries(EVENTS || {})) scanOpts(id, ev?.options);
  for (const [id, adv] of Object.entries(ADVENTURES || {})) {
    for (const st of adv?.stages || []) scanOpts(`${id}#${st.id ?? '?'}`, st?.options);
  }
  return dead;
}
