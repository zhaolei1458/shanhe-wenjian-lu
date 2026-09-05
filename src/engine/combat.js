// ============================================================
// 山河问剑录 · 引擎/战斗系统
// 回合制骨架 × 自由指令之魂 × 一切结算藏在幕后（GDD §4.6）
// 结算五要素（引擎内部）：招式品阶 / 内力深浅 / 身法高低 / 伤势部位 / 临场意图
// 玩家看见的：招来招往与"左臂挂彩，刀握不稳"
// ============================================================

// 战斗模板（对局用例库的骨架）
export const COMBAT_TEMPLATES = {
  c_jianjing: {
    id: 'c_jianjing', name: '剪径强人', count: 1,
    intro: '为首的强人把刀抽了出来，刀背拍在掌心："识相的，留下买路钱。"',
    hp: 40, atk: 9, def: 4, spd: 6, style: 'oldhand', winMoney: 0,
    winText: '强人们抱头鼠窜。你把刀尖上的血在草叶上抹了抹——第一次见血的人手会抖，你的没抖（或者抖了，你握紧了些）。',
    loseText: null,
  },
  c_jinjun: {
    id: 'c_jinjun', name: '禁军', count: 2,
    intro: '两名禁军拔刀上前："宫城重地，胆敢放肆！"——这是不能打赢的架，也是不能打输的架。',
    hp: 50, atk: 10, def: 7, spd: 7, style: 'soldier', winMoney: 0,
    winText: '你击退了禁军——然后跑得比谁都快。此地不可久留，皇城的通缉画像，画师的手艺一向很好。',
    loseText: '你被按倒在宫墙根下。执事太监走过来，看了你很久："……关进慎刑司。"(此路收束。)',
  },
  c_gongtou_daren: {
    id: 'c_gongtou_daren', name: '工头及其打手', count: 1,
    intro: '工头把鞭子抽了出来，他的两个跟班围拢过来："哪来的愣头青，码头上的事也是你管的？"',
    hp: 35, atk: 8, def: 3, spd: 5, style: 'bully', winMoney: 0,
    winText: '工头趴在麻袋堆里。扛包的汉子们先是一静，随即爆出欢呼——有人把鞭子踩进了泥里。',
    loseText: '你被打倒在码头上，鼻血滴进河水。工头啐了一口："多管闲事。"（汉子们把你抬到背风处——他们记住了。）',
  },
  c_wuhang_bishi: {
    id: 'c_wuhang_bishi', name: '镖师（切磋）', count: 1,
    intro: '镖师抱拳："点到为止，手脚上见真章！"',
    hp: 45, atk: 9, def: 6, spd: 8, style: 'spar', winMoney: 5,
    winText: '你胜了半招。镖师一抱拳，心服口服："好功夫！这位朋友，可敢留个名号？"——武行街认下你了。',
    loseText: '你输了半招，输得干脆。镖师扶你一把："好底子，就是火候欠些——练吧，江湖不亏肯练的人。"',
  },
  c_heiquan: {
    id: 'c_heiquan', name: '黑拳对手', count: 1,
    intro: '上台。灯光刺眼，台下千百只眼睛盯着你。对面的赤膊汉子活动着脖颈，骨节咔咔作响。',
    hp: 55, atk: 11, def: 4, spd: 6, style: 'bully', winMoney: 5,
    winText: '对手倒下时，全场先是死寂，随即钞票和骂声一起飞上了台。掌柜的笑眯眯数钱给你："好拳。下回还来。"',
    loseText: '你被抬下台时天旋地转。掌柜的声音远远的："年轻人，拳场不养面子。"',
  },
  c_yanhui_choujia: {
    id: 'c_yanhui_choujia', name: '崖顶仇家', count: 2,
    intro: '两人从亭子里站起来，动作里全是老练。先开口那个笑："三日了，你还真爬上来了。"',
    hp: 60, atk: 12, def: 6, spd: 8, style: 'oldhand', winMoney: 10,
    winText: '你以伤胜敌——胜得狼狈，但胜了。两人丢下兵刃遁走前，为首的回头看了你一眼："记住你了。"（江湖上，被记住有两种下场。）',
    loseText: null,
  },
  c_shouwei: {
    id: 'c_shouwei', name: '药人坊守卫', count: 1,
    intro: '守卫拔刀，眼神却直得吓人——他像一把钝了的刀，可钝刀也开得了膛。',
    hp: 45, atk: 10, def: 5, spd: 4, style: 'bully', winMoney: 0,
    winText: '守卫倒下前，眼神忽然清了一瞬，嘴唇动了动："……渠……第三块砖……"',
    loseText: '你被拖出后巷。坊主温和的声音在头顶响起："客官，夜闯民坊，不好看。念你不是本地人——滚吧。"（他放了你。为什么？）',
  },
  c_goubi_ren: {
    id: 'c_goubi_ren', name: '夜叩之人', count: 1,
    intro: '门开的瞬间，一道影子欺身而进——快，而且无声。这不是寻常剪径的做派。',
    hp: 70, atk: 13, def: 7, spd: 9, style: 'assassin', winMoney: 0,
    winText: '你险胜半招。那人影倒退出门，在雪地里留下一个踉跄的脚印，消失在风雪里。他掉了一样东西——一枚铜符，刻着"镇抚司"。（荒驿夜叩的，是官家的刀。）',
    loseText: '你倒下前的最后一眼，看见那人从怀里摸出什么，看了看你，又收了回去，转身走进风雪。（他没补刀。为什么？）',
  },
  c_baiying: {
    id: 'c_baiying', name: '白狐', count: 1,
    intro: '你的箭还搭在弦上——白狐没有躲。它只是看着你，眼睛里第一次有了"人"才有的东西：怜悯，和寒意。',
    hp: 9999, atk: 0, def: 99, spd: 99, style: 'spirit', winMoney: 0,
    winText: null, unwinnable: true,
    loseText: '你的箭在半空化成了飞灰。白狐叹了口气，转身没入黑暗——那一夜的月光特别冷。（山里的东西碰不得。这不是惩罚，是常识。）',
  },
};

// 战斗文字句库（招来招往的"帧"）
const HIT_LINES = {
  player_hit: [
    '你这一下{move}，走的是{line}的路子——他躲过了前半式，没躲过后半式。',
    '{move}递出去，正撞上他换步的空当——"噗"的一声闷响，结结实实。',
    '你{move}。他格挡慢了半拍，闷哼一声，退了两步。',
    '这一手{move}你练得最熟，出手比想法还快——他肩头着了一下。',
  ],
  player_miss: [
    '你{move}，他偏头让过，反手一记擦着你耳侧带过——风声都听得见。',
    '这一式递空了。他早就等着你这一手——老江湖的斗，一半在招上，一半在你心里。',
    '你{move}。他半转身的功夫卸了力道，顺势欺进半步——你反而险了。',
  ],
  enemy_hit: [
    '{enemy}的{eatk}来得刁钻，你格挡不及——{pt}',
    '{enemy}忽然变招，虚晃一记，实招在后——你{pt}',
    '{enemy}根本不与你拆招，一力降十会——{pt}',
  ],
  enemy_miss: [
    '{enemy}的攻势擦着你掠过去，你借力卸了半步，堪堪避过。',
    '你堪堪格住——兵刃相击，火星子溅在两人中间。',
    '{enemy}这一击落了空。他眼中凶光一闪——怒了。怒了的人，招式会露空当。',
  ],
  parts: {
    leftArm: '左臂挂了彩，麻了一阵才缓过劲——刀再握上去，就没那么稳了。',
    rightArm: '右臂中了一下，骨头没裂，但使不上全力。',
    leg: '腿上着了一下。你的步子，从这一刻起慢了半拍。',
    inner: '胸口被震了一下，一口气堵在半途——内息乱了。',
  },
};

// 玩家可用招式（由功法生成）
export function playerMoves(life) {
  const moves = [];
  for (const g of life.gongfa || []) {
    if (g.realm === 'wudao' || g.id.includes('quan') || g.id.includes('jian') || g.id.includes('dao') || g.id.includes('biao') || g.id.includes('zoujian') || g.id.includes('chaoxi')) {
      moves.push({ name: g.name.split('（')[0], level: g.level, source: g.id });
    }
  }
  if (!moves.length) moves.push({ name: '拳脚', level: 0, source: 'basic' });
  return moves;
}

export function startCombat(state, templateId, opts = {}) {
  const t = COMBAT_TEMPLATES[templateId];
  const life = state.life;
  const combat = {
    tid: templateId, tpl: t,
    enemy: { name: t.name, hp: t.hp, maxHp: t.hp, injury: {}, morale: 100, style: t.style },
    round: 0, over: false, result: null, opts,
  };
  state.combat = combat;
  return combat;
}

// 结算五要素（内部数值，绝不外露）
function playerPower(state, move) {
  const life = state.life;
  const base = 10 + (life.dims.gengu / 12) + (life.neili / 4) + (life.hp / 12);
  const moveBonus = (move?.level || 0) * 8 + Math.min(life.wugongXiuwei / 20, 15);
  // 装备叙事化：佩戴器物加成藏在幕后，玩家只见"手上的家伙趁手"
  const equipBonus = (() => {
    if (!life.equipped) return 0;
    const it = (life.items || []).find(i => i.id === life.equipped);
    return it ? (it.combat || 0) : 0;
  })();
  const injPenalty = (life.injury?.leftArm ? 4 : 0) + (life.injury?.rightArm ? 5 : 0) + (life.injury?.leg ? 3 : 0);
  return { atk: base * 0.6 + moveBonus + equipBonus, spd: 8 + life.dims.gengu / 15 + (life.injury?.leg ? -3 : 0), injPenalty };
}

function applyInjury(rng, target, severity) {
  target.injury = target.injury || {};
  const part = rng.pick(['leftArm', 'rightArm', 'leg', 'inner']);
  target.injury[part] = (target.injury[part] || 0) + severity;
  return part;
}

// 单回合结算。playerCmd: {type:'attack'|'defend'|'flee'|'observe'|'item', move?}
export function combatRound(state, cmd) {
  const c = state.combat; if (!c || c.over) return null;
  const rng = state._rng;
  const life = state.life;
  const e = c.enemy;
  const moves = playerMoves(life);
  const move = cmd.move || moves[Math.floor(rng.next() * moves.length)];
  const p = playerPower(state, move);
  const lines = [];

  c.round++;
  if (cmd.type === 'flee') {
    const chance = 0.4 + (p.spd - 8) * 0.05;
    if (rng.chance(chance)) {
      c.over = true; c.result = 'fled';
      lines.push('你觑个空当，翻身就走。身后的喝声被你的脚步声盖了过去——活命不丢人。');
      return { lines, over: true, result: 'fled' };
    }
    lines.push('你转身想走，对方一个箭步封住了去路——走不脱了。');
  } else if (cmd.type === 'observe') {
    const hint = e.style === 'oldhand' ? '他招式沉稳，但每次抢攻前，左肩会先沉半寸——破绽在那半寸里。'
      : e.style === 'bully' ? '他招大力沉，可下盘虚浮——以巧破力，有得一打。'
      : e.style === 'assassin' ? '他出手无声无息，退路留得极足——这不是打手，是刀。速战，或速走。'
      : '他的招式没什么花哨，全凭一个"快"字。';
    lines.push('你观他气机——' + hint);
    p.observeBuff = true;
  } else if (cmd.type === 'defend') {
    lines.push('你收势守御，护住要害，等他的下一手。');
    p.defendBuff = true;
  } else {
    // 攻击回合：双方各一击，快者先手
    const eStyleAtk = { bully: 9, oldhand: 11, assassin: 13, soldier: 10, spar: 9, spirit: 0 }[e.style] || 9;
    const playerFirst = (p.spd + rng.int(-2, 2)) >= (c.tpl.spd + rng.int(-2, 2));
    const seq = playerFirst ? ['p', 'e'] : ['e', 'p'];

    for (const who of seq) {
      if (c.over || e.hp <= 0 || life.hp <= 0) break;
      if (who === 'p') {
        const hitChance = 0.55 + (move.level || 0) * 0.08 + (p.observeBuff ? 0.15 : 0) - (e.style === 'assassin' ? 0.1 : 0);
        if (rng.chance(hitChance)) {
          const dmg = Math.round(p.atk * (0.5 + rng.next() * 0.7) - c.tpl.def * 0.4);
          e.hp -= Math.max(dmg, 2);
          const part = applyInjury(rng, e, 1);
          lines.push(rng.pick(HIT_LINES.player_hit).replace('{move}', `使出「${move.name}」`).replace('{line}', e.injury.leg ? '他步法已乱，破绽百出' : '正锋'));
          if (e.hp <= 0) { c.over = true; c.result = 'win'; }
        } else {
          lines.push(rng.pick(HIT_LINES.player_miss).replace('{move}', `「${move.name}」`));
        }
      } else {
        const hitChance = 0.45 + (c.tpl.atk - 8) * 0.03 - (p.defendBuff ? 0.2 : 0);
        if (rng.chance(hitChance)) {
          const dmg = Math.round((c.tpl.atk * (0.5 + rng.next() * 0.6)) - p.atk * 0.15);
          life.hp -= Math.max(dmg, 2);
          const part = applyInjury(rng, life, 1);
          lines.push(rng.pick(HIT_LINES.enemy_hit).replace('{enemy}', e.name).replace('{eatk}', '攻势').replace('{pt}', HIT_LINES.parts[part]));
          life.injury = life.injury || {};
          life.injury[part] = (life.injury[part] || 0) + 1;
          if (life.hp <= 0) { c.over = true; c.result = 'lose'; }
        } else {
          lines.push(rng.pick(HIT_LINES.enemy_miss).replace('{enemy}', e.name));
        }
      }
    }
  }

  // 敌人性格戏份
  if (!c.over && e.style === 'bully' && e.hp < e.maxHp * 0.3) lines.push(`${e.name}开始嘶吼着乱打——慌了。`);
  if (!c.over && e.style === 'oldhand' && e.hp < e.maxHp * 0.4) lines.push(`${e.name}忽然卖了个破绽——你差点上当。老手的陷阱，用破绽做饵。`);
  if (!c.over && e.style === 'assassin' && e.hp < e.maxHp * 0.5) lines.push(`${e.name}的刀势忽然一收——他在找你的要害。他耐心很好。`);
  if (c.over && c.result === 'win') lines.push(c.tpl.winText || `${e.name}倒下了。`);
  if (c.over && c.result === 'lose' && c.tpl.loseText) lines.push(c.tpl.loseText);

  return { lines, over: c.over, result: c.result };
}

export function endCombat(state) {
  const c = state.combat; if (!c) return null;
  state.combat = null;
  // 收尾：伤势转化为 hp 减免已即时结算；部位伤保留至休息
  if (c.result === 'win') {
    state.life.neili = Math.max(0, state.life.neili - 5);
  }
  if (c.result === 'lose') {
    state.life.hp = Math.max(1, state.life.hp); // 横死判定交给调用方
  }
  return c;
}
