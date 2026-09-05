// ============================================================
// 山河问剑录 · 音效（二十期 B 卷）
// 设计文档：docs/设计-音效系统.md
// 程序化 WebAudio 合成，零素材；引擎层零依赖，接线全在 UI 层
// ============================================================

const LS_KEY = 'shanhe.audio.muted';

// ---------- 音色定义表（名 → 合成描述；闸审计引用完整性） ----------
// osc: [type, freq] 或数组多振荡器；env: [attack, decay 秒]；gain: 峰值音量
// slide: [toFreq, ms]（可选）；noise: {ms}（噪声突发，可选）
export const SOUNDS = {
  tick:        { osc: [['triangle', 660]], env: [0.004, 0.06], gain: 0.06 },
  hush:        { osc: [['sine', 220]],     env: [0.01, 0.12],  gain: 0.025 },
  bell_low:    { osc: [['sine', 494], ['sine', 988]], env: [0.005, 1.2], gain: 0.09 },
  bell_mid:    { osc: [['sine', 587]],     env: [0.005, 0.8],  gain: 0.08 },
  bell_bright: { osc: [['sine', 1046]],    env: [0.003, 0.5],  gain: 0.07 },
  drum:        { noise: 80, osc: [['sine', 80]], env: [0.002, 0.09], gain: 0.12 },
  gong_up:     { osc: [['sine', 523]], env: [0.005, 0.18], gain: 0.08, slide: [784, 180] },
  fall:        { osc: [['sine', 330]], env: [0.005, 0.3],  gain: 0.09, slide: [220, 300] },
  gong_deep:   { osc: [['sine', 98], ['sine', 98.7]], env: [0.01, 2.0], gain: 0.14 },
};

// ---------- 文卷 kind → 音色映射（表驱动；没有的 kind 静默） ----------
export const KIND_TO_SFX = {
  dialog: 'tick',
  echo: 'tick',
  ambient: 'hush',
  adventure: 'bell_low',
  combat: 'drum',
  event: 'bell_mid',
  imprint: 'gong_deep',
  dead: 'gong_deep',
};

// ---------- 特殊文本优先级（在 kind 兜底之前） ----------
export const TEXT_TO_SFX = [
  { re: /账.*善|善.*账/, sfx: 'bell_bright' },
  { re: /战胜|旗开|得胜/, sfx: 'gong_up' },
  { re: /不敌|落败|败下阵/, sfx: 'fall' },
];

let ctx = null;
let muted = null;
let lastPlayed = {}; // 节流：同名 80ms 一次

function loadMuted() {
  if (muted !== null) return muted;
  muted = false;
  try {
    if (typeof localStorage !== 'undefined') muted = localStorage.getItem(LS_KEY) === '1';
  } catch { /* 隐私模式降级 */ }
  return muted;
}

export const audio = {
  get muted() { return loadMuted(); },
  setMuted(v) {
    muted = !!v;
    try {
      if (typeof localStorage !== 'undefined') localStorage.setItem(LS_KEY, muted ? '1' : '0');
    } catch { /* 静默 */ }
  },
  // 测试钩子：注入假 AudioContext 检查合成调用
  _ctx: null,
};

function ensureCtx() {
  if (audio._ctx) return audio._ctx;
  try {
    const AC = typeof AudioContext !== 'undefined' ? AudioContext : (typeof window !== 'undefined' && window.webkitAudioContext);
    if (!AC) return null;
    ctx = new AC();
    if (ctx.state === 'suspended') ctx.resume();
    audio._ctx = ctx;
    return ctx;
  } catch { return null; }
}

// ---------- 合成一条音色 ----------
function render(def) {
  const c = ensureCtx();
  if (!c) return;
  const t0 = c.currentTime;
  const master = c.createGain();
  master.connect(c.destination);
  const [atk, dec] = def.env;
  master.gain.setValueAtTime(0.0001, t0);
  master.gain.linearRampToValueAtTime(def.gain, t0 + atk);
  master.gain.exponentialRampToValueAtTime(0.0001, t0 + atk + dec);
  let stopAt = t0 + atk + dec + 0.05;
  if (def.noise) {
    const len = Math.ceil(c.sampleRate * def.noise / 1000);
    const buf = c.createBuffer(1, len, c.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    const src = c.createBufferSource();
    src.buffer = buf;
    const ng = c.createGain();
    ng.gain.value = 0.6;
    src.connect(ng); ng.connect(master);
    src.start(t0);
  }
  for (const [type, freq] of def.osc) {
    const o = c.createOscillator();
    o.type = type;
    o.frequency.setValueAtTime(freq, t0);
    if (def.slide) o.frequency.linearRampToValueAtTime(def.slide[0], t0 + def.slide[1] / 1000);
    o.connect(master);
    o.start(t0);
    o.stop(stopAt);
  }
}

// ---------- 播放入口 ----------
export function play(name) {
  if (loadMuted()) return;
  const def = SOUNDS[name];
  if (!def) return;
  const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
  if (now - (lastPlayed[name] || 0) < 80) return; // 节流
  lastPlayed[name] = now;
  try { render(def); } catch { /* 音频炸了不伤游戏 */ }
}

// ---------- 文卷尾条 → 音色选择（表驱动，§二映射） ----------
export function pickSfx(entries) {
  if (!entries || !entries.length) return null;
  const tail = entries.slice(-3);
  // 特殊文本优先（善账/胜/败）
  for (const { re, sfx } of TEXT_TO_SFX) {
    if (tail.some(j => re.test(j.text || ''))) return sfx;
  }
  const last = tail[tail.length - 1];
  return KIND_TO_SFX[last.kind] || null;
}
