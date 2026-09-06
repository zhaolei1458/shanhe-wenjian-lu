// ============================================================
// 山河问剑录 · 2.0 第四层：魔道余孽·身世局「魔火余烬」
// 五章：黑市探旧物 → 乱葬岭坟前 → 药人坊的账 → 镇抚司的门 → 翻案书
// 目标类型：node/flag/realm（quest.js 消费面，见坑册 2.2）
// 素材对准 fates.js modao 出身三命帖（md_f1 残篇 / md_f2 铜扣 / md_f3 药人）
// ============================================================

export const EV_Q_MD_GRAVE = {
  id: 'ev_q_md_grave',
  text: '乱葬义庄的东坡，养父的坟头多了半圈新土——有人比你来过。土里没翻动，坟没毁，只是坟前多了半截烧剩的香。这乱葬岭，给死人上香的人不多。',
  options: [
    {
      label: '蹲下来，看那半截香。看香灰，看脚印。',
      effect: {
        flags: { quest_md_grave_done: true, quest_md_watchful: true },
        trait: { ren: 1 },
      },
      text_after: '香灰断口还新——昨夜的。脚印两行，一深一浅，往黑市方向去了。有人认得这坟，认得这坟里埋的是谁。你把那半截香收进袖中：从今夜起，你也是有"来历"的人了。',
    },
    {
      label: '给养父磕三个头，把答应他的话再说一遍。',
      effect: {
        flags: { quest_md_grave_done: true, quest_md_swrn: true },
        trait: { juan: 1 },
        ledger: { type: '誓', text: '乱葬岭坟前重申旧诺：不给魔道翻案，但还他一个名字' },
      },
      text_after: '你磕完头，把坟头的草拔净了。起身时你觉得袖中那半页残篇比来时沉——字还是那些字，可你现在敢认它了。',
    },
  ],
};

export const EV_Q_MD_RAID = {
  id: 'ev_q_md_raid',
  text: '镇抚司的门夜里开了。海捕文书上那张画像，终于跟你对上了脸。带队的老缇骑把腰牌亮在火把下："幽冥教余孽，跟我们走一趟——是走进去，还是抬进去，你自己挑。"',
  options: [
    {
      label: '抬什么抬。拔刀——今夜谁也别想把我带走。',
      combat: 'c_jinjun',
      winFlag: 'quest_md_fight_done',
      winItem: { id: 'item_tiqi_yaopai', name: '缇骑的腰牌', desc: '镇抚司的乌木腰牌，錾着"缇"字。假不了，也用不得——但吓唬黑市的眼睛，够用。', kind: 'treasure' },
      winSay: '（两个缇骑一个倒地一个跑了。你捡起腰牌揣进怀里——从今夜起，"余孽"两个字，你不再是背着走的，是攥在手里用的。）',
      loseFx: { hp: -12, text_after: '你被按倒在地，铁尺架上了脖颈——可当夜押送途中队伍忽然接到密令，把你"丢"在了荒郊。有人不想让你死在他们手里。谁？' },
    },
    {
      label: '撩开衣襟露出铜扣（残篇）："我等你们很久了。跟你们的上头谈。"',
      effect: {
        flags: { quest_md_fight_done: true, quest_md_talked: true },
        trait: { yi: 1 },
      },
      text_after: '老缇骑盯着你手心的东西看了半晌，忽然收了腰牌，压低声音："……上头换人了，你不该露这个。今夜文书烧了，你换个活法。"他转身带队走了。你站在原地，掌心的汗把衣襟浸透——这局水的深浅，你刚看见一线。',
    },
  ],
};

export const EV_Q_MD_CHOICE = {
  id: 'ev_q_md_choice',
  text: '线索拼全了：百年前魔教之乱，你这一脉是替人顶罪的——真正的乱源在正道自己人里；养父不是赌坊打手，是当年拼死把你这一房血脉藏下来的教中护法。真相攥在手里，烫得很。你打算怎么办？',
  options: [
    {
      label: '寻仇。把当年构陷的人，一个一个翻出来。',
      effect: {
        flags: { quest_md_done: true, revenge_md: true },
        ledger: { type: '仇', text: '立誓查明百年前构陷魔教真凶，逐个讨还' },
        trait: { sha: 2 },
      },
      text_after: '你把真相一页一页收好，像收一叠诉状。从今夜起你有账要讨——魔道的名是你背的，账也是你的。走夜路的人，先要学会不怕黑。',
    },
    {
      label: '放下。翻案书烧给养父，只留一个清白的名。',
      effect: {
        flags: { quest_md_done: true, revenge_md: false },
        ledger: { type: '善', text: '真相烧作纸钱——只为养父求一个清白的名' },
        trait: { juan: 2 },
      },
      text_after: '火光里，残篇和诉状一起卷了边。你没让眼泪掉进火里。答应他的话，你做到了——他有了名字，你放下了担子。天亮时你往集市走，肩上轻得不像话。',
    },
  ],
};

export const MODAO = {
  id: 'ql_modao',
  title: '身世局·魔火余烬',
  matchFate: /^md_/, // 魔道余孽三张命帖（md_f1/f2/f3）通用
  chapters: [
    {
      id: 'q_md_1', chapter: 1, title: '黑市探旧物',
      brief: '黑市有人高价收"幽冥教旧物"。你袖中那半页烧剩的残篇，落的正是幽冥印——是福是祸，得先去黑市探探口风，看看收货的到底是什么人。',
      goals: [{ type: 'node', target: 'hq_heishi', hint: '去黑市，探"收旧物"的口风' }],
      rewards: {
        money: 2,
        say: '（收货的摊主收了你半吊"看货钱"，什么也没换给你，只留了一句："乱葬岭东坡的东西，比你以为的多。"——他知道你在查什么。）',
      },
      next: 'q_md_2',
    },
    {
      id: 'q_md_2', chapter: 2, title: '乱葬岭坟前',
      brief: '乱葬岭东坡，养父的坟。答应他的话还没做到，坟前却先来了旁人。去义庄看看——是谁，来做什么。',
      goals: [{ type: 'flag', key: 'quest_md_grave_done', hint: '去乱葬义庄，会一会坟前那位"上香的"' }],
      onStart: { fire: EV_Q_MD_GRAVE },
      rewards: {
        say: '（坟前的香灰你收好了。有人比你先认下了这段旧事——这局棋，你不是唯一一枚在动的子。）',
      },
      next: 'q_md_3',
    },
    {
      id: 'q_md_3', chapter: 3, title: '药人坊的账',
      brief: '黑市到乱葬岭，线头都往一个方向收：药人坊。坊里夜里运"新货"，守卫眼神发直——你内息的根是药汤泡出来的，这笔账，你躲不掉。去坊外走一趟。',
      goals: [{ type: 'node', target: 'hq_yaorenfang', hint: '去药人坊，认一认这门"旧账"' }],
      rewards: {
        say: '（坊墙根下，你闻见了那股熟悉的药汤味——娘的味道，也是你恨的味道。坊主不认得你，可你认得这坊。真相的下一页，就关在这堵墙里。）',
      },
      next: 'q_md_4',
    },
    {
      id: 'q_md_4', chapter: 4, title: '镇抚司的门',
      brief: '海捕文书上的画像终于对上你的脸了。镇抚司的人夜里堵门——是走进去，还是抬进去，还是……换个谈法？',
      goals: [{ type: 'flag', key: 'quest_md_fight_done', hint: '应付镇抚司夜访——动手，或谈' }],
      onStart: { fire: EV_Q_MD_RAID },
      rewards: {
        say: '（夜访过去了。你在这局水里又沉了一寸——也已学会了在水里睁眼。）',
      },
      next: 'q_md_5',
    },
    {
      id: 'q_md_5', chapter: 5, title: '翻案书',
      brief: '真相拼全了：百年前那场"魔教之乱"，你这一脉是替罪的；养父是护法，不是打手。翻案书就在你手里——寻仇，还是放下？',
      goals: [{ type: 'flag', key: 'quest_md_done', hint: '做出你的抉择' }],
      onStart: { fire: EV_Q_MD_CHOICE },
      rewards: {
        say: '（身世局·魔火余烬——了。魔字的烙印还在，可它如今是个字，不是个罪名。往前的路，往高处去。）',
      },
    },
  ],
};
