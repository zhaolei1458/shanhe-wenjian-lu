// ============================================================
// 山河问剑录 · 暗线 hook 事件补全（二十一期修 I）
// 设计文档：docs/设计-游玩体验优化.md §九
// 35 条此生暗线中 32 条的 hook 事件此前从未定义（含两条用了引擎
// 不读的 via/needFlag 字段的死奇遇）——本文件一次性补齐。
// id 与 HIDDEN_LINES.hook 严格一致；nodes=出身命帖 startNode。
// ============================================================

import { EVENTS } from './events.js';

const HOOK = (id, hl, node, text, options) => ({
  id, nodes: [node], weight: 5, minAge: 16,
  cond: { flags: [hl] },
  text, options,
});

Object.assign(EVENTS, {

  // ---------- 魔道·桥接（接通已写好的接引奇遇） ----------
  ev_canpian_name: HOOK('ev_canpian_name', 'hl_modao_canpian', 'hq_dufang',
    '黑市的水很深，可深水里才有你要的鱼。你把残篇又摩挲了一遍——落款被涂掉的那一角，纸纤维都起了毛，是你摸的。托关系查一个名字，得走三层哑线，费钱，也费命。',
    [
      { label: '托黑市查落款', trigger: 'adv_canpian_name' },
      { label: '再等等——风声太紧', effect: { trait: { juan: 1 }, text_after: '你把残篇收回贴身的地方。名字迟早会浮上来，浮上来的时候，最好你已经做好了打算。' } },
    ]),
  ev_tongkou_song: HOOK('ev_tongkou_song', 'hl_modao_tongkou', 'hq_dufang',
    '你把那枚铜扣给城里最好的匠人看过。匠人眯眼看了半晌："这扣子是军器监的作法，可这"宋"字錾得软——不是官作，是私錾。錾扣子的人手抖。"你爹姓宋。魔教之乱的罪奴名录里，姓宋的只有一支。',
    [
      { label: '求匠人引荐见过识广的人', effect: { stat: { wugongXiuwei: 6 }, text_after: '匠人领你去见了位跑码头的老客。老客只问了一句："你家里，还有人记得幽冥教的切口么？"你答不上来。他说，答不上来就别打听。' } },
      { label: '把铜扣收好，自己慢慢查', effect: { trait: { hen: 1 }, text_after: '铜扣贴身放着。夜里它比你的心口还凉。' } },
    ]),
  ev_yaoren_mizhang: HOOK('ev_yaoren_mizhang', 'hl_modao_yaoren', 'hq_dufang',
    '城南的旧书摊上，你翻到半册《魔教之乱始末》，官修的，删得只剩骨头。可"妖人"一节的批注里，有人用蝇头小楷补了一行：妖人非妖，左使旧部，匿于市井，以药为生。以药为生——黄泉集，药香最重的地方。',
    [
      { label: '记下这行批注，往药香处寻', effect: { stat: { wugongXiuwei: 5 }, text_after: '你把这行小楷默背了三遍。以药为生的人，手上都有洗不掉的苦味。' } },
      { label: '买下残册——官府的东西不该落在外人手里', effect: { money: -3, trait: { jin: 1 }, text_after: '书摊老者收了钱，多看了你一眼："这册子，前头来问过的，都没你这么年轻的。"' } },
    ]),

  // ---------- 皇族（一条桥接，两条自足） ----------
  ev_pixiang_ying: HOOK('ev_pixiang_ying', 'hl_huangzu_pixiang', 'gongmen',
    '宫墙下的老内侍见过你之后，手抖得几乎端不住茶盏。他说你眉眼像一个人——像到宫里旧人的忌日，连哭都不必装。他没说像谁。他只说："离宫墙远些。有些像，是催命的。"',
    [
      { label: '追问那句"像谁"', trigger: 'adv_pixiang_ying' },
      { label: '行礼，退开——不逼老人', effect: { trait: { juan: 1 }, text_after: '你退出来时，老内侍在身后站了很久。宫墙上的琉璃瓦映着日头，晃得人眼晕。' } },
    ]),
  ev_neiku_oldjian: HOOK('ev_neiku_oldjian', 'hl_huangzu_oldjian', 'gongmen',
    '内库的旧档你只看了一眼名录就明白了——"前朝旧剑三千，永封"。你父亲提过的那柄剑，不在三千之列。名录末行有小注：另存一柄，武库北角，非诏不启。',
    [
      { label: '记熟北角的位置与"非诏不启"四个字', effect: { stat: { wugongXiuwei: 6 }, text_after: '有些东西的存在本身，就是一句遗言。你把它记在心里，跟自己的名字放在一起。' } },
      { label: '托守库老人讲讲武库的旧事', effect: { trait: { jin: 1 }, text_after: '老人讲了一下午武库的耗子、漏雨和换防。末了他说："北角那间，从我没进来时就不开。你说怪不怪。"' } },
    ]),
  ev_dixing_fuqi: HOOK('ev_dixing_fuqi', 'hl_huangzu_duobi', 'gongmen',
    '你在宫墙外替人誊抄地契，抄到一份三十年前的旧档：宫城西南角那片宅子，地契换过三次主，三次的买主姓氏不同，笔迹却像同一个人。地是死的，人是活的——有人用三张皮，把一块地藏了三十年。',
    [
      { label: '按契上的笔迹摸下去', effect: { stat: { wugongXiuwei: 5 }, money: -2, text_after: '你循着代书铺子问了一圈。三十年前替三张契落笔的先生已经过世，可他的徒弟还记得一句话——"那宅子的主人，从不走门。"' } },
      { label: '把抄好的契交回去，装作没看懂', effect: { trait: { juan: 1 }, text_after: '装糊涂是门手艺。你在宫墙底下长大，这门手艺你天生就会。' } },
    ]),

  // ---------- 将门 ----------
  ev_jiancu_zhui: HOOK('ev_jiancu_zhui', 'hl_jiangmen_jiancu', 'tw_guanqiang',
    '你把那枚箭簇拿给关里最好的铁匠看。铁匠只掂了掂就变了脸色："三棱透甲锥，军械监的制式——可这批料，十年前就封库了。孩子，你父亲中的这一箭，不是关外马匪射得出来的。"',
    [
      { label: '追问封库的经手人', effect: { stat: { wugongXiuwei: 6 }, trait: { hen: 1 }, text_after: '经手人的名字，铁匠不敢说，只用手蘸水在案上写了个字，还没写完就抹了。你记住了起笔的两道。' } },
      { label: '谢过铁匠，回去把枪谱再练一遍', effect: { stat: { wugongXiuwei: 10 }, text_after: '父亲站了一炷香才倒。你至少要站得住两炷香。' } },
    ]),
  ev_qinbing_kan: HOOK('ev_qinbing_kan', 'hl_jiangmen_qinbing', 'tw_guanqiang',
    '选亲兵那日，戍将把你排在头一拨。校场上你枪走得又直又稳，戍将却只看了一眼你母亲缝的护腕，眼里过了点东西。收操后他留你半刻："进了营，逢七的日子，去西库房点卯。别问为什么。"',
    [
      { label: '应下——逢七去点卯', effect: { stat: { wugongXiuwei: 6 }, text_after: '西库房里没兵器，只有一屋子落灰的旧档。第一次点卯，管库的老兵只让你擦了一天窗。' } },
      { label: '婉辞——母亲只让你把枪练直', effect: { trait: { jin: 1 }, text_after: '戍将没勉强你，只在你走时说了句："你父亲当年，也是这么回我的。"' } },
    ]),

  // ---------- 书香 ----------
  ev_canjuan_xun: HOOK('ev_canjuan_xun', 'hl_shuxiang_canjuan', 'dongshi',
    '东市的旧书肆你去了七趟，第八趟，掌柜的才从柜底摸出半函书："你找的这个残卷，三个月里你是第三个问的。前头两个，一个是书商，一个——不像好人。你出了价再说。"',
    [
      { label: '出钱买下这半函', effect: { money: -8, stat: { wugongXiuwei: 6 }, text_after: '半函残卷，字缺了一角。缺的那一角，恰好是作者的名字。天底下没有这么巧的事——除非有人刻意抠的。' } },
      { label: '问那两个先来的人', effect: { stat: { wugongXiuwei: 4 }, trait: { jin: 1 }, text_after: '掌柜的摇头："书商好认。那个不像好人的——他问的不是一个名字，是一户人家满门的下落。"' } },
    ]),
  ev_laojuren_jiao: HOOK('ev_laojuren_jiao', 'hl_shuxiang_laojuren', 'dongshi',
    '教馆的老举人翻完你的习作，半天没说话，末了问你："这手文章的路数，是家学？"你说是先父留下的稿子。老举人把稿子凑到灯下看了很久——"这不像文章，这像账。你父亲在记什么人的账。"',
    [
      { label: '请老举人细看这"账"', effect: { stat: { wugongXiuwei: 5 }, money: -2, text_after: '老举人指给你看：稿中每逢"某人"二字，字距都比别处紧半分。你父亲用字距记人名，一课一条，记了满满四十页。' } },
      { label: '收回稿子——账的事自己认', effect: { trait: { hen: 1 }, text_after: '你把稿子贴身收好。父亲留下的不是文章，是没敢署名的状纸。' } },
    ]),

  // ---------- 市井 ----------
  ev_tangkou_baochou: HOOK('ev_tangkou_baochou', 'hl_shijing_tangkou', 'sipailou',
    '四牌楼的茶博士什么都知道一点，收费也公道。你提了义庄旧案，他擦碗的手停了停："那案子，官面上说是走水。可抬尸的杠夫，后来一个暴病，一个失踪。客人，这碗茶钱买得到消息，买不到平安。"',
    [
      { label: '加钱——两个都要', effect: { money: -6, stat: { wugongXiuwei: 6 }, text_after: '茶博士收了钱，只给你指了条道：失踪的杠夫没走远，在码头扛活，改了姓。"他夜里不敢睡实——你去问，他不敢不应。"' } },
      { label: '先买平安——改日再来', effect: { trait: { jin: 1 }, text_after: '茶博士赞许地点点头："知道怕，就活得长。"你走出四牌楼，身后茶馆的喧闹忽然显得很远。' } },
    ]),
  ev_guishi_maimai: HOOK('ev_guishi_maimai', 'hl_shijing_guishi', 'sipailou',
    '鬼市开在三更后的桥洞底下。你问的那桩旧物，摊主把布掀开一角："东西在。可你知道这行的规矩——问价的人，得先留一样自己的东西。你留什么？"',
    [
      { label: '留一件随身的旧物，换看那桩货', effect: { money: -5, stat: { wugongXiuwei: 5 }, text_after: '布掀开了。你只看了一眼就确认：东西是真的。摊主说货主交代过，"像你的人来了，让他去问当年抬过第二口棺的人。"' } },
      { label: '转身就走——鬼市的规矩沾不得', effect: { trait: { jin: 1 }, text_after: '你走出桥洞，背后摊主的声音追上来："价不会一直在这儿等你！"鬼市的灯，在你身后一盏一盏灭了。' } },
    ]),

  // ---------- 海岛 ----------
  ev_xuanshui_mi: HOOK('ev_xuanshui_mi', 'hl_haidao_haitu', 'cl_yushi',
    '老渔民听你念出"旋水"两个字，把手里的网都放下了。"旋水不是地名，是海况——三股洋流绞在一处，船进去就出来。你阿公烧那张图，不是怕官府，是怕有人按图去那儿。图上除了旋水，还画了什么？"',
    [
      { label: '凭记忆把图上的记号画给老人看', effect: { stat: { wugongXiuwei: 6 }, text_after: '你画到第三处记号，老渔民的脸色变了："这是镇海的钉子。三处记号——是三根钉。拔了钉，旋水就通。你阿公是守钉的人。"' } },
      { label: '摇头——图已经烧了，记不全', effect: { trait: { juan: 1 }, text_after: '老人叹口气："记不全也好。海里的事，知道全了的人，都没能留在岸上。"' } },
    ]),
  ev_haizi_xue: HOOK('ev_haizi_xue', 'hl_haidao_haizi', 'cl_yushi',
    '村塾的孩子里，有个总在退潮时往礁石那边跑。你跟过去，看见他蹲在水洼边，用树枝在水面上写字——写的竟是你阿公教你的那套渔民切口。他不肯说跟谁学的，只说"水底下有人教"。"',
    [
      { label: '陪他等退潮——见教他的人', effect: { stat: { wugongXiuwei: 6 }, text_after: '潮退尽了，礁石丛里没人出来。孩子指着你身后："他教完就走，从来不让我回头。"你回头，只有海风。' } },
      { label: '教孩子正经字，别学切口', effect: { trait: { juan: 1 }, text_after: '孩子跟你学写了三个正经字，又偷偷在沙上补了一行切口。有些东西，教不了，也忘不掉——像血。' } },
    ]),

  // ---------- 药铺 ----------
  ev_dushi_baicao: HOOK('ev_dushi_baicao', 'hl_yaopu_dushi', 'bc_yaoshi',
    '老毒师的药圃你远远看过：九垄药，垄垄不同色，垄与垄之间隔着石灰线。他逮到你扒墙头，也不恼，只说："认得几味？"你认出三味。他哼了一声："我家门里，五岁就得认全。你这点道行——是谁教你站在这儿的？"',
    [
      { label: '如实说——只想学认药', effect: { stat: { wugongXiuwei: 6 }, money: -2, text_after: '老毒师扔给你一册手抄的《百草便认》："抄一遍，抄完再来。错一味，罚一日挑水。"你这才明白，门票是他刚发的。' } },
      { label: '退开——这门惹不起', effect: { trait: { jin: 1 }, text_after: '老毒师在你背后冷冷道："躲得了一时。你身上的血，已经替你把门敲过了。"' } },
    ]),
  ev_dijing_canyuan: HOOK('ev_dijing_canyuan', 'hl_yaopu_renshen', 'bc_yaoshi',
    '药王殿的地基翻修，你混在看热闹的人堆里。挖出来的残碑洗出一角刻字——不是药王讳，是个"宋"字，和魔教之乱的罪奴名录上的宋，是同一个写法。监工催着把碑重新埋回去，谁也不许拓。',
    [
      { label: '趁乱拓下那一角', effect: { stat: { wugongXiuwei: 6 }, trait: { hen: 1 }, text_after: '拓片贴身藏好。碑埋回去了，可拓片上的"宋"字，在夜里比碑还沉。' } },
      { label: '记牢碑的位置与埋法', effect: { stat: { wugongXiuwei: 4 }, trait: { jin: 1 }, text_after: '监工的规矩是"埋三尺，夯三遍"。你把夯的位置数得清清楚楚——想再挖出来，就等它重见天日的那天。' } },
    ]),

  // ---------- 乞丐 ----------
  ev_kanxie_jizhang: HOOK('ev_kanxie_jizhang', 'hl_qigai_xie', 'chengmen_dashi',
    '城门洞的老丐看你的眼神不对——不是看你这个人，是看你脚上的鞋。"这鞋底的针脚，是营里的走线法。穿这鞋的孩子，家里该有军中的旧人。"他把讨饭的瓦罐往你面前推了推，罐底压着半张烧焦的纸。',
    [
      { label: '看那半张纸', effect: { stat: { wugongXiuwei: 5 }, text_after: '纸上是半个名录式的名单，名字全被烧掉了，只有墨点。老丐说："烧名字的人，是想让这些人像没活过。你爹的名字，我在这儿坐了十年，没敢忘。"' } },
      { label: '把干粮分给老丐，先处成熟人', effect: { money: -1, trait: { juan: 1 }, text_after: '你连着三天来送干粮。第三天老丐开口了："明天晌午，城隍庙后头。别带人。"' } },
    ]),
  ev_haibu_ming: HOOK('ev_haibu_ming', 'hl_qigai_haibu', 'chengmen_dashi',
    '你终于摸清了城里乞丐的"海布"规矩——乞儿分片，片各有名，名上头还有个看不见的总名。老丐醉后吐了真言：那总名三十年前换过，旧的那个，因一桩案子，满门的乞儿一夜之间散了个干净。',
    [
      { label: '问旧总名是什么、案子是什么', effect: { stat: { wugongXiuwei: 6 }, text_after: '「旧总名，一个字。案子——官府卷宗上写的是窝藏。」藏的是什么人，卷宗上没写。反正那年之后，城里再没人敢收留外乡的病乞丐。"' } },
      { label: '先记下，别露了求知的样子', effect: { trait: { jin: 1 }, text_after: '讨饭的堆里，好奇心是最贵的奢侈品。你把它收进怀里，和半块冷饼放在一起。' } },
    ]),

  // ---------- 猎户 ----------
  ev_bailu_yin: HOOK('ev_bailu_yin', 'hl_liehu_bailu', 'shanlu',
    '老猎户酒后说起白鹿：山里的白鹿三十年一现，现必有因。他年轻时见过一回，就在白影出没的那道梁——"鹿蹄印比碗口大，踩在雪里，里头是热的。那不是鹿，是山神爷的信使。它来，是有话没带到。"',
    [
      { label: '问——什么话，没带到谁那儿', effect: { stat: { wugongXiuwei: 6 }, text_after: '老猎户盯着火塘："带话的人死了。三十年前进山的那一队，你爹就在里头。话没带到，鹿就还在等——你信不信，它现在找的，是队里人的种？"' } },
      { label: '谢过老人，自己上梁守一夜', effect: { stat: { wugongXiuwei: 8 }, trait: { jin: 1 }, text_after: '你在梁上守到四更，没等到鹿，等到一声极远的、像是什么东西踏碎冰面的响。山里的夜，比故事里冷得多。' } },
    ]),
  ev_neizhai_anshao: HOOK('ev_liehu_neizhai', 'hl_liehu_neizhai', 'shanlu',
    '猎户内宅的窗纸后头，你瞥见一样东西：供桌上一面小铜镜，镜背的纹样——和你家那半块碎镜严丝合缝。老猎户婆娘发现你看出了神，隔天隔着门说："那面镜子，是你爹娘进山前寄存的。他们说，若是他们没回来，就等一个带着另外半块的人来取。"',
    [
      { label: '取出另外半块，合上去', effect: { stat: { wugongXiuwei: 8 }, text_after: '两半镜面合拢的一瞬，你后颈的汗毛全立起来——镜里除了你，还有你身后山道的方向。老猎户婆娘在门里说："镜子合一回，山门开一回。去不去，你自己定。"' } },
      { label: '不取——先问清寄存人的原话', effect: { stat: { wugongXiuwei: 4 }, trait: { jin: 1 }, text_after: '"原话就一句：镜圆之日，白影现身之时，别在后山。你爹娘留下的全是别去二字，可他们自己，偏偏是去了的。"' } },
    ]),

  // ---------- 镖局 ----------
  ev_weijing_biao: HOOK('ev_weijing_biao', 'hl_biaoshi_danyi', 'yh_biaoju',
    '你替镖局清点旧库，压箱底一面"威"字镖旗——旗面三个弹孔一样的前后通透的洞。老趟子手路过看了一眼："这面旗收起来那年，你还没生。单人不走夜路是局里的规矩，可那趟镖，是子时出城的。谁改的规矩，谁就是那趟镖的死敌。"',
    [
      { label: '查旗入库的年份与押镖名录', effect: { stat: { wugongXiuwei: 6 }, trait: { hen: 1 }, text_after: '名录上那趟镖的押镖人栏，被人用浓墨涂了。墨底透光能看出两个字——第一个字，是你师父的姓。' } },
      { label: '把旗原样压回去', effect: { trait: { juan: 1 }, text_after: '有些旗不能亮出来，一亮就是催命幡。你把它压得比原来更深了三寸。' } },
    ]),
  ev_caodao_heihuo: HOOK('ev_caodao_heihuo', 'hl_biaoshi_caodao', 'yh_biaoju',
    '曹刀子请你喝了顿酒，酒过三巡，他压着嗓子说："兄弟，有条黑货的道，一个月顶你半年的辛苦钱。局里老人们不知道——知道的人，当年都没能善终。"他说这话时一直在笑，眼睛里没有笑。',
    [
      { label: '应下——先看看是什么货', effect: { money: 10, trait: { si: 1 }, ledger: { type: '怨', text: '应了曹刀子的黑货道，此账迟早有人来算' }, text_after: '货你没细看，只看见封条上的官印。钱是好东西，可压着封条的手，也是要留印的。' } },
      { label: '回绝——局里的规矩不破', effect: { trait: { jin: 1 }, stat: { wugongXiuwei: 4 }, text_after: '曹刀子笑着送你出门，转身时啐了一口。三天后他离了城。半年后你在别处听见他的死讯——你回绝的那天，他其实给你看了他的命。' } },
    ]),

  // ---------- 罪奴 ----------
  ev_anjuan_wei: HOOK('ev_anjuan_wei', 'hl_zuinu_anjuan', 'gongmen',
    '案卷库的老吏喝了你一盏酒，指给你看架上蒙尘的一函："罪奴安置卷，三十年前的。你家那一支的名字，在发卖一栏。可你数数这函卷宗的厚度——发卖的卷，比没发卖的白丁卷厚三倍。多出来的纸，记的全是病故二字。"',
    [
      { label: '数一数"病故"的条目', effect: { stat: { wugongXiuwei: 6 }, trait: { hen: 1 }, text_after: '一百三十七人，全是青壮，病故的日子前后不出十日。老吏把卷宗合上："老朽只告诉你一件事：那十日里，发卖他们的人家，一家没剩。"' } },
      { label: '把卷宗原样放回，谢老吏的酒', effect: { trait: { jin: 1 }, text_after: '老吏在你出门时说了句："这函卷三十年没人动过。你今日动了，往后夜里睡不踏实，别怪老朽。"' } },
    ]),
  ev_yupei_ban: HOOK('ev_yupei_ban', 'hl_zuinu_yupei', 'gongmen',
    '玉市上你见到半块玉佩——纹样跟你贴身那半块同出一料。摊主说是收荒货收来的，原主是个"欠了债的穷书生"。你还没开口，摊主忽然压价三成："看你也是识货人，这半块，本就不该在我手里。"',
    [
      { label: '买下这半块', effect: { money: -6, stat: { wugongXiuwei: 6 }, text_after: '两个半块合不上——茬口差了一线，不是一块玉分的两半，是一块玉和另一块玉。你家那半块的另一半，还在别人手里。' } },
      { label: '问穷书生的下落', effect: { stat: { wugongXiuwei: 5 }, text_after: '摊主说书生典了玉就去了北边，临走留了句话："告诉戴另一半的人——玉不合，人别合。"' } },
    ]),

  // ---------- 游方 ----------
  ev_jiaoyin_yuan: HOOK('ev_jiaoyin_yuan', 'hl_youfang_jiaoyin', 'poza',
    '破庙的飞檐下，一个游方郎中盯着你看了半天："小哥，你这走相，是常年睡牛棚马厩压出来的肩。可你走路不弓腰——有人教过你站相。教站相的人，自己却没能教你别的，对不对？"他收摊跟你走了一段，临别留下一句话。',
    [
      { label: '问那句临别的话', effect: { stat: { wugongXiuwei: 6 }, text_after: '郎中说："教你站相的人，是行者里的「灯」。灯灭了，火还在传。你什么时候想找火，就去每个庙里数灯笼——单数的庙，进去等。"' } },
      { label: '给他把破庙的灯点上', effect: { money: -1, trait: { juan: 1 }, stat: { wugongXiuwei: 4 }, text_after: '你点了灯。郎中看着那点火光，忽然说："灯还亮着就好。有些队伍，就靠着几盏灯记住自己还在走。"' } },
    ]),
  ev_nide_xue: HOOK('ev_nide_xue', 'hl_youfang_yuanlai', 'poza',
    '游方郎中替你搭了脉，搭完收了手，半天不说话。你追问，他只说："你这脉，走的是一路极凶的内功底子——打熬筋骨的路数，练的人十不存一。这不是农家孩子该有的底子。谁在你骨头里埋的东西，你自己不知道？"',
    [
      { label: '请他细说这路内功的来历', effect: { stat: { wugongXiuwei: 8 }, text_after: '"这路功法叫什么，我说出来你一夜睡不着。我只说一样：练它的门里，十年前死了个最出色的。尸首，是走着回的家。"' } },
      { label: '不肯说就作罢——骨头里的东西，自己认', effect: { trait: { hen: 1 }, stat: { wugongXiuwei: 4 }, text_after: '你谢过诊金退了回去。走出破庙，你第一次认真地感受自己的骨头——它们比你记忆里的任何东西都老。' } },
    ]),

  // ---------- 世家 ----------
  ev_zhangmu_fan: HOOK('ev_zhangmu_fan', 'hl_shijia_zhangmu', 'lj_shuyuan',
    '书院长亲身故，你随众人吊唁。灵堂白幔间，你看见院长的手边供着一样东西——和你家祖传的那柄断折的戒尺，是同一把。尺身刻的小字你从小就摸熟了：「朴作教刑」。原来他一直知道你是谁的孩子。',
    [
      { label: '把断尺对上去', effect: { stat: { wugongXiuwei: 8 }, trait: { hen: 1 }, text_after: '两截断尺合上了，接口处严丝合缝。执事的学生在背后说："院长临终交代，若有人来合尺——请他读尺腹里的东西。"尺是空心的，里头塞着一卷纸。' } },
      { label: '不碰——吊唁的人不该翻旧物', effect: { trait: { jin: 1 }, text_after: '你行完礼退出来。身后有人说，院长那一房的亲属今早全到了，一个不落——一个三十年从不来往的"世交"，也到了。' } },
    ]),
  ev_jianshu_fang: HOOK('ev_jianshu_fang', 'hl_shijia_shanzhang', 'lj_shuyuan',
    '书院藏书楼的管楼嬷嬷病故前，托人捎给你一把钥匙："三楼西架，《河工水利考》第四函，夹层里的东西，物归原主。"你问原主是谁，她说："当年给你家惹祸的那位老爷，临死前跪在楼底下求我收的。他说是他欠的。"',
    [
      { label: '上楼取夹层里的东西', effect: { stat: { wugongXiuwei: 6 }, money: 5, text_after: '夹层里是一叠地契与一封未寄出的信。信封上的名字，是你家蒙难后第一个改口不认你家的人。' } },
      { label: '先拜祭嬷嬷，再动书楼', effect: { trait: { juan: 1 }, stat: { wugongXiuwei: 4 }, text_after: '你先去给嬷嬷上了香。回头再上三楼时，西架第四函被人抽走了——来晚的人，比你更早知道钥匙的事。' } },
    ]),

  // ---------- 药族 ----------
  ev_donghuang_qu: HOOK('ev_donghuang_qu', 'hl_yaozu_donghuang', 'hq_yaorenfang',
    '东荒药市的规矩你听说了：每年开市第一秤，称的不是药，是"旧年"——各族老药人会拿出一样压箱的东西，讲一段往年事。今年轮到主讲的老人，讲到一半看见你，忽然停了口，把后半段咽了回去。',
    [
      { label: '散市后去寻那位老人', effect: { stat: { wugongXiuwei: 6 }, text_after: '老人见了你，把门闩上了才开口："你娘当年在这市上，是有座位的。她的座位，是在药字上了锁的那一栏。别问是什么药——问了你就回不了头。"' } },
      { label: '先在市上长住下来，日日听旧事', effect: { money: -4, stat: { wugongXiuwei: 5 }, text_after: '你在药市听了半个月旧事，记了一本子人名。最后有个卖甘草的老婆子拉住你："别记了。你娘的事，这市上没人敢讲全——讲全的人，坟头草都三尺高了。"' } },
    ]),
  ev_luopan_zhi: HOOK('ev_luopan_zhi', 'hl_yaozu_luopan', 'hq_yaorenfang',
    '你把那只祖传罗盘拿给市上最老的相地先生看。老人转着罗盘，忽然手一抖："这不是看风水的盘——针脚是医家的「归经」刻法。它不指方向，它指「药引」。你家里，是不是有人是药引命？"',
    [
      { label: '追问什么是药引命', effect: { stat: { wugongXiuwei: 6 }, trait: { hen: 1 }, text_after: '"某些极罕见的方子，最后一味药引，是活人的精气。有那路人家的孩子，生下来就上了别人的方子。你这罗盘的针，朝着谁家去——谁家的方子上，就有你家。"' } },
      { label: '收起罗盘，谢过老人', effect: { trait: { jin: 1 }, text_after: '老人在你出门时追出来一句："盘针要是夜夜指同一个方向——别跟着去。让针等你，你别等针。"' } },
    ]),

  // ---------- 歌姬 ----------
  ev_jinqu_xiang: HOOK('ev_jinqu_xiang', 'hl_geji_quzi', 'neishi',
    '内教坊的旧曲簿你翻了三天，在一支没名字的曲子后头找到一行小注："此曲不入谱，传者三支——一支焚，一支殉，一支……"后头的字被水渍洇了。可那支曲子的工尺谱，你娘哄你睡觉时哼过，一个字都不差。',
    [
      { label: '把整支曲默写出来，送去给教坊的老人辨', effect: { stat: { wugongXiuwei: 6 }, text_after: '老乐师看完默谱，手抖着把它凑到烛上点了："烧了。这支曲传到谁手里，谁家就要出事。你娘到死没教你唱全——她是疼你。"' } },
      { label: '追问焚掉的、殉掉的那两支的下落', effect: { stat: { wugongXiuwei: 5 }, trait: { hen: 1 }, text_after: '"焚的那支，灰撒进了教坊的井。殉的那支，跟着人葬进了乱葬岗。孩子，三支曲是一支曲——你娘哼给你的，是活下来的那支。"' } },
    ]),
  ev_beibian_shi: HOOK('ev_beibian_shi', 'hl_geji_beibian', 'neishi',
    '北边来的商队里有个老琴师，在坊里替人调弦糊口。他听见你随口哼的调子，弦"铮"地断了。他说这调子三十年前在北边的官宴上听过一回——"唱它的人，是当时整个北地最红的姑娘。宴罢第二天，人就没了。你们家……和那位姑娘，是什么称呼？"',
    [
      { label: '"是我娘。"', effect: { stat: { wugongXiuwei: 6 }, text_after: '老琴师对你深深一揖，揖到底："那年宴上，我给她伴奏。散席后她跟我说过一句话——若我回不来，我孩子的琴，替我留一弦。你要肯学，我这双手还剩一弦的力。"' } },
      { label: '不答，反问宴上还有什么人', effect: { stat: { wugongXiuwei: 5 }, trait: { jin: 1 }, text_after: '"什么人？"老琴师苦笑，"坐主位的，如今在朝；坐两侧的，如今在土里；替她倒酒的——"他举起自己的手，"如今在这儿，调一辈子弦。"' } },
    ]),
});
