// 山河问剑录 · 引擎/人际关系系统
// 06 册 A 类「一生的人际」：把关系做成一生的主轴（GDD §4.3 并入）
// 五种关系：结拜(sworn)/姻缘(spouse)/子嗣(child)/授业(disciple)/宿敌(nemesis)
// 红线不变：数值藏幕后，一切以文字落账——关系的一生记入 arc，判词/编年史收束。

// ---------- 名册 ----------
const SURNAMES = ['沈', '顾', '白', '燕', '洛', '温', '苏', '秦', '陆', '林', '萧', '程', '裴', '崔', '宋', '韩', '叶', '许'];
const GIVEN = {
  sworn: ['振河', '怀远', '守拙', '仗义', '同舟', '铁崖', '望北', '拏云'],
  spouse: ['眉娘', '阿沅', '青绡', '雪衣', '月奴', '琬儿', '云窈', '素秋'],
  child: ['念安', '承志', '小满', '岁岁', '知秋', '念远', '阿九', '团团'],
  disciple: ['承剑', '抱朴', '闻溪', '拾星', '问渠', '听松', '继灯', '砚秋'],
  nemesis: ['断鸿', '孤鸦', '血屠', '笑面阎罗', '白衣判官', '铁面修罗', '夜枭', '疯刀'],
};
const EPITHETS = {
  sworn: ['同门师弟', '一起扛过漕的兄弟', '比武场上不打不相识的汉子', '与你分过最后一个馒头的同乡'],
  spouse: ['渡口摆船人家的女儿', '医馆坐堂大夫的独女', '说书先生的掌上明珠', '镖局账房里的姑娘'],
  child: null, // 子嗣不"相遇"，由姻缘推进
  disciple: ['上山求剑的少年', '拦路拜师的痴儿', '被你从山匪手里救下的孤儿', '武馆里最不服输的学徒'],
  nemesis: ['与你争过一桩公道的对头', '灭你师门旧怨的正主', '江湖上与你齐名却终生为敌的人', '同一柄剑下讨过生活的人'],
};

const MEET_TEXTS = {
  sworn: [
    '酒过三巡，那人把碗一磕：「今日一醉，往后你我便是过命的交情——敢不敢歃血为盟？」',
    '那人替你挡了一记闷棍，自己挂了彩还先笑：「够意思吧？我看你顺眼，结拜不结？」',
  ],
  spouse: [
    '她抬头看你一眼，又低下头去。就是这一眼，你心里某处落了锚。',
    '你病中昏沉，醒来时榻边多了一碗还温着的粥。端粥的人没走，也没说话。',
  ],
  disciple: [
    '那少年在你门前跪了三天，膝盖磨破了也不吭声。第四天清晨你开门，他还在。',
    '你随手指点了他半招。半月后他在你窗外把那半招练了一万遍——风雪没停过。',
  ],
  nemesis: [
    '那人横剑当路：「听闻你的剑快。今日我若输了，此生练剑还有什么意思？」',
    '你们在人群里同时认出了对方。谁都没说话，手却都按上了剑柄。',
  ],
};
const MEET_OPTIONS = {
  sworn: [
    { label: '歃血为盟，义结金兰', rel: { mood: 'warm', arc: '义结金兰，换帖为誓。三炷香烧到底，从此你的江湖多一家亲人。' } },
    { label: '以酒代血：情义在心，香火免了', rel: { mood: 'warm', arc: '未换帖，但心里认了这份交情——酒喝到底，各留了退路。' } },
    { label: '江湖路窄，各走各的', rel: { mood: null, arc: null, decline: true } },
  ],
  spouse: [
    { label: '托媒下聘，明媒正娶', rel: { mood: 'warm', arc: '明媒正娶，红烛照了半城。从此你的行囊里多了一件冬衣，是有人缝的。' } },
    { label: '萍水相逢，就此别过', rel: { mood: null, arc: null, decline: true } },
  ],
  disciple: [
    { label: '收入门墙，倾囊相授', rel: { mood: 'warm', arc: '收入门墙。你把半生所学拆开揉碎，从站桩教起——教着教着，自己也明透了几分。' } },
    { label: '赠他一部功法，指条明路', rel: { mood: 'warm', arc: '没有收徒，但赠了功法、指了路。他磕了三个头走了，背影像极了当年的你。' } },
    { label: '山门不留客', rel: { mood: null, arc: null, decline: true } },
  ],
  nemesis: [
    { label: '拔剑——从今日起，你我必分高下', rel: { mood: 'strained', arc: '一战不分胜负。从此江湖上多了一对宿敌——你练剑，是为他；他练剑，也是为你。' } },
    { label: '收剑入鞘：「你还不配我拔剑」', rel: { mood: 'strained', arc: '你收剑不入局。那人怒极反笑，撂下一句「三年后再问」——这份梁子，结下了。' } },
  ],
};

// 一生推进句池：按 kind 与 mood 取
const COURSE = {
  sworn: {
    warm: [
      r => `${r.name}娶妻了。他在喜宴上喝得满面通红，拉着你的手说：「当年那碗酒，是我这辈子喝得最值的一碗。」`,
      r => `${r.name}发达了，托人给你捎来一身新衣。信上只有一句：「哥，天冷了。」`,
      r => `${r.name}落了难，变卖了宅子。你去看他，他倒是想得开：「大不了从头再来——你借我的那句话，我还留着。」`,
      r => `${r.name}替你挡了一桩祸事，硬是把官司揽到了自己身上。你去牢里看他，他隔着栅栏摆手：「兄弟之间，说这个就生分了。」`,
    ],
    strained: [
      r => `${r.name}近来信少了。捎东西来的人说话也吞吞吐吐——你们之间，隔了一层什么。`,
      r => `有人在酒桌上提起${r.name}，话里有话。你没接，但那晚的酒，喝着发苦。`,
    ],
    betray: r => `${r.name}背叛了你。旧年换帖的香灰还没凉透，他就把你的底细卖了个干净。你坐在他府外的石阶上坐了一夜——**这是此生最重的一笔落子。**`,
  },
  spouse: {
    warm: [
      r => `${r.name}病了一场，你守了半月。她烧糊涂时还在念叨：让你出门在外少喝酒。`,
      r => `你要远行，${r.name}没拦你，只把行囊里的伤药又多塞了两份：「江湖是你的，你也是这个家的。」`,
      r => `${r.name}鬓角有了白丝。她对着铜镜叹气，你说了句「白发也好看」，她笑了，眼角纹里都是光阴。`,
    ],
    strained: [
      r => `${r.name}劝你收手：「江湖上的名，是拿命换的。家里那盏灯，夜夜给你留着——你几时真的回来过？」`,
      r => `你又带伤回来。${r.name}没哭也没闹，只是那顿饭，她一粒米都没动。`,
    ],
  },
  child: {
    grow: [
      r => `${r.name}会走路了，摇摇晃晃专往你剑鞘上扑。${r.name}娘在一旁又急又笑。`,
      r => `${r.name}开蒙了，先生说你家孩子记性好。你在窗外站了一晌午，没进去。`,
      r => `${r.name}七岁了，抓周抓了你的剑穗。${r.name}娘的脸当时就沉了——你倒是在心里叹了口气。`,
    ],
    choose: r => `${r.name}十四岁了，到了择路的年纪。`,
    martial: r => `${r.name}随你入了江湖。第一堂课你教的是握剑的分寸——也是做人的分寸。`,
    study: r => `${r.name}送去念书了。临走时他回头看你，眼神里有不舍，也有一丝你读不懂的东西——像是庆幸。`,
    resent: r => `${r.name}怨你。怨你常年不在家，怨江湖占了你，怨他掌灯等到睡着的那些夜。这话是${r.name}娘转述的。你听完，一整晚没说话。`,
  },
  disciple: {
    warm: [
      r => `${r.name}出师了。他一剑破了你三分招式——青出于蓝，你输了半招，笑得比谁都开。`,
      r => `${r.name}自立门户了，临行前给你磕了三个头。你受了一个，避了两个：「头要磕给天下人看的时候再磕。」`,
      r => `${r.name}替你在江湖上扬了名。别人说「某某的徒弟」，你听着，比自己出名还熨帖。`,
    ],
    strained: [
      r => `${r.name}近来学艺浮了，剑里带躁。你训了他一句，他眼里有不忿——当年的你，好像不是这样的。`,
      r => `有人说在外头见过${r.name}，用你的剑法，干的是黑道上的营生。你没信，也没法不信。`,
    ],
    betray: r => `${r.name}欺师灭祖了。他带着你半生心血绘成的剑谱投了仇家，回山那天还冲你笑了笑。你举起剑，又放下了——「滚。江湖再小，别让我遇见。」`,
  },
  nemesis: {
    strained: [
      r => `你和${r.name}又打了一场。酣畅淋漓，两败俱伤，各自拎着剑回家养了三个月。`,
      r => `有人在${r.name}的酒里下毒。你查了三天，把下毒的人丢到了他府门口——「我的对手，轮不到别人动手。」`,
      r => `${r.name}伤了，卧床半年。江湖传言你最高兴。你却在夜里摸了摸剑——空落落的。`,
    ],
    warm: [
      r => `你和${r.name}坐在棋盘两侧，谁也没提剑。二十年打下来的默契，最后成了对坐喝茶——从拔剑到下棋，你们用了半生。`,
      r => `你与${r.name}并肩退了一伙马匪。事后各自别过脸去谁也不看谁——但你们的剑，头一回站在了同一边。`,
    ],
    death: r => `${r.name}死了。寿终于榻上，儿孙满堂。你赶去的时候只赶上一炷香。他儿子捧出一柄剑：「家父说，这个还给他。」你接剑在手，忽然觉得——世上再没人懂你的剑了。`,
  },
};

const OLD_AGE = 55;

function relName(rng, kind, used) {
  for (let i = 0; i < 40; i++) {
    const n = rng.pick(SURNAMES) + (kind === 'nemesis' ? '' : '') + rng.pick(GIVEN[kind]);
    if (!used.has(n)) { used.add(n); return n; }
  }
  return rng.pick(SURNAMES) + '氏';
}

// ---------- 相遇（yearTick 掷签） ----------
export function maybeMeetRelation(game) {
  const life = game.state.life;
  if (!life.rels) life.rels = [];
  const used = new Set(life.rels.map(r => r.name));
  const alive = life.rels.filter(r => r.alive);
  const count = k => alive.filter(r => r.kind === k).length;

  const cands = [];
  if (life.age >= 15 && life.age <= 45 && count('sworn') < 2) cands.push('sworn');
  if (life.age >= 16 && life.age <= 60 && count('spouse') === 0) cands.push('spouse');
  if (life.age >= 14 && life.age <= 70 && count('disciple') < 2) cands.push('disciple');
  if (life.age >= 16 && count('nemesis') < 1) cands.push('nemesis');
  if (alive.some(r => r.kind === 'spouse' && r.alive) && life.age < 50 && count('child') < 3) cands.push('child');
  if (!cands.length) return false;
  const kind = game.rng.pick(cands);

  // 名号与出场词
  let name, epithet;
  if (kind === 'child') {
    const sp = alive.find(r => r.kind === 'spouse');
    name = relName(game.rng, 'child', used);
    epithet = `${sp ? sp.name : '你妻室'}为你添了个孩子`;
  } else {
    name = relName(game.rng, kind, used);
    epithet = game.rng.pick(EPITHETS[kind]);
  }

  const rel = {
    id: 'rel_' + Math.floor(game.rng.int(0, 1e9)).toString(36),
    kind, name,
    metYear: game.state.world.year,
    metAge: life.age,
    mood: kind === 'child' ? 'warm' : null,
    alive: true,
    arc: [{ year: game.state.world.year, text: kind === 'child' ? `${epithet}，取名${name}。` : `遇见了${name}——${epithet}。` }],
  };
  if (kind === 'child') {
    // 子嗣无事件，直接落账
    life.rels.push(rel);
    game.say(`（家中添丁。${epithet}，取名${name}。）`, 'event');
    game.book('喜', `家中添丁，取名${name}`);
    return true;
  }

  const meetText = game.rng.pick(MEET_TEXTS[kind]);
  const evTitle = { sworn: '义结金兰', spouse: '姻缘一线', disciple: '师徒之缘', nemesis: '宿命之敌' }[kind];
  const ev = {
    id: 'rel_meet_' + rel.id,
    title: evTitle,
    text: `【${evTitle}】\n${epithet}，名叫${name}。\n\n${meetText}`,
    options: MEET_OPTIONS[kind].map(o => ({
      label: o.label,
      rel: { relId: rel.id, mood: o.rel?.mood, arc: o.rel?.arc, decline: o.rel?.decline },
    })),
  };
  life.rels.push(rel);
  game.fireEvent(ev);
  return true;
}

// 选项结算：设 mood、落 arc、写人物谱
export function applyRelChoice(game, spec) {
  const life = game.state.life;
  const rel = (life.rels || []).find(r => r.id === spec.relId);
  if (!rel) return;
  if (spec.decline) { rel.alive = false; rel.arc.push({ year: game.state.world.year, text: '一面之缘，就此别过。' }); game.say('（缘起缘灭，皆在一念。你们擦肩而过，江湖再无交集。）', 'event'); return; }
  rel.mood = spec.mood || rel.mood;
  if (spec.arc) rel.arc.push({ year: game.state.world.year, text: spec.arc });
  if (spec.arc) game.say(spec.arc, 'event');
  game.book(rel.kind === 'nemesis' ? '怨' : '恩', `${rel.kind === 'sworn' ? '结拜兄弟' : rel.kind === 'spouse' ? '结发之妻' : rel.kind === 'disciple' ? '门下弟子' : '宿敌'}${rel.name}，自此有了牵挂`);
  game.state.sleeve.people[rel.id] = { name: rel.name, desc: `${rel.kind === 'sworn' ? '结拜兄弟' : rel.kind === 'spouse' ? '发妻' : rel.kind === 'disciple' ? '弟子' : rel.kind === 'child' ? '子嗣' : '宿敌'}。${spec.arc || ''}` };
}

// ---------- 一生推进（yearTick 调用） ----------
export function advanceRelations(game) {
  const life = game.state.life;
  if (!life.rels) life.rels = [];
  const push = (rel, text, ledgerType) => {
    rel.arc.push({ year: game.state.world.year, text });
    game.say(text, 'event');
    if (ledgerType) game.book(ledgerType, text.slice(0, 40));
  };
  const used = new Set();

  for (const rel of life.rels) {
    if (!rel.alive) continue;
    const relAge = life.age - rel.metAge;
    switch (rel.kind) {
      case 'sworn': {
        if (rel.mood === 'warm' && game.rng.chance(0.22)) push(rel, game.rng.pick(COURSE.sworn.warm)(rel));
        else if (rel.mood === 'warm' && relAge > 10 && game.rng.chance(0.04)) {
          rel.mood = 'broken'; rel.alive = false;
          push(rel, COURSE.sworn.betray(rel), '怨');
        } else if (rel.mood === 'strained' && game.rng.chance(0.3)) push(rel, game.rng.pick(COURSE.sworn.strained)(rel));
        break;
      }
      case 'spouse': {
        if (life.age > OLD_AGE && game.rng.chance(0.06)) {
          rel.alive = false;
          push(rel, `${rel.name}走了。走的时候很安静，手里攥着你年轻时的那块玉佩。你把她葬在向阳的坡上——她说怕冷。`, '悲');
        } else if (game.rng.chance(0.25)) {
          push(rel, game.rng.pick(life.age > OLD_AGE ? COURSE.spouse.warm : rel.mood === 'strained' ? COURSE.spouse.strained : COURSE.spouse.warm)(rel));
        }
        break;
      }
      case 'child': {
        if (relAge <= 6 && game.rng.chance(0.3)) push(rel, game.rng.pick(COURSE.child.grow)(rel));
        if (relAge === 14 && !rel.flags?.chose) {
          rel.flags = { chose: true };
          const pick = rel.mood === 'warm' ? game.rng.pick(['martial', 'study']) : game.rng.pick(['study', 'resent']);
          if (pick === 'martial') { push(rel, COURSE.child.choose(rel) + '\n' + COURSE.child.martial(rel)); rel.path = 'martial'; }
          else if (pick === 'study') { push(rel, COURSE.child.choose(rel) + '\n' + COURSE.child.study(rel)); rel.path = 'study'; }
          else { rel.mood = 'strained'; push(rel, COURSE.child.choose(rel) + '\n' + COURSE.child.resent(rel)); rel.path = 'resent'; }
        } else if (relAge > 15 && game.rng.chance(0.15)) {
          if (rel.path === 'martial') push(rel, `${rel.name}在江湖上闯出了些名头。有人来问：「那位可是${life.name}的儿郎？」你嗯了一声，没再多话。`);
          else if (rel.path === 'study') push(rel, `${rel.name}中了县学。捎回家的信里写：「父亲大人安好。」字迹端正——端正得让你心酸。`);
          else if (rel.path === 'resent') push(rel, `${rel.name}成了家，搬去了县城。走时没回头。${rel.name}娘抹着泪骂你——这一回，你没辩。`);
        }
        break;
      }
      case 'disciple': {
        if (rel.mood === 'warm' && game.rng.chance(0.2)) push(rel, game.rng.pick(COURSE.disciple.warm)(rel));
        else if (rel.mood === 'warm' && relAge > 8 && game.rng.chance(0.04)) {
          rel.mood = 'broken'; rel.alive = false;
          push(rel, COURSE.disciple.betray(rel), '怨');
        } else if (rel.mood === 'warm' && game.rng.chance(0.12)) push(rel, game.rng.pick(COURSE.disciple.strained)(rel));
        break;
      }
      case 'nemesis': {
        if (relAge > 25 && game.rng.chance(0.15)) push(rel, game.rng.pick(COURSE.nemesis.warm)(rel));
        else if (game.rng.chance(0.25)) push(rel, game.rng.pick(COURSE.nemesis.strained)(rel));
        if (life.age > OLD_AGE && game.rng.chance(0.1)) {
          rel.alive = false;
          push(rel, COURSE.nemesis.death(rel), '悲');
        }
        break;
      }
    }
  }
}

// ---------- 判词侧写（盖棺） ----------
export function relVerdictLines(state) {
  const life = state.life;
  if (!life.rels || !life.rels.length) return [];
  const lines = [];
  const alive = life.rels.filter(r => r.alive);
  const dead = life.rels.filter(r => !r.alive);
  const spouse = alive.find(r => r.kind === 'spouse');
  const spouseDead = dead.find(r => r.kind === 'spouse');
  const kids = alive.filter(r => r.kind === 'child');
  const sworn = alive.filter(r => r.kind === 'sworn');
  const disciple = alive.filter(r => r.kind === 'disciple');
  const nemesisDead = dead.find(r => r.kind === 'nemesis');
  const betrayers = dead.filter(r => r.arc.some(a => a.text.includes('背叛') || a.text.includes('欺师灭祖')));

  if (spouse) lines.push(`发妻${spouse.name}仍在。你走后她守着那个家——灯还夜夜点着，只是再没人回来吹熄它。`);
  else if (spouseDead) lines.push(`发妻${spouseDead.name}先你而去。这样也好——黄泉路上，你们还能同行一程。`);
  if (kids.length) {
    const paths = kids.map(k => k.path);
    if (paths.includes('martial')) lines.push(`你的孩子在江湖上替你走了你没走完的路。`);
    else if (paths.includes('resent')) lines.push(`你的孩子到死没肯回来。这一生你欠江湖太多，欠家里也不少。`);
    else lines.push(`儿孙绕膝——这是你一生里，最不像江湖的一部分，也是最重要的部分。`);
  }
  if (sworn.length) lines.push(`结拜兄弟${sworn.map(s => s.name).join('、')}还在世上替你喝酒——往后碰杯，多倒一盏。`);
  if (betrayers.length) lines.push(`背叛你的人仍活得很好。这份账，你带进了土里，也带进了往世簿。`);
  if (disciple.length) lines.push(`门下弟子${disciple.map(d => d.name).join('、')}接过了你的剑。你的一生，在他们手里还要再活一遍。`);
  if (nemesisDead) lines.push(`宿敌${nemesisDead.name}先走了一步。临了那柄剑传回你手里——世上再没人懂你的剑了。`);
  return lines;
}

// ---------- 编年史（F 类：盖棺时由旧账册+关系一生合成） ----------
export function buildChronicle(state) {
  const life = state.life;
  const out = [];
  const startYear = life.rels?.[0]?.metYear ?? state.world.year;
  const ageAt = y => Math.max(0, life.age - (state.world.year - y));
  const items = [];
  // 旧账册大事
  for (const l of state.ledger) items.push({ year: l.year, text: `[${l.type}] ${l.text}` });
  // 关系一生大事（每条关系取首尾与转折）
  for (const r of life.rels || []) {
    for (const a of r.arc) {
      if (a.text.includes('遇见了') || a.text.includes('添丁') || a.text.includes('结拜') || a.text.includes('明媒') || a.text.includes('收入门墙') || a.text.includes('宿敌') || a.text.includes('背叛') || a.text.includes('欺师') || a.text.includes('再没人懂你的剑') || a.text.includes('走了。')) {
        items.push({ year: a.year, text: a.text });
      }
    }
  }
  items.sort((a, b) => a.year - b.year);
  for (const it of items.slice(0, 40)) {
    out.push(`${it.year}年（你约${ageAt(it.year)}岁）：${it.text}`);
  }
  if (!out.length) out.push('一生平平，无碑可立——可平平安安，谁说不是一种功德。');
  return out;
}
