// ============================================================
// 山河问剑录 · 内容/门派考验事件 + 江湖大事递送切片（一期追加块）
// Object.assign 追加进 EVENTS。考验事件的通过选项带 effect.sect_join。
// ============================================================

import { EVENTS } from './events.js';

// ---------- 五派拜师考验 ----------
Object.assign(EVENTS, {
  ev_kaoyan_qingyang: {
    id: 'ev_kaoyan_qingyang', weight: 5, nodes: ['lj_qingyang'], kind: 'sect',
    text: '老道放下扫帚，看了你半晌："求道的都问老道三件事。老道只问一件——你为何修行？"\n香炉里的灰一动不动，山风把檐角铁马碰出细响。他知道你答的不是话，是心。',
    options: [
      { label: '"求长生。听说仙路可期。"', effect: { trait: { chi: 1 } }, text_after: '老道摇头："求长生的，把日子活成了刑期。青羊观不收。你若想通了再来说。"' },
      { label: '"求个安顿。世道太乱，我想要个能坐得住的地方。"', effect: { sect_join: 'qingyang', trait: { ren: 1 } }, text_after: '老道笑了，皱纹里全是山风："好。求安顿的人，坐得住。从今日起，你扫殿、挑水、抄经——功课做到哪一步，道就走到哪一步。"' },
      { label: '"求力量。我要护住的人还没护住。"', effect: { trait: { xia: 1 } }, text_after: '老道沉默了很久："有牵挂是好事。但青羊观教的是放下手，不是攥紧拳。你去江湖上找你想要的——那里更合适。"' },
    ],
  },

  ev_kaoyan_taiyi: {
    id: 'ev_kaoyan_taiyi', weight: 5, nodes: ['tianjige'], kind: 'sect',
    text: '太一宗的供奉引你上观星台。夜风把星图吹得哗哗响，他不按图角。\n"太一宗收人，不看根骨，看一颗静心。"他指着西天一颗星，"你替我看着它。它什么时候动了，你告诉我。"然后他就下楼去了，把你一个人留在风里。',
    options: [
      { label: '（什么也不做，就看着。看到腿麻，看到天亮。）', cond: { minWuxing: 45, deny: '你看到后半夜，眼睛酸了，心也散了——那颗星到底动没动，你竟不敢确定。供奉上楼来笑了笑："回去养养神。看得住星的人，先得看得住自己。"' }, effect: { sect_join: 'taiyi', stat: { wuxing: 2 } }, text_after: '天将亮时，那颗星移了一线。供奉不知何时站在你身后："看住了。一颗星能看一宿的人，能替太一宗看天。入册吧。"' },
      { label: '"这不耽误工夫吗？我有更要紧的事。"', effect: { trait: { ao: 1 } }, text_after: '供奉点头："要紧事要紧。星不追人，但太一宗也不追人。门一直开着，你忙完了再来。"' },
    ],
  },

  ev_kaoyan_baoguo: {
    id: 'ev_kaoyan_baoguo', weight: 5, nodes: ['bgs_shanmen'], kind: 'sect',
    text: '知客僧领你到施药棚后头，指着一个病人的脚："烂了，得洗。药在那儿，水在那儿。"\n说完他就去前头接引香客了，把你和那双脚留在一起。棚外排队的眼睛都看着你。',
    options: [
      { label: '挽起袖子，把那双脚洗了。', effect: { sect_join: 'baoguo', dutyFlag: 'shanming', trait: { ren: 1 } }, text_after: '水凉，脓腥，你洗得很慢。洗完抬头，知客僧不知何时回来了，递给你一碗热药茶："洗脚不难。难的是把每一双脚都当第一双洗。从今日起，你的功课在棚下。"' },
      { label: '"我是来学佛法的，不是来伺候人的。"', effect: { trait: { ao: 1 } }, text_after: '知客僧不恼，只合十一礼："佛法在经卷里，也在脚盆里。施主先请回——棚下的事做得了，寺门随时开。"' },
      { label: '（默默把药和水递给旁边等着的老人，让他自己洗。）', effect: { trait: { si: 1 } }, text_after: '老人洗得很慢，你走的时候他还在道谢。知客僧在山门里看着，什么也没说——但下回你来，他记得你的脸。' },
    ],
  },

  ev_kaoyan_caobang: {
    id: 'ev_kaoyan_caobang', weight: 5, nodes: ['lj_caobang'], kind: 'sect',
    text: '管事把你的帖子在手里掂了掂："漕帮不考武功。就一件事——船过险滩的时候，一舱货和一个人，只能救一样。救哪个？"\n堂上的"义"字旗被穿堂风掀起一角，又落回去。',
    options: [
      { label: '"救人。货沉了能再运，人没了就没了。"', effect: { sect_join: 'caobang', trait: { ren: 1 } }, text_after: '管事把帖子收进袖子："对了一半。人先救——但沉了的货，得记自己的账，自己还。漕帮的义字旗，一半护人，一半记账。从今日起，你在册上。"' },
      { label: '"看货。多少人的生计押在那舱货上。"', effect: { trait: { si: 1 } }, text_after: '管事盯着你看了很久，看不出喜怒："这话不假，帮里也有人这么干。但帮里的规矩是先人后货——你这一套，走别的门也许吃得开。"' },
      { label: '"我不知道。没遇上，谁也答不准。"', effect: { trait: { ren: 1 }, flags: { caobang_yinzhen: true } }, text_after: '管事忽然笑了："实话。真遇上，你救完就知道了。"他把你的名字记上工册，"先做杂役。答案在水上，不在嘴上。"' },
    ],
  },

  ev_kaoyan_pingan: {
    id: 'ev_kaoyan_pingan', weight: 5, nodes: ['yh_biaoju'], kind: 'sect',
    text: '老镖头听你说要入行，也不抬头，手里擦着刀："平安号收人有一条——走过的路，比说过的话多。你说说，你走过哪儿？"',
    options: [
      { label: '把走过的路一五一十说了。', cond: { needFlags: ['been_guandao'], deny: '你翻来覆去只说得出村口到镇上那二里地。老镖头把刀插回鞘："走。路是走出来的，不是说出来出来的。走过官道再来。"' }, effect: { sect_join: 'pingan', stat: { wugongXiuwei: 2 } }, text_after: '老镖头这才抬眼："官道、峡口，都走过了？好。腿是自己的，路是大家的。从明日起，跟趟子手学喊镖——喊稳了，再谈刀。"' },
      { label: '"我练过几年功夫，能打。"', effect: { trait: { kuang: 1 } }, text_after: '老镖头终于抬头看了你一眼："镖行卖的是平安，不是能打。能打的坟头草都三尺高了。去走走，走明白了再来。"' },
    ],
  },

  // ---------- 江湖大事 · 同城递送切片（岁末或探索触发） ----------
  ev_we_biwu_zai: {
    id: 'ev_we_biwu_zai', weight: 6, nodes: ['chengmen_dashi'], kind: 'worldevent',
    text: '比武大会开了三日，全城的客栈都是满的。擂台上打拳的、台下赌输赢的、趁乱摸包的，各忙各的。你挤在人堆里，听见身边两个外乡口音在议论："听说今年夺魁的，使的是失传的功夫……"',
    options: [
      { label: '凑近听听他们说什么', effect: { sleeve_add: { book: 'events', entry: { year: '今岁', text: '比武大会——夺魁者用的是失传的功夫。这句话，你记下了。' } } }, text_after: '两人见你凑近，话头一转，改聊天气了。但你已经听见的那半句，收进了袖中录。' },
      { label: '去看看擂台', effect: { stat: { wugongXiuwei: 3 } }, text_after: '你在擂台底下站了一下午。高手的招式看不太懂，但那种把命放进每一招的架势，你看得懂——回去练功，你的手上多了点东西。' },
      { label: '趁人多，办自己的事', effect: { money: 2 }, text_after: '大会三日，人流量大，干什么都顺手。你赚了点辛苦钱，也见识了江湖最热闹的样子。' },
    ],
  },
  ev_we_yaoshou_zai: {
    id: 'ev_we_yaoshou_zai', weight: 6, nodes: ['yh_changjie'], kind: 'worldevent',
    text: '镇口的告示墙前围了一圈人：北道又折了一支商队，官府悬赏猎杀伤人的妖兽。告示的纸还新，边角已经被人撕去一角——有人比官府先动了手。',
    options: [
      { label: '揭下赏格', effect: { combat: 'c_baiying', win: { minghao: '猎妖手' } }, text_after: '你把赏格折好收进怀里——这单活，接了。' },
      { label: '跟人群打听妖兽的来路', effect: { sleeve_add: { book: 'events', entry: { year: '今岁', text: '北道妖患——伤人的是头白毛兽，五指爪印，像人手。' } } }, text_after: '一个老猎户模样的汉子压低声音："那不是兽。兽不留那样的爪印。"他不再多说了。' },
      { label: '避着走，多一事不如少一事', effect: { trait: { si: 1 } }, text_after: '你贴着墙根走开了。风紧的日子，活着比逞强要紧——你是这么劝自己的。' },
    ],
  },
  ev_we_caoyin_zai: {
    id: 'ev_we_caoyin_zai', weight: 6, nodes: ['lj_shuimen'], kind: 'worldevent',
    text: '漕运司的账房被封了条子，衙役进出搬着一箱箱账册。码头上的伙计们压着嗓子议论：亏空的数目，够买下半条水门街。有人因此掉了脑袋——也有人正连夜跑路。',
    options: [
      { label: '帮着搬箱子的衙役搭把手', effect: { money: 1, flags: { caoyin_seen: true } }, text_after: '你搭了一下午的手，换来一顿饭和几眼账册皮上的字。那几个字你不懂，但漕帮的人懂——回头你把见闻说了，管事多看了你两眼。' },
      { label: '趁乱打听跑路的人往哪儿去了', effect: { ledger: { type: '秘', text: '知道漕银案一名要犯的下落' } }, text_after: '一个船工收了你几文酒钱，朝上游努了努嘴。这个消息值多少，你心里没数——但你知道，知道得越多，睡得越少。' },
      { label: '看看热闹就走', text_after: '满城的风声雨声，你听完就走。案子的浪头打不到你这样的小人物——目前打不到。' },
    ],
  },
  ev_we_zhangmen_zai: {
    id: 'ev_we_zhangmen_zai', weight: 8, nodes: ['lj_qingyang'], kind: 'worldevent',
    text: '观里挂起了素白，老观主的蒲团还空着，人已经坐化七日了。道士们把丧事办得极静，没人哭——青羊观的规矩，走是回家，回家不用哭。',
    options: [
      { label: '在灵前上一炷香', effect: { trait: { ren: 1 } }, text_after: '香插进炉里，烟直直地往上走。你想起老观主活着时说的：坐得住。如今他坐到了最后。' },
      { label: '帮忙料理丧事', effect: { stat: { xiwei: 2 }, trait: { ren: 1 } }, text_after: '你抄了三天的经。抄到后半夜，忽然懂了观里为什么没人哭——他这一生是把"安顿"两个字活明白了的人。' },
    ],
  },
  ev_we_yanbang_zai: {
    id: 'ev_we_yanbang_zai', weight: 6, nodes: ['lj_shuimen'], kind: 'worldevent',
    text: '湖面上烧过的三条船还剩焦黑的龙骨，半沉在水里。漕帮的船过那儿都绕着走，盐帮的人这几天也没露面。码头上人人都在传：两边要真刀真枪了。',
    options: [
      { label: '去看看沉船', effect: { stat: { wugongXiuwei: 2 } }, text_after: '焦木缝里有没烧尽的盐袋，水泡开了一角，白花花的。你顺走了一小包——不干净，但趁手的钱没有来路干净的。' },
      { label: '躲远点', text_after: '帮派火并是绞肉的碾子，小人物凑近了就是填进去的。你转身走了。' },
    ],
  },
  ev_we_dahuan_zai: {
    id: 'ev_we_dahuan_zai', weight: 6, nodes: ['tw_mashi'], kind: 'worldevent',
    text: '马市上肥马见不着几匹，瘦马一水儿排到底。卖马的牧人自己都晒脱了皮——旱得草都不长，马吃的就是牧人家的口粮。关内的粮价，一天一个数。',
    options: [
      { label: '趁贱买一匹瘦马调养', cond: { moneyMin: 5, deny: '你摸了摸袖子——买马的价再贱，也贱不过你的家底。' }, effect: { money: -5, items: [{ id: 'item_shouma', name: '口外瘦马', desc: '旱年从关外牵回来的瘦马，肋骨一根根数得清。你喂了它半月草料，它看你的眼神不一样了。' }] }, text_after: '你把马牵到背风处，喂了半日草料。它肋骨动一动都看得见，但那双眼睛还亮着——饿不死的牲口，都是好牲口。' },
      { label: '给流民舍一碗粥', effect: { dutyFlag: 'shanming', trait: { ren: 1 }, money: -1 }, text_after: '粥稀，但热的。流民里一个老人对你合了个古礼——那礼数不是这一带的。乱世里的人，把来路都写在了礼上。' },
    ],
  },
  ev_we_dibeng_zai: {
    id: 'ev_we_dibeng_zai', weight: 8, nodes: ['chengmen_dashi'], kind: 'worldevent',
    text: '满城的白。铺子歇了业，酒楼摘了幌子，连街边的狗都叫得收敛。国丧的礼制一层压一层地下来，压得这座不夜城第一次在子时前静了下来。老人说：要变天了——不是骂人话，是实话。',
    options: [
      { label: '去宫门那头看看', effect: { sleeve_add: { book: 'events', entry: { year: '今岁', text: '帝崩国丧——宫门前的白幡挂到了第十天。天要变了。' } } }, text_after: '宫门前跪的官员一片白，像一场提前落的雪。你远远站着看了半晌——史书写这一页只用一行字，你看见的是一城的白。' },
      { label: '照常过活，丧事不沾', effect: { trait: { si: 1 } }, text_after: '皇帝换了，粮价会换，官帽子会换——但你的日子还是你的日子。你把门户关好，睡你的觉。' },
    ],
  },
  ev_we_guiwang_zai: {
    id: 'ev_we_guiwang_zai', weight: 6, nodes: ['guishi_ru'], kind: 'worldevent',
    text: '鬼市连开了七夜，摊子比平时多出一倍。来的不光是熟客——连皇城里偶尔"路过"的脸都出现了。无字碑前的油灯断过一回货，卖灯油的小贩一夜之间发了笔小财。老鬼市蹲在墙根抽着烟袋：上回这样，是二十年前。二十年前那批人，如今坟头草都齐腰了。',
    options: [
      { label: '趁夜市淘货', effect: { item_roll: { tier: 1, kind: 'treasure' } }, text_after: '你在第七夜的乱摊子上挑了件东西。摊主是张生面孔，收了钱就收摊走人——鬼市的货，认货不认人。' },
      { label: '留意谁在市里走动', effect: { sleeve_add: { book: 'events', entry: { year: '今岁', text: '鬼市夜开——市里出现了几张皇城里的脸。他们买的东西，比他们的官袍有意思。' } } }, text_after: '你蹲在暗处看了半宿。看得不真切，但有几张脸你记住了——袖中录上添了几笔。' },
    ],
  },
  ev_we_wulin_zai: {
    id: 'ev_we_wulin_zai', weight: 6, nodes: ['wuhangjie'], kind: 'worldevent',
    text: '半条街的镖局换了招牌。老字号的匾额摘下来当柴烧，新招牌漆都没干就挂上去了——背后是新的东家、新的路子、新的规矩。武行的老人蹲在街边看，一句话不说。',
    options: [
      { label: '跟老人讨个说法', effect: { sleeve_add: { book: 'events', entry: { year: '今岁', text: '武行换旗——老人说：招牌换了三回，规矩没换过一回。江湖不认招牌，认账。' } } }, text_after: '老人磕了磕烟锅："小子，记住喽——江湖不认招牌，认账。谁家的账赖了，哪家的招牌就是块木头。"' },
      { label: '去新字号应个活计', chance: 0.6, effect: { money: 3 }, fail: { text_after: '新字号招人挑得很：要年轻力壮、要本地保人、要没旧账。你占不齐。', }, text_after: '新东家正缺人手，你领了个跑腿的活，赚了几个辛苦钱。' },
    ],
  },
  ev_we_shiyi_zai: {
    id: 'ev_we_shiyi_zai', weight: 6, nodes: ['lj_shuimen'], kind: 'worldevent',
    text: '时疫过境，临江府的药铺门板都下了半扇——不是歇业，是全拆下来当病床用了。报国寺的药僧从早熬到晚，施药棚一路搭到了水门。整座城闻着都是药汤味。',
    options: [
      { label: '去施药棚帮工', effect: { dutyFlag: 'shanming', stat: { xiwei: 2 }, trait: { ren: 1 } }, text_after: '你熬了三天的药，搬了两天的水。手上沾的药味半个月散不掉——但棚下有个痊愈的婆婆逢人就说是你救的。善名这个东西，是别人替你记的账。' },
      { label: '出钱捐一批药材', cond: { moneyMin: 3, deny: '你想捐，可袖子比脸还干净。心意到了，力没到。' }, effect: { money: -3, dutyFlag: 'shanming', trait: { ren: 1 } }, text_after: '药僧收了你的钱，在你的名下记了一笔——不是记给佛祖看的，是记给疫后人心的。' },
      { label: '闭门自守', text_after: '疫病不认人，你能做的只有不出门。药汤味从窗缝里钻进来，整个月都在提醒你：外面有人在替全城硬扛。' },
    ],
  },
  ev_bgs_yizhen: {
    id: 'ev_bgs_yizhen', weight: 5, nodes: ['bgs_shanmen'], kind: 'sect',
    text: '施药棚下来了个抱着孩子的妇人，孩子烧得满脸通红。知客僧正被三个病人围着脱不开身，看见你，招了招手："来得正好。看着——退热用什么，你上一堂课学过的。"',
    options: [
      { label: '照方抓药，喂孩子服下', effect: { dutyFlag: 'shanming', trait: { ren: 1 } }, text_after: '孩子半夜退了烧。妇人第二天提着一篮鸡蛋来谢，怎么都不肯拿回去一个。知客僧说：记住今天的方子——药是死的，人急的时候，抓药的手不能急。' },
      { label: '"我不会医。"', effect: { trait: { si: 1 } }, text_after: '知客僧没说什么，自己腾出手去。但你看见他接过孩子时看了你一眼——那眼神不是怪罪，是记住了：这个人还不敢伸手。' },
    ],
  },
});
