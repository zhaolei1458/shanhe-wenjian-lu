// ============================================================
// 山河问剑录 · 2.0 第四层：皇族庶子·身世局「庶出」
// 五章：披香殿的影子 → 内市查遗物 → 东宫的目光 → 宫变前夜 → 玉牒上的名字
// 目标类型：node/flag/realm（quest.js 消费面，见坑册 2.2）
// 素材对准 fates.js huangzu 出身三命帖（hz_f1 手抄词 / hz_f2 旧剑 / hz_f3 夺嫡）
// ============================================================

export const EV_Q_HZ_EYE = {
  id: 'ev_q_hz_eye',
  text: '东宫来人请你去赴小宴——名义上是兄弟叙情，可你一进门就明白这是一场审：座上那位异母兄长笑着问你近日"读什么书、交什么人"，问得比父皇祭天还上心。',
  options: [
    {
      label: '挺直了背，把该答的答了，把不该认的一个字不认。',
      effect: {
        flags: { quest_hz_faced: true, quest_hz_steadfast: true },
        trait: { yi: 1 },
      },
      text_after: '你答得滴水不漏，退出来时后背全湿了。可你看见东宫那位的眼色变了——从"视若无睹"变成了"记住了"。被记住在这座宫里有两种下场，你选了那种要命的：活着。',
    },
    {
      label: '装傻。把"闲散宗亲"四个字演给他看。',
      effect: {
        flags: { quest_hz_faced: true, quest_hz_played: true },
        trait: { ren: 1 },
      },
      text_after: '你把半杯酒喝出了三分醉，把蠢话说了七分满。送你出门时，东宫的人眼里的针收了回去——他们信了七分。剩下那三分，够你在大雨来之前，把该见的人见完。',
    },
  ],
};

export const EV_Q_HZ_NIGHT = {
  id: 'ev_q_hz_night',
  text: '帝星浮气之夜，宫里各处的灯次第灭了。你听见偏殿的窗纸被刀尖挑开的声音——轻得像蚕食叶。蒙面人进来了，脚步没有声音。他袖口露出一角黄铜：内库的制式。',
  options: [
    {
      label: '拔剑。宫里的规矩是死的，命是活的。',
      combat: 'c_goubi_ren',
      winFlag: 'quest_hz_blade_done',
      winItem: { id: 'item_neiku_ling', name: '内库铜符', desc: '内库制式的黄铜对符——只有一半。库籍上抹去的名字，和这一半铜符是一对。', kind: 'treasure' },
      winSay: '（蒙面人退进夜里，掉了一枚铜符。你把它攥在手里，掌心全是汗——这座宫要变天了，而你握着一角"天"。）',
    },
    {
      label: '熄灯。背贴墙，让偏殿替你藏住这口气。',
      effect: {
        flags: { quest_hz_blade_done: true, quest_hz_hid: true },
        trait: { ren: 1 },
      },
      text_after: '蒙面人在殿里站了一炷香，把你的书案翻了一遍，什么也没带走——他不是来杀你的，是来"看"你的。这一夜你数着自己的心跳活了下来。天亮前你想明白了一件事：被动躲，躲不过下一次。',
    },
  ],
};

export const EV_Q_HZ_CHOICE = {
  id: 'ev_q_hz_choice',
  text: '线索拼全了：母妃当年不是病逝，是替你挡了某位贵人的一道密旨；内库旧剑是母族旧邸的陈设，库籍上一个名字被刮得干干净净——刮掉名字的那页玉牒边角，就压在东宫的书案下。帝星浮气，变天在即。这枚"闲子"，要怎么落？',
  options: [
    {
      label: '夺嫡。棋盘既然摆上了，就下赢它。',
      effect: {
        flags: { quest_hz_done: true, take_throne: true },
        ledger: { type: '誓', text: '帝星浮气之夜落子——为母妃，也为这个位子' },
        trait: { chi: 2 },
      },
      text_after: '你把铜符收进袖中最深的地方，抬头看了眼天——帝星旁那缕浮气还在。从今夜起你不再是"闲子"：棋盘上你落了第一子，落子无悔。',
    },
    {
      label: '隐退。把真相带走，把名字留在这座宫里。',
      effect: {
        flags: { quest_hz_done: true, take_throne: false },
        ledger: { type: '善', text: '弃夺嫡——带真相出宫，还自己一个布衣身' },
        trait: { juan: 2 },
      },
      text_after: '你把半阙手抄词的后两句终于补全了——在出宫的门册上，用你自己的名字签的。宫墙在身后合拢时，你没有回头。天很大，路很长，母亲的名，你带走了。',
    },
  ],
};

export const HUANGZU = {
  id: 'ql_huangzu',
  title: '身世局·庶出',
  matchFate: /^hz_/, // 皇族庶子三张命帖（hz_f1/f2/f3）通用
  chapters: [
    {
      id: 'q_hz_1', chapter: 1, title: '披香殿的影子',
      brief: '昨夜值哨，你看见御花园假山后闪过一道蒙面人影——方向，是母妃生前住的披香殿。宫里没有"恰好路过"。去宫门当值区，把今夜的班排出来，查。',
      goals: [{ type: 'node', target: 'gongmen', hint: '去宫门当值区，查披香殿方向的旧档' }],
      rewards: {
        money: 5,
        say: '（当值档上那三个时辰被人撕走了。撕档的手法很干净——宫里做惯这种事的手。你把撕口记在心里：有人不想让你知道母妃的殿里发生过什么。）',
      },
      next: 'q_hz_2',
    },
    {
      id: 'q_hz_2', chapter: 2, title: '内市查遗物',
      brief: '母妃的遗物按制该入库封存，可内市掌柜的柜面上，常年"恰好"摆着几件宫里流出的旧物。去内市走一趟——查遗物的流向，就是查那道密旨的影子。',
      goals: [{ type: 'node', target: 'neishi', hint: '去内市，查母妃遗物的流向' }],
      rewards: {
        say: '（掌柜的认出了你，也认出了你问的东西。他什么都没说，只把柜面上一柄"不起眼"的旧剑往阴影里挪了半寸——挪的手，在抖。旧剑、母族、旧邸：线头接上了。）',
      },
      next: 'q_hz_3',
    },
    {
      id: 'q_hz_3', chapter: 3, title: '东宫的目光',
      brief: '你查遗物的动静，惊动了不该惊动的人。东宫来人请你赴宴——名为叙情，实为审人。这场宴躲不掉，去。',
      goals: [{ type: 'flag', key: 'quest_hz_faced', hint: '赴东宫之宴——直言，或装傻' }],
      onStart: { fire: EV_Q_HZ_EYE },
      rewards: {
        say: '（宴散了。你在这座宫里的分量变了——不管变重还是变轻，总归是"被算计在内"了。）',
      },
      next: 'q_hz_4',
    },
    {
      id: 'q_hz_4', chapter: 4, title: '宫变前夜',
      brief: '钦天监说帝星旁有浮气——要变天了。变天前夜，蒙面人进了你的偏殿。他不是来偷东西的，他是来"看"你这枚棋子，落在谁家。',
      goals: [{ type: 'flag', key: 'quest_hz_blade_done', hint: '应付夜叩的蒙面人——拔剑，或藏住这口气' }],
      onStart: { fire: EV_Q_HZ_NIGHT },
      rewards: {
        say: '（夜过去了。铜符在你袖里，真相在你心里，刀在你门外的夜里。这座宫的天，快亮了——也可能是快黑了。）',
      },
      next: 'q_hz_5',
    },
    {
      id: 'q_hz_5', chapter: 5, title: '玉牒上的名字',
      brief: '母妃替你挡了密旨，玉牒边页上刮掉的名字压在东宫案头。变天在即，这枚"闲子"到了落子的时候——夺嫡登基，还是功成隐退？',
      goals: [{ type: 'flag', key: 'quest_hz_done', hint: '做出你的抉择' }],
      onStart: { fire: EV_Q_HZ_CHOICE },
      rewards: {
        say: '（身世局·庶出——了。宫墙里的旧账清了，往前的路，往高处去。）',
      },
    },
  ],
};
