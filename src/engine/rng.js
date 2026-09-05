// ============================================================
// 山河问剑录 · 引擎/种子随机
// 纪律：引擎纯函数、种子进种子出（GDD §八）。mulberry32 类实现。
// ============================================================

export function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function hashSeed(str) {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return (h ^ (h >>> 16)) >>> 0;
}

// 可序列化的随机流：rngState 进 rngState 出，存档后继续同一"命运线"
export function makeRng(seed) {
  let s = typeof seed === 'string' ? hashSeed(seed) : (seed >>> 0);
  const next = () => {
    s = (s + 0x6D2B79F5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return {
    next,
    state: () => s,
    setState(v) { s = v >>> 0; },
    int(min, max) { return min + Math.floor(next() * (max - min + 1)); },
    pick(arr) { return arr[Math.floor(next() * arr.length)]; },
    // 加权抽取：entries = [{key, weight, ...}]
    weighted(entries) {
      const total = entries.reduce((a, e) => a + e.weight, 0);
      let r = next() * total;
      for (const e of entries) { r -= e.weight; if (r <= 0) return e; }
      return entries[entries.length - 1];
    },
    chance(p) { return next() < p; },
    shuffle(arr) {
      const a = arr.slice();
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(next() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    }
  };
}

export function newSeed() {
  return 'S' + Date.now().toString(36) + '-' + Math.floor(Math.random() * 1e9).toString(36);
}
