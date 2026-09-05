// ============================================================
// 山河问剑录 · 数据三层之 world/（固定世界骨架，每局一致）
// 场景化铁律：每去处 = 城区结构 + 光景基调 + 活路 + 际遇四件套
// 可达审计断言：话头≥3、际遇≥1、知事NPC≥1
// ============================================================

import { CITIES2, AREAS2, NODES2, NPCS2 } from './world2.js';
import { CITIES3, AREAS3, NODES3, NPCS3 } from './world3.js';
import { CITIES4, AREAS4, NODES4, NPCS4 } from './world4.js';

export const cities = {
  xiangye: { id: 'xiangye', name: '九州乡野', kind: 'wild',
    blurb: '村落、山神庙、破驿、野渡——不成"城"但成"景"的过路处。说书人嘴里"破庙里可能有神仙"，说的就是这类地方。' },
  tianqi: { id: 'tianqi', name: '天启城', kind: 'capital',
    blurb: '城墙十里、漕河穿城。六部衙署的朱漆、坊市的喧腾与地下的潮气——三层城市，是三个世界。' },
  yanhui: { id: 'yanhui', name: '雁回镇', kind: 'town',
    blurb: '十里长街车马喧。南来北往的官道枢纽，江湖消息的集散地——天下事，先过雁回。' },
  linjiang: { id: 'linjiang', name: '临江府', kind: 'town',
    blurb: '烟雨、橹声、桨声灯影。漕运枢纽，水路即命脉；丝绸与漕银养活了半城人。' },
  tiewa: { id: 'tiewa', name: '铁瓦关', kind: 'town',
    blurb: '风沙、号角、佛塔铃铎。边关重镇，命贱恩重——关外就是戈壁。' },
  huangquan: { id: 'huangquan', name: '黄泉集', kind: 'town',
    blurb: '没有官府的地方，规矩用刀讲。魔道营生、赏金客、亡命者，都在这儿讨一口饭。' },
};

export const areas = {
  xiangye_wild: { id: 'xiangye_wild', city: 'xiangye', name: '乡野' },
  tq_huangcheng: { id: 'tq_huangcheng', city: 'tianqi', name: '皇城',
    blurb: '朱墙金瓦下的如履薄冰；一句错话、一个字，都收不回。' },
  tq_fangshi: { id: 'tq_fangshi', city: 'tianqi', name: '外城坊市',
    blurb: '人间烟火最厚处：吆喝、算盘、车辙、早点摊的热气。' },
  tq_dixia: { id: 'tq_dixia', city: 'tianqi', name: '江湖地下',
    blurb: '潮气、灯火、规矩——地下的江湖，比地上更讲"规矩"。' },
};

// nodes：去处。desc=光景基调（走进去什么样）；links=步行的去处；huatou=眼下的话头(≥3)
export const nodes = {
  // ---------- 乡野 ----------
  qingxi: {
    id: 'qingxi', city: 'xiangye', area: 'xiangye_wild', name: '青溪村',
    desc: '一个小村伏在山坳里，几十户人家，屋脊上炊烟被风扯得歪斜。村口有棵老槐，树下拴着磨秃了角的石碾；溪水从后山下来，水声一年四季没停过。黄昏时谁家喊孩子吃饭，半个村子都听得见。',
    links: ['poza', 'shanlu'], npcs: ['cunzhang', 'laolienu'],
    huatou: ['去后山看看', '和村长攀谈', '去老猎户家坐坐', '在村里逛逛'],
    events: ['ev_shanhong_visit', 'ev_houlao_shouye'], tags: ['village'],
  },
  poza: {
    id: 'poza', city: 'xiangye', area: 'xiangye_wild', name: '山神庙',
    desc: '半山腰一座塌了半边的山神庙，神像的脸早叫雨水泡糊了，只剩个轮廓。庙里有一张断腿供桌、半炷香灰。夜里风穿过来，供桌底下嗡嗡地响，像有人贴着地叹气。',
    links: ['qingxi', 'shanlu'], npcs: [],
    huatou: ['在庙里歇脚', '给山神上一炷香', '看看供桌底下', '往山道走'],
    events: ['ev_pozza_yujian'], tags: ['wild', 'night-ok'],
  },
  shanlu: {
    id: 'shanlu', city: 'xiangye', area: 'xiangye_wild', name: '后山道',
    desc: '后山的路是采药人和猎人踩出来的，窄处只容一人侧身。松针铺地，踩上去没声。往深处走，人声就断了，只剩鸟叫和自己的心跳。',
    links: ['qingxi', 'poza', 'shanbi_dong'], npcs: [],
    huatou: ['往深处走', '回村', '去山神庙', '采些草药'],
    events: ['ev_houshan_yao'], tags: ['wild'],
  },
  shanbi_dong: {
    id: 'shanbi_dong', city: 'xiangye', area: 'xiangye_wild', name: '山壁石洞',
    desc: '一道被枯藤半掩的石缝，侧身才能挤进去。里头干燥，石壁上有人用炭画过一遍遍的吐纳周天，笔迹旧得发白。',
    links: ['shanlu'], npcs: [],
    huatou: ['照着石壁吐纳', '把石壁看仔细', '出洞回去'],
    events: [], tags: ['wild', 'hidden', 'lingdi'],
  },
  guandao: {
    id: 'guandao', city: 'xiangye', area: 'xiangye_wild', name: '官道',
    desc: '黄土官道向东向西各不见头，车辙压出两道深沟。路边每隔十里一座歇脚亭，亭柱上刻满过路人的名字——有的成了名，有的只剩名字。',
    links: [], npcs: [],
    huatou: ['赶路', '在歇脚亭歇脚', '留意过路人'],
    events: ['ev_xinglu_shengshi'], tags: ['road'],
  },

  // ---------- 天启城 · 皇城 ----------
  gongmen: {
    id: 'gongmen', city: 'tianqi', area: 'tq_huangcheng', name: '宫门当值区',
    desc: '宫墙高得把日头都挡去半边，朱漆大门上碗口大的铜钉排到看不清。当值的禁军甲叶碰得轻响，谁走到哪儿、停了多久，墙角的执事太监都拿眼睛量着。这里说话要用气声，咳嗽都要拣时辰。',
    links: ['tianjige', 'neishi', 'chengmen_dashi'], npcs: ['zhishi_taijian', 'jinjun_xiaowei'],
    huatou: ['去天机阁', '去内市', '和当值小校攀谈', '在宫门外候着'],
    events: ['ev_gongmen_panwen'], tags: ['palace'],
  },
  tianjige: {
    id: 'tianjige', city: 'tianqi', area: 'tq_huangcheng', name: '天机阁',
    desc: '观星台上铜仪滴水不漏，夜里台上灯亮到三更。阁里静得能听见浑天仪的铜环转动的吱呀。太一宗的供奉们守着星图，说人间大事，都先写在星星背面上。',
    links: ['gongmen'], npcs: ['qintianjian_zhushi', 'taiyi_gongfeng'],
    huatou: ['求拜太一宗门下', '向监正主事请教星象', '观星台上看星', '和太一宗供奉叙谈'],
    events: ['ev_tianji_shiqlou'], tags: ['palace', 'sect'],
  },
  neishi: {
    id: 'neishi', city: 'tianqi', area: 'tq_huangcheng', name: '内市',
    desc: '内市专供宫里采办，货比东市金贵，也比东市安静。掌柜们轻声报价，银货两讫都不高声。偶尔能撞见宫人出来采办，袖口一松，露出半截内造的缎子。',
    links: ['gongmen'], npcs: ['neishi_zhanggui'],
    huatou: ['在铺子里转转', '和掌柜搭话', '打听内里用度'],
    events: ['ev_neishi_huowu'], tags: ['palace', 'market'],
  },

  // ---------- 天启城 · 外城坊市 ----------
  chengmen_dashi: {
    id: 'chengmen_dashi', city: 'tianqi', area: 'tq_fangshi', name: '四牌楼大街',
    desc: '四牌楼往四面各扯出一条街，天启城的人间烟火全在这儿烧着。早点摊的热气糊人脸，算盘声从当铺里泼出来，车辙里的泥水映着招牌。城门口人进人出，城吏查的是货，量的是人。',
    links: ['dongshi', 'matou', 'wuhangjie', 'sipailou', 'gongmen', 'guishi_ru', 'bgs_shanmen'], npcs: ['chaishi', 'shuotan_laoren'],
    huatou: ['去东市', '去漕运码头', '去武行镖局街', '去四牌楼贫民坊', '去报国寺', '听老说书人说书', '打探城里的消息'],
    events: ['ev_dajie_renao'], tags: ['hub'],
  },
  dongshi: {
    id: 'dongshi', city: 'tianqi', area: 'tq_fangshi', name: '东市',
    desc: '东市卖奇货：南边的象牙、海外的螺钿、西域的香料，一排排铺子开到人眼花。番商缠着红头巾站在铺前吆喝，价钱压得极低，货也说得极神——真假掺半，全看买主的眼力。',
    links: ['chengmen_dashi'], npcs: ['dongshi_zhanggui', 'fanshang'],
    huatou: ['逛铺子', '和番商搭话', '和铺掌柜攀谈', '找鉴货师傅看东西'],
    events: ['ev_dongshi_fanhuo'], tags: ['market'],
  },
  matou: {
    id: 'matou', city: 'tianqi', area: 'tq_fangshi', name: '漕运码头',
    desc: '漕河从城里穿过去，码头停的船首尾相衔。扛包的号子一声压一声，麻袋压弯了扁担也压弯了腰。工头提着鞭子来回走，谁慢半拍，鞭子就先到话头前头。',
    links: ['chengmen_dashi'], npcs: ['gongtou', 'caobang_dizi'],
    huatou: ['找工头问活计', '和漕帮弟子搭话', '在码头看船', '帮着扛两天包'],
    events: ['ev_matou_gongchao'], tags: ['docks'],
  },
  wuhangjie: {
    id: 'wuhangjie', city: 'tianqi', area: 'tq_fangshi', name: '武行镖局街',
    desc: '这条街的招牌一个比一个横：锁子甲铺、兵器行、镖局分号一家挨一家。街心立着块拴马石，石上刀痕剑印摞了几层——都是酒醉后比划留下的。铁匠铺的锤声从早响到晚，节奏不乱。',
    links: ['chengmen_dashi'], npcs: ['biaotou_wang', 'tiejiang'],
    huatou: ['去平安号镖局分号', '找铁匠看看兵器', '和镖头讨教两手', '在街口看人比武'],
    events: ['ev_wuhang_bishi'], tags: ['martial'],
  },
  sipailou: {
    id: 'sipailou', city: 'tianqi', area: 'tq_fangshi', name: '四牌楼贫民坊',
    desc: '坊里的巷子窄得晾衣杆能搭到对面屋檐。土墙上层层叠叠贴着告示：寻人的、收尸的、卖儿的。孩子光脚追着跑，鸡在瓦上飞。可这里的人活得糙也活得硬，谁家有红白事，全坊来帮衬。',
    links: ['chengmen_dashi'], npcs: ['poqigai', 'xiFu'],
    huatou: ['在坊里转转', '和老人聊天', '帮坊里人干点活', '找点吃食'],
    events: ['ev_sipailou_jijin'], tags: ['slum'],
  },
  bgs_shanmen: {
    id: 'bgs_shanmen', city: 'tianqi', area: 'tq_fangshi', name: '报国寺',
    desc: '报国寺在天启外城，山门不大，匾上"报国"两个字被香火熏得发黑。寺里一半是殿堂，一半是药坊——穿僧衣的和尚在药柜间穿行，抓药的手和敲木鱼的手是同一双手。施药棚常年搭在山门外，棚下的长队比殿里的香客长。',
    links: ['chengmen_dashi'], npcs: ['bgs_zhike'],
    huatou: ['拜入报国寺门下', '和知客僧说话', '去施药棚搭把手', '在殿里上炷香'],
    events: ['ev_bgs_yizhen'], tags: ['temple', 'sect'],
  },
  guishi_ru: {
    id: 'guishi_ru', city: 'tianqi', area: 'tq_dixia', name: '鬼市入口',
    desc: '暗渠旁一道矮门，白天看着是堵废墙，入夜有人拿油灯在墙洞里一晃，墙就"开"了。里头灯光昏黄，人影都矮半截。规矩立在门口一块无字碑上——看懂的人才进得去。',
    links: ['guishi', 'chengmen_dashi'], npcs: ['guishi_shoumen'],
    huatou: ['进鬼市', '和无字碑前的人搭话', '回大街'],
    events: ['ev_guishi_wuzibei'], tags: ['underground', 'night-only'],
  },
  guishi: {
    id: 'guishi', city: 'tianqi', area: 'tq_dixia', name: '鬼市',
    desc: '鬼市只在夜里开。摊上的货全用黑布盖着，掀一角看货，价不讲二遍。买卖双方不问来路、不摘斗笠，说话全是切口。有人说这儿"什么都卖"——也有人说，什么都卖，就看你出得起什么。',
    links: ['guishi_ru', 'tangkou', 'xiaojinku'], npcs: ['guishi_zhanggui', 'feng_qigai'],
    huatou: ['掀摊看货', '和大掌柜攀谈', '留意那个疯乞丐', '卖东西'],
    events: ['ev_guishi_zhenhuo'], tags: ['underground'],
  },
  tangkou: {
    id: 'tangkou', city: 'tianqi', area: 'tq_dixia', name: '帮派堂口',
    desc: '堂口设在一座旧茶行里，白天做正经茶叶生意，夜里改作议事。堂前两排条凳坐满了人，腰里家伙都盘在衣服底下。管事的高坐，说话不紧不慢——地下江湖讲规矩，规矩都在他不紧不慢的话里。',
    links: ['guishi', 'xiaojinku', 'chengmen_dashi'], npcs: ['tangkou_guanshi'],
    huatou: ['拜会管事', '接个活计', '递茶问规矩', '打听堂口的买卖'],
    events: ['ev_tangkou_huji'], tags: ['underground', 'gang'],
  },
  xiaojinku: {
    id: 'xiaojinku', city: 'tianqi', area: 'tq_dixia', name: '销金窟',
    desc: '赌坊连着黑拳场，一层嗒嗒的骰子声，一层闷闷的拳肉声。赢家笑得放肆，输家走得无声。楼上的酒是温的，楼下的血是凉的——这地方销的不是金，是人的定数。',
    links: ['tangkou', 'guishi'], npcs: ['dufang_zhanggui'],
    huatou: ['押两把', '看黑拳', '上台打黑拳', '喝杯热酒定定神'],
    events: ['ev_xiaojinku_quan'], tags: ['underground', 'gamble'],
  },
  yizhuang: {
    id: 'yizhuang', city: 'tianqi', area: 'tq_dixia', name: '乱葬义庄',
    desc: '义庄停棺，白幡在穿堂风里一荡一荡。守庄的老人夜夜点一盏灯，说灯灭了，躺着的就不安生。棺材有厚有薄——薄的来路多是无名尸，厚的那口，据说停了三年没人认领。',
    links: ['chengmen_dashi', 'guishi_ru'], npcs: ['yizhuang_laoren'],
    huatou: ['帮守庄老人添灯油', '打听那口厚棺的来历', '在义庄过一夜', '回大街'],
    events: ['ev_yizhuang_houguan'], tags: ['underground', 'eerie'],
  },

  // ---------- 雁回镇 ----------
  yh_changjie: {
    id: 'yh_changjie', city: 'yanhui', area: 'tq_fangshi', name: '酒旗长街',
    desc: '雁回镇一条长街贯通南北，酒旗一面接一面。车马行的骡铃、镖车轴响、赶考书生的书箱磕碰，全在这条街上混着。镇不大，可天下事都打这儿过——官道东西南北，都在这儿打个弯。',
    links: ['yh_yizhan', 'yh_biaoju', 'yh_chenghuang', 'yh_chemahang'], npcs: ['yh_jiubao', 'yh_shuoshu'],
    huatou: ['去驿站', '去平安号分号', '去城隍庙', '去车马行', '听说书', '打探消息'],
    events: ['ev_yh_xiaoxi'], tags: ['hub'],
  },
  yh_yizhan: {
    id: 'yh_yizhan', city: 'yanhui', area: 'tq_fangshi', name: '驿站',
    desc: '驿站的门前的拴马桩刻满了"某年某月到此一游"。驿丞是个精瘦老头，记账的小楷端正得刻板。过路文书、军情塘报、江湖信件，都在他这儿过手——雁回镇的消息，一半从他门缝里漏出来。',
    links: ['yh_changjie'], npcs: ['yh_yicheng'],
    huatou: ['向驿丞打听路况', '歇脚住店', '翻看官府的塘报'],
    events: ['ev_yh_yizhan_tangbao'], tags: ['post'],
  },
  yh_biaoju: {
    id: 'yh_biaoju', city: 'yanhui', area: 'tq_fangshi', name: '平安号镖局分号',
    desc: '平安号的镖旗是杏黄的，旗上一个"平"字洗得发白还在飘。院里兵器架擦得锃亮，趟子手在练喊镖——"合吾——"一声拖得又长又亮。老镖头说了：镖行在江湖走，靠的是三分武艺、七分人缘。',
    links: ['yh_changjie'], npcs: ['yh_laoBiaoTou', 'yh_tangzishou'],
    huatou: ['求入镖行门下', '拜访老镖头', '跟趟子手练喊镖', '讨个随镖的活计', '看看镖单'],
    events: ['ev_yh_biaoju_yaohuo'], tags: ['martial'],
  },
  yh_chenghuang: {
    id: 'yh_chenghuang', city: 'yanhui', area: 'tq_fangshi', name: '城隍庙',
    desc: '城隍庙的香火在雁回镇最旺。庙祝说：过路的都在这儿求签——求平安的求财的求姻缘的，城隍爷一签一签地接着。签筒摇起来哗啦啦响，像这场人间事都没个准头。',
    links: ['yh_changjie'], npcs: ['yh_miaozhu'],
    huatou: ['求一签', '和庙祝聊天', '在庙前听人许愿'],
    events: ['ev_yh_qiuqian'], tags: ['temple'],
  },
  yh_chemahang: {
    id: 'yh_chemahang', city: 'yanhui', area: 'tq_fangshi', name: '车马行',
    desc: '车马行院里停着七八辆大车，骡子打着响鼻。行里的老把式闭着眼能听出哪辆车该上油了。去哪儿的车都有——去临江的、去铁瓦关的、去黄泉集的；黄泉集那趟，车夫们不太愿意拉。',
    links: ['yh_changjie'], npcs: ['yh_bashi'],
    huatou: ['问去各镇的车', '和老把式聊聊路况', '搭车行路'],
    events: ['ev_chemahang_zhaoche'], tags: ['transport'],
  },
  yh_xia: {
    id: 'yh_xia', city: 'xiangye', area: 'xiangye_wild', name: '雁回峡',
    desc: '官道到此被一道峡谷拦腰截断，峡深不见底，云在半峡里走。栈道贴崖而建，木板响一声，心里就空一下。老人们说：雁飞到这里都要回头，所以叫雁回峡——人不回头，是人有非过不可的坎。',
    links: [], npcs: [],
    huatou: ['小心过栈道', '在崖边歇脚', '观察崖下'],
    events: ['adv_yanhui_xia'], tags: ['road', 'cliff'],
  },

  // ---------- 临江府 ----------
  lj_shuimen: {
    id: 'lj_shuimen', city: 'linjiang', area: 'tq_fangshi', name: '水门码头',
    desc: '临江府的水门是石砌的拱门，漕船打门下过，船帆要收一半。桥上卖船点的阿婆嗓门盖过橹声，桥下画舫的灯一盏盏亮起来。水汽混着鱼腥和脂粉香——这是临江府的气味。',
    links: ['lj_caobang', 'lj_shuyuan', 'lj_huze'], npcs: ['lj_shuimen_po', 'lj_chuanfu'],
    huatou: ['和船夫搭话', '去漕帮总舵', '去湖泽', '看花船'],
    events: ['ev_lj_huachuan'], tags: ['docks'],
  },
  lj_caobang: {
    id: 'lj_caobang', city: 'linjiang', area: 'tq_fangshi', name: '漕帮总舵',
    desc: '总舵临水而建，门口两根系船桩碗口粗，缆绳磨出的沟深得能躺进手指。堂上挂一面"义"字旗，旗角的水渍一层叠一层。漕帮的规矩：水上的人，义字当头；欠了帮里的账，游到天涯也要还。',
    links: ['lj_shuimen'], npcs: ['lj_bangzhong', 'lj_guanshi'],
    huatou: ['拜会漕帮管事', '讨一份行船的活', '递帖入帮', '打听漕银的案子'],
    events: ['ev_lj_caoyin_an'], tags: ['gang'],
  },
  lj_shuyuan: {
    id: 'lj_shuyuan', city: 'linjiang', area: 'tq_fangshi', name: '书院',
    desc: '书院在城东，一墙之隔隔开市声。院里两株老桂，秋天满院都是香的。读书声、翻书声、先生咳嗽声。墙上挂着历科题名录——寒门子弟的功名，一半是从这堵墙下走出去的。',
    links: ['lj_shuimen'], npcs: ['lj_xiansheng'],
    huatou: ['听先生讲书', '借阅书籍', '和学子们攀谈', '求先生收留读书'],
    events: ['ev_lj_shuyuan_cany'], tags: ['academy'],
  },
  lj_huze: {
    id: 'lj_huze', city: 'xiangye', area: 'xiangye_wild', name: '城外湖泽',
    desc: '湖泽在城外西南，芦苇荡一眼望不到边。渔船在苇荡里出没，白鹭起起落落。摆渡的老妪撑一条乌篷船，渡了三代人——湖里的水路，她闭着眼都认得。',
    links: ['lj_shuimen'], npcs: ['lj_baidu_lAoyu'],
    huatou: ['请老妪摆渡', '和渔家聊天', '下湖捕鱼', '在苇荡里转转'],
    events: ['ev_lj_huze_yu'], tags: ['lake', 'boat'],
  },
  lj_qingyang: {
    id: 'lj_qingyang', city: 'xiangye', area: 'xiangye_wild', name: '青羊观',
    desc: '青羊观在临江城外山上，一道石阶三百级，爬上去喘匀了气，才看得见山门。观里供三清，香火不旺，扫得极净。观主是位清瘦老道，说话慢，走路也慢——据说他年轻时是江湖上最快的剑。',
    links: ['lj_shuimen'], npcs: ['lj_laodao', 'lj_daoTong'],
    huatou: ['拜观求道', '和老道攀谈', '帮观里挑水扫地', '求教吐纳之法'],
    events: ['ev_lj_qingyang_zhi'], tags: ['taoist', 'sect'],
  },

  // ---------- 铁瓦关 ----------
  tw_guanqiang: {
    id: 'tw_guanqiang', city: 'tiewa', area: 'tq_fangshi', name: '关墙戍楼',
    desc: '铁瓦关的城墙是黑铁色的，砖缝里嵌着历次修缮时混进去的箭头。戍楼的号角声一天三遍，风从关外灌进来，吹得人睁不开眼。守卒的脸都是同一种颜色——风沙磨的。',
    links: ['tw_mashi', 'tw_foguta', 'tw_huangyi'], npcs: ['tw_shujiang', 'tw_laobing'],
    huatou: ['向戍将请安', '和老兵攀谈', '上城墙看关外', '听一听风声'],
    events: ['ev_tw_baizai_fengsheng'], tags: ['frontier'],
  },
  tw_mashi: {
    id: 'tw_mashi', city: 'tiewa', area: 'tq_fangshi', name: '马市',
    desc: '马市在关内斜街，蹄声、嘶鸣、牙人撮合的巧嘴全搅在一处。相马的老手扒开马嘴看牙口，一验一个准。关外的马便宜，可运到关内就翻了倍——这条道上的水，比马市的水还深。',
    links: ['tw_guanqiang'], npcs: ['tw_yaren', 'tw_mafan'],
    huatou: ['看马相马', '和牙人搭话', '贩一趟马', '打听关外的道'],
    events: ['ev_tw_mashi_pian'], tags: ['market', 'horse'],
  },
  tw_foguta: {
    id: 'tw_foguta', city: 'tiewa', area: 'tq_fangshi', name: '佛骨塔下院',
    desc: '下院是西漠佛国在边关设的一处小院，塔是依着本山缩建的，铃铎在风里响。武僧们练功不避人，一拳一脚都沉稳。老僧说：边关命贱，佛塔在这儿，是给贱命留个念想。',
    links: ['tw_guanqiang'], npcs: ['tw_laosen', 'tw_wuseng'],
    huatou: ['听老僧说法', '随武僧练拳', '帮寺里挑水', '求一串佛珠'],
    events: ['ev_tw_foguta_feng'], tags: ['buddhist'],
  },
  tw_huangyi: {
    id: 'tw_huangyi', city: 'xiangye', area: 'xiangye_wild', name: '关外荒驿',
    desc: '出关十里，有一座荒废的驿站，屋顶塌了一半，另一半还撑着。过路的商队偶尔在这儿避风沙，墙上有历代过客刻的记号——有的记里程，有的记亡人。风声呜呜的，像谁在念没念完的名单。',
    links: ['tw_guanqiang'], npcs: [],
    huatou: ['在驿站避风', '看墙上的记号', '夜里守夜'],
    events: ['ev_tw_huangyi_ye'], tags: ['frontier', 'eerie'],
  },

  // ---------- 黄泉集 ----------
  hq_dufang: {
    id: 'hq_dufang', city: 'huangquan', area: 'tq_dixia', name: '赌坊',
    desc: '黄泉集的赌坊是全镇最亮堂的地方——灯火、骰子、眼睛都亮。掌柜的笑面，抽头三成，童叟无欺；欺你的从来不是他，是赌桌本身。输光了的人从后门出去，进去的时候没人回头。',
    links: ['hq_heishi', 'hq_yaorenfang'], npcs: ['hq_dufang_zhanggui'],
    huatou: ['押一把', '和掌柜攀谈', '看牌桌上的生面孔', '借钱翻本'],
    events: ['ev_hq_dufang_qian'], tags: ['gamble'],
  },
  hq_heishi: {
    id: 'hq_heishi', city: 'huangquan', area: 'tq_dixia', name: '黑市',
    desc: '黑市开在镇子背后一排废弃的窑洞里。摊上的货不亮出来，全凭切口讲：要什么，报什么。魔功残卷、来路不明的丹药、官府海捕文书上人的随身物——这儿都有价，也都有主。',
    links: ['hq_dufang', 'hq_luanzangling'], npcs: ['hq_heishi_fan'],
    huatou: ['报切口问货', '出手东西', '打听幽冥教的下落', '留意买主们'],
    events: ['ev_hq_heishi_huo'], tags: ['underground'],
  },
  hq_yaorenfang: {
    id: 'hq_yaorenfang', city: 'huangquan', area: 'tq_dixia', name: '药人坊',
    desc: '药人坊外围是高墙，墙头拉铁蒺藜。里面日夜飘出一股苦得发甜的药气。镇上人都绕着走，说里头养着"药人"——拿活人试药的营生。坊主的银子白花花的，镇长的手章盖得也痛快。',
    links: ['hq_dufang'], npcs: ['hq_fangzhu', 'hq_shouwei'],
    huatou: ['和守卫搭话', '探听坊里的事', '夜里潜近看看', '卖身入坊做工'],
    events: ['ev_hq_yaoren_miren'], tags: ['underground', 'dark'],
  },
  hq_luanzangling: {
    id: 'hq_luanzangling', city: 'xiangye', area: 'xiangye_wild', name: '镇外乱葬岭',
    desc: '乱葬岭埋的都是没名没姓的。坟头挤着坟头，纸钱灰一阵风卷起来又落下。夜里磷火明明灭灭，胆小的白天都不来。可挖坟的、寻物的、寻仇的，夜里来的反倒多——死人不会说话，死人的东西也不会。',
    links: ['hq_heishi'], npcs: ['hq_shouling_ren'],
    huatou: ['白日里踏勘', '夜里守着', '寻一处旧坟看看', '和守岭人搭话'],
    events: ['ev_hq_luanzang_ye'], tags: ['eerie', 'wild'],
  },
};

// npcs：人物库（知事表——知什么/答什么；问路答实）
export const npcs = {
  // 乡野
  cunzhang: { id: 'cunzhang', name: '村长', aliases: ['村长'], city: 'xiangye',
    desc: '六十多岁的干瘦老头，胡子上总沾着旱烟灰，管着全村的闲事和要紧事。',
    zhishi: [
      { keys: ['后山', '闹妖', '山里'], answer: '后山这几年不太平。老猎户说见过白影，村里牲口少了几只。要去，带上老猎户，别一个人。' },
      { keys: ['修仙', '修行', '仙人', '练气'], answer: '仙人？咱这儿没见过。倒是十年前路过个游方道人，在后山住了半月，走时说山里有"气"。他啥样？背个药篓，爱笑，没名字。' },
      { keys: ['山洪', '水', '灾'], answer: '上游有个堰塞的老塘，雨水大的年头要塌。当年塌过一回，冲了三户人家。住村东头的，雨季多长个心眼。' },
      { keys: ['镇', '州府', '官道'], answer: '出村往东十里上官道，往东走三日到雁回镇，天下事都得打那儿过。往西是临江府水路，六日脚程。' },
    ],
    greeting: '后生，坐。烟筐里有旱烟，自己卷。',
    personality: '厚道，话糙理正' },
  laolienu: { id: 'laolienu', name: '老猎户', aliases: ['老猎户', '猎户'], city: 'xiangye',
    desc: '村里的老猎户，腿上有旧伤，走山路一瘸一拐，眼却比鹰还尖。弓挂在门后，弓弦常年换新的。',
    zhishi: [
      { keys: ['兽', '妖', '白影', '踪'], answer: '白影是夜里见的，快得不像兽。留过爪印，五指，像人手。老辈人说山里有成了气候的东西。要是遇见，别跑——跑就是猎物。' },
      { keys: ['打猎', '猎', '皮子'], answer: '打猎有打猎的规矩：不掏窝、不打带崽的、见着白的不碰。山上给口饭吃，你得给山留后路。' },
      { keys: ['山路', '路径', '后山'], answer: '后山三条道：采药的走东坡，猎物的走北坡，西坡别去——西坡有崖，崖上有风，风里有动静。' },
    ],
    greeting: '来了？坐。灶上有热水。',
    personality: '寡言，句句是干货' },

  // 天启皇城
  zhishi_taijian: { id: 'zhishi_taijian', name: '执事太监', aliases: ['太监', '执事'], city: 'tianqi',
    desc: '五十上下的年纪，脸上没表情也没皱纹——宫里的脸都这样。说话轻，可每个字都有分量。',
    zhishi: [
      { keys: ['宫', '当差', '差事'], answer: '宫里当差，记住八个字：多听、少说、腿勤、眼净。做到了，熬得住，就有出路。' },
      { keys: ['天机阁', '星象', '钦天监'], answer: '天机阁的星象不是随便能问的。前儿阁上连着三夜亮灯，说是"客星犯紫微"——什么意思，咱家不知道，也不敢知道。' },
      { keys: ['夺嫡', '储君', '皇子'], answer: '这话头打住。宫门外的事咱家不管，宫门里的话咱家不说。' },
    ],
    greeting: '（他眼皮都没抬）……何事。',
    personality: '滴水不漏' },
  jinjun_xiaowei: { id: 'jinjun_xiaowei', name: '禁军校尉', aliases: ['小校', '校尉', '禁军'], city: 'tianqi',
    desc: '年轻校尉，站姿笔挺，甲叶擦得能照出人影。是禁军里少见的还愿意跟生人说话的。',
    zhishi: [
      { keys: ['夜', '宵禁', '巡'], answer: '外城三更起宵禁，坊市还有夜市能逛，皇城附近三更后巡防密，别走朱雀大街，绕开。' },
      { keys: ['地下', '鬼市', '帮派'], answer: '（压低声音）鬼市在暗渠那边，官府不是不知道，是知道也管不净。你要去，管住嘴，别沾人命。沾了，镇抚司的画像上就有你。' },
      { keys: ['江湖', '武', '高手'], answer: '武行街那几家镖局里藏龙卧虎。要论真高手，见过一个——太一宗的供奉，袖手站着，我愣是没看清他什么时候到的。' },
    ],
    greeting: '这位……看着面生。（手不自觉按了按刀柄）',
    personality: '警觉但心善' },
  qintianjian_zhushi: { id: 'qintianjian_zhushi', name: '钦天监主事', aliases: ['主事', '监正'], city: 'tianqi',
    desc: '钦天监主事，眼里常年有血丝——观星的人觉少。对生人爱答不理，聊起星象就换了个人。',
    zhishi: [
      { keys: ['星', '天象', '彗'], answer: '紫微垣这两年不稳。帝星旁有浮气，非吉非凶——是"变"。变在宫里，也变在江湖。你若修行，这两年是多事之秋，也是机会之年。' },
      { keys: ['修行', '练气', '入门'], answer: '修行第一关是练气。气感因人而异：有人三日得气，有人十年不得门。子午卯酉四正时打坐，事半功倍，这是老话，但老话多数是真的。' },
      { keys: ['太一宗', '拜师', '门派'], answer: '太一宗供奉驻在天机阁，近庙堂。要拜山门，得有引荐，或者——在观星台答上他们三问。他们问的不是学问，是心性。' },
    ],
    greeting: '（头也不回）观星台重地——……罢了，你问吧。',
    personality: '冷面热心，一聊星象就停不下来' },
  taiyi_gongfeng: { id: 'taiyi_gongfeng', name: '太一宗供奉', aliases: ['供奉'], city: 'tianqi',
    desc: '一袭灰袍，看不出年纪。他往那儿一站，周围的喧嚣就像隔了一层水。',
    zhishi: [
      { keys: ['拜师', '入门', '太一'], answer: '太一宗收人不看根骨，看"静"字。你能在这喧嚣城里静下来，就够格。回去每日观星半时辰，观满百日再来——观得住，就是缘。' },
      { keys: ['望气', '气', '相人'], answer: '气这东西，藏不住的。你印堂明净，是没沾过人命的样子。修行之路，这样的底子比什么都金贵。' },
      { keys: ['朝局', '党争', '夺嫡'], answer: '（他摇头）庙堂之高，不在吾辈视野。吾辈观的是天——天比人间讲道理。' },
    ],
    greeting: '（他先开了口）你来时，绕开了三处喧嚷。是个静得下来的人。',
    personality: '出尘，一眼见底' },
  neishi_zhanggui: { id: 'neishi_zhanggui', name: '内市掌柜', aliases: ['掌柜'], city: 'tianqi',
    desc: '内市掌柜，笑得体面，报价不出声，全靠手指比划。懂行的人都说，他的手比算盘还快。',
    zhishi: [
      { keys: ['货', '买', '珍', '奇'], answer: '内市的货看人品。上个月出过一串内造佛珠，温润得很——买主是谁不便说。你要识货，我柜台底下还有几样。' },
      { keys: ['宫里', '采办', '用度'], answer: '宫里的用度，一寸缎子一两银起。别嫌贵——经手的人，每一道都要打点，这也是"用度"。' },
      { keys: ['皇族', '庶子', '皇子'], answer: '（手停了停）这话题，不聊。买个平安，东西尽管挑，话少说。' },
    ],
    greeting: '客官，看看货？手上的、柜底的，都是干净东西。',
    personality: '圆滑，有底线' },

  // 天启坊市
  chaishi: { id: 'chaishi', name: '城吏', aliases: ['城吏', '差役'], city: 'tianqi',
    desc: '城门口的城吏，查货查得松，看人看得准。城里进了什么生面孔，他心里都有一本账。',
    zhishi: [
      { keys: ['城', '去处', '逛'], answer: '天启城三个天：地上的坊市、墙里的皇城、地下的暗渠。生人先逛坊市，熟了再往深里去。' },
      { keys: ['通缉', '悬赏', '海捕'], answer: '城门口贴的海捕文书，三日一换。你要办事，多看两眼——赏格高的，都带着腥气。' },
      { keys: ['镇', '各地', '出行'], answer: '出城东官道两日到雁回镇；南下走漕船三日到临江府；北上官道五日到铁瓦关；黄泉集在西南山道，七日——不查路引，路上也不太平。' },
    ],
    greeting: '站住——（看清了）……不是找你的。何事？',
    personality: '眼毒嘴碎' },
  bgs_zhike: { id: 'bgs_zhike', name: '知客僧', aliases: ['知客僧', '知客', '僧人'], city: 'tianqi',
    desc: '报国寺的知客僧，中年，眉眼温厚，僧袍袖口磨得起了毛边——他接引的香客里，穷人的手他不躲。',
    zhishi: [
      { keys: ['拜师', '入门', '出家'], answer: '本寺收人不问出身，只问一件事：你肯不肯把手借给别人。（他摊开自己起茧的掌心）施药棚下站得住三个月，师门自然与你我有缘。' },
      { keys: ['医', '药', '看病'], answer: '药坊每日辰时开棚。你若懂些汤药，去搭把手；若不懂，就替病人端碗水——医道第一步，是学会伺候人。' },
      { keys: ['寺', '报国', '佛'], answer: '寺是朝廷敕建的，名叫报国。可老住持说：善待眼前人，就是最大的报国。' },
    ],
    greeting: '（他合十一礼）施主是来看病，还是来烧香？——都不如先喝碗热药茶。',
    personality: '温厚，眼里见不得穷人受苦' },
  shuotan_laoren: { id: 'shuotan_laoren', name: '说书老人', aliases: ['说书', '说书人', '老人'], city: 'tianqi',
    desc: '四牌楼底下说书的老人，一块醒木、一把折扇，说了四十年。他的书里，三分是话本，七分是江湖。',
    zhishi: [
      { keys: ['掌故', '旧事', '百年', '魔教'], answer: '百年前魔教之乱，幽冥教搅得天下不宁，正道死伤枕籍。黄泉集就是那时候成的气候——亡命者的窝。如今的魔道余孽，身上都背着那笔旧账。' },
      { keys: ['高手', '剑', '名人'], answer: '要说剑，三十年前有位"青衫客"，一剑退过三十马匪，后来不知所踪。有人说在雁回峡见过相似的剑光——信不信由你。' },
      { keys: ['趣闻', '轶事', '新闻'], answer: '近日东市来了个番商，捧着块"龙鳞"叫卖，说是海里捞的。老朽看那成色——嘿，有意思，是真是假，你自己去看。' },
      { keys: ['江湖', '消息', '大事'], answer: '江湖上如今三件大事：武林大会三年后在雁回开；东海那边渔村闹"海难疯话"；正魔两道，又在暗地里较劲了。' },
    ],
    greeting: '（醒木一拍）各位——哎，这位客官，想听哪一段？',
    personality: '健谈，藏着真货' },
  dongshi_zhanggui: { id: 'dongshi_zhanggui', name: '东市掌柜', aliases: ['掌柜'], city: 'tianqi',
    desc: '东市绸缎庄的掌柜，做了三十年买卖，鉴货的眼力东市头一份。人送外号"一眼清"。',
    zhishi: [
      { keys: ['鉴', '看货', '真假'], answer: '拿来看看。（翻看）嗯——东西老，但不是龙鳞，是蛇蜕压的。要听真话找我，要听好话找番商。' },
      { keys: ['残卷', '书', '经', '剑诀'], answer: '残卷啊……（压低声音）上个月有人拿半卷《潮汐剑诀》来问价，我没敢收——剑诀带血，收了是祸。那卷子现在下落，你可去书肆问问。' },
      { keys: ['番商', '西域', '海'], answer: '番商的货七假三真，可那三真里偶尔有惊世的。跟他做买卖，记住：他说到第三遍"祖传"的时候，就该还价了。' },
    ],
    greeting: '客官看货？我一眼清的名号，不是白叫的。',
    personality: '精明，话里带钩' },
  fanshang: { id: 'fanshang', name: '番商', aliases: ['番商'], city: 'tianqi',
    desc: '缠红头巾的西域番商，汉话说得七拐八绕，眼睛在生意场上磨得雪亮。',
    zhishi: [
      { keys: ['龙鳞', '货', '宝'], answer: '（献宝似的捧出匣子）祖传！海里捞的！龙鳞！可挡刀兵，可镇宅辟邪——三百两，不二价！' },
      { keys: ['海', '海外', '航路'], answer: '海？（他眼睛亮了）海那边的货，比这好十倍。可惜海路险，商队去年折了一支——沉香海港的沉香商会知道得多，你可以去问。' },
      { keys: ['还价', '便宜'], answer: '（夸张地捂胸口）客官，你这是要了我的命！……二百五，不能再少了，我赔本交个朋友！' },
    ],
    greeting: '客官！祖传的宝贝，看一看，看一看！',
    personality: '夸张，能唬人' },
  gongtou: { id: 'gongtou', name: '码头工头', aliases: ['工头'], city: 'tianqi',
    desc: '漕运码头的工头，鞭子别在腰上，嗓门比号子还响。他手下扛包的，都又怕他又服他。',
    zhishi: [
      { keys: ['活', '工', '扛包'], answer: '扛包一包一文，日结。腿脚利索、不偷奸耍滑的，我给你记长工。三天打鱼两天晒网的，别来。' },
      { keys: ['漕帮', '帮', '水'], answer: '这码头的水面归漕帮管。要行船、要讨生活，见了帮里的人客气点——不是怕，是规矩。' },
      { keys: ['工潮', '闹事', '克扣'], answer: '（他啐了一口）去年有人克扣工钱，码头上百来号人停了三天活。后来呢？后来那人"失足"落了水。这码头上，账要清，人心也要清。' },
    ],
    greeting: '干什么？找活？——先把你手伸出来我看看。',
    personality: '粗中有细' },
  caobang_dizi: { id: 'caobang_dizi', name: '漕帮弟子', aliases: ['漕帮', '弟子'], city: 'tianqi',
    desc: '驻码头的漕帮弟子，黑衣短打，走路脚下生风，见了工头也客客气气。',
    zhishi: [
      { keys: ['入帮', '拜', '漕帮'], answer: '漕帮收人先看水性，再看心性。总舵在临江府，你要有心，去临江找管事递话——码头上说话不作数。' },
      { keys: ['轻功', '水', '行船'], answer: '帮里的"过滩步"是水上讨生活的本事，脚下的桩子功要练三年。急不来的。' },
      { keys: ['盐帮', '私盐', '仇'], answer: '（他四下看了看）盐帮那伙人，官府的死敌，也是我们的死敌。水上的事水上了，陆上见了，绕道走。' },
    ],
    greeting: '（他抱拳）这位面生，找谁？',
    personality: '客气，护短' },
  biaotou_wang: { id: 'biaotou_wang', name: '王镖头', aliases: ['王镖头', '镖头', '老镖头'], city: 'tianqi',
    desc: '平安号镖局分号的镖头，五十岁，胳膊上的旧疤比新肉还多。他说过："镖行在江湖走，靠三分武艺、七分人缘。"',
    zhishi: [
      { keys: ['镖', '活', '走镖'], answer: '想走镖？先过三关：能打、能熬、嘴严。过了关，从趟子手干起，一月二两银，管吃住。干得好，三年后你自己带镖车。' },
      { keys: ['武', '教两手', '功夫'], answer: '（他摆手）我这把式是刀口舔血换来的，不敢乱教。要学武，去正经门派；要学保命，跟我走一趟镖，比什么都快。' },
      { keys: ['江湖', '规矩', '切口'], answer: '江湖的规矩，头一条是"礼数到位"：递剑柄朝人是敬，敬酒压杯为敬，递帖子报名号。第二条：话别说满。第三条……（他笑笑）第三条你走一趟镖就懂了。' },
      { keys: ['雁回', '分号', '总号'], answer: '总号在雁回镇，老镖头坐镇。你要往北走，去雁回搭镖车最稳当——顺路还能听一耳朵江湖事。' },
    ],
    greeting: '（他在擦一柄刀）生人？——坐，说事。',
    personality: '稳重，江湖味十足' },
  tiejiang: { id: 'tiejiang', name: '铁匠', aliases: ['铁匠', '师傅'], city: 'tianqi',
    desc: '武行街的铁匠，胳膊比常人大腿粗。他打的刀不上名册，可江湖人都认。',
    zhishi: [
      { keys: ['兵器', '刀', '剑', '买'], answer: '（他掂掂手里的锤）兵器合不合手，不看我，看你。握上来——嗯，腕子细，别用重的，剑或者短刀。' },
      { keys: ['好铁', '寒铁', '材料'], answer: '凡铁打凡刀。寒铁？那得去昆吾镇——铸剑世家聚的地界，人家炉火里烧的是真本事。' },
      { keys: ['养', '擦拭'], answer: '兵器是伙伴，不是物件。天天擦，月月油，用完必归鞘。你对它上心，它才不会在要命的时候掉链子。' },
    ],
    greeting: '（锤声不停）说事——锤不停，耳朵空着呢。',
    personality: '话少，字字有用' },
  poqigai: { id: 'poqigai', name: '坊里老人', aliases: ['老人', '阿婆'], city: 'tianqi',
    desc: '四牌楼贫民坊的老人，在坊里住了一辈子。谁家几口人、谁病了、谁失踪了，她心里清清楚楚。',
    zhishi: [
      { keys: ['坊', '人', '事'], answer: '坊里啊，走一批来一批。前儿巷尾那家男人又没回来——说是去码头扛活，三天了。唉，这年头。' },
      { keys: ['吃', '施粥', '饿'], answer: '城南报国寺初一十五施粥，排得早能舀上稠的。你要是难，去——不丢人，活着才要紧。' },
      { keys: ['孩子', '孤儿', '收留'], answer: '坊里的孩子都是百家米喂大的。你要是没去处，先去报国寺挂单，再回来坊里做工——咱这儿，勤快人就饿不死。' },
    ],
    greeting: '哎哟，后生，来，晒着太阳呢，坐。',
    personality: '慈祥，见惯了世情' },
  xiFu: { id: 'xiFu', name: '鞋匠', aliases: ['鞋匠'], city: 'tianqi',
    desc: '贫民坊的鞋匠，摊子支在巷口，纳鞋底的手不停。耳朵灵——整条巷子的闲话都从他耳朵过。',
    zhishi: [
      { keys: ['消息', '闲话', '听说'], answer: '（他咬断线头）坊里最近传两件事：一是城西义庄那口厚棺，昨夜有人听见响动；二是鬼市大掌柜在找"懂剑的人"——出价不低。你自己掂量。' },
      { keys: ['鬼市', '地下'], answer: '鬼市我没去过，可我知道进门的规矩：不带火、不摘帽、不问姓名。犯一条，会被"请"出去。' },
      { keys: ['修鞋', '鞋'], answer: '修鞋三文，换底十文。你要走远路，我给你上双层的底——路远，鞋先受罪。' },
    ],
    greeting: '（手上不停）修鞋？——不修？那就坐会儿。',
    personality: '耳朵灵，嘴有把门的' },

  // 天启地下
  guishi_shoumen: { id: 'guishi_shoumen', name: '守门人', aliases: ['守门'], city: 'tianqi',
    desc: '鬼市入口的守门人，斗笠压得极低，油灯挂在腰间。他不说话，只伸手——伸一根指头是查货，伸两根是收钱。',
    zhishi: [
      { keys: ['规矩', '进'], answer: '（他伸出三根手指，指了指无字碑，又指指你的腰和头）……（意思是：不带火、不摘帽、不问名。）' },
      { keys: ['卖', '买'], answer: '（他朝里努努嘴，竖起两根手指）……（意思是：进去了自有人接，押金二两。）' },
    ],
    greeting: '（无声。三根手指。）',
    personality: '哑巴似的，规矩就是他的话' },
  guishi_zhanggui: { id: 'guishi_zhanggui', name: '鬼市大掌柜', aliases: ['大掌柜', '掌柜'], city: 'tianqi',
    desc: '鬼市的大掌柜，没人见过他摘斗笠的样子。他掌着鬼市的秤——鬼市的秤，比官府的还准。',
    zhishi: [
      { keys: ['卖', '收', '货'], answer: '鬼市收货看三样：来路、成色、胆子。来路不正的压三成价——不是嫌脏，是替你担风险。' },
      { keys: ['剑', '懂剑', '高手'], answer: '（他慢慢抬起眼）本人在寻一个懂剑的。有件东西，非剑士不能碰——不是买，是"接"。接成了，酬劳你开价；接不成，就当今夜没见过我。' },
      { keys: ['规矩', '鬼市'], answer: '鬼市三规矩：不问来路、不掀第二角、出了这个门，不认人。守规矩的，鬼市就是你的银行；破规矩的——（他笑笑）鬼市没有仇家，只有没来过的人。' },
    ],
    greeting: '（斗笠下的目光在你手上停了停）客官的手，不像干粗活的。',
    personality: '深不可测，惜字如金' },
  feng_qigai: { id: 'feng_qigai', name: '疯乞丐', aliases: ['疯乞丐', '乞丐'], city: 'tianqi',
    desc: '鬼市角落蜷着个疯乞丐，破碗缺了个口。他嘴里念念有词，细听是剑诀的口诀——断断续续，可字字有骨头。',
    zhishi: [
      { keys: ['剑', '诀', '口诀'], answer: '（他浑浊的眼睛突然一亮）剑要走，不要戳！走如水，戳是钉——钉子会断，水不会！（说完又缩回去，酒气熏人）' },
      { keys: ['青衫', '三十年', '当年'], answer: '（他忽然不疯了，声音又低又稳）三十年前的雨夜，断水崖。一剑，三十骑。（顿了顿）……你听谁说的？（他又疯了）酒！酒呢！' },
    ],
    greeting: '（他抬起脏得看不清表情的脸）……酒。有酒什么都好说。',
    personality: '疯疯癫癫，偶尔锋利' },
  tangkou_guanshi: { id: 'tangkou_guanshi', name: '堂口管事', aliases: ['管事'], city: 'tianqi',
    desc: '堂口的管事，四十岁，笑起来眼睛眯成缝，可他的话没有一句是玩笑。地下江湖的规矩，从他嘴里出来就是章程。',
    zhishi: [
      { keys: ['活', '接', '买卖'], answer: '堂口的活分三等：跑腿的、看场的、办"事"的。你现在顶多接跑腿的——别嫌轻，地下的路，都是一步一步走出来的。' },
      { keys: ['规矩', '茶'], answer: '递茶双手是敬，茶盖倒扣是"事办砸了"，茶满欺客，茶浅留客。（他把茶盏一转）这些记住了，地下的门就开了一半。' },
      { keys: ['仇', '火并', '恩怨'], answer: '地下的仇，讲究"当面锣对面鼓"，背后下手的，全地下一起收拾他。你要结仇，先想想扛不扛得起堂口的规矩。' },
    ],
    greeting: '（他把茶盏推过来）自己倒。坐。',
    personality: '绵里藏针' },
  dufang_zhanggui: { id: 'dufang_zhanggui', name: '赌坊掌柜', aliases: ['掌柜'], city: 'tianqi',
    desc: '销金窟的掌柜，永远笑呵呵。他的账本上没有坏账——只有"消失的人"。',
    zhishi: [
      { keys: ['赌', '押', '黑拳'], answer: '骰子凭运气，黑拳凭眼力。买台下注看的是拳手的路数——你要懂行，比押骰子稳当。' },
      { keys: ['打拳', '上台', '黑拳'], answer: '上台？上台一胜五两，十胜五十两，没有退路。（他笑）去吧，楼下的擂台不认人，只认拳头。' },
      { keys: ['欠', '账'], answer: '（笑容不变）本店不赊账。赢是客，输也是客，走后门的——不是客。' },
    ],
    greeting: '哎哟，客官里边请——手气好，喝彩；手气背，加把劲！',
    personality: '笑面，账比刀清楚' },
  yizhuang_laoren: { id: 'yizhuang_laoren', name: '守庄老人', aliases: ['守庄', '老人'], city: 'tianqi',
    desc: '乱葬义庄的守庄老人，夜夜点一盏灯。他说他在义庄守了四十年，比义庄里的"住户"都久。',
    zhishi: [
      { keys: ['厚棺', '棺', '三年'], answer: '那口棺是三年前一个雨夜送来的，抬棺的两个人一人一半定金，说好三日内来结账——再没来。（他压低声音）昨夜你又听见了？灯花爆了三回。这棺……邪性。' },
      { keys: ['灯', '守夜'], answer: '灯不能灭。四十年前我师父交班时说的：义庄的灯是给"回来的人"照路的。照的是善缘还是孽债，就看灯亮不亮。' },
      { keys: ['尸', '无名', '来历'], answer: '义庄的尸首，官府验过才进庄。无名的居多——横死的、病死的、被丢的。（他叹气）人活一世，最后就剩一张席。好好活。' },
    ],
    greeting: '（他往灯里添了点油）来了？坐——夜里来这儿的，都有心事。',
    personality: '看透生死，话里有话' },

  // 雁回镇
  yh_yicheng: { id: 'yh_yicheng', name: '雁回驿丞', aliases: ['驿丞'], city: 'yanhui',
    desc: '驿站驿丞，精瘦老头，小楷端正得刻板。过路文书都打他手上过，官道上的事他比谁都清楚。',
    zhishi: [
      { keys: ['路况', '道路', '各地'], answer: '（他翻册子）东去官道过雁回峡——峡里栈道年久，雨季慎行。南下临江三日，北上铁瓦关五日。西南山道去黄泉集七日，那边没官府，自己当心。' },
      { keys: ['塘报', '文书', '消息'], answer: '（他压低声音）近日塘报说北边关外马市有人收"生面孔"——收去干什么，册子上没写。你若是生面孔，走北道小心。' },
      { keys: ['峡', '雁回峡', '崖'], answer: '雁回峡每年都摔死人。老辈人说峡底有寒潭，摔下去的未必就死——可也没见谁上来过。' },
    ],
    greeting: '（他头也不抬）住宿还是问路？',
    personality: '刻板，册子在他心里' },
  yh_laoBiaoTou: { id: 'yh_laoBiaoTou', name: '平安号老镖头', aliases: ['老镖头', '镖头'], city: 'yanhui',
    desc: '平安号总号的老镖头，六十了还能单手拎起镖车轴。走了一辈子镖，伤疤从眉骨排到手背。',
    zhishi: [
      { keys: ['走镖', '活', '镖'], answer: '想押镖？（他打量你）先跟我走一趟近的——雁回到临江，三日。丑话说前头：镖行不斩来使，可劫镖的刀不长眼。' },
      { keys: ['江湖', '规矩', '切口'], answer: '江湖切口，教你两句保命的："踏雪寻梅"是平安号自己人的暗号；遇上劫道的，喊"合吾"再谈——喊都懒得喊的，是连规矩都不讲的人，跑。' },
      { keys: ['武林大会', '大会'], answer: '三年一届的武林大会，下届就在雁回开。到时候天下英雄齐集，你是去比试还是去看热闹，都趁早打算。' },
      { keys: ['黑单', '劫镖'], answer: '（他眼神一沉）上月总号接了张黑单——有人出银子买我们一趟"失手"。镖行吃的是信字饭，这单我们不接，也得防着。你若在道上见着生面孔盯镖车，记得回来告诉我。' },
    ],
    greeting: '（他放下茶碗）小友，面生啊。平安号不待无名客——报名号。',
    personality: '老江湖，恩怨分明' },
  yh_tangzishou: { id: 'yh_tangzishou', name: '趟子手', aliases: ['趟子手'], city: 'yanhui',
    desc: '平安号的年轻趟子手，嗓门练得又长又亮。走镖喊"合吾"是本分，他喊得最好听。',
    zhishi: [
      { keys: ['喊镖', '合吾', '练'], answer: '喊镖讲究气沉丹田，尾音上挑——"合——吾——"（他示范，半条街的马都竖了耳朵）。你要练，先练嗓子，再练胆。' },
      { keys: ['镖', '路线', '走哪'], answer: '近期镖期：三日后一趟去临江府的绸缎镖，五日后一趟去铁瓦关的药材镖。缺人手，你去老镖头那儿应名。' },
    ],
    greeting: '（他正在溜嗓子）合——吾——……哟，客官听练嗓呢？',
    personality: '热忱，话密' },
  yh_miaozhu: { id: 'yh_miaozhu', name: '庙祝', aliases: ['庙祝'], city: 'yanhui',
    desc: '城隍庙的庙祝，白须白袍，签筒在他手里摇得像有自己的主意。他说城隍爷最公道——善恶簿上，一笔不漏。',
    zhishi: [
      { keys: ['签', '求', '解'], answer: '（他摇签筒）心诚则灵。抽吧——上签不喜，下签不忧，签是提个醒，路还得自己走。' },
      { keys: ['城隍', '善恶', '因果'], answer: '城隍爷掌一方的善恶簿。（他压低声音）老朽守庙四十年，见过太多"人前善"——账都在那儿记着呢，跑得了和尚跑不了庙。' },
      { keys: ['故人', '亲人', '祭'], answer: '（他叹气）来祭扫的，一半求保佑，一半求心安。身后事、身前情，都在这一炷香里。' },
    ],
    greeting: '（签筒轻摇）施主，求签还是问事？',
    personality: '慈悲，看得远' },
  yh_bashi: { id: 'yh_bashi', name: '老把式', aliases: ['老把式', '把式'], city: 'yanhui',
    desc: '车马行的老把式，赶了四十年车，闭着眼能听出车轴哪里该上油。',
    zhishi: [
      { keys: ['车', '去', '搭'], answer: '去临江的明早发车，去铁瓦关的后日。黄泉集那趟……（他皱眉）加钱也不拉——上个月拉货去的那趟，去时是三匹骡，回来剩两匹。' },
      { keys: ['路', '路况', '峡'], answer: '过雁回峡要赶早，晌午前过栈道，风小。再有，雨天别赶路——峡里的木板，见了水就变心。' },
    ],
    greeting: '（他在给骡子梳毛）问路还是搭车？',
    personality: '实在' },
  yh_jiubao: { id: 'yh_jiubao', name: '酒保', aliases: ['酒保', '店小二'], city: 'yanhui',
    desc: '长街酒肆的酒保，嘴皮子利索，天下的消息在他这儿过一道，都要添三分佐料。',
    zhishi: [
      { keys: ['酒', '吃', '喝'], answer: '本店招牌女儿红，一壶八文；烧刀子烈，五文——客官走远路的，来烧刀子，暖。' },
      { keys: ['消息', '听闻', '新鲜'], answer: '（他凑近）新鲜事：临江府漕银亏空的案子又有了下文，说亏空不是贪的，是"丢的"——水上丢的。您品，您细品。' },
      { keys: ['说书', '书'], answer: '说书先生每日午后开讲，在街心那棵老槐底下，不要钱，好段子收彩头。今日讲"青衫客一剑退三十骑"，值得听。' },
    ],
    greeting: '客官里边请——打尖还是住店？',
    personality: '消息灵通，话多' },
  yh_shuoshu: { id: 'yh_shuoshu', name: '说书先生', aliases: ['说书', '说书人'], city: 'yanhui',
    desc: '雁回镇的说书先生，醒木一响，满街安静。他讲古，也讲今——讲今的时候，声音会放轻。',
    zhishi: [
      { keys: ['青衫客', '剑', '古'], answer: '（他压低声音）青衫客的剑，讲的人多，见过的少。老朽只说一句真的：他最后一剑，是替别人挡的。（顿）至于挡的是谁——这话本上没有。' },
      { keys: ['趣闻', '新闻', '讲个'], answer: '今日的新段子：铁瓦关外白灾那年，有个守卒靠一口"剑冢里捡来的剑"活了下来。剑冢在北原大雪山——万剑插在雪原上，风过齐鸣。（他摇头）老朽没见过，也是听来的。' },
      { keys: ['漕银', '案子'], answer: '（他折扇一收）漕银的案子，明面上是账目亏空，暗地里的说法可多了。老朽的段子只讲到"船到了、银子没了"——后头的，等官府的告示。' },
    ],
    greeting: '（醒木轻拍）客官留步——听一段再走？',
    personality: '有真货，也有分寸' },

  // 临江府
  lj_shuimen_po: { id: 'lj_shuimen_po', name: '卖船点阿婆', aliases: ['阿婆'], city: 'linjiang',
    desc: '水门桥头卖船点心的阿婆，嗓门盖过橹声，做了五十年买卖，认得半个漕帮。',
    zhishi: [
      { keys: ['花船', '画舫', '灯'], answer: '花船夜里才开，画舫上的人，唱的是曲，卖的是消息。（她压低嗓门）去年有位姑娘从船上跳了水——捞上来的时候，手里攥着半页账册。漕银的事，你去品。' },
      { keys: ['湖泽', '渔', '摆渡'], answer: '城外湖泽的老妪，渡了三代人的船。你要下湖，先给她带一包茶叶——她的规矩。' },
      { keys: ['船', '行船', '渡'], answer: '去往南边的客船每日一趟，卯时发。带货的商船要在帮里报备——这是漕帮的水面。' },
    ],
    greeting: '船点趁热——哎客官，听不听新鲜事？',
    personality: '热心肠，嗓门大' },
  lj_chuanfu: { id: 'lj_chuanfu', name: '老船夫', aliases: ['船夫'], city: 'linjiang',
    desc: '水门下的老船夫，撑了一辈子船，手上的茧比船板还硬。',
    zhishi: [
      { keys: ['水路', '航线', '去'], answer: '顺水三日到下游府城，逆水五日。夜航不行——临江的水，夜里"有人"，老船工都懂。' },
      { keys: ['水鬼', '怪', '夜里'], answer: '（他压低声音）不是水鬼，是"水下的旧东西"。湖泽深处有沉船，船上有什么，捞过的人没一个说清楚——因为没一个捞第二次。' },
    ],
    greeting: '客官渡河还是听水？',
    personality: '信水如信命' },
  lj_bangzhong: { id: 'lj_bangzhong', name: '漕帮帮众', aliases: ['帮众'], city: 'linjiang',
    desc: '漕帮总舵门口的帮众，黑衣短打，抱拳利落。水上人的规矩刻在骨子里。',
    zhishi: [
      { keys: ['入帮', '递帖', '规矩'], answer: '递帖找管事。帮里的规矩先说清：入帮三年不得脱籍，水上生死各安天命，义字当头——背叛帮里的，四海码头皆不留。' },
      { keys: ['管事', '总舵'], answer: '管事今日在堂，你要递帖，先在门口等着——（他打量你）等管事得空。急事另说。' },
      { keys: ['漕银', '亏空', '案子'], answer: '（他脸上变色）这话不是码头该问的。管那儿问去——或者，别问。' },
    ],
    greeting: '（抱拳）站住。总舵重地——何事？',
    personality: '规矩刻在骨子里' },
  lj_guanshi: { id: 'lj_guanshi', name: '漕帮管事', aliases: ['管事'], city: 'linjiang',
    desc: '漕帮总舵的管事，四十上下，眼神像船头的灯——稳，且照得远。他的算盘声在总舵里比号子还响。',
    zhishi: [
      { keys: ['活', '行船', '差事'], answer: '帮里缺跑水路的腿脚。试工期一月，水上听令、岸上守规矩——干得住，就上正册。' },
      { keys: ['漕银', '亏空', '案子'], answer: '（他起身，关了半扇窗）这案子，官府查的是账，帮里查的是水。去年腊月那批漕银沉的河段，偏偏是"最安全"的一段——最安全的段出事，就是"人"的事。你若好奇，去湖泽问问打渔的，他们夜里见的多。' },
      { keys: ['过滩步', '轻功', '教'], answer: '过滩步是帮里的看家本事，桩子功三年起步。（他看看你）肯吃苦的话，先从跑船练起——水上讨生活的，脚下先稳。' },
      { keys: ['雪夜', '饼', '恩'], answer: '（他突然笑了）你这人有点意思。三年前雪夜在雁回镇外，有个赶考书生饿倒在你手上过？……不记得了？（他拱手）那个书生，如今在本帮做文书。他托帮里的人留意恩公——今日算他记上了一笔。' },
    ],
    greeting: '（他把算盘一推）坐。漕帮的门，问事的都能进。',
    personality: '滴水不漏，恩怨分明' },
  lj_xiansheng: { id: 'lj_xiansheng', name: '书院先生', aliases: ['先生'], city: 'linjiang',
    desc: '临江书院的先生，两袖清风，一肚子经史。他收学生不问出身，只问心诚。',
    zhishi: [
      { keys: ['读书', '借', '学'], answer: '书院藏书对求学的人开。你若想读书，先扫一个月的书阁——书要敬着读，人要沉得住。' },
      { keys: ['科举', '功名', '考'], answer: '科举是寒门的梯子，也是苦海的岸。（他叹气）去年有个学子考中回去，第二年就病故了——功名到手，命没跟上。读不读，你自己掂量，读了别悔。' },
      { keys: ['残卷', '书', '孤本'], answer: '书肆上月收过半卷残卷，说是什么剑诀——（他摇头）武人的书到了书肆，多半带着祸。老朽劝一句：无缘的东西，别强求。' },
    ],
    greeting: '（他从书卷里抬起头）求学问的，请进；求旁的，请便。',
    personality: '清正，惜才' },
  lj_baidu_lAoyu: { id: 'lj_baidu_lAoyu', name: '摆渡老妪', aliases: ['摆渡', '老妪'], city: 'linjiang',
    desc: '湖泽摆渡的老妪，撑一条乌篷船渡了三代人。湖里每条水路她闭眼都认得。她的船钱不讲价——只收茶叶。',
    zhishi: [
      { keys: ['渡', '船', '湖'], answer: '（她撑着篙）坐稳。湖里的道，跟着我的篙走——篙点三下，你低头；点两下，你闭眼。别问为什么，规矩。' },
      { keys: ['沉船', '深处', '水底'], answer: '（她的篙停了停）湖心偏西，水底下有"旧东西"。四十年前我亲眼见有人下去捞——上来的时候，船轻了，人疯了。（她看着你）小伙子，湖里有些东西，不是给活人准备的。' },
      { keys: ['故人', '当年', '年轻时'], answer: '（她笑了，皱纹里都是水光）老身年轻时也走过江湖——渡过的人里，有成名的大侠，也有逃命的刀客。他们都老了，我还在这儿撑船。这湖啊，才是活的最久的。' },
    ],
    greeting: '（她瞥一眼你的手）带茶叶了吗？——带了就上船。',
    personality: '深藏不露' },
  lj_laodao: { id: 'lj_laodao', name: '青羊观老道', aliases: ['老道', '观主'], city: 'linjiang',
    desc: '青羊观观主，清瘦，说话慢，走路也慢。据说年轻时是江湖上最快的剑——现在他连扫帚都拿得很慢。',
    zhishi: [
      { keys: ['吐纳', '练气', '教'], answer: '（他扫着落叶）气感这东西，教不来，堵不来，只能"等"。你在山门扫十日地，扫的时候只想着扫——十日后若还想学，我再教第一个周天。' },
      { keys: ['拜师', '入门', '青羊'], answer: '青羊观不收"求长生"的，收"求安顿"的。修行不是往上飞，是往回坐。（他指指蒲团）坐得住，就有你的位置。' },
      { keys: ['快剑', '当年', '江湖'], answer: '（他笑了，皱纹温和）剑快不快，不在剑，在心静不静。老道现在的心很静——所以你说，我的剑是快了，还是慢了？' },
      { keys: ['符箓', '符'], answer: '符箓是道门的用处，不是法术。一张符，画的是"安"字——安人、安宅、安心。你想学？先把心写平了。' },
    ],
    greeting: '（他不抬头）石阶三百级，上来不易。坐，喘匀了再说话。',
    personality: '扫地僧式的深不可测' },
  lj_daoTong: { id: 'lj_daoTong', name: '道童', aliases: ['道童'], city: 'linjiang',
    desc: '青羊观的小道童，十四岁，机灵。他跟着观主十年，会的比说出来的多。',
    zhishi: [
      { keys: ['观主', '老道', '师父'], answer: '师父的剑，我见过一次。（他比划）就一下——院子里那口老钟的绳，断了。钟没响，绳断了。师父说那是他"最慢的一剑"。' },
      { keys: ['修行', '练', '功课'], answer: '观里的功课：扫地、挑水、打坐。师兄弟们都说扫地最养气——扫着扫着，心就平了。' },
    ],
    greeting: '（他压着扫帚）客官是求道的，还是走累了的？',
    personality: '机灵，藏不住话' },

  // 铁瓦关
  tw_shujiang: { id: 'tw_shujiang', name: '戍将', aliases: ['戍将', '将军'], city: 'tiewa',
    desc: '铁瓦关戍将，五十出头，脸上的皱纹里嵌着风沙。他守关二十年，说关外的风声他听得懂一半——另一半，是活着的人还听不懂的。',
    zhishi: [
      { keys: ['关外', '戈壁', '出关'], answer: '出关十里是荒驿，过了荒驿就是戈壁。风大的时候别走——戈壁的风会"搬家"，走十里退八里。商队结伴走，单人莫行。' },
      { keys: ['白灾', '雪', '围城'], answer: '白灾是关外的雪崩了山，妖兽下来找食。上回白灾围城，关墙外堆的兽尸比墙还高——（他看着关外）这几年的雪，一年比一年大。' },
      { keys: ['军', '吃粮', '从军'], answer: '军中吃粮，一月一两半，战时翻倍。丑话：边军的饷，是拿命换的。你要投军，先在关墙下站三日——站得住，再谈。' },
      { keys: ['马市', '马'], answer: '马市的水深。牙人报的价要砍三成；看牙口、看蹄子、看眼神——马通人性，眼神躲闪的马，别碰。' },
    ],
    greeting: '（他在看关外的方向）……何事？快说，风大。',
    personality: '铁打的人' },
  tw_laobing: { id: 'tw_laobing', name: '老兵', aliases: ['老兵'], city: 'tiewa',
    desc: '守了十五年的老兵，缺了两根手指——那年白灾冻掉的。他现在只管给新兵讲"怎么活下来"。',
    zhishi: [
      { keys: ['活', '守', '怎么'], answer: '守关的诀窍就一条：别逞英雄。（他晃晃缺指的手）英雄都埋在墙外头了。活着领饷，回家娶亲——这才是好兵。' },
      { keys: ['佛塔', '僧', '念想'], answer: '下院的老僧人好。白灾那年，他打开院门收了三百个难民，粥一直施到雪化。（他别过脸去）像那样的人……唉。' },
      { keys: ['戈壁', '夜', '怪声'], answer: '夜里戈壁有怪声，风穿过石缝的动静。老兵都知道——可有一年，那声音"回答"了我们的喊话。那晚之后，夜里出关，两人成行，一人不行。' },
    ],
    greeting: '（他把火盆往你这边推推）烤着。关外的风，能把人烤干。',
    personality: '惜命，也惜人' },
  tw_yaren: { id: 'tw_yaren', name: '马市牙人', aliases: ['牙人'], city: 'tiewa',
    desc: '马市的牙人，眼睛毒，嘴上抹了蜜。经他手的马上千，没一匹是他自己会骑的。',
    zhishi: [
      { keys: ['马', '买', '贩'], answer: '客官好眼力——这匹关外青骓，日行三百里！（见你不动）……好吧实话，日行二百五，五十两。贩马去关内能翻倍，可路上的"税"——你懂的。' },
      { keys: ['骗局', '假', '坑'], answer: '（他咧嘴）马市的骗局？就三种：老马充壮马、病马喂了料撑三天、还有——（他压低声音）上个月有人卖"会认路的军马"，那马夜里自己跑回旧主人那儿去了。买马看眼神，信我。' },
    ],
    greeting: '客官！相马？相人？——都一样，看眼缘！',
    personality: '嘴上有蜜，心里有秤' },
  tw_mafan: { id: 'tw_mafan', name: '贩马客', aliases: ['贩马'], city: 'tiewa',
    desc: '常年在关内外贩马的老客，皮袄油亮，话不多，出手阔绰。他的商队去年在关外折了一支。',
    zhishi: [
      { keys: ['关外', '道', '商队'], answer: '（他灌了口酒）关外的道，走熟了就是钱道，走生……就是死道。去年我一支商队十二人，回来俩——（他顿了顿）别问折在哪儿，问我也说不清。' },
      { keys: ['伴当', '护卫', '雇'], answer: '雇护卫去关外，一人五两一程。要懂风沙的、会看水的。（他看看你）你有点底子？会武的话，随我走一趟——死了五两归你家，活着十两。' },
    ],
    greeting: '（他斜眼打量你）生面孔。贩马？还是找死？',
    personality: '亡命，重诺' },
  tw_laosen: { id: 'tw_laosen', name: '下院老僧', aliases: ['老僧', '僧人'], city: 'tiewa',
    desc: '佛骨塔下院的老僧，眉目慈悲。白灾那年他开院门收了三百难民，粥施到雪化。边关的人都说，塔铃响的时候，是他在念佛。',
    zhishi: [
      { keys: ['佛', '经', '说法'], answer: '（他合十）佛法不在经卷里，在施粥的手上、在守关的刀上。施主若心里有苦，不必说出来——坐一炷香，苦就轻一分。' },
      { keys: ['白骨', '观想', '炼体'], answer: '白骨观是佛门的修行：观诸行无常，方知人身可贵。（他看了看你的手）施主的手上有杀气未消——不急，气会消的，看你给它多长时间。' },
      { keys: ['封印', '塔', '秘密'], answer: '（他沉默了很久）塔底下封着东西，是百年前魔教之乱留下的。老衲守的不是佛骨——（他望向塔顶）守的是"它别出来"。此话出施主之口，入施主之耳。' },
    ],
    greeting: '（他合十，塔铃正响）施主，塔铃替老衲问过安了。',
    personality: '慈悲之下，守着秘密' },
  tw_wuseng: { id: 'tw_wuseng', name: '武僧', aliases: ['武僧'], city: 'tiewa',
    desc: '下院护院武僧，拳脚沉稳，一拳一脚都是几十年的桩子功。他不善言谈，但愿意陪人"过两招"。',
    zhishi: [
      { keys: ['拳', '教', '练'], answer: '（他摆开架势）佛门拳法，先学"立"。立得住，才谈得上出拳。（三个回合后）施主下盘浮——回去，每日站桩一炷香，站一个月再来。' },
      { keys: ['舍', '舍利', '修'], answer: '舍利是高僧坐化后的东西，可遇不可求。武僧的修行在拳脚里——施主与其求身外物，不如求今日比昨日稳一寸。' },
    ],
    greeting: '（他缓缓收拳）施主——切磋，还是问事？',
    personality: '少言，拳里有话' },

  // 黄泉集
  hq_dufang_zhanggui: { id: 'hq_dufang_zhanggui', name: '赌坊掌柜', aliases: ['掌柜'], city: 'huangquan',
    desc: '黄泉集赌坊掌柜，笑面，抽头三成。黄泉集没有官府，他的账本就是律法。',
    zhishi: [
      { keys: ['镇', '规矩', '黄泉集'], answer: '黄泉集的规矩就一条：（他伸出三根手指）别碰别人的"营生"。赌是我的营生，坊是坊主的营生，命是你自己的营生——（他笑）把自己的营生弄丢了，别怪我。' },
      { keys: ['幽冥教', '魔', '教'], answer: '（他的笑不变，声音低了）教里的事，账房不管。可我知道一点：教中人近来出手阔绰，买的全是"安分"两个字——他们要做事了。什么事，别问。' },
      { keys: ['赌', '押'], answer: '押吧。（他把骰盅推过来）本坊公平——公平地赢你，公平地输给你，公平地……收走一切。' },
    ],
    greeting: '（骰盅在他手里转得像活物）来了？——手气这东西，信则有。',
    personality: '笑面虎' },
  hq_heishi_fan: { id: 'hq_heishi_fan', name: '黑市摊主', aliases: ['摊主'], city: 'huangquan',
    desc: '黑市窑洞里的摊主，脸藏在斗笠阴影里。他卖的货清单写在烟纸背面，看完就烧。',
    zhishi: [
      { keys: ['货', '魔功', '残卷'], answer: '（烟纸背面推过来）幽冥教旧坛的手抄残页，练气入门的邪路子——快，但是烧命。三百两。要正路的，滚去名门正派，这儿没有。' },
      { keys: ['药人', '坊', '活人'], answer: '（他斗笠动了动）药人坊的事，黑市不接话。接了话的人……（他指指乱葬岭方向）都在那儿了。' },
      { keys: ['卖', '出手'], answer: '出手的东西看三样：来路干不干净、货真不真、你急不急。急的话，价压三成——急，是自己递的刀。' },
    ],
    greeting: '（烟纸背面朝上，推过来）看。烧。说。',
    personality: '影子一样的人' },
  hq_fangzhu: { id: 'hq_fangzhu', name: '药人坊主', aliases: ['坊主'], city: 'huangquan',
    desc: '药人坊的坊主，白净得不像干这行的人。他说话客气，可他院子里的墙很高，药气很甜。',
    zhishi: [
      { keys: ['坊', '做工', '试药'], answer: '（他温和地笑）坊里缺手脚利索的帮工，工钱一日十文，管药膳——（他顿了顿）试药另算，一次五两。风险与收益，恒古不变。' },
      { keys: ['药人', '人', '活人'], answer: '（他的笑纹丝不动）客官用的是哪个"人"字？坊里只有药引，没有"人"。（他给你斟茶）这镇上的规矩，我是镇长盖过章的。' },
      { keys: ['解药', '解毒', '买'], answer: '坊里的药，出的门就没解药。（他吹了吹茶）所以啊——别喝来历不明的东西。包括这盏茶。（他自己先饮了，笑）当然，我跟你无冤无仇。' },
    ],
    greeting: '（他亲自开门）稀客。尝尝我配的茶——放心，今天不试新药。',
    personality: '温和的恶' },
  hq_shouwei: { id: 'hq_shouwei', name: '坊前守卫', aliases: ['守卫'], city: 'huangquan',
    desc: '药人坊的守卫，刀疤脸，眼神发直——长年吸药气熏的。他守门，也守着一句没人问的话。',
    zhishi: [
      { keys: ['里面', '坊里', '声音'], answer: '（他眼神飘了一下）夜里别靠墙。（他的手在抖）墙里头有哭声……我没听见。你也没听见。' },
      { keys: ['救', '出来', '逃'], answer: '（他猛地抓住你的手腕，又松开）……排水渠。后墙西角，第三块砖。（他恢复了呆滞）我没说过话。我没见过你。' },
    ],
    greeting: '（他盯着你，眼神像蒙了层雾）……站住。',
    personality: '麻木之下还有一丝人味' },
  hq_shouling_ren: { id: 'hq_shouling_ren', name: '守岭人', aliases: ['守岭'], city: 'huangquan',
    desc: '乱葬岭的守岭人，住在岭脚的窝棚里，点一堆永远不熄的火。他说火不是给自己点的。',
    zhishi: [
      { keys: ['坟', '新', '旧'], answer: '岭上的坟，新坟埋得浅——没名没姓的，土都是借的。旧坟深，旧坟里的人，生前都有名有姓。（他往火里添了根柴）人呐，最后就争这一捧土的深浅。' },
      { keys: ['夜', '磷火', '怪'], answer: '磷火是骨头的气。（他平静地）夜里别挖坟。不是怕鬼——是怕活人。夜里来的活人，干的都不是人事。' },
      { keys: ['挖', '寻物', '死人财'], answer: '（他看了你很久）死人财，十份里九份带着账——仇家的账、家人的账、自己造孽的账。（他指指火堆）拿之前，来我这儿坐一坐。火看得清人心。' },
    ],
    greeting: '（他没回头，往火里添柴）……坐。火不咬人。',
    personality: '孤而不冷' },
};

// 跨城行路路线（官道+漕运+商路）——行路即一段大戏
export const routes = {
  tianqi: {
    yanhui:    { days: 2, way: '官道东行' },
    linjiang:  { days: 3, way: '漕船南下' },
    tiewa:     { days: 5, way: '官道北上' },
    huangquan: { days: 7, way: '西南山道' },
  },
  yanhui: {
    tianqi:    { days: 2, way: '官道西行' },
    linjiang:  { days: 3, way: '南下官道' },
    tiewa:     { days: 4, way: '北道' },
    huangquan: { days: 6, way: '西南山道' },
    xiangye:   { days: 1, way: '东行官道（过雁回峡）', viaNode: 'yh_xia' },
  },
  linjiang: {
    tianqi:    { days: 3, way: '漕船北上' },
    yanhui:    { days: 3, way: '北行官道' },
    huangquan: { days: 4, way: '山道' },
  },
  tiewa: {
    tianqi:    { days: 5, way: '官道南下' },
    yanhui:    { days: 4, way: '南道' },
  },
  huangquan: {
    tianqi:    { days: 7, way: '东北山道' },
    yanhui:    { days: 6, way: '东北山道' },
    linjiang:  { days: 4, way: '东南山道' },
  },
  xiangye: {
    yanhui:    { days: 1, way: '西行官道（过雁回峡）', viaNode: 'yh_xia' },
  },
};

// 二期合并：三镇 + 海洋三区
Object.assign(cities, CITIES2);
Object.assign(areas, AREAS2);
Object.assign(nodes, NODES2);
Object.assign(npcs, NPCS2);

// 路网扩充：三镇陆路 + 海路（按城浅合并，保留原路线）
const ROUTES2 = {
  tianqi: {
    baicao: { days: 4, way: '西南官道转山道' },
    kunwu:  { days: 4, way: '北上官道转铸剑山道' },
  },
  yanhui: {
    kunwu:   { days: 2, way: '北行山道' },
    canglan: { days: 3, way: '东行官道至海' },
  },
  linjiang: {
    baicao:  { days: 2, way: '西南水陆联程' },
    canglan: { days: 2, way: '南下沿海道' },
  },
  tiewa: {
    kunwu: { days: 2, way: '南行矿道' },
  },
  baicao: {
    tianqi:  { days: 4, way: '出山北上官道' },
    linjiang:{ days: 2, way: '东北水陆联程' },
    kunwu:   { days: 3, way: '跨山矿道' },
  },
  canglan: {
    tianqi:  { days: 3, way: '沿海官道西行' },
    yanhui:  { days: 3, way: '沿海道西行' },
    linjiang:{ days: 2, way: '沿岸北上' },
    qundao:  { days: 2, way: '扬帆出海（季风）', sea: true },
    nanhai:  { days: 4, way: '沿季风航路南下', sea: true },
  },
  qundao: {
    canglan: { days: 2, way: '回航澳港', sea: true },
    nanhai:  { days: 3, way: '随燕群南下', sea: true },
    longgong:{ days: 1, way: '循着守崖人教的旧水道下潜', dive: true },
  },
  longgong: {
    qundao: { days: 1, way: '浮出水面，归航群岛', sea: true },
  },
  nanhai: {
    canglan: { days: 4, way: '北返季风航路', sea: true },
    qundao:  { days: 3, way: '北归群岛', sea: true },
  },
  kunwu: {
    tianqi:  { days: 4, way: '南下官道' },
    yanhui:  { days: 2, way: '南行山道' },
    tiewa:   { days: 2, way: '北行矿道' },
    baicao:  { days: 3, way: '跨山药道' },
  },
};
for (const [city, rs] of Object.entries(ROUTES2)) {
  routes[city] = Object.assign(routes[city] || {}, rs);
}

// 三期合并：四大边域 + 仙山 + 深海妖渊
Object.assign(cities, CITIES3);
Object.assign(areas, AREAS3);
Object.assign(nodes, NODES3);
Object.assign(npcs, NPCS3);

// 路网扩充（三期）：边域陆路 + 仙山通道（xianshan：需仙缘通行）+ 妖渊深潜
const ROUTES3 = {
  canglan: {
    donghuang: { days: 5, way: '东出海口，横穿妖气弥漫的旷野' },
    penglai:   { days: 6, way: '出海东渡，寻海外仙山（仙风指引）', sea: true, xianshan: true },
  },
  yanhui: {
    ximo:      { days: 6, way: '西出阳关，入大漠' },
  },
  linjiang: {
    nanjiang:  { days: 4, way: '溯瘴江而上，入蛊地' },
  },
  tiewa: {
    beiyuan:   { days: 5, way: '出关北上，攀大雪山' },
    kunlunxu:  { days: 6, way: '西行千里，攀天阶（有仙缘者方能登临）', xianshan: true },
  },
  ximo: {
    kunlunxu:  { days: 4, way: '出玉门，循断壁剑痕而行（有仙缘者方能登临）', xianshan: true },
    yanhui:    { days: 6, way: '东归阳关官道' },
  },
  donghuang: {
    canglan:   { days: 5, way: '西行出妖域，归海港' },
  },
  nanjiang: {
    linjiang:  { days: 4, way: '顺瘴江而下，归临江府' },
    baicao:    { days: 3, way: '北穿十万大山余脉' },
  },
  beiyuan: {
    tiewa:     { days: 5, way: '南下出关，归铁瓦关' },
  },
  kunlunxu: {
    tiewa:     { days: 6, way: '顺天阶而下，东归中原', xianshan: true },
    ximo:      { days: 4, way: '下墟西行，入大漠', xianshan: true },
    shushan:   { days: 5, way: '御气南渡，云海之中寻蜀山（仙山之间灵气可托）', xianshan: true },
    penglai:   { days: 5, way: '东渡重洋（仙山之间灵气可托）', sea: true, xianshan: true },
  },
  baicao: {
    shushan:   { days: 5, way: '北攀云栈，入蜀山云海（有仙缘者方能登临）', xianshan: true },
    nanjiang:  { days: 3, way: '南穿十万大山余脉' },
  },
  shushan: {
    kunlunxu:  { days: 5, way: '御气北渡，循墟中剑痕归昆仑', xianshan: true },
    baicao:    { days: 5, way: '下云海，西南入山' , xianshan: true },
  },
  penglai: {
    canglan:   { days: 6, way: '西归澳港（仙凡之别，回程如常人）', sea: true },
    kunlunxu:  { days: 5, way: '西渡重洋归墟（仙山之间灵气可托）', sea: true, xianshan: true },
  },
  longgong: {
    yuanyuan:  { days: 2, way: '过宫后渊门，潜入更深的黑水', dive: true },
  },
  yuanyuan: {
    longgong:  { days: 2, way: '循旧水道浮升，回龙宫遗迹', dive: true },
  },
};
for (const [city, rs] of Object.entries(ROUTES3)) {
  routes[city] = Object.assign(routes[city] || {}, rs);
}

// 四期合并：仙界·九重天
Object.assign(cities, CITIES4);
Object.assign(areas, AREAS4);
Object.assign(nodes, NODES4);
Object.assign(npcs, NPCS4);

// 路网扩充（四期）：蓬莱劫峰直上仙界（xianjie 旗标：需渡劫圆满）
const ROUTES4 = {
  penglai: {
    xianjie: { days: 1, way: '自劫峰顶纵身而起——第九道雷后面那扇门，为你开了', xianjie: true },
  },
  xianjie: {
    penglai: { days: 1, way: '自南天门下望人间——云路直通劫峰' },
  },
};
for (const [city, rs] of Object.entries(ROUTES4)) {
  routes[city] = Object.assign(routes[city] || {}, rs);
}
