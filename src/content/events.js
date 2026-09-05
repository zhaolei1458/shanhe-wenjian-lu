// ============================================================
// 山河问剑录 · 数据三层之 templates/：事件切片库
// 切片结构：触发条件 | 权重 | 前置 | 正文 | 选项≤3 | 效果（入账/预约/旗标）
// 场景化验收：每去处挂际遇≥1
// ============================================================

export const EVENTS = {
  // ---------- 乡野 ----------
  ev_shanhong_visit: {
    id: 'ev_shanhong_visit', nodes: ['qingxi'], weight: 3,
    cond: { season: 0 },
    text: '春汛来得早，溪水涨过了踏脚石。村长蹲在河堤上抽烟，眉头拧成个疙瘩："老塘的堤又松了。今年雨要是再这么大……"他看了看你，"后生，真到那天，你这腿脚，得帮着喊人。"',
    options: [
      { label: '应下——真到那天，我挨家喊', effect: { ledger: { type: '诺', text: '应下村长：山洪之日，喊人撤离' }, trait: { xia: 1 }, echo: { delayYears: 1, payload: { type: 'shanhong_day', text: 'PAY_SHANHONG' } } } },
      { label: '"自有官府管。"——低头走开', effect: { trait: { juan: 1 } } },
    ],
  },
  ev_houlao_shouye: {
    id: 'ev_houlao_shouye', nodes: ['qingxi'], weight: 4,
    text: '收山货的贩子又来了。村口晒场上，山鸡、野猪腿、干蘑菇堆成几堆，价钱压得极低。乡邻们围着不敢还嘴——山里的东西，不卖也是烂。',
    options: [
      { label: '替乡邻出头还价', effect: { trait: { xia: 1 }, ledger: { type: '恩', text: '替青溪村乡邻争回三成山货价' }, money: 1, echo: { delayYears: 1, payload: { type: 'village_gratitude', text: 'PAY_VILLAGE' } } } },
      { label: '趁机把自己那份卖个好价', effect: { money: 3, trait: { si: 1 } } },
      { label: '只管看热闹', effect: {} },
    ],
  },
  ev_pozza_yujian: {
    id: 'ev_pozza_yujian', nodes: ['poza'], weight: 5,
    cond: { night: true },
    text: '你夜里借宿山神庙，半梦半醒间，供桌后传来窸窣声。一个黑影正把什么东西塞进神像底座的砖缝里，见你睁眼，黑影僵住了——是个中年汉子，怀里还抱着个睡熟的孩子。',
    options: [
      { label: '"你藏东西，我不问。孩子病了？"', effect: { ledger: { type: '恩', text: '山神庙夜遇逃难的汉子，赠伤药' }, items: [{ id: 'item_shangyao', name: '跌打伤药', desc: '黑影汉子塞给你的两包药，说"江湖上用得着"。' }], flags: { met_beinang_han: true } } },
      { label: '抄家伙喝问"什么人！"', effect: { combat: 'c_beinang_han', flags: { met_beinang_han: true } } },
      { label: '装睡，天亮再看砖缝', effect: { items: [{ id: 'item_buzhuan_dongxi', name: '来历不明的小布包', desc: '神像底座砖缝里摸出来的，一层层裹得严实。' }], flags: { took_buzhuan: true } } },
    ],
  },
  ev_houshan_yao: {
    id: 'ev_houshan_yao', nodes: ['shanlu'], weight: 4,
    cond: { night: true },
    text: '后山的夜静得反常。忽然，林子里所有虫鸣同时停了。一道白影贴着崖根掠过，在你十步外停住——那是一头通体雪白的狐形之物，眼睛在黑暗里亮得像两盏小灯。它"看"了你一会儿，忽然开口，声音像个老妇人："……不是他。不是。"',
    options: [
      { label: '"你在找谁？也许我能帮上。"', effect: { trigger: 'adv_houshan_baiying' } },
      { label: '僵在原地，一动不敢动', effect: { flags: { saw_baiying: true }, stat: { xiwei: 3 }, text_after: '白影绕着你走了半圈，忽然叹了口气——妖物会叹气！它钻进林子不见了。可你胸口像被什么东西轻轻碰了一下，暖的。' } },
      { label: '搭弓便射', effect: { combat: 'c_baiying', flags: { offended_baiying: true } } },
    ],
  },
  ev_xipo_feng: {
    id: 'ev_xipo_feng', nodes: ['shanlu'], weight: 3,
    cond: { flags: ['hl_shancun_xipo'] },
    text: '你循着老猎户守夜的踪迹摸上西坡。崖边一块大石后面，刻着一整面壁的剑痕——千千万万道，深浅不一，最旧的已经风化，最新的还泛着白茬。石下压着一柄锈剑，剑柄缠绳早已朽成粉。风从崖底吹上来，穿过程千剑痕，呜呜地响，像万剑齐鸣的余韵。',
    options: [
      { label: '伸手握那柄锈剑', effect: { trigger: 'adv_xiuejian' } },
      { label: '把剑痕全部看一遍再走', effect: { stat: { wugongXiuwei: 15 }, text_after: '你看了整整一个下午。剑痕里有章法——起手三式是"守"，中段尽是"走"，收尾……没有收尾，戛然而止，像主人没能打完最后一剑。' } },
      { label: '退开——这是别人的东西', effect: { trait: { juan: 1 } } },
    ],
  },
  ev_huolang_gengduo: {
    id: 'ev_huolang_gengduo', nodes: ['qingxi'], weight: 3,
    cond: { flags: ['hl_shancun_shanhong'], minAge: 17 },
    text: '货郎又进村了。这一回他看见你，神色古怪，把你拉到一边："后生，我认错人了——你不是他。可你这张脸……"他从怀里掏出一张画像，画上是个中年人，眉眼与你竟有五六分像。"二十年前官府贴的。这人当年在临江府，是个人物。"',
    options: [
      { label: '把画像要过来', effect: { items: [{ id: 'item_xiangsi_hua', name: '旧画像', desc: '画上一个眉眼与你相似的陌生中年人，落款二十年前。' }], flags: { got_xiangsi: true } } },
      { label: '"他叫什么？"', effect: { flags: { knows_name: true }, text_after: '货郎摇头："画像上是通缉犯的脸，名字早被墨涂了。可我知道——他当年用的兵刃，是一口刀。刀名，收山。"' } },
      { label: '烧掉画像——过去的事，让它过去', effect: { trait: { juan: 1 }, flags: { burned_hua: true } } },
    ],
  },

  // ---------- 天启皇城 ----------
  ev_gongmen_panwen: {
    id: 'ev_gongmen_panwen', nodes: ['gongmen'], weight: 5,
    text: '你在宫门当值区走动，一名执事太监拦住你，眼皮不抬："面生。何职？何差？何人引荐？"——宫里的盘问，三个问题，答错一个，今日就到头了。',
    options: [
      { label: '如实报上来历', effect: { trait: { juan: 1 }, text_after: '他"嗯"了一声，眼皮总算抬了半分："记性不错。宫里的规矩，第一是实。"' } },
      { label: '含糊其辞，蒙混过去', effect: { chance: 0.5, success: { text_after: '他盯了你半晌，竟放行了。（他没看穿你？还是懒得看穿？）' }, fail: { combat: 'c_jinjun', text_after: '他眼皮一撩："来人。"——两名禁军已在你身后。' } } },
    ],
  },
  ev_tianji_shiqlou: {
    id: 'ev_tianji_shiqlou', nodes: ['tianjige'], weight: 4,
    text: '天机阁出了事——观星台的铜浑天仪被人动过手脚，差了半分。监正震怒，钦天监上下查了三日，查不出名堂。你路过时，听见两位供奉低声议论："差的这半分……冲着「荧惑守心」去的。有人想让天象示警，示给陛下看。"',
    options: [
      { label: '记在心里——这是要变天的信号', effect: { flags: { knows_tianji_case: true }, ledger: { type: '秘', text: '天机阁铜仪被动手脚，冲着荧惑守心去' } } },
      { label: '向主事请缨协查', effect: { flags: { helps_tianji: true }, echo: { delayYears: 1, payload: { type: 'tianji_gratitude', text: 'PAY_TIANJI' } } } },
    ],
  },
  ev_neishi_huowu: {
    id: 'ev_neishi_huowu', nodes: ['neishi'], weight: 4,
    text: '内市掌柜从柜台底下摸出个锦盒："内造的护身玉，避血光。念你常来——一百两。"他顿了顿，"真话：这玉三个月前还是掖庭一个病殁宫人的遗物。忌讳不忌讳，你自己拿主意。"',
    options: [
      { label: '买下——护身要紧', cond: { moneyMin: 100 }, effect: { money: -100, items: [{ id: 'item_hushenyu', name: '内造护身玉', desc: '温润贴肤，据说避血光。来历有一段无人知晓的故事。' }] } },
      { label: '"来历不明的护身，护不了身。"——不买', effect: { trait: { juan: 1 }, text_after: '掌柜笑了："有见地。那看看这串佛珠？正经报国寺开过光的。"' } },
    ],
  },

  // ---------- 天启坊市 ----------
  ev_dajie_renao: {
    id: 'ev_dajie_renao', nodes: ['chengmen_dashi'], weight: 5,
    text: '四牌楼下，说书老人的醒木一拍："上回说到——那青衫客立于崖头，身后三十骑卷尘而来！"满街的喝彩里，一个穿绸衫的胖子挤到你身边，压低声音："客官听书？听什么书——真正的好戏，三天后漕运码头见分晓。"他挤挤眼，钻进人堆没了。',
    options: [
      { label: '三天后去码头看个究竟', effect: { flags: { fat_man_hint: true }, echo: { delayYears: 0, payload: { type: 'matou_daxi', text: 'PAY_MATOU_DAXI' }, when: 'nextVisitMatou' } } },
      { label: '听书到底', effect: { stat: { wuxing: 1 }, text_after: '书说到"三十骑齐齐勒马，青衫客袍袖无风自动"——收了。吊胃口，是这一行的祖师爷手艺。' } },
    ],
  },
  ev_dongshi_fanhuo: {
    id: 'ev_dongshi_fanhuo', nodes: ['dongshi'], weight: 5,
    text: '番商把匣子推到你面前，神秘兮兮："客官，龙鳞！海里捞的！辟邪挡刀——三百两。"匣子里一片青灰色的鳞，巴掌大，入手冰凉，对着光看，纹路里隐隐有流光。',
    options: [
      { label: '三百两，买', cond: { moneyMin: 300 }, effect: { money: -300, items: [{ id: 'item_longlin', name: '"龙鳞"', desc: '番商口中的宝物，青灰冰凉。真伪未辨。' }], flags: { bought_longlin: true }, echo: { delayYears: 1, payload: { type: 'longlin_truth', text: 'PAY_LONGLIN' } } } },
      { label: '拿去给"一眼清"鉴一鉴', effect: { trigger: 'ev_dongshi_jian' } },
      { label: '压价到五十两', effect: { chance: 0.4, success: { money: -50, items: [{ id: 'item_longlin', name: '"龙鳞"', desc: '五十两入手，捡漏的价。', note: 'cheap' }], flags: { bought_longlin: true }, echo: { delayYears: 1, payload: { type: 'longlin_truth', text: 'PAY_LONGLIN' } } }, fail: { text_after: '番商把匣子一把抱回怀里："客官这是要我的命！"——不过他傍晚主动来找你：一百两。"朋友价。"' } } },
    ],
  },
  ev_dongshi_jian: {
    id: 'ev_dongshi_jian', nodes: ['dongshi'], weight: 6,
    cond: { flags: ['bought_longlin'] },
    text: '"一眼清"掌柜把那片鳞翻来覆去看了半晌，忽然叹了口气："东西老，但不是龙鳞——是蛟蜕。蛟者，龙属，蜕下的鳞也一样冰凉。"他压低声音，"不过，蛟蜕比龙鳞稀罕。这东西入药能吊命，入炉能淬器。你这五十两……值。"',
    options: [
      { label: '收下——原来是真货', effect: { flags: { longlin_real: true } } },
      { label: '"蛟蜕？蛟还活着吗？"——追问来历', effect: { flags: { longlin_real: true, longlin_q: true }, text_after: '掌柜摇头："蛟在不在，得问海。东海那边……据说前些年有渔村见过「蛟影」。你要真好奇，去沧澜澳——那是陆地的尽头。"（沧澜澳，二期再开。）' } },
    ],
  },
  ev_matou_gongchao: {
    id: 'ev_matou_gongchao', nodes: ['matou'], weight: 5,
    text: '码头炸了锅——工头发了话：今年工钱再扣两成，"上方压下来的"。扛包的汉子们攥着扁担不散，眼看着就要出事。有人认出了你："这位常在码头上走动，帮我们评评理！"',
    options: [
      { label: '站到扛包人这边，去找工头理论', effect: { combat: 'c_gongtou_daren', ledger: { type: '恩', text: '码头工潮中替扛包人出头' }, trait: { xia: 2 }, echo: { delayYears: 1, payload: { type: 'matou_gratitude', text: 'PAY_MATOU_GRAT' } } } },
      { label: '两边劝——工钱要争，别见血', effect: { trait: { ren: 1 }, money: 2, text_after: '你磨了一下午嘴皮子。最后工头松口扣一成，汉子们散了——没散出人命，这码头今年就算功德圆满。' } },
      { label: '趁乱多扛几包自己的', effect: { money: 3, trait: { si: 1 }, flags: { matou_zhanpianyi: true } } },
    ],
  },
  ev_wuhang_bishi: {
    id: 'ev_wuhang_bishi', nodes: ['wuhangjie'], weight: 5,
    text: '武行街街心，两个镖师在拴马石边比划上了，围了半街的人。输赢没分出来，脸先红了。有人起哄："让这位客官评评——到底谁的刀快！"两个镖师齐齐看向你。',
    options: [
      { label: '下场比划两招', cond: { hasCombatSkill: true }, effect: { combat: 'c_wuhang_bishi', win: { minghao: '初出茅庐', money: 5 } } },
      { label: '"刀快不快，看刀口就知道——你们的刀口，都是卷的。"', effect: { stat: { wuxing: 1 }, text_after: '满街哄笑，两个镖师臊得脸通红，倒是冰释了。（外行话，有时比内行话管用。）' } },
      { label: '看热闹，不掺和', effect: {} },
    ],
  },
  ev_sipailou_jijin: {
    id: 'ev_sipailou_jijin', nodes: ['sipailou'], weight: 5,
    text: '坊里巷尾，那户男人失踪的人家，三个孩子围着半锅稀的。老人招呼你："后生，吃了吗？——吃了就当没看见，没吃就……唉。"',
    options: [
      { label: '把身上的钱留下一半', effect: { money: -5, ledger: { type: '恩', text: '四牌楼贫民坊雪中送炭' }, trait: { ren: 2 }, echo: { delayYears: 1, payload: { type: 'fangmin_gratitude', text: 'PAY_FANGMIN' } } } },
      { label: '去码头给他们家男人寻个活——人失踪前是扛包的', effect: { flags: { seeking_fang_father: true }, ledger: { type: '诺', text: '答应坊里：寻那失踪的扛包人' } } },
      { label: '移开目光，快步走过', effect: { text_after: '巷子里的风，比外面冷。（有些账，会自己记上。）' } },
    ],
  },

  // ---------- 天启地下 ----------
  ev_guishi_zhenhuo: {
    id: 'ev_guishi_zhenhuo', nodes: ['guishi'], weight: 5,
    text: '你掀开一个摊的黑布一角——一只巴掌大的铜铃，锈得看不出形制。摊主头也不抬："三两。"旁边一个老买主低声提醒你："那铃……去年有人摇了一下，整条鬼市的灯，全灭了。三两？便宜。"',
    options: [
      { label: '买下这只邪门的铃', cond: { moneyMin: 3 }, effect: { money: -3, items: [{ id: 'item_xieling', name: '哑铃', desc: '锈铜小铃，摇不响——去年摇响过一次，整条鬼市的灯全灭了。' }] } },
      { label: '不碰，转身走', effect: { trait: { juan: 1 } } },
      { label: '"这铃，收来路是什么？"——问到底', effect: { chance: 0.5, success: { text_after: '摊主抬了抬斗笠："乱葬义庄，第三排，从「厚棺」里……"他忽然住口，"当我没说。三两，卖不卖？"' , flags: { ling_yizhuang: true } }, fail: { text_after: '摊主把黑布"啪"地盖回去："规矩不懂，别掀第二角。"（你被摊主记住了——不是好事。）', flags: { guishi_offended: true } } } },
    ],
  },
  ev_tangkou_huji: {
    id: 'ev_tangkou_huji', nodes: ['tangkou'], weight: 6,
    text: '管事把你叫到里间："有趟小活。城南当铺有批「急货」要过户，你去跑个腿，压价签个字。一百文的跑腿钱，两百文的封口钱。"他把茶盏转了个方向，"记住：过户的东西，别看。"',
    options: [
      { label: '接活，不看', effect: { money: 3, faction: 'tangkou_half', ledger: { type: '诺', text: '为堂口跑过一次' } } },
      { label: '接活，但偷看了一眼', effect: { money: 3, faction: 'tangkou_half', flags: { peeked_huodan: true }, text_after: '货单上是一个人名，和一个你见过的字样——幽冥教的"幽"字印。你把这一眼记下了。（看见了不该看的，账就变了。）' } },
      { label: '不接——来路不明的钱烫手', effect: { trait: { juan: 1 }, text_after: '管事也不恼："年轻人，有忌讳是好事。"（他把你从「可用的人」挪进了「可交的人」——虽无赏，有后路。）' } },
    ],
  },
  ev_xiaojinku_quan: {
    id: 'ev_xiaojinku_quan', nodes: ['xiaojinku'], weight: 6,
    text: '黑拳场今夜开锣。台下押注的喊声能掀了屋顶，台上一个赤膊汉子正被人按着打。掌柜的瞥见你："客官气色不错——上台？一胜五两。台下押你赢的，赔率一赔八。"',
    options: [
      { label: '上台打一场', cond: { hasCombatSkill: true }, effect: { combat: 'c_heiquan', win: { money: 5, minghao: '北门新人' }, lose: { hp: -40, text_after: '你被抬下台时，掌柜的还在笑："年轻人，拳场不养面子。"（伤是真的。）' } } },
      { label: '押那挨打的汉子赢——他眼神不像输家', cond: { moneyMin: 2 }, effect: { chance: 0.6, success: { money: 16, text_after: '那汉子后半场像是换了个人，三拳翻盘。你赢了十六两。（你押的不是拳，是眼神。）' }, fail: { money: -2 } } },
      { label: '看一场就走', effect: {} },
    ],
  },
  ev_yizhuang_houguan: {
    id: 'ev_yizhuang_houguan', nodes: ['yizhuang'], weight: 6,
    text: '义庄那口停了三年的厚棺，今夜又响了。守庄老人盯着灯花："三年了，头一回来真的。"他看看你，"后生，胆子大不大？陪老朽守一夜——响动要是再起，总得有人看看里头到底是什么。"（死人财最凶，凶的是拿死人东西要过活人的关。）',
    options: [
      { label: '留下守夜', effect: { trigger: 'adv_houguan' } },
      { label: '劝老人开棺验尸', effect: { trigger: 'adv_houguan', flags: { kaiguan: true } } },
      { label: '添灯油，转身走', effect: { trait: { juan: 1 }, text_after: '你添满灯油走了。身后那盏灯，亮得像一句"谢了"。（因果不现报——但这笔，老朽记下了。）', ledger: { type: '恩', text: '义庄老人记下了你添的灯油' }, echo: { delayYears: 1, payload: { type: 'yizhuang_gratitude', text: 'PAY_YIZHUANG' } } } },
    ],
  },

  // ---------- 雁回镇 ----------
  ev_yh_xiaoxi: {
    id: 'ev_yh_xiaoxi', nodes: ['yh_changjie'], weight: 6,
    text: '长街上的消息像河水一样淌：北边的说铁瓦关白灾要来，南边的说临江漕银的案子要结，西边的说黄泉集换了地头蛇。人人都在传，人人都在问——"你听说了吗？"',
    options: [
      { label: '"武林大会呢？有准信吗？"', effect: { text_after: '酒保一拍大腿："有！三年后，就在咱雁回开！到时候镖局、门派、散人，全得来！"' , flags: { knows_wulin_dahui: true } } },
      { label: '安静听，把有用的记下', effect: { stat: { wuxing: 1 }, sleeve_add: { book: 'places', entry: '雁回镇——天下消息的集散地，长街一日，胜读三月塘报。' } } },
    ],
  },
  ev_yh_yizhan_tangbao: {
    id: 'ev_yh_yizhan_tangbao', nodes: ['yh_yizhan'], weight: 5,
    text: '驿丞翻着塘报叹气。你凑近看了一眼——北道加急：关外马市发现"收买生面孔"的行迹，令各驿留意。驿丞压低声音："后生，你要走北道，路上多看身后。这塘报……老朽看不太懂，但老朽的直觉是：不是好事。"',
    options: [
      { label: '"我记下了，谢驿丞。"', effect: { flags: { knows_beidao: true }, sleeve_add: { book: 'places', entry: '北道有异：关外马市有人收买生面孔，来路不明。' } } },
      { label: '"能抄一份吗？"', effect: { chance: 0.5, success: { items: [{ id: 'item_tangbao_chao', name: '塘报抄录', desc: '驿丞默许的手抄。北道异动的第一手消息。' }] }, fail: { text_after: '驿丞把册子一合："塘报是官物。"——不过他放你走的时候，脚步慢了半拍。（他自己也拿不准。）' } } },
    ],
  },
  ev_yh_biaoju_yaohuo: {
    id: 'ev_yh_biaoju_yaohuo', nodes: ['yh_biaoju'], weight: 6,
    text: '老镖头一拍桌子："五日后一趟药材镖去铁瓦关，正缺人手！"他打量你，"丑话前头：走镖不是逛江湖，夜里守镖车、白天赶路、遇上劫道的——先递话，递不通再动手。你干不干？"',
    options: [
      { label: '干！', effect: { trigger: 'adv_yah_biaoxing' } },
      { label: '"我武艺还浅，先当趟子手练练喊镖。"', effect: { gongfa_add: { id: 'gf_hanbiao', name: '喊镖腔（平安号）', desc: '"合——吾——"一声拉出来，半条街的骡马都竖耳朵。江湖人听着，就知道你是平安号的人。' }, money: 2, ledger: { type: '诺', text: '在平安号挂了名，当趟子手' } } },
      { label: '婉拒——另有打算', effect: { text_after: '老镖头也不强留："人各有道。"（他记住了你的脸——镖行记人的本事，比武艺还深。）' } },
    ],
  },
  ev_yh_qiuqian: {
    id: 'ev_yh_qiuqian', nodes: ['yh_chenghuang'], weight: 6,
    text: '你摇出一只签。庙祝看了半天，缓缓道："中平签。「风起于萍末」——小风已成气候，才到你眼前。签文不吉不凶，就一句话：「你如今的处境，是三年前哪一步走出来的？」——施主，这一签，是让你回头看看。"',
    options: [
      { label: '回头看看（想起这三年走过的路）', effect: { stat: { wuxing: 2 }, text_after: '你站在签台下想了很久。原来这一签不是签，是一面镜子。' } },
      { label: '"大师，问个前程。"', effect: { text_after: '庙祝摇头："前程不在我这儿，在你脚下。老朽只能告诉你：你命里有水，往有水的地界走，事顺。"' , flags: { qiyuan_water: true } } },
      { label: '添香油钱，捐一炷灯', cond: { moneyMin: 1 }, effect: { money: -1, ledger: { type: '恩', text: '城隍庙添灯一炷' }, echo: { delayYears: 1, payload: { type: 'chenghuang_deng', text: 'PAY_DENG' } } } },
    ],
  },

  // ---------- 临江府 ----------
  ev_lj_huachuan: {
    id: 'ev_lj_huachuan', nodes: ['lj_shuimen'], weight: 5,
    text: '夜里的画舫灯影摇在水面。船娘唱的是老曲子，唱到一半忽然停了——"这支曲子，三年前有位客人点过。"她望着水面，"他听完给了十两，说：「曲是好曲，只是词里的人，回不来了。」"',
    options: [
      { label: '"那位客人，如今在哪儿？"', effect: { text_after: '船娘摇头："官人的事，船上的人不打听。只记得他说这话时，望着漕银船的方向。"（漕银船。你把这三个字记下了。）', flags: { caoyin_hint: true } } },
      { label: '点同一支曲子，听完', effect: { money: -2, stat: { wuxing: 1 }, text_after: '曲子唱完，你忽然懂了那位客人——有些东西回来了，有些人回不来了。' } },
    ],
  },
  ev_lj_caoyin_an: {
    id: 'ev_lj_caoyin_an', nodes: ['lj_caobang'], weight: 5,
    text: '总舵的议事厅门外，你听见里头拍案声。出来的人个个脸色铁青。漕帮管事看见你，把你叫住："那批漕银，官府查是「账目亏空」，我们查是「水上出的事」。最安全的河段出的事——你要是水上有门路，帮我留意一条船：去年腊月，「顺字号」，桅杆第三节有补丁。"',
    options: [
      { label: '接下——"留意到了，怎么递话？"（管事教了你联络的切口）', effect: { flags: { caoyin_quest: true, learned切口_caoyin: true }, ledger: { type: '诺', text: '应漕帮管事：查顺字号船的下落' } } },
      { label: '"这案子水深，帮不了。"', effect: { trait: { juan: 1 }, text_after: '管事点头："识时务。"（他没恼——帮里的账上，不记「不接」，只记「接了办砸」。）' } },
    ],
  },
  ev_lj_shuyuan_cany: {
    id: 'ev_lj_shuyuan_cany', nodes: ['lj_shuyuan'], weight: 4,
    text: '书院的学子们围着一张告示议论——科举在即，书院要选人赴考。先生看见你，招手："你眉眼沉静，读不读书？读了，这世道多一条路给你。"',
    options: [
      { label: '求学——扫书阁也认了', effect: { flags: { shuyuan_xue: true }, stat: { wuxing: 3 }, ledger: { type: '诺', text: '入临江书院，从扫地读起' }, echo: { delayYears: 2, payload: { type: 'shuyuan_keju', text: 'PAY_KEJU' } } } },
      { label: '"谢先生。武人的路，走一半换不得。"', effect: { trait: { chi: 1 }, text_after: '先生也不恼："各人有各人的道。"（他后来逢人便说：那后生眼神里有东西，不走文路可惜了。）' } },
    ],
  },
  ev_lj_huze_yu: {
    id: 'ev_lj_huze_yu', nodes: ['lj_huze'], weight: 5,
    text: '你随渔家下湖。收网时网沉得反常——拉上来，满网的水草里裹着一只木匣，匣上的铜锁早锈死了。渔家们脸色变了："又来……上回捞起这东西的船，后来翻了。"他们把匣子推给你："你收着。我们不敢。"',
    options: [
      { label: '收下木匣', effect: { items: [{ id: 'item_huze_muha', name: '湖底木匣', desc: '湖泽深处捞出的木匣，铜锁锈死。上回捞它的船，后来翻了。' }], flags: { got_huze_muha: true } } },
      { label: '原样沉回去', effect: { trait: { juan: 1 }, text_after: '你把匣子沉回原处。网收上来时，网底干干净净——老妪在船上看着你，轻轻点了点头。（湖里的东西，她见得多了。）' } },
      { label: '请摆渡老妪掌眼', effect: { trigger: 'adv_huze_muha' } },
    ],
  },
  ev_lj_qingyang_zhi: {
    id: 'ev_lj_qingyang_zhi', nodes: ['lj_qingyang'], weight: 5,
    text: '老道扫着石阶，忽然停了帚："你上山的脚步声，比来时轻了三分。"他扫帚一横，拦住去路，"三日之期到了。还扫得下去吗？"——原来他一直在等你的回答。',
    options: [
      { label: '接过扫帚——"扫。"', effect: { flags: { qingyang_disciple: true }, gongfa_add: { id: 'gf_qingyang_tuna', name: '青羊吐纳法（道门）', desc: '青羊观入门吐纳，讲"气如羊羔，徐行不躁"。正道根基法，进境不快，根基极正。', level: 1, realm: 'lianqi' }, ledger: { type: '誓', text: '于青羊观得授吐纳法' } } },
      { label: '"道长，我想先学剑。"', effect: { chance: 0.4, success: { text_after: '老道深深看你一眼，忽然笑了："剑也好。心不静的剑，我教不了——心静的剑，不用我教。你自去吧。"（这算答应，还是算送客？你想了很久。）' }, fail: { text_after: '"剑在心上，不在手上。"老道继续扫地，"你的心，如今扫地扫不平。"——话止于此。' } } },
    ],
  },

  // ---------- 铁瓦关 ----------
  ev_tw_baizai_fengsheng: {
    id: 'ev_tw_baizai_fengsheng', nodes: ['tw_guanqiang'], weight: 5,
    text: '关墙上的风，今夜不一样——带着一股腥的。戍将站在垛口，一动不动。老兵跟你说："这风向，白灾前兆。上回白灾，妖兽下来找食，围了城半月。"他看看你，"你若在关里，帮着搬石头；你若要走，这三日之内，走。"',
    options: [
      { label: '留下——帮关里守白灾', effect: { flags: { stay_baizai: true }, ledger: { type: '诺', text: '应下戍将：白灾之日守铁瓦关' }, echo: { delayYears: 1, payload: { type: 'baizai_day', text: 'PAY_BAIZAI' } } } },
      { label: '三日之内离开', effect: { trait: { juan: 1 }, flags: { flee_baizai: true } } },
    ],
  },
  ev_tw_mashi_pian: {
    id: 'ev_tw_mashi_pian', nodes: ['tw_mashi'], weight: 6,
    text: '马市角落，一个老农牵着匹瘦马抹泪："三十两……卖了吧……"牙人凑过去："十两，我收。"那马抬眼看了你一下——不是求救的眼神，是"认人"的眼神。它脖子上有烙印，军中的印。',
    options: [
      { label: '掏三十两买下——这是匹有主的军马', cond: { moneyMin: 30 }, effect: { money: -30, items: [{ id: 'item_junma', name: '识路的老军马', desc: '被牙人坑到瘦骨嶙峋的军马，脖子上有营中烙印，认得回营的路。' }, ], ledger: { type: '恩', text: '马市救下老兵的军马' }, echo: { delayYears: 0.5, payload: { type: 'junma_return', text: 'PAY_JUNMA' } } } },
      { label: '找戍将来认——军马私自变卖，是罪', effect: { flags: { mashi_ju: true }, ledger: { type: '恩', text: '马市揭破军马私卖' }, echo: { delayYears: 1, payload: { type: 'shujiang_gratitude', text: 'PAY_SHUJIANG' } } } },
      { label: '不关我事', effect: {} },
    ],
  },
  ev_tw_foguta_feng: {
    id: 'ev_tw_foguta_feng', nodes: ['tw_foguta'], weight: 4,
    text: '夜里的塔铃全停了——不是没风，是风穿过塔身，竟不带响。老僧独坐殿前，看见你，招手："施主，来得巧。今夜「它」不安分，老衲念了一夜的经，缺个添灯的。你若信老衲，坐一坐；若不信——天亮再来。"',
    options: [
      { label: '坐下添灯，守一夜', effect: { flags: { foguta_night: true }, stat: { xiwei: 3 }, text_after: '灯添到四更，塔铃"当"的一声齐响——像什么被按回去了。老僧合十："有劳。老衲欠施主一夜灯火。"' , ledger: { type: '恩', text: '佛塔之夜为老僧添灯' }, echo: { delayYears: 1, payload: { type: 'laosen_gratitude', text: 'PAY_LAOSEN' } } } },
      { label: '"塔底下封的是什么？"', effect: { text_after: '老僧沉默良久："施主，有些话，说了就得有人守。老衲守了四十年，你若问了，就轮到你了。"——他把选择递到你面前。' , options_note: 'truly_open' } },
      { label: '天亮再来', effect: { trait: { juan: 1 } } },
    ],
  },
  ev_tw_huangyi_ye: {
    id: 'ev_tw_huangyi_ye', nodes: ['tw_huangyi'], weight: 5,
    cond: { night: true },
    text: '荒驿之夜，风声呜呜。你和同屋的贩马客轮值守夜。后半夜，风里忽然传来叩门声——三长两短，是商队的暗号。可贩马客死死按住你的手，摇头，嘴唇动了动："我们的暗号，不是这个。"',
    options: [
      { label: '不出声，握紧刀', effect: { flags: { huangyi_night_ok: true }, text_after: '叩门声又响了两轮，停了。天亮开门——门外雪地上，一行脚印绕着驿站走了三圈，出去了，没进来。（谁在学商队的暗号？为什么要人开门？）' } },
      { label: '"什么人？"——应一声', effect: { combat: 'c_goubi_ren', text_after: '门"吱呀"被推开——门口站着的人，脸上有雪，没有影子。' } },
    ],
  },

  // ---------- 黄泉集 ----------
  ev_hq_dufang_qian: {
    id: 'ev_hq_dufang_qian', nodes: ['hq_dufang'], weight: 6,
    text: '你赢了三把。第四把，对家是个戴斗笠的生面孔，押的注是你的全部身家。骰盅落下——他赢了。可他盯着你的眼睛看了半晌，忽然把筹码推回来："不赌了。你输不起，我看得出。输了钱能翻本，输了命……黄泉集的「黄泉」，不是白叫的。"他起身走了，斗笠下露出的半张脸，有刀疤。',
    options: [
      { label: '追上去问名字', effect: { flags: { met_daoba: true }, text_after: '他摆摆手没回头："黄泉集不问名姓。"（可你记住了那道刀疤——江湖上会有再遇见的一天。）' } },
      { label: '收手——今晚就到这儿', effect: { trait: { juan: 1 }, text_after: '你收了筹码。掌柜的笑眯眯："客官有数。这镇上，「有数」的人活得长。"' } },
    ],
  },
  ev_hq_heishi_huo: {
    id: 'ev_hq_heishi_huo', nodes: ['hq_heishi'], weight: 5,
    text: '黑市摊主招手让你过去，烟纸背面推过来一行字："收：幽冥教旧物，印鉴、坛器、手札。价好商量。"他压低声音，"教中人回来了，收旧物是「认祖归宗」的规矩。你手上若有——出手别过三家铺子，走第二家，走漏风声。"',
    options: [
      { label: '"教里收旧物，认的是物，还是人？"', effect: { flags: { knows_jiaozhong: true }, text_after: '摊主的斗笠动了动："……问得好。认物是假，认人是真。他们收的不是东西——是「还没死绝的自己人」。"（你若身上有旧物，这是机会，也是网。）' } },
      { label: '把知道的记下，不动声色', effect: { flags: { knows_jiaozhong: true } } },
    ],
  },
  ev_hq_yaoren_miren: {
    id: 'ev_hq_yaoren_miren', nodes: ['hq_yaorenfang'], weight: 4,
    cond: { night: true },
    text: '你夜里潜近药人坊后墙。墙里透出一缕甜得发苦的药气，还有压得极低的说话声——"这批药性太烈，得再试两个。""……上头催得紧，「银主」等不及了。"（银主？谁出的银子，买人命试药？）',
    options: [
      { label: '记住"银主"二字，全身而退', effect: { flags: { knows_yinzhu: true }, ledger: { type: '怨', text: '查到药人坊背后有"银主"买凶试药' } } },
      { label: '顺着排水渠摸进去救人', effect: { trigger: 'adv_yaoren_jiu' } },
      { label: '敲晕守卫，硬闯', effect: { combat: 'c_shouwei', then: 'adv_yaoren_jiu' } },
    ],
  },
  ev_hq_luanzang_ye: {
    id: 'ev_hq_luanzang_ye', nodes: ['hq_luanzangling'], weight: 6,
    text: '乱葬岭的夜，磷火明明灭灭。守岭人的火堆边，今夜多了个人影——一个白发老者，对着一座新坟自言自语。守岭人见你来，朝那老者努努嘴："等了三年了。等坟里的人「回来」——唉，他不知道，坟是空的。尸骨早叫人换走了。"',
    options: [
      { label: '把守岭人的话，原样告诉老者', effect: { flags: { kongfen_known: true }, ledger: { type: '恩', text: '乱葬岭夜，替守岭人传了句实话' }, echo: { delayYears: 1, payload: { type: 'ling_gratitude', text: 'PAY_LING' } } } },
      { label: '"谁的坟？尸骨谁换走的？"——追问', effect: { flags: { kongfen_quest: true }, text_after: '守岭人摇头："换尸骨的手法，是行家的——「借尸还局」，江湖上失传的手艺。问到底，你要得罪的人，比这座岭的坟还多。"' } },
      { label: ' quietly 离开，不打扰任何人', effect: {} },
    ],
  },

  // ---------- 通用：行路生事 ----------
  ev_xinglu_shengshi: {
    id: 'ev_xinglu_shengshi', nodes: ['guandao', 'yh_xia'], weight: 7,
    text: '行路第三日，前方歇脚亭的烟还没散——三个人影拦在路心，刀都出了半鞘。为首的咧嘴："此山……算了，老词儿不念了。留一半盘缠，人过去。"（行路生事，是江湖的一部分。）',
    options: [
      { label: '拔刀——讲不通就动手', cond: { hasCombatSkill: true }, effect: { combat: 'c_jianjing' } },
      { label: '"交一半。交朋友。"——爽快给钱', effect: { money: -3, text_after: '为首的一愣，笑了："懂规矩。"他竟还了你半句话，"前面十里有人查货，绕小路，贴着河走。"（钱买了个顺水人情——值不值，各人算各人的账。）' } },
      { label: '绕小路，避开这一拨', effect: { timeCost: 1, chance: 0.7, success: { text_after: '小路难走，但清静。' }, fail: { combat: 'c_jianjing', text_after: '小路上竟然也有人——还是这三个。看来是专挑"绕路的"下手。' } } },
    ],
  },
};

// ---------- 补际遇（可达审计） ----------
Object.assign(EVENTS, {
  ev_guishi_wuzibei: {
    id: 'ev_guishi_wuzibei', nodes: ['guishi_ru'], weight: 5,
    text: '无字碑前站着个戴帷帽的人，正拿指尖临摹碑面——碑上无字，他指下却一笔一划极认真。见你看他，他头也不回："碑上为什么无字，你知道么？因为鬼市的规矩，写下来就破了。规矩在心上，不在碑上。"他放下手，"你进不进？"',
    options: [
      { label: '"规矩在心上。"——侧身进门', effect: { flags: { knows_guishi_rule: true }, trait: { yi: 1 } } },
      { label: '"碑上无字，你临的什么？"', effect: { text_after: '他终于回头，帷帽下是一张平静的脸："临的是当年立碑人的手。他是我师父。"（鬼市的水，比你想的深。）', flags: { guishi_stone_master: true } } },
      { label: '不答，转身走', effect: { trait: { juan: 1 } } },
    ],
  },
  ev_chemahang_zhaoche: {
    id: 'ev_chemahang_zhaoche', nodes: ['yh_chemahang'], weight: 6,
    text: '你到车马行问车。老把式正在给一头骡子钉掌，头也不抬："搭车？先说去哪儿——去临江的明早有，去铁瓦关的后日有。黄泉集……那趟没人拉，你要真急，去镇口找「独行客」刘三，他单人单骡，什么都拉，价钱翻倍，命自负。"',
    options: [
      { label: '"刘三是什么来路？"', effect: { flags: { knows_liusan: true }, text_after: '老把式钉完最后一颗钉，才抬头："亡命人。跑得快，嘴严，认钱不认路。用他三次以内，他是条好狗——用第四次，说不准。"' } },
      { label: '订一间去临江的车位', cond: { moneyMin: 1 }, effect: { money: -1, flags: { booked_che: true }, text_after: '你付了定钱。老把式收钱时看了你一眼："明早卯时，误了不等。"' } },
    ],
  },
});
