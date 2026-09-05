// ============================================================
// 山河问剑录 · 引擎/风水堪舆十三期（06 册 E 类收尾）
// doKanyu（请人看宅）/ doZhenwu（请镇物压宅）/ doXunlong（寻龙点穴·古墓链）
// fengshuiYearTick（宅子风水隐藏层年度掷签）/ fengshuiVerdictLines（判词侧写）
// 红线不变：风水是隐藏层，永远给文字不给数值。
// ============================================================
import { KANYU_TEXTS, KANYU_REVIEW, ZHENWU_LIST, FENGSHUI_GOOD, FENGSHUI_BAD, ZHENWU_WORK_TEXT, TOMB_YITUI, TOMB_ZONGZI, TOMB_KONG } from '../content/fengshui.js';
import { rollNamedTreasure } from './equipment.js';

// ---------- 请人看宅（意头：看风水/堪舆/相宅） ----------
export function doKanyu(game) {
  const life = game.state.life;
  if (!life.home) return game.say('（你连个落脚的屋檐都没有——风水风水，先有风有水再谈它。先安家，再相宅。）', 'echo');
  const home = life.home;
  if (home.fs) {
    const tail = home.zhenwu ? `（堂上那尊【${home.zhenwu.name}】落着薄灰——它一直在当值。）` : '';
    return game.say(KANYU_REVIEW[home.fs] + tail, 'echo');
  }
  if (life.money < 5) return game.say('（请一位正经堪舆先生看宅，卦金五贯。你数了数褡裢——先生不赊账，先把钱凑够。）', 'echo');
  life.money -= 5;
  // 置宅地气比赁屋厚：吉概率更高
  const r = game.rng.chance(home.kind === 'buy' ? 0.3 : 0.12) ? 'ji'
    : game.rng.chance(0.65) ? 'ping' : 'xiong';
  home.fs = r;
  game.say(game.rng.pick(KANYU_TEXTS[r])(home.place), 'event');
  game.book('秘', `请堪舆先生相${home.place}之宅，得评「${r === 'ji' ? '吉' : r === 'ping' ? '平' : '凶'}」`);
  game.advanceTime(1);
}

// ---------- 请镇物（意头：请镇物/镇宅/安镇物） ----------
export function doZhenwu(game) {
  const life = game.state.life;
  if (!life.home) return game.say('（镇物压的是宅，不是人。你居无定所——那点风霜，先自己扛着。）', 'echo');
  const home = life.home;
  if (home.zhenwu) return game.say(`（堂上已供着【${home.zhenwu.name}】。${home.zhenwu.lore}老物件不挑主人，你也不必三心二意。）`, 'echo');
  if (life.money < 8) return game.say('（镇物是老物件，可再老也是别人的传家——入手得使钱，少说八贯。先把褡裢掂掂。）', 'echo');
  life.money -= 8;
  const used = (life.flags.usedZhenwu || []);
  const pool = ZHENWU_LIST.filter(z => !used.includes(z.id));
  const z = game.rng.pick(pool.length ? pool : ZHENWU_LIST);
  used.push(z.id);
  home.zhenwu = { id: z.id, name: z.name, lore: z.lore };
  if (home.fs === 'xiong') {
    home.fs = 'ping';
    game.say(`（你辗转从旧货行里请回一尊【${z.name}】，红布裹着，安放在堂屋正位。${z.lore}\n说也奇怪——安放当夜，宅子里那股子挥不去的滞气，肉眼可见地敛了。先生说得对：老物件压宅，比什么符咒都顶用。）`, 'event');
  } else {
    game.say(`（你从旧货行里请回一尊【${z.name}】，红布裹着，安放在堂屋正位。${z.lore}\n其实先生没说你家有什么不干净——可老物件进门那一刻，你心里咯噔一下，落了地。人求的未必是辟邪，是心安。）`, 'event');
  }
  game.book('善', `请【${z.name}】压宅，宅眷得安`);
  game.advanceTime(1);
}

// ---------- 寻龙点穴（意头：寻龙/点穴/探古墓——拿命换眼力的本事） ----------
export function doXunlong(game) {
  const life = game.state.life;
  const canCulti = ['zhuji', 'jindan', 'yuanying', 'huashen', 'lianxu', 'heti', 'dasheng', 'dujie', 'zhenxian', 'jinxian', 'taiyi', 'daluo', 'daozun'].includes(life.realm);
  const canWudao = life.wudaoRank != null && life.wudaoRank <= 6; // 先天往上，山里才走得动
  if (!canCulti && !canWudao) return game.say('（寻龙点穴是拿脚底板和性命喂出来的本事——修为不到筑基、武道不到先天，进了山也是给野物送饭。先把本事立起来。）', 'echo');
  const year = game.state.world.year;
  if (year < (life.flags.tombUntil || 0)) return game.say(`（三年前你才进过一回山——地气走一年停一年，龙脉的气口不是年年开。歇着吧，山不会跑。）`, 'echo');
  life.flags.tombUntil = year + 8;
  // 三母型分签：遗蜕四成 / 粽子三成半 / 空冢两成半
  const kind = game.rng.chance(0.4) ? 'yitui' : game.rng.chance(0.58) ? 'zongzi' : 'kong';
  const pool = kind === 'yitui' ? TOMB_YITUI : kind === 'zongzi' ? TOMB_ZONGZI : TOMB_KONG;
  const seen = life.flags.seenTombs || (life.flags.seenTombs = []);
  const fresh = pool.filter(t => !seen.includes(t.id));
  const scen = game.rng.pick(fresh.length ? fresh : pool);
  if (!seen.includes(scen.id)) seen.push(scen.id);
  const opts = kind === 'yitui' ? [
    { label: '叩首三拜，不取一物', tomb: 'bow', tombRef: scen },
    { label: '取石案上的遗泽（器物入袖）', tomb: 'take', tombRef: scen },
    { label: '静读壁上遗篇', tomb: 'read', tombRef: scen },
  ] : kind === 'zongzi' ? [
    { label: '举火拼杀', tomb: 'fight', tombRef: scen },
    { label: '封土退走，不碰这晦气', tomb: 'flee', tombRef: scen },
  ] : [
    { label: '把井底铜钱摸上来', tomb: 'copy', tombRef: scen },
    { label: '添一把土，掩了坑走人', tomb: 'soil', tombRef: scen },
  ];
  game.fireEvent({
    id: 'tomb_' + scen.id,
    title: '寻龙点穴·' + scen.title,
    text: `【寻龙点穴】\n${scen.text}`,
    options: opts,
  });
}

// ---------- 古墓抉择结算 ----------
export function resolveTombChoice(game, opt) {
  const life = game.state.life;
  const scen = opt.tombRef;
  game.advanceTime(2); // 进山寻穴连去带回
  switch (opt.tomb) {
    case 'bow':
      game.say(`（你对遗蜕端端正正磕了三个头，替石室掩了门，退出来重新把荒草栽好。什么都没拿——可下山的路上，你脚步轻得不像话。有些东西不是拿在手里的，是记在心里的。）`, 'event');
      game.book('善', `于${scen.title}叩首敬前辈，不取遗泽`);
      life.flags.yituiBow = (life.flags.yituiBow || 0) + 1;
      break;
    case 'take': {
      const item = rollNamedTreasure(game.rng);
      game.applyEffect({ items: [item] }, 'event');
      game.say(`（你双手把遗物捧出石室，对着遗蜕又是一拜：「前辈，物得其主，你别怪我。」下山的路上你把器物摩挲了十几遍——三百年的东西到了你手里，往后它的故事，就接着你的往下写了。）`, 'event');
      game.book('机', `于${scen.title}承前辈遗泽【${item.name}】`);
      // 与家宅联动：遗泽里有镇宅的老物件，宅子若压着凶气，它自己会「回家」
      if (life.home && !life.home.zhenwu && life.home.fs === 'xiong' && game.rng.chance(0.5)) {
        const z = ZHENWU_LIST[0];
        life.home.zhenwu = { id: z.id, name: z.name, lore: z.lore };
        life.home.fs = 'ping';
        game.say(`（到家堂屋一摆，你盯着看了半晌——这器物的包浆、形制，分明就是堪舆先生口中「压宅」的路数。你把它安在正位。当夜，宅中滞气散了大半。）`, 'event');
      }
      break;
    }
    case 'read':
      game.say(`（你把壁上遗篇逐字读完，在石室里坐到天黑。字字平白，却像有人隔着三百年拍了拍你的肩。下山时你一步三回头——不是舍不得东西，是舍不得那个把话说完的人。）`, 'event');
      game.applyEffect({ stat: { xiwei: 30 } }, 'event');
      game.book('机', `于${scen.title}读前辈遗篇，悟性精进`);
      break;
    case 'fight':
      game.say(`（火把抡圆了拼命。那东西不怕砍，怕火——你烧了半边袖子，趁它退进阴影里翻出土坑，连滚带爬。回城躺了半个月，每每夜里惊醒，总觉得有十根乌黑的指头还搭在你脖子上。）`, 'event');
      game.applyEffect({ hp: -25 }, 'event');
      game.book('怨', `于${scen.title}惊动凶物，带伤而返`);
      if (life.hp > 0 && game.rng.chance(0.3)) {
        const item = rollNamedTreasure(game.rng, 'weapon');
        game.applyEffect({ items: [item] }, 'event');
        game.say(`（养伤时你翻检褡裢才发现——慌乱里竟从墓道里抓出来一件东西。【${item.name}】。你握着它半天说不出话：这是从凶物嘴里抢食，抢回来了。）`, 'event');
      }
      break;
    case 'flee':
      game.say(`（你把土重新封上，头也不回地下了山。走出十里地才敢回头——山里静得只剩风声。君子不立危墙，何况那不是墙，是一座立了三百年的错。）`, 'event');
      game.say('（行路志添了一笔：【寻龙】凶穴方位与封土记号，俱录在册——往后绕着走。）', 'ledger');
      break;
    case 'copy':
      game.say(`（你挽起袖子探进井底，摸上来几枚温润的铜钱——几百年的愿，都在这几枚钱里焐着。你不识得它们许过什么，只把手里的那枚丢回井里：「替我也带着。」）`, 'event');
      game.applyEffect({ money: 3 }, 'event');
      game.book('秘', `于${scen.title}得祈雨井古钱，还愿一枚`);
      break;
    case 'soil':
      game.say(`（你把坑填平，又从旁边铲了把青草皮盖上。临走拍了拍手上的土——今天没挖着宝，可你莫名觉得，这趟不亏。）`, 'event');
      game.book('善', `于${scen.title}填坑掩土，不留伤疤于山野`);
      break;
  }
}

// ---------- 宅子风水隐藏层（年轮掷签：吉宅添喜 / 凶宅磨人 / 镇物显灵） ----------
export function fengshuiYearTick(game) {
  const life = game.state.life;
  const home = life.home;
  if (!home || !home.fs) return; // 未请先生相过，宅子风水是「未知」——隐藏层不掷签
  if (home.fs === 'xiong' && home.zhenwu) {
    home.fs = 'ping';
    game.say(ZHENWU_WORK_TEXT(home.zhenwu), 'ambient');
    return;
  }
  if (home.fs === 'xiong') {
    if (game.rng.chance(0.3)) {
      game.say(game.rng.pick(FENGSHUI_BAD), 'ambient');
      if (game.rng.chance(0.4)) { life.money = Math.max(0, life.money - 2); game.say('（家里又添了一笔药钱——你数都没数就递了出去。宅子磨人，先磨的是钱。）', 'ambient'); }
    }
  } else if (home.fs === 'ji') {
    if (game.rng.chance(0.22)) {
      game.say(game.rng.pick(FENGSHUI_GOOD), 'ambient');
      if (game.rng.chance(0.3)) { life.money += 1; }
    }
  }
}

// ---------- 判词侧写（风水/镇物收束） ----------
export function fengshuiVerdictLines(state) {
  const life = state.life;
  const out = [];
  if (life.home?.fs === 'xiong') out.push('那座宅子的凶，你没等到散就走了。堪舆先生说地脉里的滞气三百年不散——可你住过的那间堂屋，后来倒是一直干干净净。有些凶，是留给人惦记的。');
  else if (life.home?.zhenwu) out.push(`堂上那尊【${life.home.zhenwu.name}】还立在原位。老物件压宅，也压着你的名字——往后每一任宅主掸灰时，都会听见上一个家的回声。`);
  if (life.flags?.yituiBow) out.push('你在山里给一位前辈磕过头，什么都没拿。多年后你才明白：那天你没空手——你把「敬」字带下了山，用了一辈子。');
  return out;
}
