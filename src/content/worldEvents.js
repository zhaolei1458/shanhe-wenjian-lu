// ============================================================
// 山河问剑录 · 内容/江湖大事（蓝图 §：势力格局小幅随机 + 江湖大事每局有变）
// 玩家不在处，江湖照样翻涌——大事按年调度，递到玩家眼前的三条路：
//   1. 玩家恰在事发城市 → 际遇事件切片（arriveEvent）
//   2. 不在 → 袖中录传闻 + 知事口径更新（news）
//   3. 涉及玩家利害的（欠账/师门）→ 催账回响（PAYLOADS）
// ============================================================

export const WORLD_EVENTS = [
  {
    id: 'we_biwu', title: '天启比武大会', weight: 3, years: [2, 26], city: 'tianqi',
    mood: null,
    news: '说书人醒木一拍：今岁天启比武大会，各路豪杰揣着刀也会揣着银子来——会后赌坊的账，比擂台精彩。',
    arriveEvent: 'ev_we_biwu_zai',
    npcDeaths: [],
    moodShift: '承平',
  },
  {
    id: 'we_yaoshou', title: '北道妖患', weight: 3, years: [1, 28], city: 'yanhui',
    mood: ['暗流', '风紧'],
    news: '北道上跑镖的都换了结伴走——妖兽下山的事，官府的告示写得含糊，牲口贩子说得吓人。',
    arriveEvent: 'ev_we_yaoshou_zai',
    npcDeaths: [],
    moodShift: '风紧',
  },
  {
    id: 'we_caoyin', title: '漕银亏空案发', weight: 2, years: [3, 25], city: 'linjiang',
    mood: ['暗流'],
    news: '临江府衙封了漕运司的账房，漕帮的人这几天脸上都没什么表情。水上人说：要起风了。',
    arriveEvent: 'ev_we_caoyin_zai',
    npcDeaths: [],
    moodShift: '风紧',
  },
  {
    id: 'we_zhangmen', title: '青羊观主坐化', weight: 1, years: [8, 30], city: 'linjiang',
    mood: null,
    news: '临江府传来的消息：青羊观老观主坐化了。观里说，老人走得很静，像睡着。',
    arriveEvent: 'ev_we_zhangmen_zai',
    npcDeaths: ['lj_laodao'],
    moodShift: null,
  },
  {
    id: 'we_yanbang', title: '盐帮火并', weight: 2, years: [2, 28], city: 'linjiang',
    mood: ['暗流', '风紧'],
    news: '盐帮内讧，两派在湖面上烧了三条船。漕帮的总舵连夜加了双岗——城门失火，殃及池鱼。',
    arriveEvent: 'ev_we_yanbang_zai',
    npcDeaths: [],
    moodShift: '风紧',
  },
  {
    id: 'we_dahuan', title: '关外大旱', weight: 2, years: [4, 27], city: 'tiewa',
    mood: null,
    news: '关外大旱，流民往关内走。铁瓦的马市今年瘦马多肥马少——粮比马贵，是凶年才有的行情。',
    arriveEvent: 'ev_we_dahuan_zai',
    npcDeaths: [],
    moodShift: '暗流',
  },
  {
    id: 'we_dibeng', title: '帝崩 · 国丧', weight: 1, years: [10, 30], city: 'tianqi',
    mood: null,
    news: '大行皇帝驾崩，举国挂素。天启城门落了锁又开，开了又落——国丧的规矩比城门沉。',
    arriveEvent: 'ev_we_dibeng_zai',
    npcDeaths: [],
    moodShift: '风紧',
  },
  {
    id: 'we_guiwang', title: '鬼市夜开', weight: 2, years: [1, 29], city: 'tianqi',
    mood: ['暗流'],
    news: '入秋后鬼市连开了七夜，无字碑前的灯油都断过一回卖。老鬼市说：上回这样，还是二十年前。',
    arriveEvent: 'ev_we_guiwang_zai',
    npcDeaths: [],
    moodShift: null,
  },
  {
    id: 'we_wulin', title: '武行换旗', weight: 2, years: [6, 30], city: 'tianqi',
    mood: null,
    news: '武行镖局街换了半条街的旗——老字号倒了三家，新招牌挂得比旧的高。江湖换代，先换招牌。',
    arriveEvent: 'ev_we_wulin_zai',
    npcDeaths: [],
    moodShift: null,
  },
  {
    id: 'we_shiyi', title: '南地时疫', weight: 2, years: [3, 29], city: 'linjiang',
    mood: null,
    news: '南边时疫，报国寺的药僧成筐地往外背药材。施药棚一路搭到城外——佛门的账，记在人心上。',
    arriveEvent: 'ev_we_shiyi_zai',
    npcDeaths: [],
    moodShift: null,
  },
];

// 岁月推进时的小口径变化（势力 mood 微调叙事，进袖中录）
export const MOOD_TICKERS = {
  承平: ['今年各处都还太平，只是粮价比去年悄没声地涨了两分。', '边关无战事，江湖上也还算斯文——至少明面上是。'],
  暗流: ['有几路来路不明的生面孔在镇上打尖，问路的比赶路的多。', '夜里巡城的兵比往年多了一倍，谁也问不出缘故。'],
  风紧: ['官道上的关卡查得严了，行人翻包翻到底。', '说书人收敛了两个段子，说是"上头打了招呼"。'],
};
