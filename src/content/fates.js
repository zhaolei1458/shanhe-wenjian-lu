// ============================================================
// 山河问剑录 · 数据三层之 templates/：命帖库
// 命帖三要素：来处（家世处境）/ 软肋（放不下的人或事）/ 钩子（命运第一道闸）
// + 此生暗线 + 开局变故（随机启蒙线）+ 人生节点分支
// 首期三出身：山村孤儿 / 魔道余孽 / 皇族庶子
// ============================================================

import { ORIGINS2, VARIANTS2, HIDDEN_LINES2, LIFE_NODES2 } from './fates13.js';

export const ORIGINS = {
  shancun: {
    id: 'shancun', name: '山村孤儿',
    startCity: 'xiangye', startArea: 'xiangye_wild', startNode: 'qingxi',
    startMoney: 1,
    intro: '爹娘去得早，你是吃百家饭、穿百家衣长大的。村后是山，村前是溪，山里有兽，也有人说，山里有仙。',
    fates: [
      {
        id: 'sc_f1', originId: 'shancun', age: 16,
        laichu: '爹娘在你三岁那年进山采药，再没回来。你跟着瞎眼的阿婆长大，如今阿婆也走了，留你一个人守着溪边的老屋。',
        ruanle: '阿婆留下的一只顶针——她纳了一辈子鞋底，临走前给你缝的最后一双布鞋还在床底。',
        gouzi: '后山近来夜里有白影出没，村里的牲口少了三只，老猎户说，那东西像是在"找"什么。',
        hiddenLine: 'hl_shancun_baiying',
        startCity: 'xiangye', startArea: 'xiangye_wild', startNode: 'qingxi',
        variants: ['bian_shanhong', 'bian_huolang', 'bian_houshan'],
        lifeNodes: ['ln_shancun_1', 'ln_shancun_2'],
        startItems: [{ id: 'item_dingzhen', name: '阿婆的顶针', desc: '磨得发亮的铜顶针，还带着体温似的。', kind: 'relic' }],
      },
      {
        id: 'sc_f2', originId: 'shancun', age: 15,
        laichu: '你爹是村里的猎户，去年冬天猎熊没回来。娘改嫁去了邻县，把你留给老猎户当学徒——他腿瘸，可眼比鹰尖。',
        ruanle: '爹留下的那张弓，弦你已经换了三根，还是舍不得换新的。',
        gouzi: '老猎户近来总在后山西坡守夜，回来一句话不说。你知道他看见了什么，他不说，你也不敢问。',
        hiddenLine: 'hl_shancun_xipo',
        startCity: 'xiangye', startArea: 'xiangye_wild', startNode: 'qingxi',
        variants: ['bian_shanhong', 'bian_huolang', 'bian_houshan'],
        lifeNodes: ['ln_shancun_1', 'ln_shancun_2'],
        startItems: [{ id: 'item_gong', name: '爹的猎弓', desc: '桑木弓，弓臂上有道旧裂，用麻绳缠好了。', kind: 'weapon' }],
      },
      {
        id: 'sc_f3', originId: 'shancun', age: 17,
        laichu: '山洪那年冲了半个村，也冲散了你的家。你在下游被人捞起，昏迷三日，醒来什么都不记得，只记得梦里总有一声"快跑"。',
        ruanle: '你总在雨天心口发闷——说不清是病，还是那一夜有什么没做完。',
        gouzi: '开春有货郎进村，收山货时多看了你两眼，说了一句："你像一个人。"像谁，他没说，压价压得却痛快。',
        hiddenLine: 'hl_shancun_shanhong',
        startCity: 'xiangye', startArea: 'xiangye_wild', startNode: 'qingxi',
        variants: ['bian_huolang', 'bian_houshan', 'bian_yaoling'],
        lifeNodes: ['ln_shancun_1', 'ln_shancun_2'],
        startItems: [],
      },
    ],
  },

  modao: {
    id: 'modao', name: '魔道余孽',
    startCity: 'huangquan', startArea: 'tq_dixia', startNode: 'hq_dufang',
    startMoney: 4,
    intro: '百年前魔教之乱，正道死伤枕籍；乱平之后，"魔"字就成了你姓氏上洗不掉的烙印。你在黄泉集长大——这儿没人问你姓什么，只问你能干什么。',
    fates: [
      {
        id: 'md_f1', originId: 'modao', age: 17,
        laichu: '养父是黄泉集的赌坊打手，把你从死人堆里捡回来。他去年死于一场"意外"，遗物只有半页烧剩的功法残篇——落款是一个被涂掉的名字。',
        ruanle: '养父坟在乱葬岭东坡，没立碑。你答应过他：不给魔道翻案，但至少，让他有个名字。',
        gouzi: '黑市有人在高价收"幽冥教旧物"，说是教中人重出江湖的前兆。你养父的残篇上，有幽冥教的印。',
        hiddenLine: 'hl_modao_canpian',
        startCity: 'huangquan', startArea: 'tq_dixia', startNode: 'hq_dufang',
        variants: ['bian_zhuishabing', 'bian_jiaohua', 'bian_yaoren'],
        lifeNodes: ['ln_modao_1', 'ln_modao_2'],
        startItems: [{ id: 'item_canpian', name: '烧剩的残篇', desc: '半页手抄，字迹遒劲，落款被火燎去。隐约可辨"引气入体，逆行三关"八字。', kind: 'gongfa' }],
        startGongfa: [{ id: 'gf_youming_can', name: '幽冥残篇（残）', desc: '魔脉邪法的入门残篇。进境快，根基带伤——功法里带着写它的人的魔障。', level: 1, realm: 'lianqi', corrupt: true }],
      },
      {
        id: 'md_f2', originId: 'modao', age: 16,
        laichu: '你是"罪奴"的后代——祖上随魔教败亡，全族被没入官奴。你逃出来那年十二岁，一路乞讨到黄泉集，被黑市摊主留下做了跑腿。',
        ruanle: '娘临别塞给你的一枚铜扣，说是"你爹的东西"。你爹长什么样，你不知道；这枚铜扣在哪儿，黑市老板盯了很久。',
        gouzi: '镇抚司的海捕文书上月进了镇，画的画像……有点像你。赏格不高，可黄泉集最不缺见钱眼开的人。',
        hiddenLine: 'hl_modao_tongkou',
        startCity: 'huangquan', startArea: 'tq_dixia', startNode: 'hq_heishi',
        variants: ['bian_zhuishabing', 'bian_jiaohua', 'bian_yaoren'],
        lifeNodes: ['ln_modao_1', 'ln_modao_2'],
        startItems: [{ id: 'item_tongkou', name: '娘的铜扣', desc: '磨得快平了的铜扣，扣面上有个模糊的"宋"字。', kind: 'relic' }],
      },
      {
        id: 'md_f3', originId: 'modao', age: 18,
        laichu: '你是幽冥教"药人"的遗孤——娘是坊里的试药人，生下你后就没了。坊主嫌你碍眼，八岁把你丢进黄泉集，可你在赌坊后巷偷听偷学，居然摸到了内息的门道。',
        ruanle: '你恨药人坊，可你内息的根，恰恰是娘怀你时泡在药汤里泡出来的。这口气，你既靠它活，又恨它脏。',
        gouzi: '药人坊近来夜里总运"新货"进后墙。守卫的眼神越来越直——像被抽走了什么。',
        hiddenLine: 'hl_modao_yaoren',
        startCity: 'huangquan', startArea: 'tq_dixia', startNode: 'hq_dufang',
        variants: ['bian_zhuishabing', 'bian_jiaohua', 'bian_yaoren'],
        lifeNodes: ['ln_modao_1', 'ln_modao_2'],
        startItems: [],
      },
    ],
  },

  huangzu: {
    id: 'huangzu', name: '皇族庶子',
    startCity: 'tianqi', startArea: 'tq_huangcheng', startNode: 'gongmen',
    startMoney: 15,
    intro: '你是先帝一位不受宠的妃嫔所出，如今的天子是你异母兄长。宫墙里你有一份例银、一间偏殿、一个没有实封的名分——和一屋子对你视若无睹的人。',
    fates: [
      {
        id: 'hz_f1', originId: 'huangzu', age: 17,
        laichu: '你母妃在你七岁那年"病逝"，宫里的说法滴水不漏。你如今在天机阁挂了个闲职——说是闲职，其实是把你这个"隐患"放在眼皮底下。',
        ruanle: '母妃留下的半阙手抄词，后两句被撕掉了。你十岁起就背得滚瓜烂熟，也找了十年那后两句。',
        gouzi: '昨夜你值夜，亲眼看见御花园的假山后闪过一道蒙面人影——方向，是母妃生前住的披香殿。',
        hiddenLine: 'hl_huangzu_pixiang',
        startCity: 'tianqi', startArea: 'tq_huangcheng', startNode: 'gongmen',
        variants: ['bian_duobi', 'bian_neiku', 'bian_mengmian'],
        lifeNodes: ['ln_huangzu_1', 'ln_huangzu_2'],
        startItems: [{ id: 'item_cipai', name: '半阙手抄词', desc: '母妃的字，清瘦工整。前两句是"月满披香殿，风回太液池"——后两句，被撕掉了。', kind: 'relic' }],
      },
      {
        id: 'hz_f2', originId: 'huangzu', age: 16,
        laichu: '当今登基后清洗旧邸，你母族的旧人死的死、贬的贬。你是漏网的——因为一个老太监偷偷把你名字从玉牒的边页上刮掉了。',
        ruanle: '那个老太监去年冬天殁了，你连他的名字都没来得及叫一声。他留给你的，是一句"活下去，别回头"。',
        gouzi: '内库年前清点，少了一件旧物——一柄"不起眼"的旧剑。内市掌柜说，那剑原来是母族旧邸的陈设。',
        hiddenLine: 'hl_huangzu_oldjian',
        startCity: 'tianqi', startArea: 'tq_huangcheng', startNode: 'gongmen',
        variants: ['bian_duobi', 'bian_neiku', 'bian_mengmian'],
        lifeNodes: ['ln_huangzu_1', 'ln_huangzu_2'],
        startItems: [],
      },
      {
        id: 'hz_f3', originId: 'huangzu', age: 18,
        laichu: '夺嫡的暗流里，各方都把你这枚"闲子"当过棋——你谁也没投，谁也没得罪，落得个两头不是人。如今你在宫里当差，与世无争——装出来的。',
        ruanle: '你幼时的伴读阿九，当年替你挡过一次杖责，如今在宫外当差。你们再没见过——你知道再见面对谁都不好。',
        gouzi: '钦天监近日观星，说"帝星旁有浮气"。宫里的人都在传——你听得懂这话的分量：要变天了。',
        hiddenLine: 'hl_huangzu_duobi',
        startCity: 'tianqi', startArea: 'tq_huangcheng', startNode: 'gongmen',
        variants: ['bian_neiku', 'bian_mengmian', 'bian_duobi'],
        lifeNodes: ['ln_huangzu_1', 'ln_huangzu_2'],
        startItems: [],
      },
    ],
  },
};

// 开局变故（每局随机其一）——同出身不同局，启蒙线不同
export const VARIANTS = {
  // 山村孤儿变故
  bian_shanhong: {
    id: 'bian_shanhong', title: '山洪之夜',
    text: '入夏第一场大雨下了三天。第三天夜里，上游的老塘塌了。水声先到，人后跑——你在齐腰的水里拽住了两个人，也被冲出去二里地。天亮时村子半毁，你站在泥里，手里的船桨换成了村长塞的半袋干粮。',
    effect: { kind: 'shanhong', ledger: { type: '救', text: '山洪夜救人两名' }, trait: { xia: 2 }, gongfa: null },
  },
  bian_huolang: {
    id: 'bian_huolang', title: '神秘货郎',
    text: '货郎进村收山货，你帮他扛了半日担子。傍晚歇脚时他忽然问你："想不想学点保命的东西？"他从担子底层摸出一卷旧书页，"看不懂就还我，看得懂——是你的缘。"',
    effect: { kind: 'huolang', ledger: null, trait: { chi: 1 }, gongfa: { id: 'gf_tuna_can', name: '吐纳残诀（散传）', desc: '货郎给的三页残诀，字歪理正。练的是"听自己的气"。', level: 1, realm: 'lianqi' } },
  },
  bian_houshan: {
    id: 'bian_houshan', title: '后山闹妖',
    text: '后山夜里有白影。你和老猎户蹲了三夜，第四夜白影贴着崖根过去——快得不像兽，可它在你眼前停了一瞬，"看"了你一眼。（那眼神你后半夜都在想：不凶，像在辨认。）',
    effect: { kind: 'houshan', ledger: null, trait: { chi: 1 }, gongfa: null },
  },
  bian_yaoling: {
    id: 'bian_yaoling', title: '雨夜药香',
    text: '一个雨夜，你在山道边遇见一个昏迷的老者，身上药香刺鼻。你背他回村，他走时留下一句话："你的根骨，是被药汤泡过的。别浪费了。"——你从不知道自己有什么根骨。',
    effect: { kind: 'yaoling', ledger: null, trait: { ren: 1 }, gongfa: { id: 'gf_yaoxi', name: '药息诀（散传）', desc: '老者随口留的养气法子，练气慢，但根基极稳。', level: 1, realm: 'lianqi' } },
  },
  // 魔道余孽变故
  bian_zhuishabing: {
    id: 'bian_zhuishabing', title: '追杀令下',
    text: '镇抚司的缇骑进了黄泉集，拿着画像挨家查。你提前半个时辰得了信，从赌坊后巷翻墙走水沟逃出镇子，在乱葬岭的坟窟窿里蹲了一夜。天亮回镇，养父的旧识冲你摇头："画像上有你。这一世，你得学会不露脸。"',
    effect: { kind: 'zhuishabing', ledger: null, trait: { yi: 1 }, gongfa: null, wanted: 1 },
  },
  bian_jiaohua: {
    id: 'bian_jiaohua', title: '黑市立名',
    text: '黑市摊主丢给你一个活儿：去窑洞深处取一件"不能见光"的东西，成了，赏十两。你在伸手不见五指的地道里爬了半日，取回来一具焦黑的匣子。摊主验都没验："行。往后黄泉集的地下，有你一条道。"',
    effect: { kind: 'jiaohua', ledger: { type: '诺', text: '为黑市取匣，地下江湖记下你的名字' }, trait: { kuang: 1 }, gongfa: null },
  },
  bian_yaoren: {
    id: 'bian_yaoren', title: '墙里的哭声',
    text: '夜里你替赌坊送酒，路过药人坊后墙，听见墙里有人哭——不是哭疼，是哭"还差三日"。你站了一炷香，把那声哭记下了。（有些账，是听来的。）',
    effect: { kind: 'yaoren', ledger: { type: '怨', text: '亲耳听见药人坊的哭声，此账记下' }, trait: { ren: 2 }, gongfa: null },
  },
  // 皇族庶子变故
  bian_duobi: {
    id: 'bian_duobi', title: '池鱼之殃',
    text: '母族旧邸余案重提，缇骑进宫查"漏网"。执事太监把你关进值房"避风头"三日——出来时，与你相熟的清扫宫女已被调离宫城，不知所踪。你学会了一件东西：在宫里，"不知道"三个字能保命。',
    effect: { kind: 'duobi', ledger: { type: '怨', text: '宫女阿蘅因你被调离，下落不明' }, trait: { juan: 1 }, gongfa: null },
  },
  bian_neiku: {
    id: 'bian_neiku', title: '内库失窃',
    text: '内库年前清点少了东西，追查追到你挂名的一亩三分地。执事太监替你压下了——压下的代价，是你从此欠他一个人情。（宫里的人情，比银子贵。）',
    effect: { kind: 'neiku', ledger: { type: '恩', text: '执事太监压下内库失窃的嫌疑，欠他一个大人情' }, trait: { yi: 1 }, gongfa: null },
  },
  bian_mengmian: {
    id: 'bian_mengmian', title: '蒙面人影',
    text: '御花园的蒙面人影，你不止看见一次。第二夜你带了个火折子守在假山后——人没等到，等到半块玉牌掉在草里，玉色温润，角上刻着半个"披"字。',
    effect: { kind: 'mengmian', ledger: null, trait: { kuang: 1 }, gongfa: null },
  },
};

// 此生暗线（撞见是缘分，认不认是玩家的事）
export const HIDDEN_LINES = {
  hl_shancun_baiying: {
    id: 'hl_shancun_baiying', title: '白影寻踪',
    hint: '后山的白影像是在"找"什么。它在找的东西，或许和你爹娘当年进山有关。',
    hook: 'ev_houshan_yao', // 对应事件切片，触发即撞见
  },
  hl_shancun_xipo: {
    id: 'hl_shancun_xipo', title: '西坡的秘密',
    hint: '老猎户守着西坡不肯说。西坡有崖，崖上有风，风里有动静。',
    hook: 'ev_xipo_feng',
  },
  hl_shancun_shanhong: {
    id: 'hl_shancun_shanhong', title: '像一个人',
    hint: '货郎说你"像一个人"。你失忆之前的脸，牵着一个你没见过的名字。',
    hook: 'ev_huolang_gengduo',
  },
  hl_modao_canpian: {
    id: 'hl_modao_canpian', title: '残篇的名字',
    hint: '残篇的落款被涂掉。写它的人若还活着——正道与魔道，都在找他。',
    hook: 'ev_canpian_name',
  },
  hl_modao_tongkou: {
    id: 'hl_modao_tongkou', title: '铜扣与旧姓',
    hint: '铜扣上的"宋"字。你爹姓宋？魔教之乱的罪奴名录里，姓宋的只有一支。',
    hook: 'ev_tongkou_song',
  },
  hl_modao_yaoren: {
    id: 'hl_modao_yaoren', title: '药人坊的账',
    hint: '墙里的哭声记在你心里。这坊的账，早晚要有人来清。',
    hook: 'ev_yaoren_mizhang',
  },
  hl_huangzu_pixiang: {
    id: 'hl_huangzu_pixiang', title: '披香殿的影子',
    hint: '蒙面人往披香殿方向去。母妃"病逝"的旧档，皇史宬里有一册。',
    hook: 'ev_pixiang_ying',
  },
  hl_huangzu_oldjian: {
    id: 'hl_huangzu_oldjian', title: '内库旧剑',
    hint: '那柄旧剑是母族旧邸的陈设。剑在谁手里，谁就碰过那段旧案。',
    hook: 'ev_neiku_oldjian',
  },
  hl_huangzu_duobi: {
    id: 'hl_huangzu_duobi', title: '帝星浮气',
    hint: '要变天了。闲子未必一直是闲子——就看风往哪边吹。',
    hook: 'ev_dixing_fuqi',
  },
};

// 人生节点分支（重大抉择，岔开 NPC 阵营/功法/门派）
export const LIFE_NODES = {
  ln_shancun_1: {
    id: 'ln_shancun_1', title: '出山之择', triggerAge: 17,
    text: '转眼你在村里又过了一年。这一日村长寻你："后生，村里是留不住你了。往后怎么走，你自己定。"',
    options: [
      { label: '随老猎户学艺，守着这片山', effect: { gongfa: { id: 'gf_shanhuquan', name: '山户拳（村传）', desc: '猎户们口传的搏命拳，糙，但招招冲着活命去。', level: 1, realm: 'wudao' }, ledger: { type: '诺', text: '应下村长，学成护村' } } },
      { label: '去雁回镇，投平安号走镖', effect: { move: { city: 'yanhui', area: 'tq_fangshi', node: 'yh_biaoju' }, ledger: { type: '誓', text: '离开青溪村，去江湖闯一条路' } } },
      { label: '循着货郎的踪迹，去外面看世界', effect: { move: { city: 'tianqi', area: 'tq_fangshi', node: 'chengmen_dashi' }, ledger: null } },
    ],
  },
  ln_shancun_2: {
    id: 'ln_shancun_2', title: '山中之物', triggerAge: 20,
    text: '这一年你有了自己的道。是继续走武的路，还是试着摸修行的门槛？',
    options: [
      { label: '一门心思练武', effect: { stat: { wugongXiuwei: 30 }, ledger: null } },
      { label: '试引气入体，走修行的路', effect: { stat: { xiwei: 20 }, ledger: null } },
      { label: '两头都练，慢就慢些', effect: { stat: { wugongXiuwei: 15, xiwei: 10 }, ledger: null } },
    ],
  },
  ln_modao_1: {
    id: 'ln_modao_1', title: '地下的门槛', triggerAge: 18,
    text: '黄泉集的地下江湖认了你这张脸。管事的话摆在你面前："跟着我，有肉吃。但吃了这碗饭，就别想着干净收场。"',
    options: [
      { label: '入堂口，走地下的路', effect: { faction: 'tangkou', ledger: { type: '誓', text: '入天启堂口，地下江湖有了你的名字' } } },
      { label: '不入伙，只接零活', effect: { ledger: null } },
      { label: '背转身去——这碗饭太脏', effect: { faction: null, ledger: { type: '诺', text: '拒绝堂口，宁走窄路' }, trait: { juan: 2 } } },
    ],
  },
  ln_modao_2: {
    id: 'ln_modao_2', title: '功法之择', triggerAge: 21,
    text: '残篇在手，路在脚下：是修这带伤的魔功求快，还是从头学正道功法求稳？',
    options: [
      { label: '修魔功——命短就短，快意就好', effect: { stat: { xiwei: 25 }, corrupt: 1, ledger: { type: '誓', text: '修幽冥残篇，魔道自认' } } },
      { label: '残篇烧了，另寻正路', effect: { ledger: { type: '诺', text: '焚残篇，魔道自断' }, trait: { juan: 2 } } },
      { label: '都学——正邪都过一遍手', effect: { stat: { xiwei: 12, wugongXiuwei: 12 }, corrupt: 0.5, ledger: null } },
    ],
  },
  ln_huangzu_1: {
    id: 'ln_huangzu_1', title: '宫墙内外', triggerAge: 19,
    text: '执事太监寻你："宫里的路窄，宫外的路远。你这张脸，留在哪儿都惹眼。往哪儿走？"',
    options: [
      { label: '留在宫里，暗中查母妃旧事', effect: { ledger: { type: '诺', text: '留在宫墙内，暗查披香殿旧事' } } },
      { label: '求放出宫，去江湖换个活法', effect: { move: { city: 'tianqi', area: 'tq_fangshi', node: 'chengmen_dashi' }, ledger: { type: '誓', text: '出宫，弃皇籍闲职' } } },
      { label: '去天机阁，借观星之位往上走', effect: { ledger: { type: '誓', text: '投身天机阁，太一宗门外汉' } } },
    ],
  },
  ln_huangzu_2: {
    id: 'ln_huangzu_2', title: '闲子的用法', triggerAge: 22,
    text: '帝星浮气的风声越传越紧。你这枚闲子，是继续装聋作哑，还是做一回"有用的人"？',
    options: [
      { label: '装聋作哑，明哲保身', effect: { trait: { juan: 2 }, ledger: null } },
      { label: '押一注——把知道的递给可信的人', effect: { trait: { kuang: 1 }, ledger: { type: '誓', text: '夺嫡暗流中押下第一注' } } },
      { label: '练本事——不管天下怎么变，自己先站住', effect: { stat: { wugongXiuwei: 20, xiwei: 10 }, ledger: null } },
    ],
  },
};

// 二期合并：16 出身全量
Object.assign(ORIGINS, ORIGINS2);
Object.assign(VARIANTS, VARIANTS2);
Object.assign(HIDDEN_LINES, HIDDEN_LINES2);
Object.assign(LIFE_NODES, LIFE_NODES2);
