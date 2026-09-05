// ============================================================
// 山河问剑录 · 存档导出/导入（二十期 A 卷）
// 设计文档：docs/设计-存档导出导入.md —— 实现与文档冲突时改代码不改文档
// 纯函数分层：不摸 IndexedDB，Save 接口注入；node 闸测可用假件
// ============================================================

const GAME_ID = 'shanhe-wenjian-lu';
const FMT = 1;

// ---------- 纯：组装导出文档 ----------
export function buildExportDoc(meta, saves) {
  return {
    game: GAME_ID,
    fmt: FMT,
    exportedAt: new Date().toISOString(),
    meta: JSON.parse(JSON.stringify(meta || {})),
    saves: (saves || []).map(s => ({
      slot: s.slot,
      name: s.name || '',
      at: s.at || 0,
      state: JSON.parse(JSON.stringify(s.state)),
    })),
  };
}

// ---------- 纯：校验导入文档（§四校验规则表） ----------
export function validateImportDoc(doc) {
  const fail = error => ({ ok: false, error, summary: null });
  if (!doc || typeof doc !== 'object') return fail('这不是一份能读的存档文件。');
  if (doc.game !== GAME_ID) return fail('这不是山河问剑录的存档。');
  if (!Number.isInteger(doc.fmt) || doc.fmt < 1 || doc.fmt > 99) return fail('存档格式认不出来。');
  if (!doc.meta || typeof doc.meta !== 'object' || typeof doc.meta.legacyPoints !== 'number') {
    return fail('存档里的往世簿缺了页。');
  }
  if (!Array.isArray(doc.saves)) return fail('存档里的档位散了页。');
  for (let i = 0; i < doc.saves.length; i++) {
    const s = doc.saves[i];
    const bad = !s || typeof s.slot !== 'string' || !s.state || !s.state.life || !s.state.life.name || !s.state.world;
    if (bad) return fail(`第 ${i + 1} 个档位残了，缺了名姓或世界。`);
  }
  return {
    ok: true,
    error: null,
    summary: {
      lives: (doc.meta.pastLives || []).length,
      slots: doc.saves.length,
      names: doc.saves.map(s => s.state.life.name),
      legacyPoints: doc.meta.legacyPoints,
    },
  };
}

// ---------- 浏览器侧：下载 ----------
export function exportToFile(doc) {
  if (typeof document === 'undefined') return false; // node 闸测下跳过
  const d = new Date();
  const pad = n => String(n).padStart(2, '0');
  const fname = `山河问剑录·存档-${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}.json`;
  const blob = new Blob([JSON.stringify(doc, null, 1)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = fname;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 800);
  return fname;
}

// ---------- 导入：事务（备份→写档→写meta；任何一步炸了不继续） ----------
// saveLike: { saveGame(slot, state, name), saveMeta(meta) } —— 与 Save 同形
export async function importAll(saveLike, doc) {
  const v = validateImportDoc(doc);
  if (!v.ok) return v;
  // 1. 备份当前 meta（§三第 2 步：导入前自动备份）
  //    注意：当前 meta 由调用方读好传入 doc 外部——这里约定 saveLike.currentMeta()
  let backup = null;
  if (typeof saveLike.currentMeta === 'function') {
    backup = await saveLike.currentMeta();
    if (backup) await saveLike.saveGame('backup-preimport', backup, '导入前的旧进度·自动备份');
  }
  // 2. 逐档写入
  for (const s of doc.saves) {
    await saveLike.saveGame(s.slot, s.state, s.name || s.state.life.name);
  }
  // 3. 整卷替换 meta
  await saveLike.saveMeta(doc.meta);
  return { ...v, backup: !!backup };
}

// ---------- 解析文件文本（parse 与 validate 分离，闸测直接喂对象） ----------
export function parseImportText(text) {
  let doc;
  try { doc = JSON.parse(text); } catch { return { ok: false, error: '这不是一份能读的存档文件。', summary: null }; }
  const v = validateImportDoc(doc);
  return v.ok ? { ...v, rawDoc: doc } : v;
}
