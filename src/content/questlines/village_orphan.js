// ============================================================
// 山河问剑录 · 2.0 第一层：山村孤儿·身世局「青溪谜踪」
// 五章：村中疑云 → 后山寻踪 → 初入江湖 → 截杀 → 铜扣与旧姓
// 目标类型：node/city/event/flag/realm（quest.js 消费面，见坑册 2.2）
// ============================================================

export const EV_Q_SC_AMBUSH = {
  id: 'ev_q_sc_ambush',
  text: '你刚在天启城站稳脚跟，巷口就堵上来两条汉子。为首的咧着嘴，手里掂着一把短刀："宋家的种——把铜扣交出来，饶你个囫囵尸首。"',
  options: [
    {
      label: '拔刀。爹留下的是猎弓，可你今天想用刀。',
      combat: 'c_heiquan',
      winFlag: 'quest_sc_fight_done',
      winItem: { id: 'item_heidao_can', name: '打手的黑刀', desc: '巷口打手的佩刀，刀刃豁了口，还沉得很——你头一件正经兵刃。', kind: 'weapon' },
      winSay: '（两条汉子跑了一条，倒了一条。你把那口黑刀捡起来掂了掂——从今天起，你不只是个村里来的孤儿。）',
    },
    {
      label: '交出铜扣，忍下这口气。',
      effect: { flags: { quest_sc_fight_done: true, quest_sc_fled: true }, trait: { ren: 1 } },
      text_after: '你把铜扣扔了过去。为首的接住，眯眼打量你半晌："识相。可你知道得太多了——往后离天启城远些。"他们走了。你攥紧了拳：铜扣没了，可"宋家"两个字，你记下了。',
    },
  ],
};

export const EV_Q_SC_CHOICE = {
  id: 'ev_q_sc_choice',
  text: '夜深了。你把打听来的碎片摊在桌上：二十年前临江府宋家满门出事、收山刀、官府册子上被墨涂掉的名字、还有一枚刻着"宋"的铜扣。老猎户临别时那句话又浮上来——"娃，有些账，记着就行；有些账，不讨不行。你分得清哪句是为你好。"——你打算怎么办？',
  options: [
    {
      label: '复仇。宋家的账，一笔一笔讨回来。',
      effect: {
        flags: { quest_sc_done: true, revenge_sc: true },
        ledger: { type: '仇', text: '立誓查清宋家灭门真相，向下手的人讨账' },
        trait: { sha: 1 },
      },
      text_after: '你把铜扣系上红绳，贴身收好。从今夜起，你走江湖，带着一桩账。',
    },
    {
      label: '放下。铜扣收进袖中，只往前活。',
      effect: {
        flags: { quest_sc_done: true, revenge_sc: false },
        ledger: { type: '善', text: '放下宋家旧仇——过去的事，让它过去' },
        trait: { juan: 1 },
      },
      text_after: '你把铜扣收进袖中最深的地方。恩怨是别人的，往后的路是你自己的。',
    },
  ],
};

export const VILLAGE_ORPHAN = {
  id: 'ql_shancun',
  title: '身世局·青溪谜踪',
  matchFate: /^sc_/, // 山村孤儿三张命帖（sc_f1/f2/f3）通用
  chapters: [
    {
      id: 'q_sc_1', chapter: 1, title: '村中疑云',
      brief: '收拾阿婆遗物时，你在箱底翻出一枚陌生的铜扣——扣背刻着个"宋"字。这村里，没姓宋的。爹娘去得蹊跷，老猎户又总念叨后山不太平。先上后山山路走一趟。',
      goals: [{ type: 'node', target: 'shanlu', hint: '走一趟后山山路' }],
      rewards: {
        money: 2,
        say: '（山路尽头，你把铜扣攥得发热。风从山坳里灌出来，像谁叹了口气。）',
      },
      next: 'q_sc_2',
    },
    {
      id: 'q_sc_2', chapter: 2, title: '后山寻踪',
      brief: '村里牲口丢得邪门，夜里的白影越传越凶。有人说它在"找"什么——你在后山守夜，会一会它。',
      goals: [{ type: 'event', id: 'ev_houshan_yao', hint: '夜里在后山（山路）守着，等那道白影' }],
      rewards: {
        say: '（白影开的那句"不是他"，你翻来覆去想了一路。不是谁？——答案不在村里了。）',
      },
      next: 'q_sc_3',
    },
    {
      id: 'q_sc_3', chapter: 3, title: '初入江湖',
      brief: '村子里问不出更多了。天下之大，先去天启城——人多的地方，消息也多。',
      goals: [{ type: 'city', target: 'tianqi', hint: '启程去天启城' }],
      rewards: {
        money: 3,
        say: '（你跟着一支镖队出的村。回头望，青溪村的炊烟细成一线——从这一步起，你是江湖人了。）',
      },
      next: 'q_sc_4',
    },
    {
      id: 'q_sc_4', chapter: 4, title: '截杀',
      brief: '有人不想让你活着打听。城门口那两条汉子只是开头——他们要的东西，正是你身上这枚铜扣。',
      goals: [{ type: 'flag', key: 'quest_sc_fight_done', hint: '应付巷口截杀——拔刀，或是忍下' }],
      onStart: { fire: EV_Q_SC_AMBUSH },
      rewards: {
        say: '（截杀过去了。可"宋家"两个字，已经替你在这座城里喊出了声。）',
      },
      next: 'q_sc_5',
    },
    {
      id: 'q_sc_5', chapter: 5, title: '铜扣与旧姓',
      brief: '碎片凑齐了：二十年前临江府宋家满门出事、一口叫"收山"的刀、官府册子上被墨涂掉的名字。铜扣、画像、老猎户的话——都指向同一个方向。复仇，还是放下？',
      goals: [{ type: 'flag', key: 'quest_sc_done', hint: '做出你的抉择' }],
      onStart: { fire: EV_Q_SC_CHOICE },
      rewards: {
        say: '（身世局·青溪谜踪——了。可有些门，一旦推开就关不上：长生登顶的引导线，第三层接上。）',
      },
    },
  ],
};
