// ============================================================
// 山河问剑录 · 引擎/LifeState 状态模型
// 五维（根骨/悟性/气运/魅力/福缘）只存引擎，绝不上面板（GDD §2.3）
// ============================================================

import { makeRng } from './rng.js';

// 境界体系（GDD §6.1）——首期实装范围
export const REALMS = {
  fan:      { name: '凡俗', idx: 0, lifespan: [60, 80],  rankName: null },
  wudao:    { name: '武道', idx: 0.5, lifespan: null },   // 后天九品→先天，寿 +30（先天起算）
  lianqi:   { name: '练气', idx: 1, lifespan: [80, 110] },
  zhuji:    { name: '筑基', idx: 1.5, lifespan: [200, 240] },
  jindan:   { name: '金丹', idx: 2, lifespan: [450, 550] },
  yuanying: { name: '元婴', idx: 3, lifespan: [800, 1100] },
  huashen:  { name: '化神', idx: 4, lifespan: [1500, 2200] },
  lianxu:   { name: '炼虚', idx: 5, lifespan: [2500, 3500] },
  heti:     { name: '合体', idx: 6, lifespan: [4000, 6000] },
  dacheng:  { name: '大乘', idx: 7, lifespan: [8000, 12000] },
  dujie:    { name: '渡劫', idx: 8, lifespan: [15000, 20000] },
  // 仙界后（GDD §6.1：真仙→道祖；道祖之后仍有证道之途——只给钩子不给终点）
  zhenxian: { name: '真仙', idx: 9,  lifespan: [20000, 30000] },
  jinxian:  { name: '金仙', idx: 10, lifespan: [50000, 80000] },
  taiyi:    { name: '太乙', idx: 11, lifespan: [100000, 150000] },
  daluo:    { name: '大罗', idx: 12, lifespan: [200000, 300000] },
  daozun:   { name: '道尊', idx: 13, lifespan: [500000, 900000] },
  daozu:    { name: '道祖', idx: 14, lifespan: [999990, 999999] }, // 跳出桎梏，实则不可达成（天外混沌只给风声）
};
export const STAGES = ['初', '中', '后', '圆满'];

// 武道轨（GDD §6.1：后天九品→先天→宗师→大宗师→破碎虚空）
// wudaoRank 编码：9~1 后天九品（9 低 1 高）、0 先天、-1 宗师、-2 大宗师、-3 破碎虚空
export const WUDAO_RANKS = {
  9: '后天九品', 8: '后天八品', 7: '后天七品', 6: '后天六品', 5: '后天五品',
  4: '后天四品', 3: '后天三品', 2: '后天二品', 1: '后天一品',
  0: '先天', '-1': '宗师', '-2': '大宗师', '-3': '破碎虚空',
};
export function wudaoRankName(r) { return WUDAO_RANKS[String(r)] || null; }

// 武道晋升阈值（wugongXiuwei 判据）
export const WUDAO_THRESHOLDS = [
  { rank: 9, at: 50 }, { rank: 8, at: 120 }, { rank: 7, at: 220 }, { rank: 6, at: 350 },
  { rank: 5, at: 520 }, { rank: 4, at: 740 }, { rank: 3, at: 1000 }, { rank: 2, at: 1300 },
  { rank: 1, at: 1650 }, { rank: 0, at: 2100 }, { rank: -1, at: 3000 },
  { rank: -2, at: 4200 }, { rank: -3, at: 6000 },
];

export const SEASONS = ['春', '夏', '秋', '冬'];
export const WEATHERS = {
  春: ['细雨', '晴', '薄雾', '微风'],
  夏: ['烈日', '雷雨', '闷热', '晴'],
  秋: ['秋风', '晴', '冷雨', '霜晨'],
  冬: ['大雪', '寒风', '阴沉', '晴冷'],
};

export function rollFiveDims(rng) {
  return {
    gengu:  rng.int(30, 95),   // 根骨
    wuxing: rng.int(30, 95),   // 悟性
    qiyun:  rng.int(20, 90),   // 气运
    meili:  rng.int(25, 90),   // 魅力
    fuyuan: rng.int(20, 90),   // 福缘
  };
}

export function newLifeState(seed) {
  const rng = makeRng(seed);
  return {
    v: 1,                       // 存档结构版本
    seed,
    rngState: rng.state(),
    life: null,                 // 投生后填充
    world: {
      year: rng.int(0, 5),      // 大衍承平三十年内的当口
      factionMood: rng.pick(['承平', '暗流', '风紧']),  // 势力小格局
      bigEvents: [],            // 江湖大事队列
      deadNpcs: [],
      wallPoems: [],            // 题壁留世：{node, year, lifeName, text}（06 册 C：题壁诗留在世界里）
    },
    ledger: [],                 // 旧账册：{year,season,type,text,resolved}
    pendingEchoes: [],          // 预约队列：{id,cond,delayYears,payload}
    sleeve: { places: [], people: [], events: [], xingluZhi: [], miwen: [], daozang: [], shanhe: [] }, // 六卷制：行路志/人物谱/旧账册 + 秘闻/道藏/山河
    adventures: { seen: [], cooldown: 0, channelCount: {} },
    monitor: { inputCount: 0, coldEchoCount: 0 },  // 冷场率审计
  };
}

// 投生：认领命帖后的 life 初始化
export function initLife(state, fateCard, name) {
  const rng = makeRng(state.seed);
  rng.setState(state.rngState);
  const dims = rollFiveDims(rng);
  const startAge = fateCard.age || rng.int(14, 19);
  state.life = {
    name,
    originId: fateCard.originId,
    fateId: fateCard.id,
    laichu: fateCard.laichu,       // 来处
    ruanle: fateCard.ruanle,       // 软肋（登记为数据，供心魔/因果引用）
    gouzi: fateCard.gouzi,         // 钩子
    hiddenLine: fateCard.hiddenLine, // 此生暗线 id
    age: startAge,
    season: rng.int(0, 3),
    day: 1,
    weather: null,
    realm: 'fan', realmStage: 0,   // 境界与大境阶段
    wudaoRank: null,               // 后天九品（9 低 → 1 高），武道轨
    xiwei: 0,                      // 修为（引擎内部，练气/筑基突破判据）
    wugongXiuwei: 0,               // 武学修为
    hp: 100, maxHp: 100,
    neili: 10,
    lifespanMax: null,             // 由境界定；凡人 60-80（null=未定，首次 yearTick 按当前境界重算——修士延寿依赖此机制）
    agingSigns: false,
    money: fateCard.startMoney ?? rng.int(1, 8),   // 单位：贯（银钱只到"盘缠紧不紧"的体感层）
    items: (fateCard.startItems || []).map(x => ({ ...x })),
    gongfa: (fateCard.startGongfa || []).map(x => ({ ...x })),
    dims,
    xinXing: { ren: 0, xia: 0, kuang: 0, yi: 0, chi: 0, ao: 0 }, // 心性六组计数（幕后）
    minghao: null,                 // 名号
    location: { city: fateCard.startCity, area: fateCard.startArea, node: fateCard.startNode },
    mount: null,                   // 坐骑 { id, name, kind(lu/fei/shui/xiong), speed, xun, desc }（坐骑驯养）
    beastBook: [],                 // 妖兽图鉴：见过的妖兽 id（袖中录妖兽卷）
    sect: null,                    // 师门 { id, joinedYear, dutyCount }（拜师系统）
    equipped: null,                // 佩戴器物 id（装备叙事化）
    tutor: fateCard.tutor || null, // 引路人
    tutorStepsLeft: 3,             // 引路人带前三~五步
    relations: {},                 // npcId -> {attitude(0-100), history:[]}
    rels: [],                      // 一生的人际（06 册 A）：{id,kind,name,metYear,metAge,mood,alive,arc,path}
    swordBond: 0,                  // 剑养灵（06 册 G）：佩剑随身年数
    eggs: [],                      // 灵兽奇缘（07 册）：怀中兽蛋 {eggId, progress}
    home: null,                    // 居所（06 册 B）：{kind(buy/rent), place, node, since, tree}
    alias: null,                   // 易容化名（06 册 E）：化名行走时 NPC 只认名号不认脸
    business: null,                // 轻经营（06 册 B）：{kind, place, since}
    foundedSect: null,             // 开宗立派（06 册 B）：{name, rules, since, disciples}
    flags: {},
    diedOf: null,                  // shouzhong/hengsi/qiuren/daochem
    alive: true,
  };
  state.rngState = rng.state();
  return state;
}

// 引擎内部：境界寿元表（GDD §6.2）
export function lifespanFor(realm, rng) {
  const t = REALMS[realm];
  if (realm === 'wudao') return rng.int(70, 90); // 先天前武者延寿有限
  if (!t || !t.lifespan) return rng.int(60, 80);
  return rng.int(t.lifespan[0], t.lifespan[1]);
}

export function seasonOfYear(s) { return SEASONS[s.life.season]; }
