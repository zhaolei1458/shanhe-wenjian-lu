// ============================================================
// 山河问剑录 · 引擎/装备叙事化（P2-8）
// 器型 × 材质 × 词缀 → 组合成名与描述句。数值藏 tier，combat 读取。
// 反面板：玩家永远只看见文字，看不见数字。
// ============================================================

import {
  FORMS, MATERIALS, AFFIXES, EPITHETS, TIERS, composeItemName, composeItemDesc,
  NAMED_TREASURES, NAMED_TREASURES6, NAMED_TREASURES7,
  HEAVENLY_TREASURES, HEAVENLY_TREASURES6, HEAVENLY_TREASURES7, HEAVENLY_TREASURES8,
} from '../content/equipment.js';
import { HEAVENLY_TREASURES9 } from '../content/equipment9.js';

// 七期：独名法宝总池（100 件）与天材地宝总池（60 种）
export const ALL_NAMED_TREASURES = [...NAMED_TREASURES, ...NAMED_TREASURES6, ...NAMED_TREASURES7];
export const ALL_HEAVENLY_TREASURES = [...HEAVENLY_TREASURES, ...HEAVENLY_TREASURES6, ...HEAVENLY_TREASURES7, ...HEAVENLY_TREASURES8, ...HEAVENLY_TREASURES9];

// 抽一件器物：tier 0-3。tier 越高，材质/词缀越重；tier 3 有独名。
// 七期：tier 3 且命中 0.4 时走独名法宝池（每件带器物传记 lore，入山河卷可读）。
export function rollItem(rng, tier = 0, kind = 'weapon') {
  if (tier >= 3 && rng.chance(0.4)) return rollNamedTreasure(rng, kind);
  const formKeys = Object.keys(FORMS).filter(k => (kind === 'weapon' ? !['舟'].includes(k) : true));
  const formKey = rng.pick(formKeys);
  const matKeys = Object.keys(MATERIALS).filter(k => MATERIALS[k].tier <= Math.min(tier + 1, 3));
  // 材质按 tier 加权上浮
  const matKey = rng.weighted(matKeys.map(k => ({
    key: k, weight: MATERIALS[k].tier === tier + 1 ? 3 : MATERIALS[k].tier === tier ? 4 : 1,
  }))).key;
  // 词缀：tier>=1 时高概率带
  let affixKey = null;
  if (tier >= 1 && rng.chance(0.75)) {
    const afx = Object.keys(AFFIXES).filter(k => AFFIXES[k].tier <= tier + 1);
    affixKey = rng.pick(afx);
  }
  const epithet = tier >= 3 ? rng.pick(EPITHETS) : null;
  const { name, desc } = composeItemDesc(formKey, matKey, affixKey, epithet);
  const realTier = Math.max(tier, MATERIALS[matKey].tier, affixKey ? AFFIXES[affixKey].tier : 0);
  return {
    id: 'item_roll_' + Math.floor(rng.int(0, 1e9)).toString(36),
    name, desc, kind: kind === 'weapon' ? 'weapon' : 'treasure',
    tier: realTier, combat: TIERS[realTier].combat,
    grade: TIERS[realTier].name,
  };
}

// 七期：抽一件独名法宝（实例 id 独立，src 指向器物本体）
export function rollNamedTreasure(rng, kind = 'treasure') {
  const pool = ALL_NAMED_TREASURES.filter(t => kind === 'weapon' ? true : true);
  const t = rng.pick(pool.length ? pool : ALL_NAMED_TREASURES);
  return {
    id: 'ntr_' + Math.floor(rng.int(0, 1e9)).toString(36),
    src: t.id,
    name: t.name, desc: t.desc + (t.lore ? ' ' + t.lore : ''),
    kind: t.kind === 'weapon' ? 'weapon' : 'treasure',
    tier: t.tier, combat: TIERS[t.tier].combat, grade: TIERS[t.tier].name,
    evil: !!t.evil, lore: t.lore || '', named: true,
  };
}

// 七期：抽一味天材地宝（kind:'herb'，按药性分类，服用走 useHerb）
export function rollHeavenly(rng) {
  const t = rng.pick(ALL_HEAVENLY_TREASURES);
  return {
    id: 'hb_' + Math.floor(rng.int(0, 1e9)).toString(36),
    src: t.id,
    name: t.name, desc: t.desc, lore: t.lore || '',
    kind: 'herb', herbEffect: t.effect || 'heal',
  };
}

// 七期：服用天材地宝——按药性结算，叙事呈现，吃完即无
export function useHerb(game, item) {
  const life = game.state.life;
  const eff = item.herbEffect || 'heal';
  const name = item.name;
  // 结算
  if (eff === 'life') {
    life.lifespanMax += 4;
    game.say(`（你服下【${name}】。只觉丹田一暖，寿数暗里厚了四年。）`, 'item');
  } else if (eff === 'heal') {
    life.hp = life.maxHp;
    game.say(`（你服下【${name}】。伤处像被温水洗过一遍——血止了，气顺了，浑身上下，没有一处再疼。）`, 'item');
  } else if (eff === 'spirit') {
    life.xiwei += 40;
    game.say(`（你服下【${name}】。神识清明如洗，今夜打坐，进境必速。）`, 'item');
  } else if (eff === 'body') {
    life.maxHp += 12; life.hp += 12;
    game.say(`（你服下【${name}】。一股热流走遍四肢百骸——筋骨响了一遍，像老屋换了新梁。）`, 'item');
  } else if (eff === 'agility') {
    life.dims.qiyun = Math.min(99, (life.dims.qiyun || 0) + 3);
    game.say(`（你服下【${name}】。脚步轻了三分，起身时带风。）`, 'item');
  } else { // bone
    life.maxHp += 8; life.hp = Math.min(life.maxHp, life.hp + 8);
    game.say(`（你服下【${name}】。骨头缝里一阵酥麻——像有人把你的骨架重新校直了一遍。）`, 'item');
  }
  if (item.lore) game.say(`（关于【${name}】：${item.lore}）`, 'echo');
  const idx = life.items.findIndex(i => i.id === item.id);
  if (idx >= 0) life.items.splice(idx, 1);
  return true;
}

// 佩戴/用起来：同 tier 只认最新的一件（叙事呈现，不做装备槽面板）
export function equipItem(game, itemId) {
  const life = game.state.life;
  const it = life.items.find(i => i.id === itemId);
  if (!it || (it.kind !== 'weapon' && it.kind !== 'treasure')) return false;
  life.equipped = itemId;
  const grade = it.grade || '凡品';
  game.say(`（你把【${it.name}】用了起来。${it.desc || ''}江湖人看东西先看成色——这是件${grade}。）`, 'item');
  return true;
}

// combat 结算读数：当前佩戴器物的加成
export function equippedBonus(state) {
  const life = state.life;
  if (!life?.equipped) return 0;
  const it = life.items.find(i => i.id === life.equipped);
  return it ? (it.combat || 0) : 0;
}
