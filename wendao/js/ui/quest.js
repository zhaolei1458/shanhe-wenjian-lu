
/* ======================================================================
 * §15.5 v11 剧情 · 问道九章 QuestSys（主线 + 奇遇录支线）
 * 主线：九章剧情随修为推进，每章开篇叙事 + 阶段目标 + 章末奖励；
 * 支线：奇遇录五则，达到境界解锁，达成后结案领赏。
 * 全部目标挂靠既有玩法行为，不新增玩法负担。
 * ====================================================================== */
const QuestSys = {
  checking: false,
  CN9: ['一', '二', '三', '四', '五', '六', '七', '八', '九'],
  /** 主线九章 ·《山河问剑录》（supR：境界领先到该大境界时，本章目标自动追认完成）
   *  剧情取自山河本传：命帖疑云起 → 寻访仙山 → 拜入名门 → 入世行脚 →
   *  金丹地火 → 元婴妖潮 → 化神通仙 → 东荒妖域 → 南天门验籍。
   *  步骤机制沿用参考框架（探索计数/胜场/境界门槛），只换叙事。 */
  CHAPTERS: [
    {
      id: 'c1', title: '命帖疑云', supR: 2,
      story: '你怀里揣着一纸命帖。\n帖上写的是你的来处、你的软肋，还有一桩悬而未决的旧事——那桩事夜里会变成影子，白日会变成旁人的窃语。\n老辈人说：山河为局，众生为子。你落子的第一手，先把眼下的日子过稳——根基不稳，连问案的资格都没有。',
      goal: '命帖在手，旧事在心。先固根基，再入江湖——悬案的门，从不为弱者开。',
      steps: [
        { desc: '根基初固（修为至练气中期）', done: p => p.realmIdx >= 1 || p.layer >= 1, prog: p => `${Math.min(1, p.realmIdx >= 1 ? 1 : p.layer)}/1` },
        { desc: '尘世历练（村野·后山探索五次）', done: p => ((p.counters.mapExplores || {}).village || 0) >= 5, prog: p => `${Math.min(5, (p.counters.mapExplores || {}).village || 0)}/5` },
        { desc: '自保有余（累计克敌三场）', done: p => (p.counters.wins || 0) >= 3, prog: p => `${Math.min(3, p.counters.wins || 0)}/3` },
      ],
      ending: '三月苦修，你的手稳了，心也稳了。夜里那道影子再来时，你没有躲——你记下了它的来路。命帖上的旧事，头一回有了下落。',
      reward: { stones: 300, fortune: 2, items: { pill_juqi: 2 } },
    },
    {
      id: 'c2', title: '寻访仙山', supR: 2,
      story: '命帖的暗线指向山外。听往来客商说，青峰山上有仙门气象——云起时半山如海，钟声隔着二十里都听得见。\n你背起行囊。第一次离家的路上你才明白：山河之大，不是命帖一页纸装得下的。\n寻仙问路，先问山。',
      goal: '循暗线出山，往青峰仙山寻访——仙缘这东西，讲究先到先问。',
      steps: [
        { desc: '仙山巡礼（青峰山探索三次）', done: p => ((p.counters.mapExplores || {}).qingfeng || 0) >= 3, prog: p => `${Math.min(3, (p.counters.mapExplores || {}).qingfeng || 0)}/3` },
        { desc: '路见不平（累计克敌八场）', done: p => (p.counters.wins || 0) >= 8, prog: p => `${Math.min(8, p.counters.wins || 0)}/8` },
        { desc: '修至练气圆满', done: p => p.realmIdx >= 1 || p.layer >= 3, prog: p => p.realmIdx >= 1 ? '1/1' : `${p.layer}/3` },
      ],
      ending: '练气圆满那夜，你在山腰望见云海开了一道缝——缝里有灯火，有钟声，有一条石阶直上不见顶。仙山的门，认出了你。',
      reward: { stones: 800, items: { pill_ningqi: 2 } },
    },
    {
      id: 'c3', title: '拜入名门', supR: 3,
      story: '筑基之夜，山门自开。\n执事长老验过你的根骨，只问了一句：「入我门中，所求为何？」\n你摸了摸怀中命帖：「求一个明白。」\n长老笑了：「好。宗门藏经万卷，耳目遍布诸州——你要求的明白，这里都借得了你。」',
      goal: '筑基入宗，借藏经与耳目之势——命帖旧事，该有个查法了。',
      steps: [
        { desc: '突破至筑基期', done: p => p.realmIdx >= 1, prog: p => `${p.realmIdx >= 1 ? 1 : 0}/1` },
        { desc: '拜入一座宗门', done: p => !!p.sect, prog: p => `${p.sect ? 1 : 0}/1` },
        { desc: '修习第一部功法', done: p => (p.counters.learns || 0) >= 1, prog: p => `${Math.min(1, p.counters.learns || 0)}/1` },
      ],
      ending: '藏经阁的故纸堆里，你翻到一页与命帖暗线相合的残卷——纸上的名字被人墨涂了，可涂痕底下，笔锋还认得出半个字。旧事的门，开了一道缝。',
      reward: { stones: 2000, items: { pill_zhuji: 1 } },
    },
    {
      id: 'c4', title: '入世行脚', supR: 3,
      story: '长老说：查案之前，先学会看人。\n你下山行脚——给守灯的老汉搭把手，替补网的瞎眼婆婆穿针，听驿丞念半塘报。江湖不在剑上，在人心里。\n恩怨、善恶、抉择，皆是修行。',
      goal: '入世行脚，红尘炼心——看惯了人心，才看得懂命帖上那桩旧事。',
      steps: [
        { desc: '广结善缘（结交一位江湖修士）', done: p => (p.counters.befriends || 0) >= 1, prog: p => `${Math.min(1, p.counters.befriends || 0)}/1` },
        { desc: '红尘一念（经历一次红尘劫抉择）', done: p => (p.counters.dilemmas || 0) >= 1, prog: p => `${Math.min(1, p.counters.dilemmas || 0)}/1` },
        { desc: '百战炼心（累计克敌二十场）', done: p => (p.counters.wins || 0) >= 20, prog: p => `${Math.min(20, p.counters.wins || 0)}/20` },
      ],
      ending: '行脚归来的路上，你忽然懂了命帖上软肋二字的分量——它不是弱点，是你落在山河里的根。根扎得深，剑才使得直。',
      reward: { stones: 5000, fortune: 10 },
    },
    {
      id: 'c5', title: '金丹地火', supR: 4,
      story: '金丹天劫的雷光里，命帖无风自燃——烧尽的灰烬落在掌心，排成一行小字：那桩旧事的源头，竟与丹道一脉相承。\n你入丹房，守地火，学人间最慢的功夫。一炉丹，是一场禅。',
      goal: '金丹既成，命帖显字。守地火、习丹道——旧事的线索藏在一炉一丹之间。',
      steps: [
        { desc: '成功突破金丹期', done: p => p.realmIdx >= 2, prog: p => `${p.realmIdx >= 2 ? 1 : 0}/1` },
        { desc: '丹道初窥（炼丹成丹或服丹，累计三次）', done: p => ((p.counters.craftsOk || 0) + (p.counters.pills || 0)) >= 3, prog: p => `${Math.min(3, (p.counters.craftsOk || 0) + (p.counters.pills || 0))}/3` },
        { desc: '挫敌扬威（累计击败精英妖兽两头）', done: p => (p.counters.killsElite || 0) >= 2, prog: p => `${Math.min(2, p.counters.killsElite || 0)}/2` },
      ],
      ending: '开炉那日，丹香清正。灰烬里的名字终于认全了——你把它记进行卷，合上册子：有些人欠的账，来日要当面还。',
      reward: { stones: 10000, items: { pill_pojing: 1 } },
    },
    {
      id: 'c6', title: '元婴妖潮', supR: 5,
      story: '元婴初成，神识大涨的当夜，你听见了山河深处的动静——东荒妖域的妖潮醒了，一波一波，像大地在翻身。\n旧事里那桩案子的余党，就藏在妖潮背后兴风作浪。\n正面相抗必死无疑。你想起典籍记载：上古法宝，克邪祟。集齐碎片，或有一线生机。',
      goal: '元婴出，妖潮动。深入秘境、汇聚上古碎片——妖潮背后，正是旧案余波。',
      steps: [
        { desc: '成功突破元婴期', done: p => p.realmIdx >= 3, prog: p => `${p.realmIdx >= 3 ? 1 : 0}/1` },
        { desc: '秘境探幽（秘境抵达第三层）', done: p => (p.counters.maxDepth || 0) >= 3, prog: p => `${Math.min(3, p.counters.maxDepth || 0)}/3` },
        { desc: '碎片聚势（累计收取上古法宝碎片五枚）', done: p => (p.counters.gupianGot || 0) >= 5, prog: p => `${Math.min(5, p.counters.gupianGot || 0)}/5` },
      ],
      ending: '五枚碎片在你掌心嗡鸣成阵。妖潮暂退——它们在等头领出关，你也在等，等自己足够强。行卷里那页名字，又被你描深了一笔。',
      reward: { stones: 20000, items: { m_gupian: 2 } },
    },
    {
      id: 'c7', title: '化神通仙', supR: 6,
      story: '化神之后，你的名字开始在诸州流传。这日，一位白须掌门亲自到访，开门见山：「你命帖上那桩旧事，老夫听过——当年经手的人里，有一位如今位高权重。老朽时日无多，你若要查，老夫把名字给你。」\n他留下一个名单，拂袖去了。',
      goal: '化神成名，白须掌门递来旧案名单——第一个名字，位高权重。',
      steps: [
        { desc: '成功突破化神期', done: p => p.realmIdx >= 4, prog: p => `${p.realmIdx >= 4 ? 1 : 0}/1` },
        { desc: '精英授首（累计击败精英妖兽八头）', done: p => (p.counters.killsElite || 0) >= 8, prog: p => `${Math.min(8, p.counters.killsElite || 0)}/8` },
        { desc: '家底殷实（灵石积蓄十万）', done: p => (p.stones.low + p.stones.mid * 100 + p.stones.high * 10000) >= 100000, prog: p => `${Utils.fmtNum(Math.min(100000, p.stones.low + p.stones.mid * 100 + p.stones.high * 10000))}/10万` },
      ],
      ending: '名单在手，你反而冷静下来。棋盘比你想的大——但你早已不是命帖开篇那个连路都问不明白的少年。化神已稳，接下来，该让某些人睡不着了。',
      reward: { stones: 50000, fortune: 5 },
    },
    {
      id: 'c8', title: '东荒妖域', supR: 8,
      story: '大乘雷劫落定，你的道已近圆满。名单上的名字开始一个个出事——有人暴毙，有人失踪，有人在狱中留下一句「他也只是执子之人」。\n你深知：终局之前，当有亲友相依、大道相佐——孤身一人，破不了这盘下了几十年的棋。',
      goal: '终局将临。觅相依之人、参大道之理，方有执子的资格。',
      steps: [
        { desc: '成功突破大乘期', done: p => p.realmIdx >= 7, prog: p => `${p.realmIdx >= 7 ? 1 : 0}/1` },
        { desc: '觅得相依之人（结为道侣或义结金兰）', done: p => !!p.partner || (p.sworn || []).length > 0, prog: p => `${(p.partner ? 1 : 0) + Math.min(1, (p.sworn || []).length)}/1` },
        { desc: '参悟小成（任意功法修至第三层）', done: p => Object.values(p.gongfa || {}).some(g => g.level >= 3), prog: p => { let mx = 0; for (const g of Object.values(p.gongfa || {})) mx = Math.max(mx, g.level); return `${Math.min(3, mx)}/3`; } },
      ],
      ending: '道友在侧，真意在胸。行卷忽然自己翻开，停在那页名字上——终局的棋盘已选定：你的飞升雷台。',
      reward: { stones: 100000, fortune: 10, items: { pill_taichu: 1 } },
    },
    {
      id: 'c9', title: '南天门验籍', supR: 999,
      story: '渡劫雷云压顶之际，一道身影踏雷而来——名单上最后一个名字，也是当年执子最后一手的人，竟亲赴你的雷台。\n他要在天劫中与你做个了断：棋局收官，胜负各安天命。\n雷海之上，山河为证，终须一战。',
      goal: '飞升雷台，即收官之地。渡劫、了断、验籍——一局一生，就此落子。',
      steps: [
        { desc: '成功突破渡劫期', done: p => p.realmIdx >= 8, prog: p => `${p.realmIdx >= 8 ? 1 : 0}/1` },
        { desc: '精英十授首（累计击败精英妖兽十五头）', done: p => (p.counters.killsElite || 0) >= 15, prog: p => `${Math.min(15, p.counters.killsElite || 0)}/15` },
        { desc: '白日飞升（于天劫中了断棋局）', done: p => !!(p.flags || {}).ascended, prog: p => `${(p.flags || {}).ascended ? 1 : 0}/1` },
      ],
      ending: '第九道天雷落下时，你引动行卷中一世的因果，与来人的杀局同缚雷心。雷光吞没一切的刹那，你听见那人长叹：「几十年……原来输的是我心魔。」\n雷散，云开。南天门下仙官验你的籍——命帖化作一点朱砂，落进你的眉心。你回首人间，白衣胜雪：一局终了，卷末留册；下世山河，另起一盘。',
      reward: { stones: 200000, fortune: 20 },
    },
  ],
  /** 奇遇录 · 支线十二则（minRealm 解锁境界；v19 起含 NPC 绑定与任务链） */
  SIDES: [
    {
      id: 's1', title: '义庄尸变', minRealm: 0,
      story: '新手村义庄近来夜半有声，更夫不敢值夜。你自告奋勇守夜——子时刚过，棺木果然自己动了。',
      steps: [
        { desc: '村中历练（新手村·后山探索八次）', done: p => ((p.counters.mapExplores || {}).village || 0) >= 8 },
        { desc: '除祟安民（累计获胜六场）', done: p => (p.counters.wins || 0) >= 6 },
      ],
      ending: '尸变之源是一缕误入棺中的游魂。你以灵力超度，义庄重归安宁。村老千恩万谢，塞给你一包谢礼。',
      reward: { stones: 500, items: { pill_liaoshang: 3 } },
    },
    {
      id: 's2', title: '药翁遗方', minRealm: 1,
      story: '坊市后巷的药翁守着一座冷炉。他祖传的丹方在战乱中失了后半卷，他赌上余生想复刻出来，却屡炉屡败。他想借你的手，替他把这炉丹试完。',
      steps: [
        { desc: '妙手试炉（炼丹成功三次）', done: p => (p.counters.craftsOk || 0) >= 3 },
        { desc: '亲验药力（服丹两次）', done: p => (p.counters.pills || 0) >= 2 },
      ],
      ending: '第三炉开炉，丹香清正——丹方成了！药翁老泪纵横，将祖传的一枚洗髓丹赠你：「丹成之日，方知当年执念误我一生。小友，莫学老朽。」',
      reward: { items: { pill_xisui: 1 } },
    },
    {
      id: 's3', title: '剑冢遗鸣', minRealm: 2,
      story: '城外古剑冢夜夜剑鸣，樵夫说那是一位剑仙埋骨之地，剑意不散。你入冢探看，一柄断剑在你靠近时铮然出鞘半寸——它在等一个配得上它的人。',
      steps: [
        { desc: '力挫精英（累计击败精英妖兽四头）', done: p => (p.counters.killsElite || 0) >= 4 },
        { desc: '剑心可鉴（修习任意功法）', done: p => (p.counters.learns || 0) >= 1 },
      ],
      ending: '断剑认主，却又自行崩碎——原来它只借剑鸣传讯。冢中石壁留有一句刻字：「剑非杀人器，护道方为锋。」你恍然有所悟，一缕剑意入体。',
      reward: { stones: 8000, fortune: 5 },
    },
    {
      id: 's4', title: '万商护标', minRealm: 3,
      story: '万宝商会贴出悬赏：一队送往北域的宝镖，需要一位足以服众的高手押标。管事上下打量你：「行。但商会只认实力与信誉——家底与人心，你得让大伙服气。」',
      steps: [
        { desc: '家资巨万（灵石积蓄五万）', done: p => (p.stones.low + p.stones.mid * 100 + p.stones.high * 10000) >= 50000 },
        { desc: '江湖人脉（结交两位修士）', done: p => (p.counters.befriends || 0) >= 2 },
      ],
      ending: '宝镖一路平安。结算之日，管事奉上厚酬，并递给你一枚商会金纹：「北域之外还有南疆——来日商会开到南疆，还需道友这般人物。」',
      reward: { stones: 20000, fortune: 8 },
    },
    {
      id: 's5', title: '飞升遗诏', minRealm: 8,
      story: '集齐碎片的夜里，你梦见一位白衣仙人，他指着渡劫期的雷云对你说了四个字：「劫上有劫。」醒来时枕边多了一卷泛黄遗诏——落款处，竟是三百年前飞升的血河宗开派祖师。',
      steps: [
        { desc: '碎片归一（累计收取上古法宝碎片九枚）', done: p => (p.counters.gupianGot || 0) >= 9 },
        { desc: '突破渡劫期', done: p => p.realmIdx >= 8 },
      ],
      ending: '遗诏结尾写着：「吾宗堕魔，非吾本意。持此诏者，代吾清门户。」你将遗诏折好收入怀中——原来三百年前的因，早为今日的果埋好了线。',
      reward: { fortune: 15, items: { pill_xisui: 2 } },
    },
    /* ---- v19 支线扩充（NPC 绑定 + 任务链；npc：结案时关系 +8 并写入记忆） ---- */
    {
      id: 's6', title: '顽石之托', minRealm: 1, npc: 'n20',
      story: '磐岩谷长老石破天在坊市拦住你，一双铁掌捧着半块碎裂的阵盘：「谷中演武场地脉塌了，这是从底下挖出来的老物件——认得这纹路的人，方圆千里只有你一个。」',
      steps: [
        { desc: '力证实力（累计击败精英妖兽两头）', done: p => (p.counters.killsElite || 0) >= 2 },
        { desc: '踏勘地脉（妖兽森林探索三次）', done: p => ((p.counters.mapExplores || {}).forest || 0) >= 3 },
      ],
      ending: '你认出阵盘纹路出自上古困杀大阵的一角——与秘境碎片同源。石破天瞪大眼睛，半晌憋出一句：「俺就说没找错人！」',
      reward: { stones: 3000, items: { pill_tiegu: 2 } },
    },
    {
      id: 's7', title: '裂山失约', minRealm: 2, npc: 'n16', prev: 's6',
      story: '磐岩谷大弟子楚天阔失约了——约好同去勘矿的日子，他在矿洞口留下血书：谷中暗河之下，有「活物」咬断了锁链。石破天请你入谷一探。',
      steps: [
        { desc: '以武会友（与江湖修士切磋两次）', done: p => (p.counters.spars || 0) >= 2 },
        { desc: '备下盘缠（灵石积蓄两万）', done: p => QuestSys.stonesTotal(p) >= 20000 },
      ],
      ending: '暗河底的「活物」是一头失控的岩甲兽——当年困杀大阵崩了一角，镇在谷下的东西醒了。你与楚天阔联手将其重新镇回。他抱拳：「这条命，算你一半。」',
      reward: { stones: 8000, fortune: 4 },
    },
    {
      id: 's8', title: '磐岩之心', minRealm: 3, npc: 'n20', prev: 's7',
      story: '石破天破天荒地设了一桌酒席，请你坐上首：「谷中长老会决议——磐岩谷欠你一份大因果。谷库里有件老祖宗传下的东西，掌谷说，给能镇得住它的人。」',
      steps: [
        { desc: '深入秘境（秘境推进至第三层）', done: p => (p.counters.maxDepth || 0) >= 3 },
        { desc: '百战之资（累计获胜四十场）', done: p => (p.counters.wins || 0) >= 40 },
      ],
      ending: '谷库深处，一块温润的磐石在灵光中沉浮——「磐岩之心」，谷派开山时镇谷之物。石破天亲手为你系上：「往后磐岩谷的山门，永远为你开。」',
      reward: { stones: 15000, items: { m_gupian: 1 } },
    },
    {
      id: 's9', title: '烟雨追账', minRealm: 2, npc: 'n5',
      story: '烟雨楼主柳含烟隔着珠帘打量你：「黑风寨背后那本账，你也想知道吧？巧了——我也是。各出一半力，账查清了，五五分。」',
      steps: [
        { desc: '广布眼线（结交三位修士）', done: p => (p.counters.befriends || 0) >= 3 },
        { desc: '夜探匪巢（黑风寨探索五次）', done: p => ((p.counters.mapExplores || {}).heifeng || 0) >= 5 },
      ],
      ending: '账册合拢——黑风寨历年掘获，三成流向同一个匿名暗桩。柳含烟指尖敲着账册：「这条线，你捏着一半，我捏着一半。往后江湖上，你我算一伙的。」',
      reward: { stones: 12000, insight: 5 },
    },
    {
      id: 's10', title: '血罗刹的委托', minRealm: 3, npc: 'n22',
      story: '月下，红绡的身影从檐角落下来，红衣胜血：「听说你在查血河。巧了——我也有笔账要算。帮我把这批货截下来，你查你的，我拿我的。」',
      steps: [
        { desc: '斩草除根（累计击败精英妖兽六头）', done: p => (p.counters.killsElite || 0) >= 6 },
        { desc: '截获暗货（妖兽森林探索五次）', done: p => ((p.counters.mapExplores || {}).forest || 0) >= 5 },
      ],
      ending: '货箱开启——里面不是灵材，是一箱引魂玉的仿品。红绡眸光冷了下来：「有人在做假玉。做假玉的人……知道真玉的炼法。」她把仿品收进袖中，「这份情，红绡记下了。」',
      reward: { fortune: 6, items: { m_gupian: 1 } },
    },
    {
      id: 's11', title: '醉后真言', minRealm: 4, npc: 'n23',
      story: '老酒鬼堵在坊市酒肆门口，葫芦晃荡：「小娃娃，陪老头子喝一场。酒钱你出——好酒，最烈的那种。老头子有句话，酒到了才能说。」',
      steps: [
        { desc: '以酒会友（与江湖修士切磋三次）', done: p => (p.counters.spars || 0) >= 3 },
        { desc: '酒资不菲（灵石积蓄八万）', done: p => QuestSys.stonesTotal(p) >= 80000 },
      ],
      ending: '三坛烈酒下肚，老酒鬼伏在桌上，声音忽然清醒得可怕：「水底下那位……的三百年，老头子一天一天看着。你想下水，先学会——别信水面上的倒影。」',
      reward: { fortune: 8, insight: 6 },
    },
    {
      id: 's12', title: '星轨残图', minRealm: 5, npc: 'n17',
      story: '周天阁首席姬冰颜的传讯玉符落在你案头，只有一行清冷小字：「观星塔藏图残了三分之一。补全它，需要一枚你手里的东西——碎片拓影。」',
      steps: [
        { desc: '力破守关（击败秘境守关者一位）', done: p => (p.counters.bossKills || 0) >= 1 },
        { desc: '参悟至理（修习三部功法）', done: p => (p.counters.learns || 0) >= 3 },
      ],
      ending: '拓影合入残图，星轨亮起一线——血河故道上空，那颗三百年未曾移动的星，微微颤了一下。姬冰颜难得地侧过头：「多谢。这一颤，我等了十年。」',
      reward: { insight: 8, items: { m_gupian: 1 } },
    },
    /* ---- v20 支线扩充（NPC 绑定，与个人线互补） ---- */
    {
      id: 's13', title: '断弦之谜', minRealm: 2, npc: 'n7',
      story: '洛雪衣的琴又断了一根弦——这已是本月第三次。她盯着断口看了很久：「断口平整，不是旧损。有人在暗中以音波伤我的琴。」',
      steps: [
        { desc: '以武会友（与江湖修士切磋两次）', done: p => (p.counters.spars || 0) >= 2 },
        { desc: '揖盗擒凶（累计获胜十五场）', done: p => (p.counters.wins || 0) >= 15 },
      ],
      ending: '你们在坊市暗角截住了那个以琴音伤琴的同行——一个输不起的琴师。洛雪衣没有动手，只弹了一曲。曲毕，那人当街折了自己的琴。「琴道之争，琴上解决。」',
      reward: { stones: 6000, fortune: 4 },
    },
    {
      id: 's14', title: '商会的暗账', minRealm: 2, npc: 'n8',
      story: '秦重楼罕见地一脸愁容：「商会的暗账被人做了手脚——三笔灵石流向对不上。我要一个账房之外的人，帮我核一遍。」',
      steps: [
        { desc: '家资殷实（灵石积蓄三万）', done: p => QuestSys.stonesTotal(p) >= 30000 },
        { desc: '夜探匪巢（黑风寨探索三次）', done: p => ((p.counters.mapExplores || {}).heifeng || 0) >= 3 },
      ],
      ending: '账目在黑风寨的一处赃点上对上了——原来是管事里应外合。秦重楼合上账本：「商会欠你一个人情。往后你来买东西，内部价。」',
      reward: { stones: 10000, items: { pill_yulu: 2 } },
    },
    {
      id: 's15', title: '阵眼之约', minRealm: 4, npc: 'n10',
      story: '白玉京递来一枚空白的阵石：「试阵如试人。带它下一趟秘境，让它看看你的路数——回来自会知晓它认不认你。」',
      steps: [
        { desc: '深入秘境（秘境推进至第五层）', done: p => (p.counters.maxDepth || 0) >= 5 },
        { desc: '精英授首（累计击败精英妖兽十头）', done: p => (p.counters.killsElite || 0) >= 10 },
      ],
      ending: '归来时，空白阵石上浮出了一道细纹——恰与白玉京那座百年大阵的纹路同源。「它认你了。」老人抚掌而笑，「这可是百年头一遭。」',
      reward: { stones: 8000, items: { m_gupian: 1 } },
    },
    {
      id: 's16', title: '无名名帖', minRealm: 3, npc: 'n12',
      story: '谢惊鸿托人捎来口信：「有人出高价悬赏『谢惊鸿』的人头。帮我查查——是谁想买一个名字。」',
      steps: [
        { desc: '广结善缘（结交四位修士）', done: p => (p.counters.befriends || 0) >= 4 },
        { desc: '以武会友（与江湖修士切磋四次）', done: p => (p.counters.spars || 0) >= 4 },
      ],
      ending: '线索指向一个被偷过传家宝的富商——他要买的人头，其实是一场吓唬。谢惊鸿听完大笑：「早说啊！我还以为多大仇。」他退了赃，事情了了。',
      reward: { stones: 8000, insight: 4 },
    },
    {
      id: 's17', title: '疏影初成', minRealm: 2, npc: 'n14',
      story: '沈疏影偷偷找到你：「我自创的剑法缺一场真刀真枪的印证——你陪我打十五场，让我把每一式都喂进实战里。」',
      steps: [
        { desc: '百战之资（累计获胜二十五场）', done: p => (p.counters.wins || 0) >= 25 },
        { desc: '博采众长（修习两部功法）', done: p => (p.counters.learns || 0) >= 2 },
      ],
      ending: '第十五场打完，她收剑而立，眉目飞扬：「成了！这套剑活了！」她郑重把第一式演示给你看——剑光如疏影横斜，「《不在人后》。名字也想好了。」',
      reward: { stones: 5000, items: { pill_zhuji: 1 } },
    },
  ],
  stonesTotal(p) { return p.stones.low + p.stones.mid * 100 + p.stones.high * 10000; },
  /** v12 每章各目标对应的功能页签（供焦点条「前往」直达） */
  GO: {
    c1: ['cultivate', 'map', 'map'],
    c2: ['map', 'map', 'cultivate'],
    c3: ['cultivate', 'sect', 'gongfa'],
    c4: ['jianghu', 'map', 'map'],
    c5: ['cultivate', 'shop', 'map'],
    c6: ['cultivate', 'map', 'map'],
    c7: ['cultivate', 'map', 'shop'],
    c8: ['cultivate', 'jianghu', 'gongfa'],
    c9: ['cultivate', 'map', 'cultivate'],
  },
  /** v12 有效章节序号：跳过「境界已领先、目标全部自动追认」的章节（正式结算仍在 check 中逐章进行） */
  currentChapterIdx(p) {
    const q = p.quest || { ch: 0 };
    let ch = Math.min(q.ch, this.CHAPTERS.length - 1);
    while (ch < this.CHAPTERS.length - 1) {
      const def = this.CHAPTERS[ch];
      if (!def.steps.every(st => this.stepDone(st, p, def.supR))) break;
      ch++;
    }
    return ch;
  },
  /** v12 当前主线焦点：{ title, text, go 页签 }，全部完成时返回 null */
  focus() {
    const p = Game.player;
    if (!p) return null;
    const ch = this.currentChapterIdx(p);
    const def = this.CHAPTERS[ch];
    const idx = def.steps.findIndex(st => !this.stepDone(st, p, def.supR));
    if (idx < 0) return null;
    return { ch, title: def.title, text: def.steps[idx].desc, go: (this.GO[def.id] || [])[idx] || 'cultivate' };
  },
  stepDone(step, p, supR) {
    if (p.realmIdx >= (supR || 999)) return true;   // 境界领先：旧章目标自动追认
    try { return !!step.done(p); } catch (e) { return false; }
  },
  rewardText(reward) {
    const parts = [];
    if (reward.stones) parts.push(`灵石 ${Utils.fmtNum(reward.stones)}`);
    if (reward.fortune) parts.push(`气运 +${reward.fortune}`);
    for (const [id, n] of Object.entries(reward.items || {})) parts.push(`${GameData.ITEMS[id].name} ×${n}`);
    return parts.join('、') || '无';
  },
  storyHtml(text) { return text.split('\n').map(t => `<p class="story-p">${t}</p>`).join(''); },
  /** v11 叙事入卷：剧情以「羊皮卷」样式写入游历记载（不弹窗，不阻断操作） */
  storyLog(head, text) {
    Log.add(head, 'system');
    text.split('\n').forEach(line => Log.add(line, 'story'));
  },
  /** v15 开篇演出：全屏卷轴播放章节开篇（取代日志投放） */
  showStory(idx) {
    const def = this.CHAPTERS[idx];
    if (!def) return;
    const key = `c${idx + 1}_open`;
    Story.play(GameData.STORIES[key], () => {
      Log.add(`【本章目标】${def.goal}`, 'story');
      UI.announce(`主线 · ${def.title}`, 'gold');
      UI.renderAll();
      Save.autoSave(true);
    });
  },
  /** v15 中段插章：本章第一个目标完成时触发一次 */
  checkMid(p, def, chIdx) {
    if (!p.story || p.story.mid[def.id]) return;
    if (!def.steps[0] || !this.stepDone(def.steps[0], p, def.supR)) return;
    p.story = p.story || { seen: {}, mid: {}, choices: {} };
    // 境界领先追认场景：静默标记，不播
    if (p.realmIdx >= (def.supR || 999)) { p.story.mid[def.id] = 1; return; }
    p.story.mid[def.id] = Math.floor(p.day);
    Story.play(GameData.STORIES[`c${chIdx + 1}_mid`]);
  },
  /** v19 反派暗线插章：本章第二个目标完成时触发一次（mid 播毕后） */
  checkMid2(p, def, chIdx) {
    if (!p.story || !p.story.mid[def.id] || p.story.mid[def.id + '_2']) return;
    if (!def.steps[1] || !this.stepDone(def.steps[1], p, def.supR)) return;
    const script = GameData.STORIES[`c${chIdx + 1}_mid2`];
    if (!script) return;   // 暂无此段则不打标，后续章节补齐后自动生效
    p.story.mid[def.id + '_2'] = Math.floor(p.day);
    if (p.realmIdx >= (def.supR || 999)) return;   // 境界领先追认：静默跳过
    Story.play(script);
  },
  /** 每次行动后检查：当前章节目标齐备则完结 → 播章末演出 → 发奖 → 衔接下一章开篇 */
  async check() {
    if (this.checking) return;
    const p = Game.player;
    if (!p || p.dead) return;
    if (Story.active()) return;   // v15 剧情播放中不推进（播毕后下次行动再查）
    const q = p.quest = p.quest || { ch: 0, side: {} };
    const def = this.CHAPTERS[q.ch];
    if (!def) return;
    this.checkMid(p, def, q.ch);
    this.checkMid2(p, def, q.ch);
    if (Story.active()) return;
    if (!def.steps.every(st => this.stepDone(st, p, def.supR))) return;
    this.checking = true;
    try {
      q.ch += 1;
      Story.chron(`主线 · 第${this.CN9[q.ch - 1]}章「${def.title}」完结`);   // v19 年表
      UI.announce(`主线 · ${def.title} · 完结`, 'gold');
      Log.add(`✦ 主线推进 · 第${this.CN9[q.ch - 1]}章「${def.title}」完成！`, 'realm');
      DaoxinSys.attune(p, q.ch);   // v18 残玉共鸣 +1 重
      this.grant(def.reward);
      const rewardLine = `【章末奖励】${this.rewardText(def.reward)}`;
      const next = this.CHAPTERS[q.ch];
      const supSkipped = next && p.realmIdx >= (next.supR || 999);
      // v15 章末演出（结算场注入奖励行）
      const endScript = GameData.STORIES[`c${q.ch}_end`];
      if (endScript) {
        const scenes = endScript.scenes.slice();
        scenes.push({ t: 'reward', lines: [rewardLine] });
        Story.play({ id: endScript.id, title: endScript.title, scenes });
      } else {
        Log.add(rewardLine, 'gain');
      }
      if (next) {
        const after = () => {
          Log.add(`【本章目标】${next.goal}`, 'story');
          UI.renderAll();
          Save.autoSave(true);
        };
        if (supSkipped) {
          // 境界领先追认：不发开篇演出，只记日志（避免中期入坑连播）
          this.storyLog(`【主线 · 第${this.CN9[q.ch]}章 · ${next.title}】`, next.story);
          Log.add(`【本章目标】${next.goal}`, 'story');
          UI.announce(`主线 · ${next.title}`, 'gold');
          after();
        } else {
          // v18 角色注脚：开篇卷轴末尾追加残玉低语 / 道侣客串，让剧情看见"你是谁"
          const openScript = GameData.STORIES[`c${q.ch + 1}_open`];
          if (openScript) {
            const scenes = openScript.scenes.slice();
            scenes.push(...DaoxinSys.openEcho(p, q.ch + 1));
            Story.play({ id: openScript.id, title: openScript.title, scenes }, after);
          } else { after(); }
        }
      } else {
        Log.add('✦ 问道九章 · 全部完结！残玉化砂，仙路已成。', 'realm');
        UI.renderAll();
        Save.autoSave(true);
      }
    } finally { this.checking = false; }
  },
  grant(reward) {
    if (reward.stones) Bag.addStones(reward.stones);
    if (reward.fortune) KarmaSys.addFortune(reward.fortune, true);
    for (const [id, n] of Object.entries(reward.items || {})) Bag.addItem(id, n);
  },
  /** 支线结案 */
  async claimSide(id) {
    const p = Game.player;
    if (!p) return;
    const q = p.quest = p.quest || { ch: 0, side: {} };
    const sd = this.SIDES.find(x => x.id === id);
    if (!sd || q.side[id]) return;
    if (p.realmIdx < sd.minRealm) { UI.toast(`需 ${GameData.REALM_NAMES[sd.minRealm]}期方可了结此事`); return; }
    // v19 任务链：前置支线须先结案
    if (sd.prev && !q.side[sd.prev]) { UI.toast('前置事件尚未了结'); return; }
    if (!sd.steps.every(st => this.stepDone(st, p))) { UI.toast('结案条件尚未达成'); return; }
    q.side[id] = true;
    UI.announce(`支线 · ${sd.title} · 了结`, 'gold');
    this.storyLog(`【支线结案 · ${sd.title}】`, sd.ending);
    this.grant(sd.reward);
    Log.add(`【酬谢】${this.rewardText(sd.reward)}`, 'gain');
    // v19 NPC 绑定：结案增进交情、写入记忆与年表
    if (sd.npc) {
      const s = NpcSys.state(p, sd.npc);
      if (s) {
        s.met = true;
        s.rel = Utils.clamp(s.rel + 8, -100, 100);
        NpcSys.mem(p, sd.npc, 'story', `支线·${sd.title}`);
      }
      const nd = NpcSys.def(sd.npc);
      if (nd) Log.add(`${nd.name} 对你刮目相看——此事之后，你们的关系更进了一步。（交情 +8）`, 'gain');
    }
    Story.chron(`支线「${sd.title}」结案`);
    UI.renderAll();
    Save.autoSave(true);
  },
  /** 问道页渲染（v15：章节进度轨 + 目标进度 + 问道录回顾） */
  renderTab() {
    const p = Game.player;
    const q = p.quest = p.quest || { ch: 0, side: {} };
    const ch = Math.min(q.ch, this.CHAPTERS.length);
    // 九章进度轨
    const rail = this.CHAPTERS.map((def, i) => {
      const state = i < ch ? 'done' : i === ch ? 'cur' : 'lock';
      return `<div class="rail-node ${state}" title="第${this.CN9[i]}章 · ${def.title}${state === 'done' ? '（已完结）' : state === 'cur' ? '（进行中）' : ''}">
        <span class="rail-dot">${state === 'done' ? '✓' : i + 1}</span>
        <span class="rail-name">${def.title}</span>
      </div>`;
    }).join('<span class="rail-link"></span>');
    const railHtml = `
    <div class="card quest-card card-main">
      <div class="card-title">✦ 主线 · 问道九章 <span class="tag">${ch}/${this.CHAPTERS.length} 章</span>
        <button class="btn btn-sm" data-action="quest-review" style="margin-left:auto">📜 问道录 · 剧情回顾</button></div>
      <div class="quest-rail">${rail}</div>
    </div>`;
    let mainHtml;
    if (ch >= this.CHAPTERS.length) {
      mainHtml = `
      <div class="card quest-card">
        <div class="card-title">主线 · 问道九章（已圆满）</div>
        <div class="card-desc">残玉化砂，仙路已成。三百年血案昭雪，你的故事却仍在继续——轮回转世，另有一番天地机缘。</div>
      </div>`;
    } else {
      const def = this.CHAPTERS[ch];
      const goTabs = this.GO[def.id] || [];
      const steps = def.steps.map((st, si) => {
        const ok = this.stepDone(st, p, def.supR);
        const prog = (!ok && st.prog) ? `<span class="q-prog">${st.prog(p)}</span>` : '';
        const go = (!ok && goTabs[si]) ? `<button class="btn btn-sm q-go" data-action="quest-goto" data-tab="${goTabs[si]}">前往</button>` : '';
        return `<div class="q-step ${ok ? 'done' : ''}"><span class="q-mark">${ok ? '✓' : '○'}</span><span class="q-desc">${st.desc}</span>${prog}${go}</div>`;
      }).join('');
      mainHtml = `
      <div class="card quest-card card-main">
        <div class="card-title">主线 · 第${this.CN9[ch]}章 · ${def.title} <span class="tag warn">进行中</span></div>
        <div class="card-desc">${def.goal}</div>
        <div class="q-steps">${steps}</div>
        <div class="tip-line">章末奖励：${this.rewardText(def.reward)}</div>
      </div>`;
    }
    const sideRows = this.SIDES.map(sd => {
      const done = !!q.side[sd.id];
      const prevDone = !sd.prev || !!q.side[sd.prev];
      const npcName = sd.npc ? ((NpcSys.def(sd.npc) || {}).name || '') : '';
      const npcTag = npcName ? ` <span class="tag magic" title="${npcName}：结案增进交情，写入共同记忆">◈ ${npcName}</span>` : '';
      const locked = p.realmIdx < sd.minRealm || !prevDone;
      const allDone = sd.steps.every(st => this.stepDone(st, p));
      let state = '<span class="tag">进行中</span>';
      let action = '';
      if (done) state = '<span class="tag safe">已了结</span>';
      else if (!prevDone) { const prevSd = this.SIDES.find(x => x.id === sd.prev); state = `<span class="tag">前置 · ${prevSd ? prevSd.title : sd.prev}</span>`; }
      else if (locked) state = `<span class="tag">${GameData.REALM_NAMES[sd.minRealm]}期解锁</span>`;
      else if (allDone) { state = '<span class="tag warn">可结案</span>'; action = `<button class="btn btn-sm btn-primary" data-action="quest-side" data-side="${sd.id}">结 案</button>`; }
      const stepTxt = sd.steps.map(st => {
        const ok = this.stepDone(st, p);
        const prog = (!ok && st.prog) ? ` <span class="q-prog">${st.prog(p)}</span>` : '';
        return `<span class="q-step ${ok ? 'done' : ''}" style="display:inline-block;margin-right:14px">${ok ? '✓' : '○'} ${st.desc}${prog}</span>`;
      }).join('');
      return `
      <div class="card side-card ${done ? 'side-done' : ''}">
        <div class="card-title">支线 · ${sd.title} ${state}${npcTag}</div>
        <div class="card-desc">${done ? sd.ending : sd.story}</div>
        ${done ? '' : `<div class="q-steps">${stepTxt}</div><div class="tip-line">酬谢：${this.rewardText(sd.reward)}</div>${action ? `<div class="action-row">${action}</div>` : ''}`}
      </div>`;
    }).join('');
    return `${railHtml}${mainHtml}<div class="shop-section-title">◈ 奇遇录 · 支线</div>${sideRows}`;
  },

  /** v20 问道录 · 百科词条（LORE 词条化，随剧情推进解锁） */
  LORE_KEYS: [
    { id: 'intro', need: null, title: '血河之殇' },
    { id: 'bloodRiver', need: 'c1_end', title: '血河宗' },
    { id: 'jade', need: 'c1_mid', title: '引魂玉' },
    { id: 'xuanying', need: 'c2_open', title: '玄影客' },
    { id: 'tally', need: 'c3_end', title: '黑玉令' },
    { id: 'bloodRiver.truth', need: 'c5_end', title: '万魂丹与叛炉者' },
    { id: 'gupian', need: 'c6_mid', title: '上古炼魂石' },
    { id: 'ferryman', need: 'c7_open', title: '渡船人' },
    { id: 'timeline', need: 'c5_open', title: '大事时间线' },
    { id: 'factions', need: 'c7_end', title: '六大势力立场' },
  ],
  openLore() {
    const p = Game.player;
    const seen = (p.story && p.story.seen) || {};
    const rows = this.LORE_KEYS.map(e => {
      const unlocked = !e.need || !!seen[e.need];
      let body;
      if (!unlocked) body = '<div class="tip-line" style="color:var(--text-faint)">——尚未揭晓。推进主线，自会知晓。——</div>';
      else {
        const val = e.id.includes('.') ? e.id.split('.').reduce((o, k) => (o || {})[k], GameData.LORE) : GameData.LORE[e.id];
        body = Array.isArray(val)
          ? val.map(x => `<div class="tip-line">· ${typeof x === 'string' ? x : `${x.y || ''} ${x.t || x.name || ''}：${x.desc || x.stance || ''}`}</div>`).join('')
          : `<div class="card-desc">${val || '（佚失）'}</div>`;
      }
      return `<div class="card"><div class="card-title">${unlocked ? '✦' : '🔒'} ${e.title}</div>${body}</div>`;
    }).join('');
    UI.popup({ title: '📖 百科 · 血河旧事', html: `<div class="tip-line" style="margin-bottom:6px">词条随主线推进逐步解锁——真相，要一步一步挖。</div>${rows}`, options: [{ text: '合 上', value: true, primary: true }] });
  },

  /** v15 问道录：章节剧情回顾（已看过的开篇/中段/章末可重读） */
  CHOICE_LABELS: {
    c1_end: { vengeance: '带着遗志入世，此仇必报', caution: '带着告诫入世，只信亲眼所见', clarity: '带着牵挂入世，不为恨所吞' },
    c2_end: { copy: '拓印血图，原壁不动', take: '凿壁带走血图', memorize: '牢记于心，掩回原样' },
    c3_end: { defy: '顶回威胁：「想要玉，自己来拿」', feign: '虚与委蛇，暗谋后手', silent: '沉默不语，铭记于心' },
    c4_end: { blade: '以杀止杀', justice: '以直报怨，公之于众', mercy: '先问因由，不杀无辜' },
    c5_end: { accept: '认下前世因果', sever: '斩断前世，只走己路', leverage: '不认身份，以执念为刃' },
    c6_end: { slay: '阵中斩杀分身', interrogate: '逼问血河故道入口', spare: '放其溃散，直取本尊' },
    c7_end: { open: '应帖赴会，明查当面对质', dark: '绕行暗访黑玉令', blade: '借政敌之刀，坐观虎斗' },
    c8_end: { together: '立誓同生共死', entrust: '托付后事于至交', alone: '独自承担因果' },
    c9_end: { redeem: '渡宗主残魂往生', execute: '一剑斩尽，恩怨两清', walk: '转身不问，随劫火而灭' },
  },
  /** v19 问道录 2.0：剧情回顾 / 人物志 / 大事年表 / 抉择树（四页签） */
  openArchive(tab = 'story') {
    const p = Game.player;
    const tabs = [['story', '📜 剧情回顾'], ['figures', '👤 人物志'], ['chron', '🗓 大事年表'], ['choices', '⚖ 抉择树'], ['lore', '📖 百科']];
    const tabHtml = `<div class="action-row" style="margin:0 0 8px">${tabs.map(([k, label]) =>
      `<button class="btn btn-sm ${k === tab ? 'btn-primary' : ''}" data-action="quest-archive-tab" data-tab="${k}">${label}</button>`).join('')}</div>`;
    let body = '';
    if (tab === 'figures') body = this.archiveFigures(p);
    else if (tab === 'chron') body = this.archiveChron(p);
    else if (tab === 'choices') body = this.archiveChoices(p);
    else if (tab === 'lore') body = '';
    else body = this.archiveStory(p);
    if (tab === 'lore') { UI.closePopup(); this.openLore(); return; }
    UI.popup({ title: '📜 问道录', html: tabHtml + body, options: [{ text: '合 上', value: true, primary: true }] });
  },
  /** 页签：剧情回顾 */
  archiveStory(p) {
    const seen = (p.story && p.story.seen) || {};
    let body = '';
    for (let i = 0; i < this.CHAPTERS.length; i++) {
      const def = this.CHAPTERS[i];
      const cn = this.CN9[i];
      const rows = [];
      for (const [suffix, label] of [['open', '开篇'], ['mid', '中段'], ['mid2', '暗线'], ['end', '章末']]) {
        const sid = `c${i + 1}_${suffix}`;
        if (!seen[sid]) continue;
        const story = GameData.STORIES[sid];
        if (!story) continue;
        rows.push(`<button class="btn btn-sm" data-action="quest-reread" data-sid="${sid}">${label} · ${story.title.replace(/^第.+章 · /, '').replace(/^终章 · /, '') || label}</button>`);
      }
      if (!rows.length) continue;
      let choiceLine = '';
      const choiceVal = p.story && p.story.choices[`c${i + 1}_end`];
      if (choiceVal && this.CHOICE_LABELS[`c${i + 1}_end`] && this.CHOICE_LABELS[`c${i + 1}_end`][choiceVal]) {
        choiceLine = `<div class="tip-line">· 你当年的抉择：${this.CHOICE_LABELS[`c${i + 1}_end`][choiceVal]}</div>`;
      }
      body += `<div class="shop-section-title">◈ 第${cn}章 · ${def.title}</div><div class="action-row" style="margin:0 0 4px">${rows.join('')}</div>${choiceLine}`;
    }
    // 个人线回顾
    const plRows = Object.entries(GameData.PERSONAL).map(([nid, def]) => {
      const done = (p.personal || {})[nid] || 0;
      if (!done) return '';
      const acts = def.acts.slice(0, done).map(a => `<button class="btn btn-sm" data-action="quest-reread" data-sid="${a.key}">${a.title}</button>`).join('');
      return `<div class="tip-line">◈ ${def.arc}（${done}/${def.acts.length}）</div><div class="action-row" style="margin:0 0 4px">${acts}</div>`;
    }).filter(Boolean).join('');
    if (plRows) body += `<div class="shop-section-title">◈ 个人线</div>${plRows}`;
    if (!body) body = '<div class="tip-line">问道录尚是白卷——随着主线推进，你看过的每一段剧情都会收录在此，可随时重读。</div>';
    return body;
  },
  /** 页签：人物志（主线角色 + 江湖修士的相逢与记忆） */
  archiveFigures(p) {
    const seen = (p.story && p.story.seen) || {};
    const APPEAR = { c_laoren: null, c_ling: 'c1_mid', c_xuanying: 'c2_open', c_zongzhu: 'c5_open', c_zhenling: 'c5_open', c_shanggu: 'c6_mid', c_zhangmen: 'c7_open', c_xuanji: 'c7_mid' };
    const rows = [];
    for (const [id, c] of Object.entries(GameData.CHARACTERS)) {
      const appearKey = APPEAR[id];
      if (appearKey && !seen[appearKey]) continue;
      let sub = `${c.title} · 立场：${c.stance}`;
      let memHtml = '';
      if (c.npc) {
        const s = NpcSys.state(p, c.npc);
        const srole = (GameData.STORY_ROLES || {})[c.npc];
        if (s && s.met) {
          sub = `${c.title} · 关系：<b>${NpcSys.tierOf(Math.max(0, s.rel)).name}</b>（${s.rel > 0 ? '+' : ''}${s.rel}）`;
          const pl = GameData.PERSONAL[c.npc];
          if (pl) sub += ` · 个人线【${pl.arc}】 ${(p.personal || {})[c.npc] || 0}/${pl.acts.length}`;
          const mems = (s.mem || []).map(m => `${NpcSys.MEM_TYPE[m.t] || '旧事'}：${m.x}`).slice(-4);
          if (mems.length) memHtml = `<div class="figure-mem">共同回忆 —— ${mems.join('；')}</div>`;
        } else if (srole) {
          sub += ` · 尚未相逢`;
        } else {
          continue;
        }
        if (srole) sub += `<br><span style="color:var(--text-faint)">主线定位：${srole.role}</span>`;
      }
      rows.push(`
      <div class="figure-card">
        <div class="figure-portrait">${Art.portrait(c.look)}</div>
        <div class="figure-info">
          <div class="figure-name">${c.name} <span class="tag ${c.stance === '敌' ? 'danger' : c.stance === '友' ? 'safe' : ''}">${c.role}</span></div>
          <div class="figure-sub">${sub}</div>
          <div class="figure-mem">${c.desc}</div>
          ${memHtml}
        </div>
      </div>`);
    }
    if (!rows.length) rows.push('<div class="tip-line">尚未与任何人物结缘。</div>');
    return rows.join('');
  },
  /** 页签：大事年表 */
  archiveChron(p) {
    const list = (p.chronicle || []).slice();
    if (!list.length) return '<div class="tip-line">年表尚无着墨——主线推进、境界突破、支线结案与个人线落幕，都会记入此册。</div>';
    return list.map(e => `<div class="chron-line"><span class="chron-day">第${Math.floor(e.d / 365) + 1}年</span><span>${e.txt}</span></div>`).join('');
  },
  /** 页签：抉择树 */
  archiveChoices(p) {
    const choices = (p.story && p.story.choices) || {};
    let body = '';
    for (let i = 0; i < this.CHAPTERS.length; i++) {
      const key = `c${i + 1}_end`;
      const val = choices[key];
      const label = val && this.CHOICE_LABELS[key] && this.CHOICE_LABELS[key][val];
      body += `<div class="chron-line"><span class="chron-day">第${this.CN9[i]}章</span><span>${label ? `⚖ ${label}` : '<span style="color:var(--text-faint)">尚未抉择</span>'}</span></div>`;
    }
    body += '<div class="tip-line" style="margin-top:6px">· 每一次章末抉择都已化作道心烙印，并悄然改写着此后的因果。</div>';
    return body;
  },
  /** 重读某段剧情（只读模式，✕ 可关闭） */
  reread(sid) {
    UI.closePopup();
    const story = GameData.STORIES[sid];
    if (!story) return;
    Story.play(story, null, true);
  },
};
