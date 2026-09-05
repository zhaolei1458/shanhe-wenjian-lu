// ============================================================
// 山河问剑录 · 引擎/游戏主循环（核心回路编排）
// 一日之环：醒转→盘点→行动→结算→入夜休整
// 一世之环：投生→闯世→落子→凋零→传薪
// ============================================================

import { makeRng } from './rng.js';
import { maybeMeetRelation, advanceRelations, applyRelChoice } from './relations.js'; // 十期：一生的人际
import { maybeFindEgg, hatchEgg, maybeCubRescue, resolveCubChoice, maybeTuogu, mountAging, checkTuoguDuty, lifespanOf } from './beastkin.js'; // 十二期：灵兽奇缘
import { BEAST_EGGS } from '../content/beastEggs.js'; // 十二期：兽蛋池（袖中录展示）
import { maybeOmen, maybeDream, doSettle, advanceHome, doAlias, maybeAliasReveal, doInvestigate, resolveCasePick, doBusiness, advanceBusiness, doFoundSect, advanceFoundedSect } from './dimensions.js'; // 十一期：九类新维度 B/D/E
import { BUSINESS_KINDS } from '../content/dimensions.js'; // 十一期：业态名册
import { doKanyu, doZhenwu, doXunlong, resolveTombChoice, fengshuiYearTick, fengshuiVerdictLines } from './fengshui.js'; // 十三期：风水堪舆
import { joinGuild, guildYearTick, resolveGuildRuleChoice, guildVerdictLines } from './guild.js'; // 十三期：百业行会
import { npcYearTick, npcLifeCard, npcMemoryEcho } from './npcLives.js'; // 十七期：NPC 私人史
import { captureCross, rebirthEchoes, reincarnationYearTick, resolveReincarnationChoice } from './reincarnation.js'; // 十八期：前世主线
import { accumulateCodex, settleAchievements } from './codex.js'; // 十九期：图鉴与成就
import { evaluateMinghao } from './minghao.js'; // 十四期：名号系统
import { advanceQualityDay, maybeComet, moraTick, resolveMoraChoice } from './quality.js'; // 十四期：物候天象/入魔渐变
import { GUILDS } from '../content/guilds.js'; // 十三期：行会名册（盘点用）
import { newLifeState, initLife, SEASONS, WEATHERS, lifespanFor, REALMS, STAGES, WUDAO_THRESHOLDS, wudaoRankName } from './state.js';
import { parse, normalize } from './parser.js';
import { cities, areas, nodes, npcs, routes } from '../content/world.js';
import { ORIGINS, VARIANTS, HIDDEN_LINES, LIFE_NODES } from '../content/fates.js';
import { EVENTS } from '../content/events.js';
import '../content/hiddenLineEvents.js'; // 二十一期修 I：补全 32 条死暗线的 hook 事件
import { EVENTS2 } from '../content/world2Events.js';
Object.assign(EVENTS, EVENTS2);
import { EVENTS3 } from '../content/world3Events.js';
Object.assign(EVENTS, EVENTS3);
Object.assign(EVENTS, EVENTS5);
import { EVENTS4 } from '../content/world4Events.js';
Object.assign(EVENTS, EVENTS4);
import { EVENTS6 } from '../content/world6Events.js'; // 六期：市井风物
Object.assign(EVENTS, EVENTS6);
import '../content/sectEvents.js'; // 门派考验 + 江湖大事切片（Object.assign 进 EVENTS）
import '../content/sects2Events.js'; // 四期：新十一派拜师考验
import '../content/sects3Events.js'; // 六期：新十四派拜师考验
import { ADVENTURES } from '../content/adventures.js';
import '../content/adventures2.js'; // v1.0 奇遇扩桩（Object.assign 进 ADVENTURES）
import '../content/adventures3.js'; // 三/四期奇遇扩桩
import '../content/adventures4.js'; // 五期奇遇扩桩（九大母型）
import '../content/adventures5.js'; // 六期奇遇扩桩·第五批
import '../content/adventures6.js'; // 六期奇遇扩桩·第六批
import '../content/adventures7.js'; // 六期奇遇扩桩·第七批
import '../content/adventures8.js'; // 六期奇遇扩桩·第八批（过百）
import '../content/adventures9.js'; // 七期奇遇扩桩·第九批
import '../content/adventures10.js'; // 七期奇遇扩桩·第十批
import '../content/adventures11.js'; // 七期奇遇扩桩·第十一批
import '../content/adventures12.js'; // 八期奇遇扩桩·第十二批
import '../content/adventures13.js'; // 八期奇遇扩桩·第十三批
import '../content/adventures14.js'; // 八期奇遇扩桩·第十四批
// 十五期：九期生成批（adventures15~24，约 700 桩 2.2MB）改动态加载——
// 首屏只带核心池，大池在 boot/测试时 loadBigPools() 灌进 ADVENTURES。
// 未加载时 checkAdventures 按无大池逻辑跑（小池照常），加载后满编。
let _bigPoolsLoaded = false;
export async function loadBigPools() {
  if (_bigPoolsLoaded) return;
  await Promise.all([
    import('../content/adventures15.js'),
    import('../content/adventures16.js'),
    import('../content/adventures17.js'),
    import('../content/adventures18.js'),
    import('../content/adventures19.js'),
    import('../content/adventures20.js'),
    import('../content/adventures21.js'),
    import('../content/adventures22.js'),
    import('../content/adventures23.js'),
    import('../content/adventures24.js'),
  ]);
  _bigPoolsLoaded = true;
}
export const bigPoolsLoaded = () => _bigPoolsLoaded;
import '../content/adventures3.js'; // v4.0 三四期奇遇扩桩
import { ECHOES, TRAVEL_EVENTS, YEAR_MARKS, PAYLOADS, BREAKTHROUGH_TEXT } from '../content/copy.js';
import { startCombat, combatRound, endCombat, playerMoves, COMBAT_TEMPLATES } from './combat.js';
import { tryCapture, feedMount, xunLevelOf, mountDeath } from './riding.js';
import { beginNetherworld, planDianQueue, nwAdvance } from './netherworld.js';
import { FESTIVALS, SEASON_FESTIVALS, MIWEN_POOL, DAOZANG_SPOTS, REGION_FLAVOR } from '../content/festivals.js';
import { EVENTS5 } from '../content/world5Events.js';
import { BEASTS, BESTIARY_MARKS } from '../content/beasts.js';
import { CRAFT_RECIPES, canCraft, doCraft } from './crafting.js';
import { finalJudgment } from './legacy.js';
import { SECTS, sectOf } from '../content/sects.js';
import { joinSect, sectDuty, leaveSect, annualSectTick } from './sect.js';
import { annualWorldTick } from './worldsim.js';
import { rollItem, rollHeavenly, useHerb, equipItem, equippedBonus } from './equipment.js';
import { JOBS10, jobAt } from '../content/jobs.js';

const WD = { cities, areas, nodes, npcs, routes };

function pickFrom(arr, rng, k = 1) {
  const pool = rng.shuffle(arr);
  return pool.slice(0, k);
}

export class Game {
  constructor(state, meta) {
    this.state = state;
    this.meta = meta || { legacyPoints: 0, pastLives: [], crossSeenAdventures: [] };
    this.journal = [];          // 本世文字卷轴
    this.ui = { mode: 'world' };// world | combat | event | adventure | lifenode | dead
    this.pending = null;        // 当前挂起的事件/奇遇
    this.worldEventQueue = [];  // 岁末递送的大事际遇（事件 id 队列）
    this.onChange = null;       // Vue 订阅
    // 十五期：读档恢复——卷轴/挂起事件/岁末队列不落档会整世丢失（老 bug）
    if (state) {
      if (Array.isArray(state._journal) && state._journal.length) this.journal = state._journal;
      if (state._pending) this.pending = state._pending;
      if (Array.isArray(state._worldQueue)) this.worldEventQueue = state._worldQueue;
      if (state._uiMode) this.ui.mode = state._uiMode;
    }
  }

  // ---------- 序列化边界 ----------
  persist() {
    if (this.state._rng) this.state.rngState = this.state._rng.state();
    this.state._rng = null;
    // 十五期：实例态一并落档（卷轴/挂起事件/岁末队列/界面幕别）
    this.state._journal = this.journal;
    this.state._worldQueue = this.worldEventQueue;
    this.state._uiMode = this.ui.mode;
    try { this.state._pending = JSON.parse(JSON.stringify(this.pending || null)); }
    catch { this.state._pending = null; } // 含不可序列化物宁可不挂，也不能炸存档
  }
  resume() {
    if (!this.state._rng) {
      this.state._rng = makeRng(this.state.seed);
      this.state._rng.setState(this.state.rngState);
    }
  }
  get rng() { this.resume(); return this.state._rng; }

  // ---------- 投生 ----------
  static rollFateCards(seed, meta) {
    const rng = makeRng(seed);
    const originIds = Object.keys(ORIGINS); // 首期三出身
    const cards = [];
    for (const oid of originIds) {
      const origin = ORIGINS[oid];
      const fate = rng.pick(origin.fates);
      cards.push({ ...fate, originName: origin.name, intro: origin.intro });
    }
    return cards; // 三张：每出身一张（三选一 + 可换一次手气）
  }

  static rerollFateCards(oldCards, seed) {
    const rng = makeRng(seed + '#reroll' + oldCards.length);
    return Object.keys(ORIGINS).map(oid => {
      const others = ORIGINS[oid].fates.filter(f => !oldCards.some(c => c.id === f.id));
      const fate = others.length ? rng.pick(others) : rng.pick(ORIGINS[oid].fates);
      return { ...fate, originName: ORIGINS[oid].name, intro: ORIGINS[oid].intro };
    });
  }

  rebirth(fateCard, name, meta, seedOverride) {
    const seed = seedOverride || ('life-' + Date.now() % 1000003 + '-' + Math.floor(Math.random() * 99991));
    this.state = newLifeState(seed);
    this.state.alive = true;
    this.meta = meta || this.meta;
    this.journal = [];
    this.ui.mode = 'world';
    this.pending = null;
    this.worldEventQueue = [];
    initLife(this.state, fateCard, name || fateCard.defaultName || '无名氏');
    const life = this.state.life;

    // 开局变故（随机其一）
    const variant = this.rng.pick(fateCard.variants || []);
    const vDef = VARIANTS[variant];
    if (vDef) {
      life.flags = life.flags || {};
      life.flags.openingVariant = vDef.id;
      this.applyEffect(vDef.effect || {}, 'variant');
      this.say(`【开局变故·${vDef.title}】\n${vDef.text}`, 'system');
    }

    // 传承点兑换池（GDD §4.5：兑换结果一律以印记文字呈现，不做商店 UI）
    if (this.meta.legacyPoints >= 3) {
      this.say('（你身无长物地来到这个世界。但冥冥中，往世簿里还记着你的一份"家底"。）', 'system');
    }
    const lastLife = (this.meta.pastLives || []).slice(-1)[0];
    if (this.meta.legacyPoints >= 10 && lastLife?.topGongfa) {
      life.gongfa.push({ ...lastLife.topGongfa, level: 1 });
      this.say(`【家底·功法记忆】有一门功夫你分明没学过，手上却会——${lastLife.topGongfa.name}。肌肉记得，比脑子记得还牢。`, 'imprint');
      this.meta.legacyPoints -= 10;
    } else if (this.meta.legacyPoints >= 20) {
      life.items.push({ id: 'item_ks_keepsake', name: '往世旧物', kind: 'relic', desc: '一件来历不明却贴身安放的旧物。看见它，你就莫名心安。', evil: false });
      this.say('【家底·旧物】包袱底压着一件旧物——你不记得它从哪来，但从没想过丢开它。', 'imprint');
      this.meta.legacyPoints -= 20;
    }
    if (this.meta.legacyPoints >= 40) {
      for (const k of Object.keys(life.dims)) life.dims[k] = Math.min(99, life.dims[k] + 12);
      this.say('【家底·天命】这一世的你，眼底比同龄人沉——命格里带着几世攒下的"稳"。', 'imprint');
      this.meta.legacyPoints -= 40;
    }

    // 跨世回响（04 册 §3.3：每世限一两次，惊鸿一瞥即走）+ 孟婆汤余波
    if (lastLife) {
      if (lastLife.mengpo === 'refused') {
        life.flags.xinmo_zhong = true;
        this.say('（你说不清为什么——从睁眼那一刻起，心里就压着一块焐不化的东西。它不响，但它一直在。上辈子没喝那碗汤的人，这辈子的路会沉一些。）', 'imprint');
      }
      const savedDeed = (lastLife.ledger || []).some(l => l.type === '恩' && l.resolved);
      const enemyDeed = (lastLife.ledger || []).some(l => (l.type === '怨' || l.type === '杀') && !l.resolved);
      if (savedDeed) life.flags.crossSaved = true;
      if (enemyDeed) life.flags.crossEnemy = true;
      // 前世坐骑等你转身（07 册：兽寿不同轨——它送你走，等你下一世的转身）
      if (this.meta.crossMount) {
        const cm = this.meta.crossMount;
        life.flags.pastMount = cm.name;
        this.say(`（你懂事起就常做一个梦：渡口有头${cm.name}，见了你就亲。人都说怪——那畜生谁也不理，只等你。等了几年，它等到了。）`, 'imprint');
        delete this.meta.crossMount;
      }
      // 前世剑认主（06 册 G：通灵兵器比你活得久）
      if ((lastLife.swordBond || 0) >= 25 && this.rng.chance(0.5)) {
        this.say('（铁匠铺墙上挂着一柄无主的旧剑。你多看了两眼，剑在鞘里轻轻响了一声——它不认得你，可它认得你握剑柄的姿势。上一世养剑的手，这一世还记得分寸。）', 'imprint');
      }
    }

    // 印记余温（上一世的印记，渗在命里）
    if (this.meta.lastImprint) {
      this.say(`【往世印记·${this.meta.lastImprint.name}】\n${this.meta.lastImprint.text}`, 'imprint');
    }
    rebirthEchoes(this); // 十八期：未了之局找上门（宿敌/托孤/守井人余温）

    // 引路人指引（前三~五步）+ 暗线旗标（供事件 cond 引用）
    const hl = HIDDEN_LINES[fateCard.hiddenLine];
    if (hl) {
      life.flags.hiddenLine = fateCard.hiddenLine;
      life.flags[fateCard.hiddenLine] = true;
      this.say(`【此生暗线】${hl.title}——${hl.hint}`, 'system');
    }

    // 开场光景
    this.enterNode(life.location.node, { skipCost: true, firstScene: true });
    return this.state;
  }

  // ---------- 光景渲染 ----------
  sceneText(node, opts = {}) {
    const life = this.state.life;
    const season = SEASONS[life.season];
    const weather = life.weather || '';
    const area = areas[node.area];
    const timeOfDay = ['清晨', '晌午', '日暮', '深夜'][life.dayPart || 0];
    let text = '';
    if (opts.firstScene) {
      text += `大衍承平${30 - this.state.world.year}年，${season}，${weather}。\n`;
    }
    text += `【${node.name}】${['晨', '午', '暮', '夜'][life.dayPart || 0]}·${season}${weather ? '·' + weather : ''}\n`;
    text += node.desc;
    // 光景随年岁与境界变化的"岁痕"句
    if (life.agingSigns) text += '\n你近来常觉得自己慢了半拍——楼梯比记忆里高了，酒比从前烈了。';
    if (life.realm !== 'fan') text += `\n你此刻气息沉实，${life.realm === 'lianqi' ? '体内那缕气随呼吸涨落' : '气海如潭，波澜不惊'}。`;
    // 引路人余步
    if (life.tutorStepsLeft > 0) {
      life.tutorStepsLeft--;
      const hl = HIDDEN_LINES[life.flags.hiddenLine];
      if (hl) text += `\n（冥冥中像是有人提点你：${hl.hint}）`;
    }
    return text;
  }

  sceneHuotou(node) {
    const life = this.state.life;
    const huotou = (node.huatou || []).slice();
    // 二十一期修 C：暗线话头（心事→动作的翻译层；已了则不出）
    const hl = HIDDEN_LINES[life.flags.hiddenLine];
    if (hl && !(life.flags.doneEvents || []).includes(hl.hook)) {
      huotou.unshift(`想想「${hl.title}」`);
    }
    // 二十一期修 B：核心动词常驻（修行游戏最基本的动作不靠猜词；标签须命中意图锚头）
    if (!huotou.some(h => /^(打坐|修炼|行功|吐纳)/.test(h))) huotou.unshift('打坐吐纳');
    if (!huotou.some(h => /^(练功|练武|练剑|练拳|习武)/.test(h))) huotou.unshift('练武');
    // NPC 话头
    for (const nid of node.npcs || []) {
      const n = npcs[nid];
      if (n && !this.state.world.deadNpcs.includes(nid)) huotou.push(`和${n.name}聊`, `问${n.name}些事`);
    }
    // 城市出口
    if (node.city !== 'xiangye') {
      for (const dest of Object.keys(routes[node.city] || {})) {
        huotou.push(`去${cities[dest].name}`);
      }
    }
    return huotou;
  }

  currentScene() {
    const life = this.state.life;
    const node = nodes[life.location.node];
    return {
      node, city: cities[node.city], area: areas[node.area],
      npcs: (node.npcs || []).filter(id => !this.state.world.deadNpcs.includes(id)).map(id => npcs[id]),
      links: (node.links || []).map(id => nodes[id]).filter(Boolean),
      huatou: this.sceneHuotou(node),
      text: this.sceneText(node),
      time: `大衍承平${30 - this.state.world.year}年 · ${SEASONS[life.season]} · ${life.age}岁`,
    };
  }

  say(text, kind = 'scene') {
    this.journal.push({ text, kind, t: this.journal.length });
    if (this.journal.length > 400) this.journal.splice(0, 100);
    if (this.onChange) this.onChange();
  }

  // ---------- 进入节点 ----------
  enterNode(nodeId, opts = {}) {
    const life = this.state.life;
    const node = nodes[nodeId];
    if (!node) return;
    life.location = { city: node.city, area: node.area, node: nodeId };
    if (!opts.skipCost) this.advanceTime(node.area === life.area ? 1 : 2);
    this.state.sleeve.places.push(`${cities[node.city].name}·${areas[node.area].name}·${node.name}`);
    if (this.state.sleeve.places.length > 60) this.state.sleeve.places.shift();
    this.say(this.sceneText(node, opts), 'scene');
    // 题壁留世（06 册 C）：数十年前的墨迹还在墙上
    const oldPoem = (this.state.world.wallPoems || []).find(p => p.node === nodeId && this.state.world.year - p.year >= 25);
    if (oldPoem) {
      const isMine = oldPoem.lifeName === life.name;
      this.say(isMine
        ? `（墙上有一首旧诗，墨迹淡得快要没了。你凑近辨认，忽然怔住——这是你上辈子题的。落款的名字是你的名字，笔锋也是你的笔锋：「${oldPoem.text}」——字迹已淡，写它的人记得。）`
        : `（墙上留着一首旧诗，墨迹斑驳，落款是"${oldPoem.lifeName}"：「${oldPoem.text}」——不知是何方人物，几十年前从此路过。）`, 'ambient');
    }
    // 行路有知·远处听说（枢纽/集市节点给风声）
    if (node.tags?.includes('hub') && this.rng.chance(0.5)) {
      const news = this.rng.pick([
        '隐隐听得人说：北边的铁瓦关今冬怕是不好过。',
        '茶楼里有人在讲临江漕银的案子，讲的人神色都不太对。',
        '有外乡人打听黄泉集的路——打听那种地方的人，脸色都不太善。',
      ]);
      this.say(`（${news}）`, 'ambient');
    }
    this.rollNodeEvents(node);
    this.checkAdventures(node, opts);
  }

  // ---------- 事件调度 ----------
  rollNodeEvents(node, forceChance = null) {
    if (this.state.afterlife) return; // 幽冥余程中不再掷市井事件（防覆盖幽冥 pending）
    const life = this.state.life;
    const done = life.flags.doneEvents || (life.flags.doneEvents = []);
    const pool = Object.values(EVENTS).filter(ev => {
      if (!ev.nodes?.includes(node.id)) return false;
      if (done.includes(ev.id)) return false;
      const c = ev.cond || {};
      if (c.season !== undefined && c.season !== life.season) return false;
      if (c.night && (life.dayPart || 0) !== 3) return false;
      if (c.minAge && life.age < c.minAge) return false;
      if (c.flags && !c.flags.every(f => life.flags[f])) return false;
      if (c.moneyMin && life.money < c.moneyMin) return false;
      return true;
    });
    if (!pool.length) return;
    const chance = forceChance ?? 0.45;
    if (!this.rng.chance(chance)) return;
    const ev = this.rng.weighted(pool.map(e => ({ key: e.id, weight: e.weight || 3, ev: e }))).ev;
    this.fireEvent(ev);
  }

  fireEvent(ev) {
    const life = this.state.life;
    (life.flags.doneEvents ||= []).push(ev.id);
    this.ui.mode = 'event';
    this.pending = { type: 'event', ev, options: ev.options };
    this.say(ev.text, 'event');
  }

  // ---------- 效果应用（事件/奇遇/变故共用）----------
  applyEffect(ef, src) {
    const life = this.state.life;
    life.flags ||= {};
    if (ef.chance !== undefined) {
      // 已在上层裁决过 success/fail 的不重复掷
    }
    if (ef.money) life.money += ef.money;
    if (ef.zuohua) { this.die('daocheng', ef.zuohua); return; }  // 轮回井坐化：主动交还此生
    if (ef.hp) { life.hp = Math.min(life.maxHp, life.hp + ef.hp); if (life.hp <= 0) this.die('hengsi'); }
    if (ef.items) {
      const items = Array.isArray(ef.items) ? ef.items : [ef.items];
      for (const it of items) { life.items.push({ ...it }); this.say(`（你得了【${it.name}】。${it.desc || ''}）`, 'item'); }
    }
    if (ef.stat) {
      if (ef.stat.xiwei) life.xiwei += ef.stat.xiwei;
      if (ef.stat.wugongXiuwei) life.wugongXiuwei += ef.stat.wugongXiuwei;
      if (ef.stat.wuxing) life.dims.wuxing = Math.min(99, life.dims.wuxing + ef.stat.wuxing);
      if (ef.stat.qiyun) life.dims.qiyun = Math.min(99, life.dims.qiyun + ef.stat.qiyun);
    }
    if (ef.trait) for (const [k, v] of Object.entries(ef.trait)) life.xinXing[k] = (life.xinXing[k] || 0) + v;
    if (ef.corrupt) life.corruption = (life.corruption || 0) + ef.corrupt;
    if (ef.lifespan) { life.lifespanMax += ef.lifespan; this.say(`（你觉得身体里有什么东西松开了——只可意会，不可言传。命，厚了。）`, 'system'); }
    if (ef.wanted) life.wanted = (life.wanted || 0) + ef.wanted;
    if (ef.item_add) {
      const items = Array.isArray(ef.item_add) ? ef.item_add : [ef.item_add];
      for (const it of items) { life.items.push({ ...it }); this.say(`（你得了【${it.name}】。${it.desc || ''}）`, 'item'); }
    }
    if (ef.gongfa_add) {
      const g = ef.gongfa_add;
      if (!life.gongfa.some(x => x.id === g.id)) {
        life.gongfa.push({ ...g });
        this.say(`（你得了功法【${g.name}】。${g.desc}）`, 'item');
      }
    }
    if (ef.item_remove === 'auto_gongfa_or_item') {
      const idx = life.items.findIndex(i => i.id === 'item_chaoxi_youbu');
      if (idx >= 0) life.items.splice(idx, 1);
      const gi = life.gongfa.findIndex(g => g.id === 'gf_chaoxi_can');
      if (gi >= 0) { life.gongfa.splice(gi, 1); this.say('（潮汐残篇易了主。你袖中空了一块——心里也空了一块。）', 'item'); }
    }
    if (ef.flags) for (const [k, v] of Object.entries(ef.flags)) life.flags[k] = v;
    if (ef.beast_seen) {
      const bid = ef.beast_seen;
      if (!life.beastBook.includes(bid)) {
        life.beastBook.push(bid);
        const mark = BESTIARY_MARKS.find(m => m.n === life.beastBook.length);
        this.say(mark ? mark.text : `（妖兽卷又添一笔——${BEASTS[bid]?.name || bid}。认兽先认名，认名不结仇。）`, 'system');
      }
    }
    if (ef.beast_capture) {
      const r = tryCapture(this, ef.beast_capture);
      this.say(r.text, r.ok ? 'event' : 'echo');
    }
    if (ef.ledger) this.book(ef.ledger.type, ef.ledger.text);
    if (ef.echo) {
      this.state.pendingEchoes.push({
        id: 'echo' + this.state.pendingEchoes.length,
        payload: ef.echo.payload, when: ef.echo.when,
        dueYear: this.state.world.year + (ef.echo.delayYears || 1),
      });
    }
    if (ef.sect_join) joinSect(this, ef.sect_join);
    if (ef.item_roll) {
      const spec = typeof ef.item_roll === 'number' ? { tier: ef.item_roll } : ef.item_roll;
      const it = rollItem(this.rng, spec.tier || 0, spec.kind || 'weapon');
      life.items.push(it);
      this.say(`（你得了【${it.name}】。${it.desc}——行家眼里，这是件${it.grade}。）`, 'item');
    }
    if (ef.hbao_roll) {
      // 七期：天材地宝入袋—— kind:'herb'，服用走「服下」意头
      const hb = rollHeavenly(this.rng);
      life.items.push(hb);
      this.say(`（你得了天材地宝【${hb.name}】。${hb.desc}——收进袖中，记得寻个安稳时辰再服。）`, 'item');
    }
    if (ef.move) life.location = { city: ef.move.city, area: ef.move.area, node: ef.move.node };
    if (ef.faction) life.flags.faction = ef.faction;
    if (ef.minghao) { life.minghao = ef.minghao; this.say(`（江湖上从此有人叫你"${ef.minghao}"。）`, 'system'); }
    if (ef.sleeve_add) {
      const { book, entry } = ef.sleeve_add;
      this.state.sleeve[book]?.push(entry);
    }
    // 大因果（04 册 §3.2）：改命级落子改写区域状态——同周目翻不了盘，光景句随状态变
    if (ef.region) {
      const r = ef.region;
      this.state.world.regions = this.state.world.regions || {};
      this.state.world.regions[r.place] = r.state;
      this.say(`（${cities[r.place]?.name || '此地'}的命运，因你转了一个弯。）`, 'system');
    }
  }

  book(type, text) {
    this.state.ledger.push({ year: this.state.world.year, season: SEASONS[this.state.life.season], type, text, resolved: false });
    this.say(`（旧账册添了一笔：【${type}】${text}）`, 'ledger');
  }

  // ---------- 光阴账 ----------
  advanceTime(parts) {
    const life = this.state.life;
    life.dayPart = (life.dayPart || 0) + parts;
    while (life.dayPart >= 4) {
      life.dayPart -= 4;
      life.day++;
      if (life.day > 30) {
      life.day = 1;
      life.season++;
      if (life.season > 3) { life.season = 0; this.yearTick(); }
      // 节令民俗（04 册 §4.3）：换季掷签入节
      if (this.state.alive && !this.state.afterlife) this.maybeFestival();
    }
      // 新的一天：天气与晨光
      life.weather = this.rng.pick(WEATHERS[SEASONS[life.season]]);
      if (this.state.alive) {
        this.say(`——${SEASONS[life.season]}${life.day > 1 ? life.day + '日' : '朔日'}，${life.weather}。——`, 'ambient');
        advanceQualityDay(this); // 十四期：节气换气光景 + 月圆天象 + 彗星余波
      }
    }
  }

  // ---------- 节令民俗（蓝图 §4.3：节令是年轮） ----------
  maybeFestival() {
    if (!this.rng.chance(0.45)) return;
    const cands = SEASON_FESTIVALS[this.state.life.season] || [];
    if (!cands.length) return;
    const id = cands[this.rng.int(0, cands.length - 1)];
    const f = FESTIVALS[id];
    if (!f) return;
    this.say(`【节令·${f.name}】\n${f.text}`, 'ambient');
    if (f.effect && (f.effect.hp || f.effect.money)) this.applyEffect(f.effect, 'festival');
  }

  yearTick() {    const life = this.state.life;
    const world = this.state.world;
    world.year++;
    life.age++;
    // 寿元初始化（首次进入延寿境界时重算）
    if (!life.lifespanMax) life.lifespanMax = lifespanFor(life.realm, this.rng);
    // 衰老征兆（最后一成）
    if (!life.agingSigns && life.age >= life.lifespanMax * 0.9) {
      life.agingSigns = true;
      this.say('（你揽镜自照，发现鬓角有了霜色。提一口气，气到胸口就散——老了。寿数还剩几何，没人说得准，但你能觉出来：不多了。）', 'system');
    }
    if (life.age >= life.lifespanMax) { this.die('shouzhong'); return; }
    // 岁痕句
    const marks = [...YEAR_MARKS.plain];
    if ((life.injury && Object.keys(life.injury).length)) marks.push(...YEAR_MARKS.injured);
    if ((this.state.ledger.filter(l => l.type === '杀').length)) marks.push(...YEAR_MARKS.fought);
    if (life.realm !== 'fan') marks.push(...YEAR_MARKS.cultivated);
    this.say(`【${life.age}岁·岁末】${this.rng.pick(marks)}`, 'year');
    // 续命机缘：独立低频通道（衰老后偶有耳闻）
    if (life.agingSigns && !this.state.adventures.seen.includes('adv_kongqing') && this.rng.chance(0.08)) {
      return this.startAdventure('adv_kongqing');
    }
    // 因果催账
    this.resolveEchoes();
    // 师门年事（入门满一年才有）
    annualSectTick(this);
    // 一生的人际（06 册 A）：相遇掷签 + 关系的一生推进
    if (!this.state.afterlife) {
      if (this.rng.chance(0.32)) maybeMeetRelation(this);
      advanceRelations(this);
      // 剑养灵（06 册 G）：佩剑随岁月生灵性
      if (life.equipped) {
        const w = life.items.find(i => i.id === life.equipped && (i.kind === 'weapon' || i.named));
        if (w) {
          life.swordBond = (life.swordBond || 0) + 1;
          if (life.swordBond === 10) this.say(`（夜半，【${w.name}】在鞘里轻轻响了一声。你按住剑柄——它在应你。养剑十年，剑开始养你。）`, 'ambient');
          else if (life.swordBond === 25) this.say(`（【${w.name}】有了灵性。每逢你心事翻涌，它便于鞘中低鸣，像在陪你说夜话。江湖上的老话说：剑认了主，便不再是一块铁。）`, 'ambient');
        }
      }
      // 九类新维度·年轮（06 册 B/E）：居所/经营/门派推进 + 亡者托梦
      advanceHome(this);
      fengshuiYearTick(this); // 十三期：宅子风水隐藏层（吉宅添喜/凶宅磨人/镇物显灵）
      advanceBusiness(this);
      guildYearTick(this); // 十三期：行会年轮（年会/晋身/同业恩怨/行规抉择）
      npcYearTick(this); // 十七期：重点人物的岁月线（履历翻页/老去/讣闻）
      if (!this.pending && !this.state.afterlife) reincarnationYearTick(this); // 十八期：前世主线三线
      advanceFoundedSect(this);
      // 灵兽奇缘（07 册）：拾蛋/救崽/托孤掷签 + 兽寿年轮 + 托孤之诺应验
      if (!maybeTuogu(this) && !maybeCubRescue(this)) maybeFindEgg(this);
      mountAging(this);
      checkTuoguDuty(this);
      maybeDream(this);
      // 四大核心收尾（04 册）：名号年检 / 彗星引信 / 入魔渐变线
      evaluateMinghao(this);
      maybeComet(this);
      moraTick(this);
    }
    // 世界大事（大事不等玩家）——worldsim 年度调度
    const worldMsgs = annualWorldTick(this);
    for (const m of worldMsgs) this.say(m, 'ambient');
    // 大事际遇递到眼前（玩家恰在同城）
    while (this.worldEventQueue.length) {
      const evId = this.worldEventQueue.shift();
      const ev = EVENTS[evId];
      // 十四期守卫：玩家手上已有未结的事件时，大事顺延不抢幕（防覆盖，同十一期幽冥守卫之理）
      if (ev && !this.pending && !(life.flags.doneEvents || []).includes(evId)) this.fireEvent(ev);
    }
  }

  // ---------- 落子催账（延迟回响）----------
  resolveEchoes(context = {}) {
    const world = this.state.world;
    const due = this.state.pendingEchoes.filter(e => world.year >= e.dueYear && (!e.when || context[e.when]));
    for (const e of due) {
      const payload = PAYLOADS[e.payload];
      if (!payload) continue;
      this.say(`【旧账回响】${payload.text(this.state)}`, 'echo');
      this.applyEffect(payload.effect || {}, 'echo');
      // 账清了
      const src = this.state.ledger.find(l => !l.resolved && l.type !== '秘');
      if (src) src.resolved = true;
    }
    this.state.pendingEchoes = this.state.pendingEchoes.filter(e => !due.includes(e));
  }

  // ---------- 奇遇调度 ----------
  checkAdventures(node, opts = {}) {
    const life = this.state.life;
    const seen = this.state.adventures.seen;
    // 分层预算与冷却（07 册 §五）：天大机缘每世 ≤2、一生一遇/续命 ≤1；大机缘触发后全通道冷却五年
    const r3Count = life.flags.advR3 || 0;
    const r4Count = life.flags.advR4 || 0;
    const cooling = (life.flags.advCooldownUntil || 0) > this.state.world.year;
    for (const adv of Object.values(ADVENTURES)) {
      if (seen.includes(adv.id)) continue;
      if (this.meta.crossSeenAdventures.includes(adv.id)) continue; // 跨世防重复（一生一遇档用）
      const rar = adv.rarity || 1;
      if (cooling && rar >= 3) continue; // 冷却中：山川灵气避人
      if (rar >= 4 && r4Count >= 1) continue;
      if (rar === 3 && r3Count >= 2) continue;
      const en = adv.entry;
      let hit = false;
      if (en.node && en.node === node.id) hit = true;
      if (en.nodes?.includes(node.id)) hit = true;
      if (!hit) continue;
      if (en.minAge && life.age < en.minAge) continue;
      if (en.night && (life.dayPart || 0) !== 3) continue;
      if (en.cond?.season !== undefined && en.cond.season !== life.season) continue;
      if (en.cond?.weather && life.weather !== en.cond.weather) continue;
      if (en.cond?.hasGongfa && !life.gongfa.length) continue;
      if (en.cond?.moneyMin && life.money < en.cond.moneyMin) continue;
      if (en.cond?.sect && life.sect?.id !== en.cond.sect) continue;
      if (en.cond?.flags && !en.cond.flags.every(f => life.flags[f])) continue;
      if (en.chance !== undefined && !this.rng.chance(en.chance)) continue;
      // 大机缘落账：计数 + 冷却（07 册：江湖传闻四起，山川灵气避人）
      if (rar >= 4) life.flags.advR4 = r4Count + 1;
      if (rar === 3) life.flags.advR3 = r3Count + 1;
      if (rar >= 3) {
        life.flags.advCooldownUntil = this.state.world.year + 5;
        if (rar >= 3 && !life.flags.advCooldownTold) {
          life.flags.advCooldownTold = true;
          this.say('（这几日江湖传闻四起，说的都是你在何处得了什么造化。听的人多了，山川灵气反而避起人来——往后几年，怕是要过些安分日子。）', 'ambient');
        }
      }
      this.startAdventure(adv.id);
      return;
    }
  }

  startAdventure(id) {
    const adv = ADVENTURES[id];
    if (!adv) return;
    this.state.adventures.seen.push(id);
    this.ui.mode = 'adventure';
    this.pending = { type: 'adventure', id, stage: 0 };
    if (this.rng.chance(0.5)) maybeOmen(this, true); // 机缘前兆（06 册 E）
    this.say(`【机缘】${adv.title}`, 'adventure');
    const st = adv.stages[0];
    this.say(st.text, 'adventure');
    this.pending.options = st.options;
  }

  runAdventureStage(idxOrId) {
    const p = this.pending;
    // 十六期：奇遇效果可能致死/引幽冥抢幕——幕已不是奇遇时旧链就此让位，不设防会崩
    const adv = p && p.type === 'adventure' ? ADVENTURES[p.id] : null;
    if (!adv) return;
    const stage = adv.stages.find(s => s.id === idxOrId) || adv.stages[idxOrId];
    if (!stage) return this.closePending();
    if (stage.effect) {
      this.applyEffect(stage.effect, 'adventure');
      if (!this.state.alive || this.pending !== p) return;
    }
    if (stage.combat) { // 战斗中转
      this.pending.returnStage = stage.win_goto ?? (stage.goto ?? null);
      this.startCombat(stage.combat, { fromAdventure: true, winStage: stage.win_goto, loseEnd: stage.lose_end });
      return;
    }
    if (stage.end) {
      if (stage.xinglu) {
        this.state.sleeve.xingluZhi.push(stage.xinglu);
        this.say(`（行路志记了一句：${stage.xinglu}）`, 'ledger');
      }
      if (stage.rewards) this.applyEffect(stage.rewards, 'adventure');
      this.closePending();
      return;
    }
    if (stage.text) this.say(stage.text, 'adventure');
    if (stage.options?.length) {
      this.pending.options = stage.options;
    } else {
      // 无选项的过渡段
      const next = stage.goto;
      if (next !== undefined) this.runAdventureStage(next);
      else this.closePending();
    }
    p.stage = stage;
  }

  // ---------- 战斗接入 ----------
  startCombat(tid, opts = {}) {
    this.ui.mode = 'combat';
    const tpl = COMBAT_TEMPLATES[tid];
    if (this.rng.chance(0.3)) maybeOmen(this, false); // 凶兆先至（06 册 E）
    this.say(tpl.intro, 'combat');
    startCombat(this.state, tid, opts);
    this.pending = { type: 'combat', ...opts };
  }

  combatInput(text) {
    const c = this.state.combat;
    if (!c) return;
    const norm = normalize(text);
    const moves = playerMoves(this.state.life);
    let cmd = { type: 'attack' };
    if (/观|看破|气机|破绽/.test(norm)) cmd = { type: 'observe' };
    else if (/守|防|退/.test(norm)) cmd = { type: 'defend' };
    else if (/逃|走|撤|跑/.test(norm)) cmd = { type: 'flee' };
    else {
      const m = moves.find(mv => norm.includes(mv.name.split('（')[0]) || norm.includes(mv.name));
      cmd = { type: 'attack', move: m || moves[0] };
    }
    const res = combatRound(this.state, cmd);
    if (res) {
      for (const l of res.lines) this.say(l, 'combat');
      if (res.over) this.finishCombat(res.result);
    }
  }

  finishCombat(result) {
    const c = endCombat(this.state);
    const opts = this.pending || {};
    if (result === 'win') {
      const tpl = c.tpl;
      this.applyEffect({ money: tpl.winMoney || 0 }, 'combat');
      if (this.state.alive) this.afterCombatWin(opts);
    } else if (result === 'lose') {
      this.say(c.tpl.loseText || '你败了。', 'combat');
      if (opts.loseEnd === 'hengsi' || !opts.fromAdventure) {
        this.die('hengsi', null);
      } else {
        this.closePending();
      }
    } else if (result === 'fled') {
      this.closePending();
    }
  }

  afterCombatWin(opts) {
    if (opts.fromAdventure && opts.winStage !== undefined && opts.winStage !== null) {
      // 恢复奇遇上下文，继续走 win_goto 指向的阶段
      const advId = opts.advId || this.state.adventures.seen[this.state.adventures.seen.length - 1];
      this.ui.mode = 'adventure';
      this.pending = { type: 'adventure', id: advId };
      this.runAdventureStage(opts.winStage);
    } else {
      this.closePending();
    }
  }

  closePending() {
    this.pending = null;
    if (!this.state.alive) { this.ui.mode = 'dead'; return; }
    this.ui.mode = 'world';
    // 回到光景
    const node = nodes[this.state.life.location.node];
    if (node) this.say(`（${node.name}。${['晨光', '日头', '暮色', '夜色'][this.state.life.dayPart || 0]}落在你肩上。）`, 'ambient');
    this.rollNodeEvents(node, 0.2);
  }

  // ---------- 死亡分派 ----------
  die(kind, text) {
    const life = this.state.life;
    if (!this.state.alive) return;
    captureCross(this); // 十八期：未了之局入 meta（宿敌/托孤），下一世找上门
    this.state._wellTokens = this.meta.wellTokens || 0; // 十八期：过所数投影进 state，供判词读取
    // 兽寿不同轨：灵兽寿数往往比人长——你先走了，它还活着（07 册：它等你下一世的转身）
    if (life.mount && lifespanOf(life.mount.id) > (life.age - (life.mount.years || 0))) {
      this.meta.crossMount = { name: life.mount.name, kind: life.mount.kind, xun: life.mount.xun, id: life.mount.id };
    } else if (life.mount) {
      delete this.meta.crossMount;
    }
    // 道成者跳出轮回，不入幽冥；横死者六成勾魂（短流程）；寿终/求仁走幽冥全程（GDD §4.4）
    if (kind === 'daocheng') return this.finalizeDeath(kind, text);
    if (kind === 'hengsi' && !this.rng.chance(0.6)) return this.finalizeDeath(kind, text);
    beginNetherworld(this, kind, text);
  }

  finalizeDeath(kind, text) {
    const life = this.state.life;
    if (!this.state.alive && !this.state.afterlife) return;
    life.diedOf = kind;
    life.alive = false;
    this.state.alive = false;
    this.state.afterlife = null;
    this.ui.mode = 'dead';
    this.say(text || ({
      shouzhong: '那一日，你躺下来，就没能再起来。窗外的光景一寸寸暗下去——像一生的走马灯。',
      hengsi: '眼前一黑。',
      qiuren: '你笑了笑，咽下了那口气。值得。',
      daocheng: '你于雷声中坐化。肉身留在了原地，你——去了别处。',
      rumo: '那一夜之后，"你"就不在了。接管这具身体的东西带着你的脸继续活——江湖不知道，它自己也不知道。',
    }[kind] || '你死了。'), 'death');
    this.judgment = finalJudgment(this.state, kind, text);
    // 十九期：图鉴入册 + 成就添章
    accumulateCodex(this, kind);
    const newlyAch = settleAchievements(this);
    for (const a of newlyAch) this.say(`（图鉴·成就添章：【${a.name}】${a.desc}）`, 'ledger');
    this.persist();
  }

  // ---------- 幽冥余程调度 ----------
  nwStep(step) {
    const aw = this.state.afterlife;
    if (!aw) return;
    if (step === 'huangquan') aw.dianQueue = aw.kind === 'hengsi' ? [] : planDianQueue(this.state);
    nwAdvance(this, step);
  }

  nwFinal() {
    const aw = this.state.afterlife;
    const kind = aw?.kind || 'shouzhong';
    this.say('（轮回井的光漫过头顶——六道已定，来世见。）', 'system');
    this.finalizeDeath(kind, null);
  }

  // ---------- 输入主入口 ----------
  input(raw) {
    if (!this.state.alive) return;
    this.state.monitor.inputCount++;
    // 战斗态
    if (this.state.combat) { this.combatInput(raw); return; }
    // 事件/奇遇等待选项：允许按序号选择
    const seqMatch = raw.match(/^[选]?([一二三四五六1-6])$/);
    if (seqMatch && (this.ui.mode === 'event' || this.ui.mode === 'adventure' || this.ui.mode === 'lifenode')) {
      this.chooseOptionByLabel(seqMatch[1]);
      return;
    }
    const scene = {
      npcs: (nodes[this.state.life.location.node].npcs || []).map(id => npcs[id]).filter(Boolean),
      links: nodes[this.state.life.location.node].links || [],
    };
    const p = parse(raw, scene, WD);

    if (p.verdict === 'hit') {
      switch (p.intent) {
        case 'go': return this.doGo(p.slots, p.normalized);
        case 'travel': return this.doTravel(p.slots, p.normalized);
        case 'look': return this.doLook();
        case 'talk': case 'ask': return this.doTalk(p.slots, p.normalized);
        case 'cultivate': return this.doCultivate();
        case 'practice': return this.doPractice();
        case 'rest': return this.doRest();
        case 'work': return this.doWork();
        case 'buy': return this.doBuy(p.slots, p.normalized);
        case 'eat': return this.doEat();
        case 'wander': return this.doWander();
        case 'wait': return this.doWait();
        case 'sleeve': return this.doBeastBook(p);
        case 'feed': return this.doFeed();
        case 'craft': return this.doCraftRequest();
        case 'items': return this.doListItems();
        case 'baishi': return this.doBaishi(p.slots);
        case 'duty': return this.doDuty();
        case 'leave': return this.doLeaveSect();
        case 'equip': return this.doEquip(p.slots);
        case 'inscribe': return this.doInscribe();
        case 'hatch': return hatchEgg(this);
        case 'use': return this.doUse(p.slots);
        case 'settle': return doSettle(this);
        case 'alias': case 'realname': return this.doAliasCmd(p, p.intent === 'realname');
        case 'investigate': return doInvestigate(this);
        case 'business': return this.doBusinessCmd(p);
        case 'foundsect': return doFoundSect(this);
        case 'kanyu': return doKanyu(this);
        case 'zhenwu': return doZhenwu(this);
        case 'xunlong': return doXunlong(this);
        case 'help': return this.doAskHeaven(); // 二十一期修 A：指路不牵手——askHeaven 此前是死代码
        case 'ponder': return this.doPonder(); // 二十一期修 C：琢磨心事
        default: return this.doEcho('generic', p);
      }
    } else if (p.verdict === 'partial') {
      if (p.intent === 'go') {
        // go 的去处是城市名（跨城行路）——三期起共 20 城
        const dest = Object.values(cities).find(c => p.normalized.includes(c.name) || p.normalized.includes(c.name.replace(/[府镇关集]$/, '')));
        if (dest) return this.doTravel(p.slots, p.normalized);
        return this.say(this.rng.pick(ECHOES.go_noPlace), 'echo');
      }
      if (p.intent === 'buy') return this.say(this.rng.pick(ECHOES.buy_noMoney), 'echo');
      if (p.intent === 'talk' || p.intent === 'ask') return this.say(this.rng.pick(ECHOES.talk_noNpc), 'echo');
      return this.doEcho('generic', p);
    } else {
      // 冷场红线：任何输入必有回声
      return this.doEcho('unclear', p);
    }
  }

  doEcho(kind, p) {
    const node = nodes[this.state.life.location.node];
    const sense = this.rng.pick(['风把街声送过来，又送走了。', '檐下的旗子懒懒动了一下。', '不知谁家的炊烟被风压得很低。', '远处有骡铃，近处有算盘。']);
    const tpl = this.rng.pick(ECHOES[kind] || ECHOES.generic);
    let text = tpl
      .replace('{place}', node.name)
      .replace('{sense}', sense)
      .replace('{npc_nearby}', (node.npcs || [])[0] ? npcs[node.npcs[0]]?.name || '旁人' : '旁人')
      .replace('{huatou_hint}', '眼下能做的，就摆在眼前那几条路里')
      .replace('{scene_npcs_hint}', (node.npcs || []).length ? `近处有${(node.npcs || []).map(id => npcs[id]?.name).filter(Boolean).join('、')}` : '附近没什么人');
    if (kind === 'unclear') this.state.monitor.coldEchoCount++;
    // 二十一期修 D：没听懂不扣光阴（摸索词表不该被吃时间），并补一句指路引导
    if (kind === 'unclear' || kind === 'generic') {
      text += '\n（想不起要做什么，就点一下「问天」。）';
      this.say(text, 'echo');
      return;
    }
    this.say(text, 'echo');
    this.advanceTime(1);
  }

  doGo(slots, norm) {
    const target = slots.place;
    if (!target) {
      // 城市级去向（跨城行路）
      if (norm) return this.doTravel(slots, norm);
      return this.doEcho('go_noPlace');
    }
    if (target.city === this.state.life.location.city) {
      // 同城移动
      this.say(`你往${target.name}去。`, 'scene');
      this.enterNode(target.id);
      // 行迹旗标（拜师考验引用：走过官道/峡口的路）
      if (['guandao', 'yh_xia', 'tw_huangyi'].includes(target.id)) this.state.life.flags.been_guandao = true;
      // 回响 when 检查
      this.resolveEchoes({ nextVisitMatou: target.id === 'matou' });
    } else {
      this.doTravel(slots, norm || `去${target.name}`);
    }
  }

  doTravel(slots, norm) {
    const life = this.state.life;
    let dest = slots.place ? cities[slots.place.city] : null;
    if (!dest && norm) {
      for (const c of Object.values(cities)) {
        if (norm.includes(c.name) || norm.includes(c.name.replace(/[府镇关集]/, ''))) { dest = c; break; }
      }
    }
    if (!dest || !routes[life.location.city]?.[dest.id]) {
      if (/赶路|行路|启程|动身|出发|官道/.test(norm || '')) {
        return this.say('要赶路，先报个去处——这世上的路再多，也得有条方向。', 'echo');
      }
      return this.say('那条路眼下走不通——你得先到能出发的地方，或者换个去处。', 'echo');
    }
    const route = routes[life.location.city][dest.id];
    // 下潜：需闭气之能（闭气术功法/鲛人泪/水行坐骑任一）
    if (route.dive) {
      const canDive = life.gongfa.some(g => g.id === 'gf_biqi_shu') || (life.items || []).some(i => i.id === 'item_jiaorenlei') || (life.mount && life.mount.kind === 'shui');
      if (!canDive) {
        this.say('（你在水边停下了。这水道下去就是龙宫旧脉——寻常人闭不了那么久的气。要么有闭气的法门，要么有鲛人相助，要么……有一头水行的坐骑。）', 'echo');
        return;
      }
    }
    // 仙山通行：丹成（金丹以上）或望仙崖见过仙山现影者，方能登临（仙凡有别）
    if (route.xianshan) {
      const realmIdx = REALMS[life.realm]?.idx || 0;
      const hasXianYuan = realmIdx >= 2 || life.flags.xianshan_xianying;
      if (!hasXianYuan) {
        this.say('（你在山根下停住了。不是路断了——是"气"断了。山上的东西一寸一寸压下来，像水压，压得你喘不上气。山下人指指点点：没听说谁没到那一步就能登仙山的。金丹，或者仙缘。）', 'echo');
        return;
      }
    }
    // 仙界通行：渡劫圆满者，第九道雷后方为其开门（GDD 四期：仙界九重天）
    if (route.xianjie) {
      const realmIdx = REALMS[life.realm]?.idx || 0;
      if (realmIdx < 8) {
        this.say('（你在劫峰顶站了很久。雷云在你头顶聚了又散——它还不到为你开门的时候。门在那儿，可它只认「渡劫圆满」。回去，把你的证凑齐，把你的雷等足。）', 'echo');
        return;
      }
    }
    // 坐骑代步：陆路日程减半（海路不通骑乘）
    let days = route.days;
    const onMount = life.mount && !route.sea && !route.dive;
    if (onMount && days > 1) days = Math.max(1, Math.ceil(days / 2));
    this.say(onMount
      ? `你翻身上${life.mount.name}，${route.way}。这坐骑脚程快，${days}日程便能赶到。`
      : `你收拾行装，${route.way}。这一路，${days}日程。`, 'scene');
    for (let d = 0; d < days; d++) {
      if (!this.state.alive) return;
      this.advanceTime(4); // 一整日
      if (!this.state.alive) return;
      if (route.sea) {
        if (this.rng.chance(0.3)) {
          this.say(this.rng.pick([
            '（夜里起了风浪，船身摇晃如筛。水手们把帆收了三成——他们说，这是海在"打招呼"。）',
            '（海面浮起大片银光，像月亮碎在水里。老水手说是鱼群，可那光过处，罗盘的针转了三圈。）',
            '（雾起。雾里有歌声，遥远又清晰。船老大往每个人手里塞了一团棉花——"塞上。别听。"）',
            '（一只海鸟落在桅顶，不肯走了。水手们反而不慌——他们说，鸟肯落船，说明这段海"干净"。）',
          ]), 'ambient');
        }
      } else if (this.rng.chance(0.45)) {
        this.say(this.rng.pick(TRAVEL_EVENTS), 'ambient');
      }
    }
    if (route.viaNode) {
      // 途经点（雁回峡）
      this.say(`途中要过${nodes[route.viaNode].name}。`, 'scene');
    }
    this.say(`——${dest.name}到了。——`, 'scene');
    // 先落到入城节点
    const entryNode = { tianqi: 'chengmen_dashi', yanhui: 'yh_changjie', linjiang: 'lj_shuimen', tiewa: 'tw_guanqiang', huangquan: 'hq_dufang', xiangye: 'guandao', baicao: 'bc_yaomen', canglan: 'cl_aogang', kunwu: 'kw_jianshan', qundao: 'qd_yucun', longgong: 'lg_gongmen', nanhai: 'nh_bujidao', donghuang: 'dh_yaoshi', ximo: 'xm_xiangshi', nanjiang: 'nj_bazhai', beiyuan: 'by_xueyuan', kunlunxu: 'kx_tianjie', shushan: 'ss_shanmen', penglai: 'pl_dukou', yuanyuan: 'yy_shangceng', xianjie: 'xj_nantianmen' }[dest.id];
    life.location = { city: dest.id, area: nodes[entryNode].area, node: entryNode };
    this.state.sleeve.places.push(`${dest.name}·${nodes[entryNode].name}`);
    // 山河卷（蓝图 §五：足迹长卷——走过的城、渡过的海）
    life.flags.visitedCities = life.flags.visitedCities || [];
    if (!life.flags.visitedCities.includes(dest.id)) {
      life.flags.visitedCities.push(dest.id);
      this.state.sleeve.shanhe.push(`初至${dest.name}——${dest.desc ? String(dest.desc).slice(0, 40) : '此城光景，已入卷中。'}`);
    }
    this.say(this.sceneText(nodes[entryNode], { firstScene: false }), 'scene');
    this.rollNodeEvents(nodes[entryNode], 0.5);
    this.checkAdventures(nodes[entryNode]);
  }

  doLook() {
    const node = nodes[this.state.life.location.node];
    this.say(this.sceneText(node), 'scene');
    // 大因果区域状态变体（04 册 §3.2：镇兴衰写进光景）
    const rs = this.state.world.regions?.[node.city];
    if (rs) {
      const flavor = REGION_FLAVOR[node.city]?.[rs];
      if (flavor) this.say(flavor, 'ambient');
    }
    // 崖下观察 → 雁回峡奇遇
    if (node.id === 'yh_xia' && this.rng.chance(0.5) && !this.state.adventures.seen.includes('adv_yanhui_xia')) {
      this.startAdventure('adv_yanhui_xia');
    }
    this.advanceTime(1);
  }

  doTalk(slots, norm) {
    const node = nodes[this.state.life.location.node];
    let npc = slots.npc;
    if (!npc) {
      const ids = node.npcs || [];
      if (ids.length) npc = npcs[ids[this.rng.int(0, ids.length - 1)]];
    }
    if (!npc || this.state.world.deadNpcs.includes(npc.id)) return this.say(this.rng.pick(ECHOES.talk_noNpc), 'echo');
    // 人物谱
    if (!this.state.sleeve.people[npc.id]) {
      this.state.sleeve.people[npc.id] = { name: npc.name, desc: npc.desc };
      this.say(`（袖中录·人物谱添了一笔：${npc.name}。${npc.desc}）`, 'ledger');
    }
    maybeAliasReveal(this, npc); // 易容被识破的名场面（06 册 E）
    // 鬼市疯乞丐奇遇
    if (npc.id === 'feng_qigai' && !this.state.adventures.seen.includes('adv_guishi_jiankui') && this.state.life.money >= 5) {
      return this.startAdventure('adv_guishi_jiankui');
    }
    this.say(`${npc.greeting}`, 'dialog');
    npcLifeCard(this, npc); // 十七期：私人史卡（首见必出）
    npcMemoryEcho(this, npc); // 十七期：账册记忆——他记得你的旧账
    // 说书人：秘闻卷 + 跨世说前尘（06 册 F：下一世在茶楼听到上一世的故事）
    if ((npc.tags || []).includes('storyteller') || npc.name.includes('说书')) {
      const past = (this.meta.pastLives || []).filter(p => p.minghao || p.name).slice(-1)[0];
      if (past && past.minghao && this.rng.chance(0.5)) {
        this.say(`${npc.name}惊堂木一拍："今日说一位${past.minghao}——"你听着听着，忽然坐直了。这故事……你怎么听怎么像自己。说书人讲到一半说岔了一处细节，你脱口纠正。满堂哄笑，唯有说书人怔怔看你半晌："……客官，您这纠得，比老朽知道的还细。"`, 'dialog');
      } else if (MIWEN_POOL.length) {
        const m = MIWEN_POOL[this.rng.int(0, MIWEN_POOL.length - 1)];
        this.state.sleeve.miwen.push(`【${this.state.world.year}年】${m}`);
        this.say(`${npc.name}压低了声："给你说桩秘闻——${m}"（袖中录·秘闻卷记了一笔）`, 'dialog');
      }
    }
    // 知事表匹配
    const topic = slots.topic || '';
    const hit = (npc.zhishi || []).find(z => z.keys.some(k => topic.includes(k) || norm.includes(k)));
    if (hit) {
      this.say(`${npc.name}道："${hit.answer}"`, 'dialog');
      // 问路答实：答案中的地名入行路志
      for (const c of Object.values(cities)) {
        if (hit.answer.includes(c.name) && !this.state.sleeve.places.some(p => p.includes(c.name))) {
          this.state.sleeve.places.push(`${c.name}（${npc.name}所指的路）`);
        }
      }
    } else {
      this.say(`${npc.name}道：${this.rng.pick(['"这话，得问对的人。"', '"你现在问的这个，我可说不上。"', '"先坐。急什么。"（他岔开了话头。）', '"……你心里其实已经有数了，对吧？"'])}`, 'dialog');
    }
    this.advanceTime(1);
    this.rollNodeEvents(node, 0.2);
  }

  doCultivate() {
    const life = this.state.life;
    const node = nodes[life.location.node];
    const isLingdi = node.tags?.includes('lingdi');
    const quiet = node.tags?.includes('wild') || isLingdi || node.tags?.includes('taoist') || node.tags?.includes('temple');
    if (!quiet && !isLingdi) return this.say(this.rng.pick(ECHOES.cultivate_noCondition), 'echo');
    this.advanceTime(2);
    if (!this.state.alive) return;
    let gain = 2 + life.dims.gengu / 20 + (isLingdi ? 6 : 0) + (life.gongfa.some(g => g.level >= 2) ? 3 : 0);
    gain = Math.round(gain);
    // 四正时（04 册 §5.2：子午卯酉行功事半功倍——晨卯/夜子对应 dayPart 0/3）
    const sizheng = (life.dayPart || 0) === 0 || (life.dayPart || 0) === 3;
    if (sizheng) gain += 1;
    // 月圆天象（十四期）：妖修坐不住，进境反涨
    const moonYao = life.day === 15 && life.gongfa.some(g => g.mai === 'yao');
    if (moonYao) gain += 3;
    // 五脉佐修（GDD：妖快/魔急遭谴/佛养/体固）
    const maiOf = m => life.gongfa.some(g => g.mai === m);
    if (maiOf('yao')) gain += 4;   // 妖修：妖体纳气，进境快
    if (maiOf('mo')) {
      gain += 8;                    // 魔修：最急
      life.corruption = (life.corruption || 0) + 1;
      if (this.rng.chance(0.18)) {
        life.hp = Math.max(1, life.hp - 10);
        this.say('（行功行到一半，那股气忽然不听号令了——它自己走，走得太急，抽得你肺管子疼。你吐出一口黑血。快，是真的快。疼，也是真的疼。）', 'system');
      }
    }
    if (maiOf('fo')) { gain += 2; life.hp = Math.min(life.maxHp, life.hp + 6); }  // 佛修：舍利养身
    if (maiOf('ti')) { life.maxHp += 1; life.hp += 1; }                          // 体修：肉身日壮
    // 仙界气机（真仙以上）：云上灵气以千倍计，修为水涨船高
    const realmIdxNow = REALMS[life.realm]?.idx || 0;
    if (realmIdxNow >= 9) gain += 500 * (realmIdxNow - 7);
    life.xiwei += gain;
    // 道藏卷（蓝图 §五：读过的经文、功法要诀入卷）
    const dz = DAOZANG_SPOTS.find(s => node.tags?.includes(s.key));
    if (dz && this.rng.chance(0.22) && this.state.sleeve.daozang.length < 12) {
      const e = dz.entries[this.rng.int(0, dz.entries.length - 1)];
      this.state.sleeve.daozang.push(e);
      this.say(`（收功时你翻开旧卷读了一句——${e}）（袖中录·道藏卷记了一笔）`, 'system');
    }
    // 山壁石洞：吐纳计数
    if (node.id === 'shanbi_dong') {
      life.flags.shanbi_count = (life.flags.shanbi_count || 0) + 1;
      if (life.flags.shanbi_count === 3 && !this.state.adventures.seen.includes('adv_shanbi_chuan')) {
        this.say('（你吐纳收功，睁眼时，石壁上的炭痕在你眼里忽然不一样了……）', 'system');
        return this.startAdventure('adv_shanbi_chuan');
      }
    }
    this.say(this.rng.pick([
      `你盘膝行功，呼吸渐深。体内那缕若有若无的气，比昨日听得清楚了一分。`,
      `子时的露气从窗纸缝里渗进来，你行功一周天，浑身微微见汗——这汗是"气"化开的。`,
      `你入静了半个时辰。出静时，听觉比来时锋利——你能听见自己心跳的间隙。`,
      isLingdi ? '此地气机浑厚，你刚一入静，周身的气就像百川归海一样聚拢过来——灵地打坐，一日抵得别处十日。' : '行功毕。气感涨了一线，说不清，但确凿。',
    ]), 'scene');
    // 破境判定
    if (sizheng) this.say('（此刻正当四正时——子午卯酉，天地气机最顺。你借这个时辰行功，事半功倍。）', 'ambient');
    if (moonYao) this.say('（今夜月圆。你体内的妖气如鱼得水，行功一周天，比平日快了三分——月圆之夜妖不修行？那是人说的。）', 'ambient');
    this.checkBreakthrough();
    this.rollNodeEvents(node, 0.15);
  }

  checkBreakthrough() {
    const life = this.state.life;
    if (life.realm === 'fan' && life.xiwei >= 100) {
      life.realm = 'lianqi'; life.realmStage = 0;
      life.lifespanMax = Math.max(life.lifespanMax || 0, lifespanFor('lianqi', this.rng));
      this.say(`【破境】${this.rng.pick(BREAKTHROUGH_TEXT.lianqi)}`, 'system');
      this.book('记', '练气入体，踏入修行之门');
    } else if (life.realm === 'lianqi' && life.xiwei >= 300) {
      const node = nodes[life.location.node];
      const hasOpportunity = node.tags?.includes('lingdi') || life.flags.leiyu_wu || life.flags.moza_seed || (life.corruption || 0) > 0;
      if (hasOpportunity) {
        life.realm = 'zhuji'; life.realmStage = 0;
        life.lifespanMax = Math.max(life.lifespanMax || 0, lifespanFor('zhuji', this.rng));
        this.say(`【破境】${this.rng.pick(BREAKTHROUGH_TEXT.zhuji)}`, 'system');
        this.book('记', '筑基功成，初尝长生');
      } else {
        this.say('（你行功至圆满处，气机却像撞上了一层看不见的膜——差一样东西。是什么，你说不上来。也许要一场雷雨，也许要一处灵地，也许要一个契机。）', 'system');
      }
    } else if (life.realm === 'zhuji' && life.xiwei >= 600) {
      // 金丹契机在海底（GDD：契机把人拽向未知）
      const node = nodes[life.location.node];
      const haiDi = node.tags?.includes('undersea') || node.id === 'lg_huilang' || node.id === 'lg_gongmen';
      if (haiDi) {
        life.realm = 'jindan'; life.realmStage = 0;
        life.lifespanMax = Math.max(life.lifespanMax || 0, lifespanFor('jindan', this.rng));
        this.say(`【破境】${this.rng.pick(BREAKTHROUGH_TEXT.jindan)}`, 'system');
        this.book('记', '海底灵眼静坐，金丹天成——一郡活神仙');
      } else {
        this.say('（丹田的气机鼓荡如潮，可就是凝不成那个"圆"。夜里你做梦，梦见一片海——静得能听见心跳的海。也许丹要"静"出来，而不是炼出来。海底……有人说，金丹契机在海底。）', 'system');
      }
    } else if (life.realm === 'jindan' && life.xiwei >= 1200) {
      // 元婴契机：望仙崖仙山现影（或崖边观想有缘）
      const node = nodes[life.location.node];
      const xianYuan = life.flags.xianshan_xianying || node.id === 'qd_wangxianya';
      if (xianYuan) {
        life.realm = 'yuanying'; life.realmStage = 0;
        life.lifespanMax = Math.max(life.lifespanMax || 0, lifespanFor('yuanying', this.rng));
        this.say(`【破境】${this.rng.pick(BREAKTHROUGH_TEXT.yuanying)}`, 'system');
        this.book('记', '望仙崖上元婴出窍——甲子从此如一瞬');
      } else {
        this.say('（你的金丹已圆满如镜，镜里却总照见一线青山——海天相接处那座"看不见的山"。老人们说，望仙崖上望得见仙山现影的人，才有资格问"下一步"。）', 'system');
      }
    } else if (life.realm === 'yuanying' && life.xiwei >= 2400) {
      // 化神契机：仙山（昆仑墟/蜀山/蓬莱）古仙气机灌体（GDD：化神通仙界）
      const node = nodes[life.location.node];
      const xianShan = node.tags?.includes('xianshan') || ['kx_tianjie', 'kx_yuxu', 'ss_shanmen', 'ss_jianzheng', 'pl_dukou', 'pl_xianshi', 'pl_jiefeng'].includes(node.id);
      if (xianShan) {
        life.realm = 'huashen'; life.realmStage = 0;
        life.lifespanMax = Math.max(life.lifespanMax || 0, lifespanFor('huashen', this.rng));
        this.say(`【破境】${this.rng.pick(BREAKTHROUGH_TEXT.huashen)}`, 'system');
        this.book('记', '仙山之上化神——一念之间，神游万里');
      } else {
        this.say('（你的元婴在识海里徘徊——它已经太久没遇到对手了。它总朝一个方向"看"：断壁、剑痕、云海、仙市。老话说，化神要借古仙的气机——昆仑墟、蜀山、蓬莱，三处仙山，任一处都行。）', 'system');
      }
    } else if (life.realm === 'huashen' && life.xiwei >= 4800) {
      // 炼虚契机：玉虚宫残殿（古仙遗泽）或妖渊中层（化于至暗）
      const node = nodes[life.location.node];
      const lianXuDi = node.id === 'kx_yuxu' || node.id === 'yy_zhongceng';
      if (lianXuDi) {
        life.realm = 'lianxu'; life.realmStage = 0;
        life.lifespanMax = Math.max(life.lifespanMax || 0, lifespanFor('lianxu', this.rng));
        this.say(`【破境】${this.rng.pick(BREAKTHROUGH_TEXT.lianxu)}`, 'system');
        this.book('记', '炼虚合道——肉身轻了一半，天地重了一半');
      } else {
        this.say('（你试着往"内里"去——去了很远，远到忘了肉身。可每次都差一线：差一处足够"深"的地方。昆仑墟的残殿里有位断臂神像；深海妖渊的中层黑得能化掉一切。炼虚，要把自己交给一样比你老得多、深得多的东西。）', 'system');
      }
    } else if (life.realm === 'lianxu' && life.xiwei >= 8000) {
      // 合体契机：蓬莱劫峰——天劫"对表"
      const node = nodes[life.location.node];
      if (node.id === 'pl_jiefeng') {
        life.realm = 'heti'; life.realmStage = 0;
        life.lifespanMax = Math.max(life.lifespanMax || 0, lifespanFor('heti', this.rng));
        this.say(`【破境】${this.rng.pick(BREAKTHROUGH_TEXT.heti)}`, 'system');
        this.book('记', '劫峰对表，合体功成——肉身法体天地，自此一处');
      } else {
        this.say('（你的修为已经到了"天地愿意搭理你"的地步——可天地还没搭理你。差的不是功，是一场合面的话。蓬莱劫峰，天劫在那里"对表"：把你的时辰，和天地的时辰，对到同一个刻度上。）', 'system');
      }
    } else if (life.realm === 'heti' && life.xiwei >= 12000) {
      // 大乘契机：劫峰坐观，且五脉至少通两脉（GDD：旁支五脉为大道佐证）
      const node = nodes[life.location.node];
      const maiCount = ['yao', 'mo', 'fo', 'ti', 'jian'].filter(m => life.gongfa.some(g => g.mai === m)).length;
      if (node.id === 'pl_jiefeng' && maiCount >= 2) {
        life.realm = 'dacheng'; life.realmStage = 0;
        life.lifespanMax = Math.max(life.lifespanMax || 0, lifespanFor('dacheng', this.rng));
        this.say(`【破境】${this.rng.pick(BREAKTHROUGH_TEXT.dacheng)}`, 'system');
        this.book('记', '大乘——路走到头了，可天地没有头');
      } else if (node.id === 'pl_jiefeng') {
        this.say('（你坐在劫峰上，看云。云不是云，是天地在呼吸——你已经摸到大乘的边了。可你心里知道还差着什么：大道走的是正途，可"证道"要有旁证。妖、魔、佛、体、剑——五脉里，你至少得真通两脉，才算把"道"走成了自己的。）', 'system');
      } else {
        this.say('（你的修为已满，可"满"和"成"之间隔着一场对话——和天地的对话。那场对话只在蓬莱劫峰进行。另外，去把五脉里的至少两脉走通。大道为体，五脉为证。）', 'system');
      }
    } else if (life.realm === 'dacheng' && life.xiwei >= 18000) {
      // 渡劫契机：劫峰 + 五脉证道（三脉），第九道雷后面是"门"
      const node = nodes[life.location.node];
      const maiCount = ['yao', 'mo', 'fo', 'ti', 'jian'].filter(m => life.gongfa.some(g => g.mai === m)).length;
      if (node.id === 'pl_jiefeng' && maiCount >= 3) {
        life.realm = 'dujie'; life.realmStage = 0;
        life.lifespanMax = Math.max(life.lifespanMax || 0, lifespanFor('dujie', this.rng));
        this.say(`【破境】${this.rng.pick(BREAKTHROUGH_TEXT.dujie)}`, 'system');
        this.book('记', '渡劫——第九道雷后面，是一扇门');
      } else if (node.id === 'pl_jiefeng') {
        this.say('（劫云在你头顶聚而不落——天在等你把"证"凑齐。五脉证道：妖、魔、佛、体、剑，至少三脉，天劫才肯为你开门。这是最后一步了。）', 'system');
      } else {
        this.say('（你已是大乘——这世上的路，就剩最后一段了。去蓬莱劫峰。带上你的"证"：妖、魔、佛、体、剑，五脉至少三脉。第九道雷的后面，是一扇门。）', 'system');
      }
    } else if (life.realm === 'dujie' && life.xiwei >= 24000) {
      // 真仙：南天门验籍入仙籍（蓝图 §五：新仙入天的第一站）
      if (life.location.node === 'xj_nantianmen') {
        life.realm = 'zhenxian'; life.realmStage = 0;
        life.lifespanMax = Math.max(life.lifespanMax || 0, lifespanFor('zhenxian', this.rng));
        this.say('【破境】验籍灵官在你的名字下落了一笔朱砂。"从今日起，寿数归天条管。"你抬头看天——天还是那个天，但从今往后，你在天的里面。', 'system');
        this.book('记', '南天门入仙籍——真仙');
      } else {
        this.say('（你的修为满了。可仙籍无名，天条不认——去南天门，找验籍灵官把名字落上去。排队的都是刚成仙的，个个以为自己到头了。）', 'system');
      }
    } else if (life.realm === 'zhenxian' && life.xiwei >= 40000) {
      // 金仙：瑶池借蟠桃气机
      if (life.location.node === 'xj_yaochi') {
        life.realm = 'jinxian'; life.realmStage = 0;
        life.lifespanMax = Math.max(life.lifespanMax || 0, lifespanFor('jinxian', this.rng));
        this.say('【破境】瑶池的水汽浸了七日，第七日，你的仙躯换了一遍底子。【金仙】——自此斩却尘尾，寿以万计。', 'system');
        this.book('记', '瑶池濯体——金仙');
      } else {
        this.say('（真仙与金仙之间隔着一层"尘"。洗尘的水，只在瑶池。宴女们不肯说破的那一瓢，你得自己去讨。）', 'system');
      }
    } else if (life.realm === 'jinxian' && life.xiwei >= 70000) {
      // 太乙：司命殿生死簿上领一笔
      if (life.location.node === 'xj_yashu') {
        life.realm = 'taiyi'; life.realmStage = 0;
        life.lifespanMax = Math.max(life.lifespanMax || 0, lifespanFor('taiyi', this.rng));
        this.say('【破境】执笔星官在生死簿上你的名字旁添了一个数，又把数划掉。"太乙之数，不在簿上。"——自此三灾九难，簿子里管不着你。', 'system');
        this.book('记', '生死簿销名——太乙');
      } else {
        this.say('（金仙圆满了。可"太乙"是要在生死簿上销名的——那本簿子锁在天庭衙署司命殿。去跟星官把这笔账清了。）', 'system');
      }
    } else if (life.realm === 'taiyi' && life.xiwei >= 120000) {
      // 大罗：仙界三重之间（南天门/衙署/瑶池任一处悟"过去现在未来三身"）
      if (['xj_nantianmen', 'xj_yashu', 'xj_yaochi'].includes(life.location.node)) {
        life.realm = 'daluo'; life.realmStage = 0;
        life.lifespanMax = Math.max(life.lifespanMax || 0, lifespanFor('daluo', this.rng));
        this.say('【破境】你在云上坐了很久。久到看见了三个自己——过去的、现在的、将来的，同时坐在同一朵云上。【大罗】——跳出三界外，不在五行中。', 'system');
        this.book('记', '三身同坐——大罗');
      } else {
        this.say('（太乙往上，修的不再是"命"，是"身"——过去身、现在身、未来身，三身合一方成大罗。去仙界人烟处坐着：云上无岁月，坐着坐着，你会看见三个自己。）', 'system');
      }
    } else if (life.realm === 'daluo' && life.xiwei >= 200000) {
      // 道尊：魔渊对岸——借"对立面"照见自己
      if (life.location.node === 'xj_moyuan') {
        life.realm = 'daozun'; life.realmStage = 0;
        life.lifespanMax = Math.max(life.lifespanMax || 0, lifespanFor('daozun', this.rng));
        this.say('【破境】你在魔渊边站了不知多少年。渊底的黑一点点漫上来，漫到你脚边，停了——它认得你，却吞不下你。【道尊】——道成敌手，渊静三千年。', 'system');
        this.book('记', '魔渊对岸立道——道尊');
      } else {
        this.say('（大罗之上是道尊。道尊之道，要借"对立面"来立——仙界最深的对立面，在渊冥的魔渊边上。去那儿站一站：能被你照见的黑，才配做你的镜子。）', 'system');
      }
    } else if (life.realm === 'daozun' && life.xiwei >= 320000) {
      // 道祖之途：天外混沌只给钩子，不给终点（蓝图 §七：永远只给下一步）
      if (life.location.node === 'xj_hundun') {
        this.say('（天梯的尽头，风声大得像海。你把毕生之道推了出去——风把"道"接住了，却没有还给你。混沌深处有个声音，很旧，很累："还不到时候。圣人的战场，没有扫干净的地，不放人进来。"你退回梯口。风声在你背后，久久不停。道祖之途——还欠一个"时机"。）', 'system');
        this.book('记', '天梯尽头闻圣人战场回音——道祖之途未开');
      } else {
        this.say('（道尊圆满。道祖之上，只剩一个方向——天外混沌。九重之上天梯口，风声日夜不停。老人们说，那风声都是圣人战场的回音。）', 'system');
      }
    }
  }

  doPractice() {
    const life = this.state.life;
    this.advanceTime(1);
    if (!this.state.alive) return;
    const hasWugong = life.gongfa.some(g => g.realm === 'wudao' || g.id.includes('quan') || g.id.includes('jian'));
    let gain = hasWugong ? 6 + life.dims.gengu / 25 : 3 + life.dims.gengu / 30;
    // 剑修（GDD：攻高命薄）——剑诀佐拳脚，进境倍增，气血相抵
    if (life.gongfa.some(g => g.mai === 'jian')) {
      gain *= 2;
      life.hp = Math.max(1, life.hp - 4);
    }
    life.wugongXiuwei += Math.round(gain);
    this.say(this.rng.pick([
      '你练了一趟功夫。拳脚生风，收势时呼吸绵长——有进步，虽然看不见，但腿肚子知道。',
      '你把会的招式从头走了一遍。慢的是根基，快的是招——今日练的是慢的那部分。',
      '练完收功，你在原地站了一会儿，听自己的喘息平下去。这声音，一年比一年稳。',
    ]), 'scene');
    // 武道品级推进（GDD §6.1：后天九品→先天→宗师→大宗师→破碎虚空）
    this.checkWudaoRank();
  }

  checkWudaoRank() {
    const life = this.state.life;
    if (life.realm !== 'fan' && life.realm !== 'wudao') return; // 仙修不并轨
    // 连跳：修为可能一次跨过多品
    for (;;) {
      const curIdx = life.wudaoRank == null ? -1 : WUDAO_THRESHOLDS.findIndex(t => t.rank === life.wudaoRank);
      const next = WUDAO_THRESHOLDS[curIdx + 1];
      if (!next || life.wugongXiuwei < next.at) return;
      life.wudaoRank = next.rank;
      if (next.rank === -3) {
        // 破碎虚空：武道道成，跳出轮回（不入幽冥）
        this.say('【破碎虚空】你把最后一式使完，四下忽然静了。身周的空气薄得像纸——一拳递出，纸破了。纸那边有风，风里有很旧的战场声。你没有回头。（武道至极，亦可道成。）', 'system');
        this.book('记', '破碎虚空——武道道成');
        return this.die('daocheng', '你于拳意尽头打破虚空。肉身留在了原地，你——去了别处。');
      }
      if (next.rank === 0) {
        life.realm = 'wudao';
        life.lifespanMax = Math.max(life.lifespanMax || 0, lifespanFor('wudao', this.rng));
        this.say('【先天】那一日你收势站定，忽然听见了自己的心跳——不是耳朵听见的，是天地替你听见的。气血如龙，寿增三十。（武道先天：这一品的门槛，多少人一辈子没摸到。）', 'system');
        this.book('记', '武道先天——气血如龙');
        continue;
      }
      if (next.rank === -1) this.say('【宗师】江湖上开始有人专程来求你出手。你收徒、立规矩、把"打"变成了"道"。宗师——武道这条路，你走成了别人的路标。', 'system');
      else if (next.rank === -2) this.say('【大宗师】天下能与你论武的人，一只手数得过来。夜深人静你偶尔会想：宗师再往上，是什么？（风里隐约有传说：破碎虚空。）', 'system');
      else this.say(`【武道精进】${wudaoRankName(next.rank)}——这一品，是一拳一拳打熬出来的。江湖人看你的眼神，变了。`, 'system');
      if (next.rank === 1) {
        life.lifespanMax = Math.max(life.lifespanMax || 0, 90);
        this.say('（后天一品到头了。再往上便是"先天"——先天者气血如龙，寿增三十。你摸到了那道门槛的边。）', 'system');
      }
    }
  }

  doRest() {
    const life = this.state.life;
    this.advanceTime(4);
    if (!this.state.alive) return;
    const healed = Math.min(life.maxHp - life.hp, 25 + life.dims.gengu / 10);
    life.hp += healed;
    if (life.injury) {
      for (const k of Object.keys(life.injury)) { life.injury[k]--; if (life.injury[k] <= 0) delete life.injury[k]; }
      if (!Object.keys(life.injury).length) life.injury = null;
    }
    this.say(this.rng.pick([
      '你睡了一个踏实觉。醒来时窗纸发白，昨日的疲惫像潮水退去。',
      '你将养了一日。伤处还钝钝地疼，但疼得有规律了——那是在好。',
      '一夜无梦。醒来时你听见自己在打坐前听不见的声音：鸟叫，和自己的气血。',
    ]), 'scene');
  }

  doWork() {
    const life = this.state.life;
    const node = nodes[life.location.node];
    this.advanceTime(2);
    if (!this.state.alive) return;
    // 江湖百业（四期）：节点有在业者，接该业的活——业有行话、有滋味、有入行账
    const jobId = jobAt(node.id);
    if (jobId) {
      const job = JOBS10[jobId];
      this.applyEffect(job.effect, 'job');
      if (!this.state.alive) return;
      this.say(this.rng.pick(job.flavor), 'scene');
      if (!life.jobs?.includes(jobId)) {
        life.jobs = life.jobs || [];
        life.jobs.push(jobId);
        this.book('记', job.ledgerText);
      }
    } else if (node.tags?.includes('docks') || node.tags?.includes('market') || node.tags?.includes('slum') || node.tags?.includes('village')) {
      life.money += 2;
      this.say('你寻了半日的活计。汗流进眼睛里，手上的茧又厚了一层——赚了两吊钱，晚饭有了着落。', 'scene');
    } else {
      this.say('此地没有合适的活计。你转了一圈，又转回来。', 'echo');
      return;
    }
    this.rollNodeEvents(node, 0.3);
  }

  doBuy(slots, norm) {
    const life = this.state.life;
    const node = nodes[life.location.node];
    const isMarket = node.tags?.includes('market') || node.tags?.includes('hub');
    if (!isMarket) return this.say('这里没得卖。要去有市集的地方。', 'echo');
    if (/酒|吃|食|饭/.test(norm)) return this.doEat();
    const price = this.rng.int(1, 5);
    if (life.money < price) return this.say(this.rng.pick(ECHOES.buy_noMoney), 'echo');
    life.money -= price;
    this.advanceTime(1);
    this.say(`你置办了些用度——盘缠紧了些，但也踏实了。日子就是这样过出来的。`, 'scene');
  }

  doEat() {
    const life = this.state.life;
    if (life.money < 1) return this.say(this.rng.pick(ECHOES.eat_noMoney), 'echo');
    life.money -= 1;
    this.advanceTime(1);
    this.say('你寻了个摊子坐下。热汤面下肚，从喉咙一路暖到胃里——紧要关头的一碗热汤面，顶得上半部功法。', 'scene');
  }

  doWander() {
    const node = nodes[this.state.life.location.node];
    this.advanceTime(1);
    if (!this.state.alive) return;
    this.say(this.rng.pick([
      '你信步走了一段。不为什么，就是走走——江湖里的人，闲下来的时候反而最像个人。',
      '你把这条街慢慢走了一遍。铺子的招牌、人的脸色、地上的车辙——都看在眼里，收进心里。',
      '你消磨了半日。日子有时候就该这么浪费——浪费得起，才是活得好。',
    ]), 'scene');
    this.rollNodeEvents(node, 0.35);
  }

  doFeed() {
    const r = feedMount(this);
    this.say(r.text, 'scene');
    this.advanceTime(1);
  }

  doBeastBook(p) {
    // 只有「妖兽卷/图鉴」词才进妖兽卷，普通袖中录词仍走回声兜底
    if (!/妖兽卷|图鉴/.test(p?.normalized || '')) return this.doEcho('generic', p);
    const life = this.state.life;
    const book = life.beastBook || [];
    if (!book.length) {
      this.say('（妖兽卷还是空页。老猎户说：认兽先认名，认名不结仇——你遇见的"有名字的缘分"还不多。）', 'scene');
      return;
    }
    const lines = book.map(id => {
      const b = BEASTS[id];
      return `·${b ? b.name : id}——${b ? b.intro : '（闻其名，未见其形。）'}`;
    });
    if (life.mount) {
      const lvl = xunLevelOf(life.mount.xun);
      const yrs = life.mount.years || 0;
      const span = lifespanOf(life.mount.id);
      lines.push(`·【伙伴】${life.mount.name}——${life.mount.desc}（${lvl.name}：${lvl.text}）${yrs ? `（随你${yrs}年${yrs > span - 3 ? '，它老了' : ''}）` : ''}`);
    }
    for (const eg of life.eggs || []) {
      const egg = BEAST_EGGS.find(e => e.id === eg.eggId);
      if (egg) lines.push(`·【怀中卵】${egg.name}——焐了${eg.progress}回。${egg.hint}`);
    }
    this.say('【妖兽卷】\n' + lines.join('\n'), 'scene');
  }

  doCraftRequest() {
    const life = this.state.life;
    const node = nodes[life.location.node];
    if (life.location.city !== 'kunwu') {
      this.say('（炼器这门手艺，天下只认一处火——昆吾剑炉街。好料要认好火。）', 'echo');
      return;
    }
    for (const recipe of CRAFT_RECIPES) {
      const chk = canCraft(this, recipe);
      if (chk.ok) {
        const r = doCraft(this, recipe);
        if (r.ok) { this.say(r.text, 'event'); this.say(`（你得了【${r.item.name}】。${r.item.desc || ''}）`, 'item'); this.advanceTime(2); return; }
      }
    }
    this.say('（老师傅接过你的行囊翻了一遍，摇头："料不够。我这炉子认料不认钱——妖兽的材料、海底的鳞、深山的寒髓……凑齐了再来。"）', 'echo');
  }

  doWait() {
    this.advanceTime(4);
    if (!this.state.alive) return;
    this.say('你住了下来，消磨了几日。江湖不追人，人却总被江湖追——歇够了，该动身了。', 'scene');
  }

  // ---------- 门派（P3-4 拜师系统） ----------
  sceneNode() { return nodes[this.state.life.location.node]; }

  doBaishi(slots) {
    const node = this.sceneNode();
    const life = this.state.life;
    if (life.sect) {
      const cur = sectOf(this.state);
      return this.say(`你已身在${cur.name}门下。江湖规矩：师门是一世的债，也是一世的靠。`, 'scene');
    }
    // 就近找门派：所在节点是某派山门，或话头提到某派
    const sect = Object.values(SECTS).find(s => s.node === node.id)
      || (slots?.topic && Object.values(SECTS).find(s => (slots.topic || '').includes(s.name.slice(0, 2))));
    if (!sect) {
      return this.say(this.rng.pick(ECHOES.baishi_noSect || ['这里没有可以拜的山门。修行人的门墙，不在闹市里。']), 'scene');
    }
    if (this.state.world.deadNpcs.includes(sect.masterNpc)) {
      return this.say(`（${sect.name}的师尊已不在了。山门还在，功课还在——只是收人的事，得等新掌门定。）`, 'scene');
    }
    // 拜师考验事件
    const ev = EVENTS[sect.kaoyanEvent];
    if (!ev) return this.say(`${sect.name}的山门就在眼前，但收不收你，得看缘分。（考验未启，稍后再来。）`, 'scene');
    this.fireEvent(ev);
  }

  doDuty() {
    this.advanceTime(1);
    if (!this.state.alive) return;
    const r = sectDuty(this);
    this.say(r.text, r.ok ? 'scene' : 'ambient');
    if (r.ok) this.rollNodeEvents(this.sceneNode(), 0.2);
  }

  doLeaveSect() {
    const r = leaveSect(this);
    this.say(r.text, r.ok ? 'system' : 'ambient');
    return r;
  }

  doEquip(slots) {
    const life = this.state.life;
    const byName = (slots?.item) || slots?.topic || '';
    const cands = life.items.filter(i => i.kind === 'weapon' || i.kind === 'treasure');
    if (!cands.length) return this.say('你身上没有能用起来的家伙——空手走江湖的人也有，但多半走不远。', 'scene');
    let it = cands.find(i => byName && (i.name.includes(byName) || byName.includes(i.name.slice(-1))));
    if (!it) it = cands[cands.length - 1];
    equipItem(this, it.id);
  }

  // 七期：服用/使用——天材地宝按药性结算，其他器物转 equip
  doUse(slots) {
    const life = this.state.life;
    const byName = (slots?.item) || slots?.topic || '';
    const herbs = life.items.filter(i => i.kind === 'herb');
    if (herbs.length) {
      let it = byName
        ? herbs.find(i => i.name.includes(byName) || byName.includes(i.name))
        : herbs[0];
      if (!it && !byName) it = herbs[0];
      if (it) return useHerb(this, it);
    }
    // 没有可服的药——若有器物则转「用起来」，否则空手回声
    const cands = life.items.filter(i => i.kind === 'weapon' || i.kind === 'treasure');
    if (cands.length) return this.doEquip(slots);
    return this.say(byName
      ? `你翻遍袖中，没有「${byName}」这样能用的东西。`
      : '袖中暂无可服可用之物——空有念头，落不到手上。', 'echo');
  }

  // ---------- 易容化名 / 轻经营（06 册 B/E） ----------
  doAliasCmd(p, real) {
    const norm = (p.normalized || '').replace(/^(化名|易容|改名|以假名示人|以真名示人|恢复真名|洗去易容|报上|叫)/, '').replace(/[「」"'']/g, '').trim();
    if (real || (this.state.life.alias && !norm)) return doAlias(this, null);
    if (!norm || norm.length < 2 || norm.length > 6) return this.say('（化名要有名字——比方说："化名 青衫客"。两个字到六个字都行。）', 'echo');
    doAlias(this, norm);
  }

  doBusinessCmd(p) {
    const norm = p.normalized || '';
    const kind = Object.keys(BUSINESS_KINDS).find(k => norm.includes(BUSINESS_KINDS[k].name));
    if (!kind) return this.say('（盘什么？镖局、酒肆、当铺、医馆——说个明白，比方说："盘下酒肆"。）', 'echo');
    doBusiness(this, kind);
    joinGuild(this, kind); // 十三期：盘下生意即入行会（幂等：没盘成不会入）
  }

  // ---------- 题壁留世（06 册 C：题壁诗留在世界里） ----------
  doInscribe() {
    const life = this.state.life;
    const A = ['一剑霜寒十四州', '青山看惯故人稀', '江湖夜雨十年灯', '浪花淘尽英雄骨', '明月何曾是两乡', '风雪夜归人未老', '此身合是诗人未', '万里山河一局棋', '孤舟蓑笠钓斜阳', '血未冷时鬓未秋'];
    const B = ['且向山河问剑行', '不负如来不负卿', '回头已是百年身', '马蹄催得故园春', '落子无声局已残', '灯火阑珊是故乡', '何处秋风催客梦', '剑光如水人如旧', '半盏残茶话平生', '来生仍作放鹤人'];
    const text = this.rng.pick(A) + '，' + this.rng.pick(B) + '。';
    (this.state.world.wallPoems ||= []).push({ node: life.location.node, year: this.state.world.year, lifeName: life.name, text });
    this.say(`（你取笔蘸墨，就着斑驳墙面题下一句：「${text}」落款只留了名字。写完掷笔——诗留给墙，人还得赶路。或许几十年后，会有谁路过读到它。）`, 'ambient');
    this.advanceTime(1);
  }

  doListItems() {
    const life = this.state.life;
    if (!life.items.length) return this.say('你翻遍全身，家当少得可怜——穷有穷的轻省。', 'scene');
    const lines = life.items.map(i => {
      const mark = life.equipped === i.id ? '（正在用）' : '';
      return `【${i.name}】${mark}${i.desc ? ' ' + i.desc : ''}`;
    });
    const gf = life.gongfa.map(g => `功法·【${g.name}】${g.desc ? ' ' + g.desc : ''}`);
    const estate = [];
    if (life.home) estate.push(`居所·${life.home.kind === 'buy' ? '自宅' : '赁居'}于${life.home.place}（住到今年${this.state.world.year - life.home.since}年）${life.home.zhenwu ? `\n  镇物·【${life.home.zhenwu.name}】供在堂上` : ''}`);
    if (life.business) estate.push(`产业·${BUSINESS_KINDS[life.business.kind].name}（${life.business.place}）${life.business.guild ? `\n  行会·${life.business.guild.name}（${life.business.guild.rank}，会首${(GUILDS[life.business.guild.id] || {}).elder || '佚名'}）` : ''}`);
    if (life.foundedSect) estate.push(`山门·【${life.foundedSect.name}】`);
    if (life.alias) estate.push(`化名·"${life.alias}"行走中`);
    this.say('你把家当摊开盘点了一遍：\n' + [...lines, ...gf, ...estate].join('\n'), 'scene');
  }

  // ---------- 选项结算（事件/奇遇/人生节点）----------
  chooseOptionByLabel(label) {
    const map = { '一': 0, '二': 1, '三': 2, '四': 3, '五': 4, '六': 5, '1': 0, '2': 1, '3': 2, '4': 3, '5': 4, '6': 5 };
    this.chooseOption(map[label] ?? 0);
  }

  chooseOption(idx) {
    const p = this.pending;
    if (!p) return;
    const options = p.options || [];
    const opt = options[idx];
    if (!opt) return;
    if (p.type === 'event') return this.resolveEventOption(opt);
    if (p.type === 'adventure') return this.resolveAdventureOption(opt);
    if (p.type === 'lifenode') return this.resolveLifeNodeOption(opt);
  }

  resolveEventOption(opt) {
    const life = this.state.life;
    const p0 = this.pending; // 十六期：链上守卫的基准幕
    // 幽冥余程选项（不走常规效果管道）
    if (opt.nw) {
      if (opt.effect) this.applyEffect(opt.effect, 'event');
      if (opt.text_after) this.say(opt.text_after, 'event');
      if (opt.effect2?.karmicResolve) {
        const l = this.state.ledger.find(x => !x.resolved);
        if (l) { l.resolved = true; this.say(`（旧账册批注：【${l.type}】${l.text}——已了。）`, 'ledger'); }
      }
      if (opt.effect2?.karmicClear) {
        const l = this.state.ledger.find(x => x.type === '恩' && !x.resolved);
        if (l) l.resolved = true;
      }
      if (opt.effect2?.daiti) {
        const sha = this.state.ledger.find(x => x.type === '杀');
        if (sha) sha.resolved = true;
      }
      if (opt.nw.mengpo) {
        life.flags = life.flags || {};
        life.flags[opt.nw.mengpo === 'drink' ? 'mengpo_drunk' : 'mengpo_refused'] = true;
      }
      this.closePending();
      if (opt.nw.final) return this.nwFinal(opt.nw.final);
      return this.nwStep(opt.nw.goto);
    }
    // 一生的人际选项（06 册 A：设心境、落关系账）
    if (opt.rel) {
      if (opt.effect) this.applyEffect(opt.effect, 'event');
      if (!this.state.alive || this.pending !== p0) return; // 十六期：效果致死/引幽冥——旧链让位
      this.closePending();
      return applyRelChoice(this, opt.rel);
    }
    // 悬案断案选项（06 册 D：指认凶手）
    if (opt.casePick !== undefined && opt.caseRef) {
      this.closePending();
      return resolveCasePick(this, opt.casePick, opt.caseRef);
    }
    // 灵兽奇缘选项（07 册：救崽/托孤）
    if (opt.cub) {
      if (opt.effect) this.applyEffect(opt.effect, 'event');
      if (!this.state.alive || this.pending !== p0) return; // 十六期
      this.closePending();
      return resolveCubChoice(this, opt.cub);
    }
    // 寻龙点穴选项（十三期：古墓三母型结局）
    if (opt.tomb) {
      this.closePending();
      return resolveTombChoice(this, opt);
    }
    // 行规抉择选项（十三期：守规/坏规）
    if (opt.guildAct) {
      this.closePending();
      return resolveGuildRuleChoice(this, opt);
    }
    // 心魔劫选项（十四期：悬崖勒马/入魔）
    if (opt.mora) {
      this.closePending();
      return resolveMoraChoice(this, opt);
    }
    // 动态事件链（多幕事件：opt.next 挂下一幕）
    if (opt.next) {
      if (opt.effect) this.applyEffect(opt.effect, 'event');
      if (!this.state.alive || this.pending !== p0) return; // 十六期
      this.closePending();
      return this.fireEvent(opt.next);
    }
    // 前世主线选项（十八期：宿敌/托孤/守井人）
    if (opt.reline) {
      this.closePending();
      return resolveReincarnationChoice(this, opt);
    }
    // 金额/条件门槛
    if (opt.cond?.moneyMin && life.money < opt.cond.moneyMin) {
      this.say(this.rng.pick(ECHOES.buy_noMoney), 'echo');
      this.closePending();
      return;
    }
    if (opt.cond?.minWuxing && life.dims.wuxing < opt.cond.minWuxing) {
      this.say(opt.cond.deny || '（话到嘴边，你忽然觉得接不住——他问的东西，你还没到能答的年纪。回去再练练。）', 'echo');
      this.closePending();
      return;
    }
    if (opt.cond?.needFlags && !opt.cond.needFlags.every(f => life.flags[f])) {
      this.say(opt.cond.deny || '（这话现在说还早。你手里没有能证明自己的东西——先去做点让人记得住的事。）', 'echo');
      this.closePending();
      return;
    }
    // chance 二段裁决
    if (opt.chance !== undefined) {
      if (this.rng.chance(opt.chance)) {
        if (opt.success) {
          this.say(opt.success.text_after || '', 'event');
          if (opt.success.text_after) this.applyEffect(opt.success, 'event');
        } else if (opt.effect) this.applyEffect(opt.effect, 'event');
      } else {
        this.say(opt.fail?.text_after || '', 'event');
        if (opt.fail?.ledger) this.applyEffect(opt.fail, 'event');
        if (opt.fail?.flags) this.applyEffect(opt.fail, 'event');
      }
    } else {
      if (opt.effect) this.applyEffect(opt.effect, 'event');
      if (opt.text_after) this.say(opt.text_after, 'event');
      if (opt.win?.minghao) this.applyEffect(opt.win, 'event');
    }
    if (!this.state.alive || this.pending !== p0) return; // 十六期：效果致死/引幽冥——旧链让位
    if (opt.sleeve_add) this.applyEffect(opt, 'event');
    if (opt.combat) {
      this.pending = { type: 'combat', fromEvent: true };
      this.startCombat(opt.combat, { fromEvent: true });
      return;
    }
    if (opt.trigger && ADVENTURES[opt.trigger.replace('adv_', 'adv_')]) {
      // 事件转奇遇
      this.closePending();
      this.startAdventure(opt.trigger);
      return;
    }
    if (!this.state.alive) return;
    this.closePending();
  }

  resolveAdventureOption(opt) {
    const p = this.pending;
    if (opt.combat) {
      // 战斗中转：保留奇遇上下文
      const advId = this.pending.id;
      this.startCombat(opt.combat, { fromAdventure: true, winStage: opt.win_goto, loseEnd: opt.lose_end, advId });
      return;
    }
    if (opt.effect) {
      this.applyEffect(opt.effect, 'adventure');
      if (!this.state.alive || this.pending !== p) return; // 十六期：效果致死/引幽冥——旧链让位
    }
    if (opt.goto !== undefined && !opt.end) { this.runAdventureStage(opt.goto); return; }
    if (opt.end) { this.runAdventureStage('done'); return; }
    this.runAdventureStage(typeof p.stage === 'number' ? p.stage + 1 : p.stage);
  }

  resolveLifeNodeOption(opt) {
    this.applyEffect(opt.effect || {}, 'lifenode');
    if (opt.effect?.gongfa) {
      const g = opt.effect.gongfa;
      if (!this.state.life.gongfa.some(x => x.id === g.id)) this.state.life.gongfa.push(g);
    }
    if (opt.effect?.move) this.enterNode(opt.effect.move.node, { skipCost: false });
    if (opt.effect?.stat) this.applyEffect(opt.effect, 'lifenode');
    this.closePending();
  }

  // 人生节点检查（每年岁末触发）
  checkLifeNodes() {
    const life = this.state.life;
    const done = life.flags.doneLifeNodes || (life.flags.doneLifeNodes = []);
    for (const ln of Object.values(LIFE_NODES)) {
      if (done.includes(ln.id)) continue;
      if (life.age >= ln.triggerAge) {
        done.push(ln.id);
        this.ui.mode = 'lifenode';
        this.pending = { type: 'lifenode', ln };
        this.say(`【人生节点·${ln.title}】\n${ln.text}`, 'event');
        return true;
      }
    }
    return false;
  }

  // ---------- 袖中录 ----------
  getSleeve() {
    return {
      places: [...new Set(this.state.sleeve.places)],
      people: Object.values(this.state.sleeve.people),
      ledger: this.state.ledger.slice().reverse(),
      xinglu: this.state.sleeve.xingluZhi,
      miwen: this.state.sleeve.miwen || [],
      daozang: this.state.sleeve.daozang || [],
      shanhe: this.state.sleeve.shanhe || [],
      beasts: (this.state.life.beastBook || []).map(id => BEASTS[id]?.name || id),
      items: (this.state.life.items || []).map(i => ({
        id: i.id, name: i.name, kind: i.kind,
        desc: i.desc || '',
        equipped: this.state.life.equipped === i.id,
        herb: i.kind === 'herb', named: !!i.named,
      })),
    };
  }

  // ---------- 问天（指路不牵手）----------
  askHeaven() {    const s = this.currentScene();
    const life = this.state.life;
    const realmText = life.realm === 'fan'
      ? `你尚未入修行之门。${life.xiwei > 40 ? '不过你近来打坐时，指尖偶尔会发麻——那是"气"在敲门了。' : '气感一事，讲究机缘与静心。'}`
      : `${REALMS[life.realm].name}${STAGES[life.realmStage]}境。${life.realm === 'lianqi' && life.xiwei < 300 ? '距离下一步，还差着一段水磨的功夫。' : life.realm === 'lianqi' ? '你隐约摸到了下一层的门槛——差一个契机。' : ''}`;
    return {
      jingdi: `你此刻在【${s.city.name}·${s.area.name}·${s.node.name}】。${s.time}。`,
      kewei: '眼下的路：\n' + s.huatou.slice(0, 6).map(h => '· ' + h).join('\n'),
      xiuxing: realmText,
      guangyin: `今年是这世上的第${this.state.world.year}个年头，你${life.age}岁。`,
    };
  }

  // ---------- 二十一期修 A：问天落卷轴（四段指路，不烧时间） ----------
  doAskHeaven() {
    const s = this.currentScene();
    const life = this.state.life;
    const a = this.askHeaven();
    const hl = HIDDEN_LINES[life.flags.hiddenLine];
    const xinshi = (hl && !(life.flags.doneEvents || []).includes(hl.hook)) ? `\n心里搁着一桩事：${hl.title}。` : '';
    this.say(`【问天】\n${a.jingdi}${xinshi}\n${a.kewei}\n${a.xiuxing}\n${a.guangyin}\n（路要自己走，天只指个方向。）`, 'system');
  }

  // ---------- 二十一期修 F：眼下栏数据源（UI 单一取数口） ----------
  eyeNow() {
    const life = this.state.life;
    const hl = HIDDEN_LINES[life.flags.hiddenLine];
    const done = hl && (life.flags.doneEvents || []).includes(hl.hook);
    return {
      xinshi: hl && !done ? { id: hl.id, title: hl.title } : null,
      realmWord: life.realm === 'fan' ? (life.xiwei > 40 ? '气感将临' : '未入修行') : `${REALMS[life.realm].name}${STAGES[life.realmStage]}境`,
    };
  }

  // ---------- 二十一期修 C：琢磨心事（暗线钩子→动作的翻译层） ----------
  doPonder() {
    const life = this.state.life;
    const hl = HIDDEN_LINES[life.flags.hiddenLine];
    if (!hl) return this.doEcho('generic', { normalized: '想想' });
    const done = (life.flags.doneEvents || []).includes(hl.hook);
    if (done) {
      this.say(`（${hl.title}——这桩心事，了了。再想起来的时候，像在看别人的故事。）`, 'ambient');
      return;
    }
    const ev = EVENTS[hl.hook];
    const nodeName = ev?.nodes?.length ? nodes[ev.nodes[0]]?.name : null;
    this.say(`（心里搁着的事——【${hl.title}】${hl.hint}${nodeName ? `\n你琢磨了半天，觉得这事得到${nodeName}走一趟才有下文。` : ''}）`, 'system');
    this.advanceTime(1);
  }
}
