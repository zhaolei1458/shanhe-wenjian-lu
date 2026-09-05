// ============================================================
// 山河问剑录 · 内容/门派（一期五家可拜：青羊观/太一宗/报国寺/漕帮/平安号）
// 门派 = 活法提供者（05 册 §门派）。收人门槛全走考验事件（内容层），
// 引擎只管：拜入记账、师门日常、年事调度、仇怨网、叛门代价。
// ============================================================

import { SECTS3 } from './sects3.js';
import { SECTS2 } from './sects2.js';

export const SECTS = {
  qingyang: {
    id: 'qingyang', name: '青羊观', kind: '道门', city: 'linjiang', node: 'lj_qingyang',
    masterNpc: 'lj_laodao',
    kaoyanEvent: 'ev_kaoyan_qingyang',
    motto: '清修——修行不是往上飞，是往回坐。',
    // 门派型功法命名（04 册：招式命名三源）
    gongfa: { id: 'gf_qingyang_zuowang', name: '坐忘桩', desc: '青羊观入门功课。不求气感，先求坐得住。坐得住的人，气自己会来找你。', level: 1, realm: 'lianqi' },
    secondGongfa: { id: 'gf_qingyang_fuzi', name: '符水经', desc: '观主亲手抄的半卷经。画符不如明心，明心的人，水到渠成。', level: 2, realm: 'lianqi' },
    duties: [
      { label: '洒扫三清殿', text: '你把三清殿的青砖擦得能照出人影。老道在门口看着，没夸你，只把拂尘换了只手——这是青羊观的夸法。', effect: { stat: { xiwei: 3 }, trait: { chi: 1 } } },
      { label: '抄半卷《清静经》', text: '抄到"遣其欲而心自静"，你的笔停了半刻。停笔的那半刻，比抄完的整卷都值钱。', effect: { stat: { xiwei: 4 }, trait: { ren: 1 } } },
      { label: '替山下村民求一场雨', text: '你捧着符水下山，雨没求来，倒是替王家老太太看了眼风湿的腿。回观时老道说：符是死的，人是活的。', effect: { stat: { wugongXiuwei: 2 }, trait: { ren: 1 }, money: 1 } },
    ],
    annual: [
      '今年观里香火淡，观主说：淡好。香火旺的地方，心不静。',
      '冬月封观，全观坐关七日。你在蒲团上坐穿了两个时辰没动，下座时腿麻得站不起来——老道笑出了声。',
    ],
    grudges: {},
    rule: '叛师者，天下道门不收。（魔门倒是收——账，越背越厚。）',
  },

  taiyi: {
    id: 'taiyi', name: '太一宗', kind: '道门 · 庙堂', city: 'tianqi', node: 'tianjige',
    masterNpc: 'taiyi_gongfeng',
    kaoyanEvent: 'ev_kaoyan_taiyi',
    motto: '观天之道，执天之行。近庙堂，就躲不开庙堂的事。',
    gongfa: { id: 'gf_taiyi_wangqi', name: '望气篇', desc: '太一宗看家本事。气在人事之上——看一人是看气，看一朝也是看气。', level: 2, realm: 'lianqi' },
    secondGongfa: { id: 'gf_taiyi_lishu', name: '历数遗篇', desc: '残卷。算的是星轨，应的是人事。卷末一行小字：算尽者，天弃之。', level: 2, realm: 'lianqi' },
    duties: [
      { label: '当值观星台', text: '后半夜的星最老实。你记下三颗星的移位，交班时阁主只问了句：昨夜西边那颗，你怎么记？你怎么记的，就是你怎么看天的。', effect: { stat: { wuxing: 1, xiwei: 3 } } },
      { label: '誊录司天监旧档', text: '三十年前的档案灰得呛人。你誊到一半发现：某年荧惑守心的记录，被人撕去了一页。撕页的人不想让后人看见——你把它记在了心里。', effect: { stat: { xiwei: 4 }, flags: { yinghuo_knowledge: true } } },
      { label: '替钦天监送封密函', text: '函送到宫门当值区，验函的官多看了你一眼。那一眼不重，但你走下台阶时后背发潮。庙堂的事，沾上就是沾上。', effect: { stat: { wugongXiuwei: 2 }, money: 3, flags: { yiting_gongmen: true } } },
    ],
    annual: [
      '今年钦天监与太一宗又为观天之争驳了两回文书。阁主把文书烧了：天上的事，争不出结果，看就是了。',
      '宗里有位师兄下山应选国师去了。走前把一册手抄留给你：庙堂水深，能不上船，就别上船。',
    ],
    grudges: { qintianjian: '钦天监与太一宗的观天之争，是庙堂术法两家的百年旧账。你拜入太一宗那日起，宫门里某些人就记下了你的名字。' },
    rule: '叛出太一宗，庙堂的门便对你关了——但江湖的门，从来只对亡命者开得更大。',
  },

  baoguo: {
    id: 'baoguo', name: '报国寺', kind: '佛门', city: 'tianqi', node: 'bgs_shanmen',
    masterNpc: 'bgs_zhike',
    kaoyanEvent: 'ev_kaoyan_baoguo',
    motto: '入世行医。善名是本钱，慈悲是功课。',
    gongfa: { id: 'gf_baoguo_cibei', name: '慈悲愿力诀', desc: '报国寺不传杀人法。这诀救人时练得最快——你救的人越多，它越深。', level: 1, realm: 'lianqi' },
    secondGongfa: { id: 'gf_baoguo_yiwang', name: '医王十二手', desc: '寺里医僧数代人的手艺。第十二手只治一种病：治不好的病——治不了病，治人。', level: 2, realm: 'lianqi' },
    duties: [
      { label: '义诊半日', text: '寺门外支起药案，你看了十七个病人，没收一文钱。收摊时一个孩子塞给你两个还热的炊饼——善名这个东西，是别人替你记的账。', effect: { stat: { wugongXiuwei: 2 }, trait: { ren: 1 }, dutyFlag: 'shanming' } },
      { label: '药房碾药', text: '碾了三个时辰的当归。药香浸进袖子里，三日不散。知客僧说：药香入袖，是对学医的人最高的褒奖。', effect: { stat: { xiwei: 3 }, dutyFlag: 'shanming' } },
      { label: '往乱葬义庄送一趟往生钱', text: '你把住持的名帖和一吊钱送到义庄老人手上。回来路上想明白一件事：佛门超度不了穷，只能陪着。', effect: { stat: { xiwei: 4 }, trait: { ren: 1 }, money: -1, dutyFlag: 'shanming' } },
    ],
    annual: [
      '今年寺里收留了一批逃荒的孩子。住持说：经念得再好，不如粥熬得稠。',
      '城里时疫，寺门大开施药半月。你在药棚里熬红了眼，也记熟了三百张脸——慈悲愿力诀，就是这么练深的。',
    ],
    grudges: {},
    rule: '叛出佛门者，僧衣一脱便是俗人。只是施过药的手，再端刀就沉了。',
  },

  caobang: {
    id: 'caobang', name: '漕帮', kind: '江湖 · 漕运', city: 'linjiang', node: 'lj_caobang',
    masterNpc: 'lj_guanshi',
    kaoyanEvent: 'ev_kaoyan_caobang',
    motto: '水路即命脉，商路即人情。欠账跑不掉——这是规矩，也是护身符。',
    gongfa: { id: 'gf_caobang_guotan', name: '过滩步', desc: '漕帮的看家步法。滩险船急，落脚的地方只有一寸——这一寸，是用命量出来的。', level: 2, realm: 'wudao' },
    secondGongfa: { id: 'gf_caobang_chuanshui', name: '穿水十三式', desc: '堂主压箱底的货。他说这套拳在水里练才有意思——旱地练的是架子，水里练的是命。', level: 2, realm: 'wudao' },
    duties: [
      { label: '押一趟短驳', text: '从水门押到城外湖泽，货没少一两。回程船老大教你认了三处暗流——漕帮的学问全在水底下。', effect: { stat: { wugongXiuwei: 4 }, money: 2, trait: { yi: 1 } } },
      { label: '码头扛包一日', text: '扛了一天盐包，肩上磨掉层皮。管账的把你的名字记上了工册：入了册，就是帮里的人了。', effect: { stat: { wugongXiuwei: 3 }, money: 2 } },
      { label: '替帮里送一句口信', text: '口信只有六个字，你背了一路，送到时一字不差。收信的老头多看了你一眼：口信送得全，人靠得住。江湖上，这就够立住了。', effect: { stat: { wugongXiuwei: 2 }, trait: { yi: 1 }, flags: { bangzhong_ming: true } } },
    ],
    annual: [
      '今年秋汛，帮里沉了一条船，折了两个弟兄。堂主把抚恤银子亲自送到家属手上，一文不少——漕帮欠账跑不掉，包括这笔。',
      '盐帮今年又压了三成船价。总舵议了半夜，末了只定下四个字：接着走船。水上的事，水下了。',
    ],
    grudges: { yanbang: '漕帮与盐帮是官私之争的百年对头。你入了漕帮，盐帮的人见了你，眼里就带了钩子。' },
    rule: '叛出漕帮？水路三千里，哪条船你不认识人——叛帮者，天下码头不留宿。',
  },

  pingan: {
    id: 'pingan', name: '平安号镖行', kind: '江湖 · 镖行', city: 'yanhui', node: 'yh_biaoju',
    masterNpc: 'yh_laoBiaoTou',
    kaoyanEvent: 'ev_kaoyan_pingan',
    motto: '走遍山河的正路。镖行卖的不是武力，是信字。',
    gongfa: { id: 'gf_pingan_huzhen', name: '护镖十三刀', desc: '平安号开号三代的饭碗。刀不快，稳——护镖不求胜，求不失。', level: 2, realm: 'wudao' },
    secondGongfa: { id: 'gf_pingan_shitu', name: '识途要术', desc: '老镖头口传的路数：哪条道几月有匪、哪处水驿能歇脚、哪段官道走得说了不算——认路比认人要紧。', level: 1, realm: 'wudao' },
    duties: [
      { label: '跟一趟短镖', text: '雁回到铁瓦，三日。你学会了三件事：睡觉睡半只耳朵、吃饭吃七分饱、说话说一半留一半。', effect: { stat: { wugongXiuwei: 4 }, money: 3 } },
      { label: '喂马遛马半月', text: '老镖头说：镖行的命一半在刀上，一半在马背上。半月下来，那匹口外的青马见了你会打响鼻——牲口认人，比人准。', effect: { stat: { wugongXiuwei: 2 }, flags: { shima: true } } },
      { label: '誊抄一份路引底簿', text: '底簿上是三代镖师用脚记下的路：哪年哪月哪条道出过什么事，一笔一笔记到今日。你抄着抄着明白了——平安号卖的"平安"，是拿命换来的记账习惯。', effect: { stat: { wuxing: 1, wugongXiuwei: 2 }, flags: { luvin_note: true } } },
    ],
    annual: [
      '今年关外道上匪情紧，镖行折了一趟货。老镖头赔了货银，把押镖的镖师留用了——路上失手不怪人，怪路。',
      '总号新添了一匹口外青马，性子烈，三人骑摔三人。老镖头说：牲口跟人一样，得处，不能降。',
    ],
    grudges: {},
    rule: '叛出镖行的人，天下镖局不雇。走镖的圈子就这么大——信字碎了，粘不回来。',
  },
};

// 四期合并：新门派（十一派，共十六派）
Object.assign(SECTS, SECTS2);

// 门派仇怨网（蓝图 §门派）：拜入即接进网。文案级呈现（一期），遇敌倾向二期待扩。
export const SECT_GRUDGE_HINTS = {
  caobang: 'yanbang', taiyi: 'qintianjian',
};

Object.assign(SECTS, SECTS3); // 六期：门派扩编至三十家

export function sectOf(state) {
  return state?.life?.sect ? SECTS[state.life.sect.id] : null;
}
