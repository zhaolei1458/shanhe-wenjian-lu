// ============================================================
// 山河问剑录 · 存档系统（IndexedDB）
// 多档位存档 + 传承点/往世簿独立持久化（GDD §八）
// ============================================================

const DB_NAME = 'shanhe-wenjian-lu';
const DB_VERSION = 1;
const STORE_SAVES = 'saves';   // 档位存档
const STORE_META = 'meta';     // 传承点/往世簿/跨世防重复

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_SAVES)) db.createObjectStore(STORE_SAVES);
      if (!db.objectStoreNames.contains(STORE_META)) db.createObjectStore(STORE_META);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function idbPut(store, key, val) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, 'readwrite');
    tx.objectStore(store).put(val, key);
    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error);
  });
}

async function idbGet(store, key) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, 'readonly');
    const req = tx.objectStore(store).get(key);
    req.onsuccess = () => resolve(req.result ?? null);
    req.onerror = () => reject(req.error);
  });
}

async function idbKeys(store) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, 'readonly');
    const req = tx.objectStore(store).getAllKeys();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
}

export const Save = {
  // 存档档位：slot1..slot3 + auto
  async saveGame(slot, state, snapshotName) {
    return idbPut(STORE_SAVES, slot, { state, name: snapshotName, at: Date.now() });
  },
  async loadGame(slot) {
    return idbGet(STORE_SAVES, slot);
  },
  async listSaves() {
    const keys = await idbKeys(STORE_SAVES);
    const out = [];
    for (const k of keys) out.push({ slot: k, ...(await idbGet(STORE_SAVES, k)) });
    return out;
  },
  // 传承层（跨周目独立持久化）
  async saveMeta(meta) {
    return idbPut(STORE_META, 'meta', meta);
  },
  async loadMeta() {
    const m = await idbGet(STORE_META, 'meta');
    return m || { legacyPoints: 0, pastLives: [], crossSeenAdventures: [] };
  },
};
