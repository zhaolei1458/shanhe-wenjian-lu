// ============================================================
// 山河问剑录 · 九期奇遇/地宝生成器
// 用法：node scripts/gen-adventures.mjs
// 产出：src/content/adventures15..24.js（共 698 桩）+ src/content/equipment9.js（100 种地宝）
// 确定性：mulberry32 定长种子，重跑结果一致
// ============================================================
import { writeFileSync } from 'fs';
import { nodes } from '../src/content/world.js';
import { PERSONS, SHOUWU, CHUANYI } from './gen-lib.mjs';
import { HAIYUAN, ZENGXING, SHOUYE } from './gen-lib2.mjs';
import { SHIYI, WENLU, JIZHANG, HB9_NAMES, HB9_KEEPERS, HB9_RULES, HB9_LORES, HB9_HABITATS, HB9_LOOKS, HB9_EFFECTS } from './gen-lib3.mjs';

const ARCHS = [SHOUWU, CHUANYI, HAIYUAN, ZENGXING, SHOUYE, SHIYI, WENLU, JIZHANG];
const NODE_IDS = Object.keys(nodes);
const TOTAL = 698;
const PER_FILE = 70;
const CHANNELS = ['T1', 'T2', 'T3'];
const TRAIT_KEYS = ['ren', 'yi', 'xin', 'zhi', 'wen', 'dan', 'tong'];

// ---- 确定性随机 ----
function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rng = mulberry32(20260905);
const pick = (arr) => arr[Math.floor(rng() * arr.length)];
const ri = (lo, hi) => lo + Math.floor(rng() * (hi - lo + 1));

// ---- 槽位填充 ----
function fill(tpl, s) {
  return tpl
    .replaceAll('{place}', s.place)
    .replaceAll('{person}', s.person)
    .replaceAll('{obj}', s.obj)
    .replaceAll('{it}', s.objName)
    .replaceAll('{keeper}', s.keeper)
    .replaceAll('{rule}', s.rule)
    .replaceAll('{doing}', s.doing);
}

const TITLE_PATTERNS = [
  '{place}里{doing}的{person}',
  '在{place}，{doing}的{person}',
  '{person}在{place}{doing}',
  '{place}来了个{doing}的{person}',
  '路遇{person}——在{place}{doing}',
  '{place}的一课：{person}{doing}',
];

const DOINGS = {
  shouwu: '守着一件旧物', chuanyi: '把手艺往下传', haiyuan: '替故人还愿', zengxing: '白送路上的东西',
  shouye: '夜里替人醒着', shiyi: '替失物寻主人', wenlu: '只问不答', jizhang: '替人情记着账',
};

const usedTitles = new Set();
function makeTitle(arch, s) {
  for (let k = 0; k < 24; k++) {
    const t = fill(pick(TITLE_PATTERNS), { ...s, doing: DOINGS[arch.key] });
    if (!usedTitles.has(t)) { usedTitles.add(t); return t; }
  }
  return fill(TITLE_PATTERNS[0], s) + '（' + ri(1, 999) + '）';
}

// ---- 单桩奇遇组装 ----
let genIdx = 0;
function makeAdventure(i) {
  const arch = ARCHS[(i + Math.floor(i / NODE_IDS.length)) % ARCHS.length];
  const nodeId = NODE_IDS[i % NODE_IDS.length];
  const place = nodes[nodeId].name;
  const person = pick(PERSONS);
  const obj = pick(arch.objs);
  const maxim1 = pick(arch.maxims);
  let maxim2 = pick(arch.maxims);
  if (maxim2 === maxim1) maxim2 = arch.maxims[(arch.maxims.indexOf(maxim1) + 3) % arch.maxims.length];
  const s = { place, person, obj, objName: obj.replace(/^一[只盏捆块座口堵杆囤排缸篮坛包筐舱副面丛]|^一(段|册|盏|只|捆|块|座|口|堵|杆|囤|排|缸|篮|坛|包|筐|副|面|丛|册)/, '') || obj };

  const rarity = (() => { const r = rng(); return r < 0.6 ? 1 : r < 0.9 ? 2 : 3; })();
  const chance = rarity === 3 ? ri(5, 8) / 100 : ri(6, 13) / 100;
  const statN = ri(1, 2);
  const traitK = pick(TRAIT_KEYS);

  const lbl1a = fill(pick(arch.lbl1a), s);
  const lbl1b = fill(pick(arch.lbl1b), s);
  const lbl2a = fill(pick(arch.lbl2a), s);
  const lbl2b = fill(pick(arch.lbl2b), s);
  const aft1 = fill(pick(arch.aft1), s);
  const aft2 = fill(pick(arch.aft2), s);
  const aft2b = fill(pick(arch.aft2b), s);
  const deed = fill(pick(arch.deeds), s);

  const stages = [
    {
      xinglu: `是岁${place}逢${person}。${person}的话糙，理却直——「${maxim1}」`,
      text: fill(pick(arch.s1a), s) + fill(pick(arch.s1b), s) + fill(pick(arch.s1c), s),
      options: [
        { label: lbl1a, goto: 1 },
        { label: lbl1b, end: true, effect: { stat: { wuxing: 1 }, text_after: aft1 } },
      ],
    },
    {
      xinglu: `是岁${place}一课。${person}把话说到根上——「${maxim2}」`,
      text: fill(pick(arch.s2a), s) + fill(pick(arch.s2b), s) + fill(pick(arch.s2c), s),
      options: [
        { label: lbl2a, end: true, effect: { stat: { wuxing: statN }, trait: { [traitK]: 1 }, ledger: { type: pick(['恩', '义']), text: deed }, text_after: aft2 } },
        { label: lbl2b, end: true, effect: { stat: { wuxing: 1 }, text_after: aft2b } },
      ],
    },
  ];

  genIdx += 1;
  const id = `adv_g${String(genIdx).padStart(3, '0')}_${arch.key}`;
  return { id, title: makeTitle(arch, s), mother: arch.mother, channel: CHANNELS[genIdx % 3], rarity, entry: { node: nodeId, chance }, stages };
}

// ---- 生成并分文件输出 ----
const adventures = [];
for (let i = 0; i < TOTAL; i++) adventures.push(makeAdventure(i));

// id / 标题唯一性自检
{
  const ids = new Set(adventures.map(a => a.id));
  if (ids.size !== TOTAL) throw new Error('id 重复');
}
const nFiles = Math.ceil(TOTAL / PER_FILE);
for (let f = 0; f < nFiles; f++) {
  const batchNo = 15 + f;
  const chunk = adventures.slice(f * PER_FILE, (f + 1) * PER_FILE);
  const varName = `ADVENTURES${batchNo}`;
  const body = chunk.map(a => {
    const stagesJson = a.stages.map(st => `      { xinglu: ${JSON.stringify(st.xinglu)},\n        text: ${JSON.stringify(st.text)},\n        options: [\n` +
      st.options.map(o => `          { label: ${JSON.stringify(o.label)},${o.goto !== undefined ? ` goto: ${o.goto},` : ' end: true,'} effect: ${JSON.stringify(o.effect)} },`).join('\n') +
      `\n        ] }`).join(',\n');
    return `  ${a.id}: { id: '${a.id}', title: ${JSON.stringify(a.title)}, mother: '${a.mother}', channel: '${a.channel}', rarity: ${a.rarity},\n    entry: { node: '${a.entry.node}', chance: ${a.entry.chance} },\n    stages: [\n${stagesJson},\n    ] },`;
  }).join('\n');
  const out = `// ============================================================\n// 山河问剑录 · 内容/奇遇扩桩·第${batchNo}批（九期·母版库生成）\n// 由 scripts/gen-adventures.mjs 产出：母型 ${ARCHS.map(a => a.key).join('/')} × 手写碎片池，确定性种子 20260905\n// ============================================================\nimport { ADVENTURES } from './adventures.js';\n\nexport const ${varName} = {\n${body}\n};\n\nObject.assign(ADVENTURES, ${varName});\n`;
  writeFileSync(new URL(`../src/content/adventures${batchNo}.js`, import.meta.url), out, 'utf8');
  console.log(`adventures${batchNo}.js`, chunk.length, '桩');
}

// ---- 天材地宝 100 种 ----
{
  const items = HB9_NAMES.map((name, i) => {
    const keeper = HB9_KEEPERS[i % HB9_KEEPERS.length];
    const rule = HB9_RULES[i % HB9_RULES.length];
    const habitat = HB9_HABITATS[i % HB9_HABITATS.length];
    const look = HB9_LOOKS[i % HB9_LOOKS.length];
    const effect = HB9_EFFECTS[i % HB9_EFFECTS.length];
    const loreTpl = HB9_LORES[i % HB9_LORES.length];
    const lore = loreTpl.replaceAll('{keeper}', keeper).replaceAll('{rule}', rule).replaceAll('{it}', name);
    return { id: `hb9_n${String(i + 1).padStart(3, '0')}`, name, effect, desc: `${habitat}所出，${look}。`, lore };
  });
  const out = `// ============================================================\n// 山河问剑录 · 内容/天材地宝扩桩（九期 +100，60→160？否：100→200 之用）\n// 由 scripts/gen-adventures.mjs 产出：名册手写百名，规矩/传说由手写池生成\n// ============================================================\nexport const HEAVENLY_TREASURES9 = [\n` +
    items.map(t => `  { id: '${t.id}', name: '${t.name}', effect: '${t.effect}', desc: '${t.desc}', lore: '${t.lore.replaceAll("'", String.fromCharCode(92) + "'")}' },`).join('\n') +
    `\n];\n`;
  writeFileSync(new URL('../src/content/equipment9.js', import.meta.url), out, 'utf8');
  console.log('equipment9.js', items.length, '种');
}
console.log('DONE 总计', TOTAL, '桩奇遇 +', HB9_NAMES.length, '种地宝');
