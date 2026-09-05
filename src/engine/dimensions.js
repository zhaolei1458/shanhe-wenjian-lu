// ============================================================
// 山河问剑录 · 引擎/九类新维度（06 册 B/D/E 类 · 十一期）
// 居所(home) / 易容化名(alias) / 托梦 / 预兆 / 悬案断案(CASES) / 轻经营(business) / 开宗立派(foundedSect)
// 红线不变：经营与断案都是"多一段好文字"，不是多一套系统。
// ============================================================
import { OMEN_GOOD, OMEN_BAD, DREAM_TEMPLATES, CASES, BUSINESS_KINDS, BUSINESS_YEAR, SECT_FOUND_TEXT, SECT_RULES } from '../content/dimensions.js';
import { cities } from '../content/world.js';

// ---------- 预兆（E 类） ----------
export function maybeOmen(game, good = true) {
  const pool = good ? OMEN_GOOD : OMEN_BAD;
  game.say(`（${game.rng.pick(pool)}）`, 'ambient');
}

// ---------- 托梦（E 类：亡者入梦） ----------
export function maybeDream(game) {
  const life = game.state.life;
  const dead = (life.rels || []).filter(r => !r.alive && r.arc.length > 1);
  if (!dead.length || !game.rng.chance(0.14)) return;
  const r = game.rng.pick(dead);
  const tpl = game.rng.pick(DREAM_TEMPLATES);
  game.say(`（梦）${tpl(r.name)}`, 'ambient');
  life.flags ||= {};
  life.flags.dreamed = (life.flags.dreamed || 0) + 1;
}

// ---------- 居所（B 类：从"路过世界"到"住进世界"） ----------
export function doSettle(game) {
  const life = game.state.life;
  if (life.home) return game.say(`（你在${life.home.place}已有住处。${life.home.kind === 'buy' ? '自家宅子' : '赁的小院'}——要挪窝，先把眼前的日子安顿好。）`, 'echo');
  const wantBuy = life.money >= 30 && game.rng.chance(0.5);
  if (wantBuy) {
    life.money -= 30;
    life.home = { kind: 'buy', place: cityOf(game), node: life.location.node, since: game.state.world.year, tree: 0 };
    game.say(`（你掏出三十年攒下的家底，在${life.home.place}置了一座小宅。契纸落印那一刻，你的手有点抖——漂了半生，往后信上能写"家里"两个字了。）`, 'event');
    game.book('喜', `在${life.home.place}置宅安家`);
  } else {
    life.money = Math.max(0, life.money - 2);
    life.home = { kind: 'rent', place: cityOf(game), node: life.location.node, since: game.state.world.year, tree: 0 };
    game.say(`（你在${life.home.place}赁了个小院，月钱不多，胜在清净。房东是位爱干净的老太太——她只有一个要求：院里那棵树，不许动。）`, 'event');
    game.book('喜', `在${life.home.place}赁屋而居`);
  }
}
const cityOf = game => cities[game.state.life.location?.city]?.name || '此地';

export function advanceHome(game) {
  const life = game.state.life;
  if (!life.home) return;
  life.home.tree++;
  const yrs = game.state.world.year - life.home.since;
  if (yrs === 5) game.say(life.home.kind === 'buy'
    ? `（院里那棵树是你搬家那年随手栽的。五年过去，它已经高过了屋檐——你在树下摆了张石桌，夏天喝茶有了去处。）`
    : `（院里那棵老太太不许动的树，如今你也看出它的好了——夏天满院的荫。房东老太太走了，她儿子来收租，照旧只说一句："树别动，我妈的规矩。"）`, 'ambient');
  else if (yrs === 10) game.say(`（离家多年的街坊回来，在你家门口愣了半天——不是不认得，是不敢认：${life.home.place}的这条巷子都翻新了，只有你这院还是老样子，那棵树已经碗口粗了。）`, 'ambient');
  else if (yrs === 20 && life.home.kind === 'buy') game.say(`（这座宅子你住了二十年。门槛踏凹了，门环磨亮了，梁上燕子年年回来——房子老了，可它越来越像个家。）`, 'ambient');
  else if (game.rng.chance(0.18)) game.say(game.rng.pick([
    `（邻里是非：东家为半堵墙跟西家吵了三个月，最后找你评理。你说了句"墙能拆，邻居拆不得"——两家居然真把墙拆了，改成了一道门。）`,
    `（宅子会老：昨夜一场雨，屋顶漏了。你踩着梯子补瓦——年轻时这是伙计的活，如今你干得比谁都熟练。）`,
    `（家宅平安：今年秋天柿子结得好，你给街坊四邻挨家送了一篮。回来时篮子是空的，心是满的。）`,
  ]), 'ambient');
}

// ---------- 易容化名（E 类：NPC 只认名号不认脸） ----------
export function doAlias(game, name) {
  const life = game.state.life;
  if (life.alias && name) return game.say(`（你此刻行走用的是化名"${life.alias}"。要换个新名字，先说"以真名示人"。）`, 'echo');
  life.alias = name || null;
  game.say(life.alias
    ? `（你易了容，报上了化名"${life.alias}"。从此官差的画像上没有你，仇家的耳目里没有你——江湖上只认名号不认脸，这张新脸，就是你的新命。）`
    : `（你洗去了易容的胶粉，以真名示人。有些账，终究要本人来还——你反而松了口气。）`, 'event');
}
export function maybeAliasReveal(game, npc) {
  const life = game.state.life;
  if (!life.alias || !npc) return;
  const hasEnemy = (game.state.ledger || []).some(l => (l.type === '怨' || l.type === '杀') && !l.resolved);
  const chance = hasEnemy ? 0.18 : 0.06;
  if (!game.rng.chance(chance)) return;
  game.say(`（${npc.name}与你寒暄了几句，忽然目光一凝，盯着你的手看了半晌——"你握茶盏的手势，三根手指扣沿，拇指压顶……全天下只有一个人这样喝茶。"他缓缓放下盏， "${life.alias}？还是说——"你心头一凛：脸易得了，命里的习惯易不得。）`, 'dialog');
  game.book('怨', `化名"${life.alias}"在${npc.name}面前露了行藏`);
  life.alias = null;
}

// ---------- 悬案断案（D 类：证据入行路志，抓错入账） ----------
export function doInvestigate(game) {
  const life = game.state.life;
  const done = life.flags.doneCases || (life.flags.doneCases = []);
  const pool = CASES.filter(c => !done.includes(c.id));
  if (!pool.length) return game.say('（近年的积案你都断完了。如今市面太平——或者说，没人再敢在你眼皮底下犯事。）', 'echo');
  const c = game.rng.pick(pool);
  done.push(c.id);
  const opts = [
    { label: '接案，查访', next: caseStage1(game, c), effect: {} },
    { label: '不接这个茬', end: true, text_after: '（你摇了摇头。冤有头债有主，可你如今这双手，不是什么案都接得起。）' },
  ];
  game.fireEvent({ id: 'case_' + c.id, title: '悬案·' + c.title, text: `【悬案·${c.title}】\n${c.text}\n\n官差把案卷推到你面前："这案子悬了半年，城里人都说邪。您给断一断？"`, options: opts });
}
function caseStage1(game, c) {
  return {
    id: 'case1_' + c.id, title: c.title,
    text: `你走访了三日。\n\n【线索】${c.clue}\n\n（你把这条线索记进了行路志。眼下有三张面孔浮出水面——但要定罪，还差临门一脚。）`,
    options: [
      ...c.suspects.map((s, i) => ({ label: `推断凶手：${s}`, casePick: i, caseRef: c })),
      { label: '再探一探（多花一日）', next: caseStage1b(game, c) },
    ],
  };
}
function caseStage1b(game, c) {
  return {
    id: 'case1b_' + c.id, title: c.title,
    text: `你又花了一日复核。线索环环相扣——${c.clue}\n\n（证据够了。你把行路志合上，三张面孔摆在你面前，只有一个是对的。）`,
    options: c.suspects.map((s, i) => ({ label: `指认：${s}`, casePick: i, caseRef: c })),
  };
}
export function resolveCasePick(game, pick, c) {
  const life = game.state.life;
  const suspect = c.suspects[pick];
  if (pick === c.culprit) {
    life.money += 10;
    game.say(`（你把证据一条条摆出来。${c.truth}真凶伏法，赏银十贯当堂结清。临走时苦主一家人给你跪下磕头——你侧身避了：「别谢我，谢证据。」）`, 'event');
    game.book('善', `断明${c.title}，冤情得雪`);
    game.say('（行路志添了一笔：【断案】此案始末与证据链，俱录在册。）', 'ledger');
  } else {
    game.say(`（你指认了${suspect}。人被押走了——可你心里那一页行路志，越翻越不对。三日后真相浮出：${c.truth}抓错的人放回来了，可他在牢里的七天，是实打实的七天。你把赏银原样退了回去——这案子你赢了面子，输了心。）`, 'event');
    game.book('怨', `错断${c.title}，冤枉了好人`);
    life.flags ||= {};
    life.flags.wrongfulCase = true; // 十殿过堂多一层劫
  }
}

// ---------- 轻经营（B 类：当掌柜=接活、用人、担干系） ----------
export function doBusiness(game, kind) {
  const life = game.state.life;
  if (life.business) return game.say(`（你在${life.business.place}的${BUSINESS_KINDS[life.business.kind].name}还开着张——一个人分不出两个身子，先把那头照应好。）`, 'echo');
  if (life.money < 15) return game.say('（盘个铺面连货带押至少十五贯。你数了数褡裢——先把本钱挣够再来谈。）', 'echo');
  life.money -= 15;
  life.business = { kind, place: cityOf(game), since: game.state.world.year };
  game.say(`（你盘下了${life.business.place}的一间${BUSINESS_KINDS[kind].name}。${BUSINESS_KINDS[kind].desc}伙计们看着你这位新东家——他们不知道你江湖上的名号，只知道你给的钱不拖欠。挺好，这样就够了。）`, 'event');
  game.book('喜', `在${life.business.place}盘下${BUSINESS_KINDS[kind].name}`);
}
export function advanceBusiness(game) {
  const life = game.state.life;
  if (!life.business) return;
  const lines = BUSINESS_YEAR[life.business.kind] || [];
  if (game.rng.chance(0.4) && lines.length) game.say(`（${game.rng.pick(lines)}）`, 'event');
}

// ---------- 开宗立派（B 类：立山门、定门规、身后香火） ----------
export function doFoundSect(game) {
  const life = game.state.life;
  if (life.foundedSect) return game.say(`（【${life.foundedSect.name}】已是你的山门。门规刻在石上，弟子记在心里——你还能再立一座吗？）`, 'echo');
  const canCultivator = ['zhuji', 'jindan', 'yuanying', 'huashen', 'lianxu', 'heti', 'dasheng', 'dujie', 'zhenxian', 'jinxian', 'taiyi', 'daluo', 'daozun'].includes(life.realm);
  const canWulin = life.wudaoRank != null && life.wudaoRank <= 4; // 宗师以上
  if (!canCultivator && !canWulin) return game.say('（开宗立派，要么修为到了筑基往上，要么武道做到宗师——如今你在江湖上说话还太轻。先把本事立起来。）', 'echo');
  const x = game.rng;
  const family = x.pick(['问剑', '听涛', '抱朴', '归尘', '守拙', '疏影', '枕流', '洗剑']);
  const suffix = x.pick(['山房', '山庄', '门', '派', '阁']);
  const dominant = Object.entries(life.xinXing || {}).sort((a, b) => b[1] - a[1])[0]?.[0] || 'xia';
  const rules = SECT_RULES[dominant] || SECT_RULES.xia;
  life.foundedSect = { name: family + suffix, rules, since: game.state.world.year, disciples: x.int(3, 7) };
  game.say(SECT_FOUND_TEXT({ name: life.foundedSect.name, rules, firstDisciples: life.foundedSect.disciples }), 'event');
  game.book('喜', `开宗立派【${life.foundedSect.name}】`);
}
export function advanceFoundedSect(game) {
  const life = game.state.life;
  if (!life.foundedSect) return;
  const yrs = game.state.world.year - life.foundedSect.since;
  if (yrs === 3) game.say(`（【${life.foundedSect.name}】开山三年。第一批弟子下了山，有人替你扬名，有人给你丢脸——门规石上第二句被摩挲得最亮，你看了，心里五味杂陈。）`, 'ambient');
  else if (game.rng.chance(0.15)) game.say(game.rng.pick([
    `（有外派来【${life.foundedSect.name}】踢馆。大弟子接了阵——赢了。你没出面，只在庆功宴上多喝了一盏："门里有能人，比我出面强。"）`,
    `（门下弟子下山行医义诊回来，鞋上全是泥。门规石上的字没人再背得出全篇——可他们做出来了。你忽然觉得，字忘了就忘了吧。）`,
    `（【${life.foundedSect.name}】又收了新弟子。拜师礼上，新弟子问你什么是江湖。你想了半晌："就是你脚下的路，和你路上遇见的人。"）`,
  ]), 'ambient');
}

// ---------- 盖棺判词侧写（B/D 类收束） ----------
export function dimVerdictLines(state) {
  const life = state.life;
  const out = [];
  if (life.home) {
    const yrs = state.world.year - life.home.since;
    out.push(life.home.kind === 'buy'
      ? `你名下还有一座宅子——院里那棵树${yrs >= 20 ? '已经碗口粗了' : '才栽下没几年'}。往后的春天，它自己会绿。`
      : `你赁居了${Math.max(1, yrs)}年，走的时候把院里那棵树浇透了——那是老太太的规矩，你替她守到了最后。`);
  }
  if (life.business) out.push(`你那间${BUSINESS_KINDS[life.business.kind].name}没随你关门——伙计们接了钥匙。江湖上的招牌，原来也能比人活得久。`);
  if (life.foundedSect) out.push(`你亲手立起的【${life.foundedSect.name}】还在收徒。若干年后有人走进祖师堂，会看见第一幅画像挂的是你——画像下头一行小字：门规是他用一身伤换来的。`);
  if (life.flags?.wrongfulCase) out.push(`你一生断案明快，可那一桩错案，你带进了土里。十殿过堂时，那双冤枉过你的人的眼睛，会在轮回井边再看你一次。`);
  return out;
}
