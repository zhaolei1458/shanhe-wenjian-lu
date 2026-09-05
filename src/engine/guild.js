// ============================================================
// 山河问剑录 · 引擎/百业行会十三期（06 册 B 类收尾：百业深化）
// joinGuild（盘下生意自动入会）/ guildYearTick（年会/晋身/同业恩怨/行规抉择）
// guildVerdictLines（判词收束）
// 红线不变：行会是"一串人物与事件"，会首与行册先于账目。
// ============================================================
import { GUILDS, GUILD_RULE_EVENT } from '../content/guilds.js';

// ---------- 入会（doBusiness 成功后调用） ----------
export function joinGuild(game, kind) {
  const life = game.state.life;
  const biz = life.business;
  if (!biz || biz.kind !== kind || biz.guild) return; // 幂等：没盘成/已入会则不动
  const g = GUILDS[kind];
  if (!g) return;
  biz.guild = { id: kind, name: g.name, since: game.state.world.year, rank: '伙计', brokeRules: 0 };
  game.say(g.join(g.elder), 'event');
  game.book('喜', `入${g.name}行册（会首${g.elder}收帖）`);
}

// ---------- 行会年轮（advanceBusiness 之后调用） ----------
export function guildYearTick(game) {
  const life = game.state.life;
  const biz = life.business;
  if (!biz || !biz.guild) return;
  const g = GUILDS[biz.guild.id];
  if (!g) return;
  const year = game.state.world.year;
  const yrs = year - biz.guild.since;
  // 测试钩子：强触发行规抉择（正常流程 12% 掷签）
  const forceRule = life.flags.__forceGuildRule;
  if (forceRule) {
    life.flags.__forceGuildRule = false;
    const rule0 = game.rng.pick(g.rules);
    game.fireEvent({
      id: 'guildrule_' + biz.guild.id + '_' + year + '_f',
      title: g.name + '·行规抉择',
      text: GUILD_RULE_EVENT.intro(g, g.elder, rule0),
      options: [
        { label: '守行规——推了这单生意', guildAct: 'obey', guildRef: g, guildRule: rule0 },
        { label: '接了——规矩是死的，人是活的', guildAct: 'break', guildRef: g, guildRule: rule0 },
      ],
    });
    return;
  }
  // 晋身（5 年老人 / 10 年行尊）
  const up = g.rankUp[yrs];
  if (up) {
    if (yrs === 5 && biz.guild.rank === '伙计') { biz.guild.rank = '老人'; game.say(up.replace(/\$\{e\}/g, g.elder), 'event'); }
    else if (yrs === 10 && biz.guild.rank === '老人') { biz.guild.rank = '行尊'; game.say(up.replace(/\$\{e\}/g, g.elder), 'event'); }
  }
  // 行会年会：每三年一轮（会规：走镖行冬至封刀/酒行清明祭祖/当行腊月封账/药行义诊日）
  if ((yrs > 0 && yrs % 3 === 0) && game.rng.chance(0.8)) {
    game.say(game.rng.pick(g.meetings).replace(/\$\{e\}/g, g.elder), 'event');
    if (game.rng.chance(0.35)) { life.money += 2; game.say(`（年会散场，${g.short}的人脉替你引了一桩好生意——顺手赚了两贯。行册上的名字，原来也是本钱。）`, 'event'); }
  }
  // 同业恩怨（40%）与行规抉择（12% 或强触发）
  else if (game.rng.chance(0.4)) {
    game.say(game.rng.pick(g.feuds).replace(/\$\{e\}/g, g.elder), 'event');
  } else if (forceRule || game.rng.chance(0.12)) {
    life.flags.__forceGuildRule = false;
    const rule = game.rng.pick(g.rules);
    game.fireEvent({
      id: 'guildrule_' + biz.guild.id + '_' + year,
      title: g.name + '·行规抉择',
      text: GUILD_RULE_EVENT.intro(g, g.elder, rule),
      options: [
        { label: '守行规——推了这单生意', guildAct: 'obey', guildRef: g, guildRule: rule },
        { label: '接了——规矩是死的，人是活的', guildAct: 'break', guildRef: g, guildRule: rule },
      ],
    });
  }
}

// ---------- 行规抉择结算 ----------
export function resolveGuildRuleChoice(game, opt) {
  const life = game.state.life;
  const g = opt.guildRef;
  game.advanceTime(1);
  if (opt.guildAct === 'obey') {
    game.say(GUILD_RULE_EVENT.obey, 'event');
    game.book('善', `于${g.name}守行规「${opt.guildRule}」，拒了脏单`);
    life.flags.ruleKept = (life.flags.ruleKept || 0) + 1;
  } else {
    life.money += 15;
    life.business && life.business.guild && (life.business.guild.brokeRules++);
    game.say(GUILD_RULE_EVENT.break, 'event');
    game.book('怨', `坏了${g.name}的行规，红帖被会首抽扣`);
    life.flags.ruleBroken = (life.flags.ruleBroken || 0) + 1;
  }
}

// ---------- 判词收束（行会/行名） ----------
export function guildVerdictLines(state) {
  const life = state.life;
  const out = [];
  const biz = life.business;
  if (biz?.guild) {
    const g = GUILDS[biz.guild.id];
    if (g) {
      if (biz.guild.brokeRules) {
        out.push(`${g.name}的行册上，你的名字旁边画了一道墨杠——会首${g.elder}到死没把你的红帖还给你，也没销你的名。行里的账记得久，久到连你自己都拿不准，那算罚，还是算等。`);
      } else {
        out.push(`${g.name}的行册上，你的名字干干净净。${g.elder}在封行的年会上替你念了生平——念完把行册合上：「${g.short}的规矩，他一辈子没破过。」这句评语，比什么碑都经晒。`);
      }
    }
  }
  return out;
}
