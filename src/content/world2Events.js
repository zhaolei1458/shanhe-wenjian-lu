// 二期 v2.0：三镇/海洋际遇 + 山海经妖兽遭遇。妖兽是"有名字的缘分"，全部文字呈现。
export const EVENTS2 = {
  // ---------- 百草坞 ----------
  ev_bc_yaoshi_qie: {
    id: 'ev_bc_yaoshi_qie', nodes: ['bc_yaoshi'], weight: 5,
    text: '药市尽头起了争执——一个瘦老头被药铺伙计按住："偷药！抓他去见官！"老头挣扎着，怀里掉出一包药——是止血散，最便宜的那种。',
    options: [
      { label: '替老头付了药钱', cond: { moneyMin: 1 }, effect: { money: -1, ledger: { type: '恩', text: '药市替偷药老头付账' }, trait: { ren: 2 }, echo: { delayYears: 2, payload: { type: 'bc_laotou', text: 'PAY_BC_LAOTOU' } } } },
      { label: '蹲下来问：给谁止血？', effect: { text_after: '（老头怔了怔，声音低下去："给孙子。他爹在矿上没的，他在炕上躺着，伤口发炎——"伙计松了手。掌柜的从铺子里出来，把一整包药塞进老头怀里："记我账上。"药市的规矩：药市无饿死人。）', trait: { cha: 1 } } },
      { label: '人群散了，你也散了', effect: { text_after: '（你走远了。那包止血散落在地上的声音很轻，可你听见了。）' } },
    ],
  },
  ev_bc_yaowang_huan: {
    id: 'ev_bc_yaowang_huan', nodes: ['bc_yaowangmiao'], weight: 4,
    text: '药王庙前，一个中年汉子跪着还愿——他放下的是一把野山参。庙祝叹气："上次你许的愿是「救活我娘子」。参是好参……人呢？"汉子磕了个头，没说话，走了。',
    options: [
      { label: '追出去，问他需要什么', effect: { text_after: '（他说娘子「走了」，可他还在还愿——"愿许了就得还。药王救不了人，是我没本事。可药王不欠我。"你忽然懂了药王庙为什么香火不断：拜的从来不是灵不灵，是「记恩」。）', trait: { xin: 2 }, flags: { yaowang_dong: true } } },
      { label: '帮庙祝把参收进库房', effect: { text_after: '（收参时庙祝教你辨参："参要论「纹」。你看这纹路——像不像人脸上的苦？"他笑了一下，"苦到纹里的参，药性最好。"）', stat: { wuxing: 1 } } },
      { label: '上炷香，继续赶路', effect: { text_after: '（香灰落下时，你心里默默许了个愿。什么愿，你没告诉任何人。）' } },
    ],
  },
  ev_bc_yaotian_jing: {
    id: 'ev_bc_yaotian_jing', nodes: ['bc_yaotian'], weight: 5,
    text: '夜里守田，你听见药田深处传来窸窣声——不是风。你拨开雾，看见田垄间立着个「小人儿」，三寸高，正费力地拔一株九节兰。',
    options: [
      { label: '屏住呼吸，看它把兰草拔走', effect: { beast_seen: 'beast_renshen', text_after: '（它把九节兰拔出来，抖了抖土，抱着走了——临走前，它朝你的方向「鞠」了一躬。老人们没骗人：地精护参，参通地气。它拿走一株，来年这片田的药性会更好。）' } },
      { label: '出声，问它要什么', effect: { beast_seen: 'beast_renshen', chance: 0.5, success: { text_after: '（它吓了一跳，钻进土里。可第二天清晨，你守的那块田里多了一株从没见过的药苗——通体莹白。药典上没有它。你给它起了个名字。）', stat: { xiwei: 15 } }, fail: { text_after: '（它钻进土里不见了。田垄合拢，像什么都没发生过。可你蹲在原地等到天亮——你总觉得，它听懂了。）' } } },
      { label: '抓住它！', effect: { beast_seen: 'beast_renshen', text_after: '（你扑了个空，摔进田里。满身泥爬起来时，它在远处歪着头看你——那眼神不是怕，是「可怜」。它可怜你。你躺在田里笑了——人生头一回被一个三寸高的小东西可怜。）' } },
    ],
  },
  ev_bc_shidu_huo: {
    id: 'ev_bc_shidu_huo', nodes: ['bc_shidu'], weight: 4,
    text: '试毒巷的竹凳上，老毒师招手叫你："来。这碗汤药，喝不喝？"碗里药色发黑，冒着细泡。"喝，五十文。不喝，坐坐也行——我给你讲讲巷子的规矩。"',
    options: [
      { label: '喝。钱和胆子都要挣', effect: { money: -1, hp: -10, ledger: { type: '债', text: '试毒一次，赚了钱伤了身' }, flags: { shidu_xinren: true }, text_after: '（你喝了。半个时辰后你躺在巷子里的竹榻上，浑身发麻——老毒师守着你，喂你灌解药。"行。手不抖，心也不抖。这碗五十文，下碗一百。"）' } },
      { label: '不喝，坐下听规矩', effect: { text_after: '（他说了半个时辰：哪几味药相克，哪种毒遇茶反烈，试毒的人为什么「先嚼甘草」。临走他递给你一小包甘草："拿着。不收钱——你会用上的。"）', item_add: [{ id: 'item_gancao', name: '甘草包', desc: '老毒师给的。他说「你会用上的」。' }], trait: { chi: 1 } } },
      { label: '退出去——这碗水太深', effect: { text_after: '（他也不恼，端回自己面前一饮而尽。"胆子小活得久。"他笑着说，指甲的青色在昏暗里像墨。）' } },
    ],
  },
  // ---------- 沧澜澳 ----------
  ev_cl_yushi_yi: {
    id: 'ev_cl_yushi_yi', nodes: ['cl_yushi'], weight: 5,
    text: '鱼市今日的喧腾里夹着异样——渔民们围着一张网，网里有半块青黑色的「砖」。有人喊「宫砖」，有人喊「扔回去」。人群里有个后生悄悄把砖往怀里揣。',
    options: [
      { label: '拦下他："扔回海里。"', effect: { text_after: '（他脸涨红了："凭什么！"——"凭老规矩。"周围渔民围上来，七嘴八舌。最后他把砖扔进了海里。扔完他蹲在滩上哭——他娘病了，番商说这砖值三百两。你把自己身上的钱塞给他。他没说话，磕了个头。）', money: -3, beast_seen: 'beast_jiao', ledger: { type: '恩', text: '鱼市拦下私藏宫砖的后生' } } },
      { label: '看看那砖——花纹像什么', effect: { beast_seen: 'beast_jiao', text_after: '（砖上的盘龙纹路盘成「迎」的姿势——和龙宫门口石兽的姿势一样。这砖不是砖，是「门的一部分」。海里丢了一扇门的东西，海会来找的。）' } },
      { label: '不掺和，买鱼去', effect: { text_after: '（今天的黄鱼确实鲜。你拎着鱼走远，身后人声渐渐平息——最后一声是「扑通」，不知是谁把什么扔回了海里。）' } },
    ],
  },
  ev_cl_haishen_qi: {
    id: 'ev_cl_haishen_qi', nodes: ['cl_haishenmiao'], weight: 4,
    text: '老庙祝摇出一支签，看了很久，却把签递给你："这支不是你的——是「海」托我给你的。签文你拿着，什么时候看懂了，什么时候来还签。"',
    options: [
      { label: '接过签文', effect: { text_after: '（签文只有八个字："水静丹圆，山现婴成。"你看不懂。庙祝说："看懂了，你就不用问海了。"——你把签文收进袖中录最里层。这句话，后来在很多个夜里，你都翻出来看过。）', flags: { haishen_qian: true } } },
      { label: '问庙祝：我什么时候能出海？', effect: { text_after: '（他不答，反问："你出海，是要「离开」什么，还是去「见」什么？"你想了想。他点点头："想清楚这个，再出海。海上没有「顺路」这回事——每一段航程，都是「专程」。"）', trait: { wu: 1 } } },
      { label: '把签放回签筒', effect: { text_after: '（你把签放回去。庙祝也不恼："海不急。你急什么？"——这话你没听懂，但记住了。）' } },
    ],
  },
  ev_cl_huozhan_yiwu: {
    id: 'ev_cl_huozhan_yiwu', nodes: ['cl_huozhan'], weight: 4,
    text: '番商在灯下摆开今日收的「海货」：夜光贝、说不上来的骨头、一小截白森森的「龙骨」。他冲你招手："客人，掌掌眼？你要认得出哪样是真，我送你一样。"',
    options: [
      { label: '指骨头："这是龙骨，假的没有骨纹。"', effect: { beast_seen: 'beast_jiao', chance: 0.6, success: { text_after: '（番商大笑："好眼力！这截是真龙骨——我收它花了五十两。送你——"他扔给你一枚龙鳞钱，"这个送你，保平安。"）', item_add: [{ id: 'item_longlin_qian', name: '龙鳞钱', desc: '番商送的护身钱，青黑色，入水不沉。' }] }, fail: { text_after: '（番商摇头："是鲸骨。龙骨比这个沉——沉十倍。客人，眼睛要毒，先要「心不贪」。"他不生气，反而请你喝了杯番邦的酒。）' } } },
      { label: '问龙骨的来路', effect: { beast_seen: 'beast_jiao', text_after: '（番商收了笑："南海沉船里出的。那船沉在三百年前——船上的东西都「认主」，我收货敢收，是知道它们现在「无主」。客人，海里的东西，来历比货值钱。"）' } },
      { label: '把玩夜光贝', effect: { text_after: '（贝光幽幽。番商说这贝夜里能照见「水下的路」——"龙宫那片海，夜光贝照出来的不是路，是「脚印」。谁的脚印，我不说。你买不买？"）' } },
    ],
  },
  ev_cl_dengta_xianying: {
    id: 'ev_cl_dengta_xianying', nodes: ['cl_dengtaya'], weight: 3,
    text: '你在灯塔崖上看海到清晨。天将亮时，海天相接处浮起一线山影——青色的，静的，像一幅画里剪下来的一角。守灯人不知何时站在你身后："看见了？……记住这个时辰。你还会再看见它一次。那一次，就轮到你「过去」了。"',
    options: [
      { label: '问守灯人：那是什么？', effect: { text_after: '（他望着山影："老人们叫它仙山。我爷爷的爷爷见过，我也见过——看见过的人都会「被它记住」。你被记住了，从今天起。"）', flags: { xianshan_xianying: true }, ledger: { type: '记', text: '灯塔崖望见仙山现影，被仙山记住' } } },
      { label: '对着山影长揖一礼', effect: { text_after: '（你拜下去。抬起头时山影淡了，可你心口那点「躁」，忽然静了——像有人在你丹田里，按了一下「停」。这一拜，拜得值。）', stat: { xiwei: 30 }, flags: { xianshan_xianying: true } } },
      { label: '转身下山——不看不问', effect: { text_after: '（你下了崖。走到半山腰你停下来——你发现自己在「想」那线山影。想得厉害。有些东西，看见没看见，都一样：它已经在你心里了。）', trait: { jue: 1 } } },
    ],
  },
  // ---------- 昆吾镇 ----------
  ev_kw_jianlu_shixin: {
    id: 'ev_kw_jianlu_shixin', nodes: ['kw_jianlu'], weight: 5,
    text: '剑炉街的老炉前围着人——炉里的火「变色」了，由红转青。老师傅盯着炉子，脸色凝重："三十年了……火又认主了。它认谁？在场谁带了好料？"',
    options: [
      { label: '把你身上最得意的东西拿出来给火看', effect: { beast_seen: 'beast_hanshi', chance: 0.5, success: { text_after: '（你掏出贴身的东西放进炉前。青色的火「舔」了一下——然后炉火「呼」地蹿高三尺！老师傅大笑："好！火认你了！小子，往后你炼器，借我这炉——不收钱。"）', flags: { jianhuo_ren: true }, ledger: { type: '缘', text: '剑炉青火认主' } }, fail: { text_after: '（火没理你。老师傅摆摆手："不怪你，火挑料不挑人。攒好料再来。"）' } } },
      { label: '问老师傅：青火是什么兆头？', effect: { text_after: '（"青火炼剑，剑出「有灵」。"他压低声音，"上一次青火，是给一位剑仙开炉。那位剑客后来去了北原，再没回来——他最后一把剑，就埋在剑冢，无字碑下面。"）', flags: { qinghuo_shuo: true } } },
      { label: '看个热闹就走', effect: { text_after: '（你挤出人群。身后炉火「轰」地一声——不知认了谁。回头看时，青光映在每个人脸上，人人都在笑。）' } },
    ],
  },
  ev_kw_jianzhong_ming: {
    id: 'ev_kw_jianzhong_ming', nodes: ['kw_jianzhong'], weight: 4,
    text: '守冢人扫到第七排，扫帚忽然停了——无字碑前的土「鼓」了起来，像有什么东西要从坟里「醒」。守冢人松了口气："两百年了……它终于要「认主」了。今天的来客里，谁是带「缘」的？"',
    options: [
      { label: '上前一步："我试试。"', effect: { chance: 0.4, success: { text_after: '（你把手放在碑上。土里传出一声嗡鸣——像剑在「问路」。然后，一切安静下来。守冢人望着你："它认你了。剑坯还差「淬火」——昆吾的炉，青火，三个月。你若有缘，它会自己认你。"）', flags: { jianpi_ren: true }, ledger: { type: '缘', text: '剑冢无字碑下剑坯初认主' } }, fail: { text_after: '（嗡鸣在你掌心转了三圈，退了回去。守冢人摇头："不怪你。它等的不是你——但它记下你了。缘，是攒的。"）' } } },
      { label: '问守冢人：埋剑的是什么人？', effect: { text_after: '（「一个瞎子。」守冢人慢慢地说，"他这辈子铸了三十九把剑，第四十把——剑坯成了，人没等到淬火。他徒弟把剑坯埋在这，立了无字碑。「等一个不必眼睛看剑的人」——碑上原是这么刻的，我先师命我磨平了。磨平了，才算「不设门槛」。"）', flags: { wuzi_bei_gu: true } } },
      { label: '给碑磕个头，静静退开', effect: { text_after: '（你磕了个头。起身时，守冢人往你手里塞了个东西——一颗剑形的小石子。"剑坯的「剑尖」，当年崩出来的。拿着——替它看看外面的江湖。"）', item_add: [{ id: 'item_jianjian_shi', name: '剑尖石', desc: '剑冢守冢人赠。两百年剑坯崩出的剑尖——「替它看看外面的江湖」。' }] } },
    ],
  },
  // ---------- 东海群岛 ----------
  ev_qd_yucun_chao: {
    id: 'ev_qd_yucun_chao', nodes: ['qd_yucun'], weight: 4,
    text: '大潮夜。渔村全员上滩头抢收渔网，浪头一次次扑上来。混乱中一个孩子的哭声从礁石那边传来——浪快涨满，礁石马上要没顶。',
    options: [
      { label: '冲过去救孩子', effect: { chance: 0.75, success: { text_after: '（你蹚着齐胸的浪把孩子拽了下来。回滩上时最后一波浪打过来，你们两个摔在沙里——孩子在他娘怀里哇哇大哭，你躺在沙上大笑。渔村记住了你：那晚之后，你家门口每晚都有一碗热鱼汤。）', ledger: { type: '功德', text: '大潮夜礁石救稚子' }, hp: -15 }, fail: { text_after: '（一个浪把你拍进礁石缝——孩子被救上来了，是渔民们用网兜的。你躺在滩上咳水，村长拍着你的背："好后生。冲得出来，就是好后生。"）', hp: -20 } } },
      { label: '指挥大家用渔网结绳救人', effect: { text_after: '（你喊破了嗓子。网兜下去三次，第三次把孩子兜住了。村长后来在祠堂给你记了一笔："智勇。"渔村的祠堂，百年来只记了七个名字。）', ledger: { type: '功德', text: '大潮夜结网救童，渔村祠堂记名' } } },
      { label: '帮着抢收渔网——救人是他们的事', effect: { text_after: '（你抢回了三张网。孩子最后也救上来了。你扛着湿网往回走，心里松了口气——海上的村子里，没有人是「外人」。）' } },
    ],
  },
  ev_qd_wangxian_xianying: {
    id: 'ev_qd_wangxian_xianying', nodes: ['qd_wangxianya'], weight: 3,
    text: '天将破晓，望仙崖的海平线上——山影浮现了。青色，静穆，像天地睁开的一只眼。守崖人立在碑旁，对你比了个「静」的手势。这一刻，连海风都停了。',
    options: [
      { label: '在碑前盘膝坐下，就着山影观想', effect: { chance: 0.5, success: { text_after: '（你闭上眼。山影「照」进你的识海——那一刻你明白了什么叫「长生不长生，看你记得多少」。你的元婴在识海里，朝着山影「走」了半步。就这半步，寻常修士走十年。）', stat: { xiwei: 120 }, flags: { xianshan_xianying: true }, ledger: { type: '悟', text: '望仙崖观想仙山现影，识海开一线' } }, fail: { text_after: '（你静坐到日出。山影淡去时你睁开眼——什么都没「得到」，可你心里那点「躁」全没了。守崖人说："这就是收获。仙山不给东西，给「静」。"）', stat: { xiwei: 60 }, flags: { xianshan_xianying: true } } } },
      { label: '问守崖人：您当年在海底看见了什么？', effect: { text_after: '（他望着山影，很久很久。"看见了「门」。"他说，"龙宫的最深处有一道门——门后不是宝库，是「更深的静」。我回来，是因为我那时候还「静」不下来。你若去，"他转过头看你，"带着你的「静」去。"）', flags: { longgong_men: true } } },
      { label: '对着山影许愿', effect: { text_after: '（你许了愿。守崖人在旁边静静听完，说："仙山不听愿望——它听「志向」。愿望是「想要」，志向是「要去」。你刚才说的那个，是哪一个？"你答不上来。他点点头："答上来的时候，你就该动身了。"）', trait: { jue: 1 } } },
    ],
  },
  // ---------- 龙宫遗迹 ----------
  ev_lg_gongmen_ren: {
    id: 'ev_lg_gongmen_ren', nodes: ['lg_gongmen'], weight: 4,
    text: '你游进倾颓的宫门。水从门缝里过，静得庄严。门前那对石兽保持着「跪迎」的姿势——几百年了。你伸手抚上石兽的头，水面忽然荡开一圈涟漪：石兽的眼睛里，亮起了一点微光。',
    options: [
      { label: '抱拳，对宫门一拜', effect: { beast_seen: 'beast_jiao', text_after: '（你拜下去。涟漪一圈圈荡开——整个宫门遗迹的水，都轻轻震了一下。像有什么东西「知道」你来了，并且认可了你行礼的方式。鲛人的规矩：先学会归还，再学会拿取。你空着手来，先拜后看——礼到了。）', ledger: { type: '礼', text: '龙宫宫门前礼拜，遗迹知你' } } },
      { label: '察看门上的盘龙石刻', effect: { beast_seen: 'beast_jiao', text_after: '（刻纹盘成一个「迎」字。你顺着刻纹摸到龙首——龙首的鳞片缺了一片。缺口的形状……你想起番商货栈里那块「宫砖」。原来那块砖，是这扇门的。）' } },
      { label: '直接往里游', effect: { text_after: '（你从石兽面前游过去。水忽然「沉」了一分——不是阻力，是「注视」。你身后，石兽的眼睛一直亮着，跟着你，直到你游远。它们不拦人，只记账。）' } },
    ],
  },
  ev_lg_huilang_bao: {
    id: 'ev_lg_huilang_bao', nodes: ['lg_huilang'], weight: 4,
    text: '回廊尽头，夜明珠的光聚成一团——照着一座「水牢」。牢里不是囚犯，是一颗悬浮的「珠」，拳头大，通体流转着将熄未熄的灵光。牢门上刻着小字："守此珠者，代代鲛人。取珠者，还珠有期。"',
    options: [
      { label: '不取。对着牢门一拜就走', effect: { text_after: '（你拜完转身。身后水声一荡——你回头，那颗珠子跟着你「漂」出来了，停在牢门外，明明灭灭。鲛人的歌声远远传来，是笑的意思。守了代代的珠，等的就是「不取」的人。）', item_add: [{ id: 'item_longgong_zhu', name: '龙宫遗珠', desc: '它自己跟你出来的。取珠者还珠有期——可它是自己走的，那就算「珠还」给它的缘分。' }], beast_seen: 'beast_jiuying' } },
      { label: '探查水牢四周的刻纹', effect: { beast_seen: 'beast_jiuying', text_after: '（牢壁刻纹里有爪痕——三指，深三寸。和昆吾矿道七号支洞的爪印一样。牢里原来关的不是珠，是「东西」。珠是镇物。你看到这里，脊背一阵发凉——那东西现在去哪了？）', flags: { jiuying_xian: true } } },
      { label: '取珠就走', effect: { text_after: '（你把珠子摘下来。整个回廊的夜明珠，同时灭了。黑暗里，很深的地方，传来一声「叹息」——不是风，不是水。你游得很快。身后，水牢门「哐」地合上了——它合上，是「放行」的意思。鲛人代代守的账，记在你名下了。）', item_add: [{ id: 'item_longgong_zhu', name: '龙宫遗珠', desc: '从水牢里取的。鲛人的账上，你名下多了一笔「还珠有期」。' }], ledger: { type: '债', text: '取走龙宫镇珠，欠鲛人一族还珠有期' } } },
    ],
  },
  ev_lg_jiaoren_ge: {
    id: 'ev_lg_jiaoren_ge', nodes: ['lg_jiaoluo'], weight: 4,
    text: '鲛人聚落的歌声穿过珊瑚丛。长老接见了你——她眼瞳是深海的蓝，看了你很久，开口是古老的语调，翻译过来只有一句："陆上来的人，你带「礼」了吗？我们不要东西。我们要「话」——陆地上的话，海里人听不到的。"',
    options: [
      { label: '把陆地上的事讲给她听：讲市井，讲人情', effect: { text_after: '（你讲了半个时辰。讲东市的吆喝，讲四牌楼的灯，讲雪夜的饼。鲛人们围拢来听，织网的手都停了。长老听完，落了一滴泪——泪珠落进你掌心，是温的。"三百年没人跟我们讲过「人间」了。"她说，"这个给你。它认「讲真话的人」。"）', item_add: [{ id: 'item_jiaorenlei', name: '鲛人泪', desc: '长老落的泪，凝成的珠。鲛人向导的眼泪能换一次深潜——可她已经把它给了你。' }], ledger: { type: '恩', text: '为鲛人遗族讲了半个人间' } } },
      { label: '问她：龙宫为什么沉？', effect: { text_after: '（她的歌声停了。"海啸那夜，龙宫的王把整座宫「按」进了海底——为了压住宫底下的「东西」。"她看着你，"宫沉了，海救了。这就是「归还」的意思——拿一整座宫，还一片海。你们陆地上的人，懂这个道理的，不多。"）', flags: { longgong_chen: true } } },
      { label: '帮鲛人修了一下午织网', effect: { text_after: '（你的手笨，可你肯学。修完网，一个鲛人孩子把一颗夜光贝塞给你，跑了。长老笑："孩子们认你。以后你在这片海，水深的地方，「网」会托着你。"）', beast_seen: 'beast_shangui' } },
    ],
  },
  // ---------- 南海商路 ----------
  ev_nh_haishi_shen: {
    id: 'ev_nh_haishi_shen', nodes: ['nh_haishi'], weight: 4,
    text: '海市最深处，一个摊位卖「蜃景」——牙人手一挥，空气里浮现出一座城：飞檐、宫墙、街上行人如织。"真货。"牙人说，"蜃景里的城，是「曾经存在过」的城。买回去，夜里能「走进去」——进去的人，说在里面住了一辈子。"',
    options: [
      { label: '问价', effect: { text_after: '（"十两。"牙人说，"便宜吧？可丑话说前头：进去的人，「回来」的不到一半。不是城吃人——是有人进去之后，「不想回来」了。"他看着你，"客人，你有什么「放不下」的？"你没答。他也不追，"想好了再来。"）', item_add: [{ id: 'item_shenjing_pian', name: '蜃景残片', desc: '牙人没卖给你，却塞给你一小片碎琉璃："送你的。梦里有用。"' }] } },
      { label: '盯着蜃景里的城看——看城墙的纹路', effect: { chance: 0.4, success: { text_after: '（你看着看着，认出来了——那城墙的纹路，和你袖中录里记过的一处古迹对得上。这座城「曾经存在」——不是传说，是真实存在过、后来沉没消失的。蜃景是它的「回声」。你把这个发现记进袖中录时，手是抖的。）', sleeve_add: true, stat: { wuxing: 2 } }, fail: { text_after: '（你看了很久，没看出名堂。牙人收了手，城散成一片雾。"看不出来就对了——看出来的人，就「走不出去」了。"）' } } },
      { label: '摇头走开', effect: { text_after: '（你走开几步，又回头——牙人正对着下一位客人挥手，空气里又浮现一座「城」。这一次的城，你在哪儿见过……你想不起来。你走得更快了。）' } },
    ],
  },
  ev_bc_yaomen_wu: {
    id: 'ev_bc_yaomen_wu', nodes: ['bc_yaomen'], weight: 4,
    text: '入坞的山门外，一个药农守着小摊卖鲜药，摊上那筐「七叶一枝花」还带着露水。他招呼你："客人进坞？带一把鲜药吧——坞里的规矩，进山不空手，空手山不认。"',
    options: [
      { label: '买一把鲜药进坞', cond: { moneyMin: 1 }, effect: { money: -1, text_after: '（你接过药筐。他压低声音："雾大的时候走田埂，别走谷底——谷底的雾，是「沉」的。"）', item_add: [{ id: 'item_xianyao', name: '鲜药一把', desc: '带着露水的七叶一枝花。药香提神。' }], trait: { xin: 1 } } },
      { label: '问谷底的雾为什么「沉」', effect: { text_after: '（他往山谷望了一眼："老话说，药谷底下压着一位「老药王」。他咳一声，谷底的雾就浓一分。"他笑了笑，"信不信由你。反正采药人不进谷底。"）', beast_seen: 'beast_renshen', trait: { cha: 1 } } },
      { label: '道谢进坞', effect: { text_after: '（你进了山门。药香扑面的一瞬，你听见身后他把摊子挪了个位置——像是不愿让雾里的什么东西「看见」他的货。）' } },
    ],
  },
  ev_bc_kezhan_ke: {
    id: 'ev_bc_kezhan_ke', nodes: ['bc_kezhan'], weight: 4,
    text: '客栈半夜，隔壁房传来压抑的呻吟。掌柜的敲门问你："客人，你懂药吗？楼上那位药商淋了雨，高热说胡话——他随从连夜下山请医了，可这山路……"',
    options: [
      { label: '去看看，能帮则帮', effect: { chance: 0.6, success: { text_after: '（你用学过的方子给他物理降温、煎了发汗的药。天亮时他热退了，拉着你连声道谢，从货箱里取出一小包东西硬塞给你："南洋的胡椒——路上买的，不值什么，是个心意。"）', item_add: [{ id: 'item_hujiao', name: '南洋胡椒', desc: '药商答谢的稀罕物。煮汤放一点，暖。' }], ledger: { type: '恩', text: '客栈半夜救急药商' }, stat: { wuxing: 1 } }, fail: { text_after: '（你守了半夜，能做的都做了。天亮时随从请的医师赶到，说你「稳对了方向」。药商脱离了险——你累得在走廊上睡着了。）', hp: -10 } } },
      { label: '给掌柜出个法子：姜汤先顶上', effect: { text_after: '（掌柜的依言煮了姜汤。天亮时他专门来谢你："高热的人最怕脱水——你这法子救了急。"他给你免了三天的房钱。）', ledger: { type: '恩', text: '客栈姜汤救急，免房钱三日' } } },
      { label: '睡自己的觉', effect: { text_after: '（你翻了个身。呻吟声到后半夜停了——天亮你才知道，人没事了。你松了口气，又有点说不清的空落。）' } },
    ],
  },
  ev_cl_chuanwu_xiu: {
    id: 'ev_cl_chuanwu_xiu', nodes: ['cl_chuanwu'], weight: 4,
    text: '船坞里在拆一条旧船——船龄六十年，海难后被打捞上来的。老船师撬开船底的龙骨护板，忽然停了手：护板内侧刻着一行小字，漆都掉光了，笔画还在。',
    options: [
      { label: '凑近辨认刻字', effect: { text_after: '（八个字："海不归人，人自归之。"老船师盯着看了很久："这是造船人的「压舱字」——船主把命交给了船，船主把话留给了木头。"他让你帮忙把这行字拓下来，"这种字，该进海神庙的碑廊。"）', sleeve_add: true, stat: { wuxing: 1 } } },
      { label: '帮老船师拆完这条船', effect: { text_after: '（你搭了一天手。收工时他递给你一块船板边角料："老船的木头，干了六十年——做个小物件，比新木头「沉」。"）', item_add: [{ id: 'item_chuanban', name: '老船木牌', desc: '船师赠的老船边角料，摸着「沉」。' }], ledger: { type: '记', text: '船坞帮工一日，得老船木' } } },
      { label: '问这条船的海难', effect: { text_after: '（老船师的话很少："六十年前，黑风夜。船上的人，一半进了海，一半回了村。这条船是被海「还」回来的——海欠他们的。"他不再说了。有些账，船知道。）', beast_seen: 'beast_shangui' } },
    ],
  },
  ev_kw_gongfang_tie: {
    id: 'ev_kw_gongfang_tie', nodes: ['kw_gongfang'], weight: 4,
    text: '铸剑世家工坊的侧门开着——门房不在。院墙里传来少年们练锤的声音，一声一声，比外头的炉子都齐整。你探头看了一眼：一个老仆正在院角，默默修一把断成两截的剑。',
    options: [
      { label: '蹲下来看老仆修剑', effect: { text_after: '（他修得很慢。你看了一会儿，忍不住说"这里接缝要留一口气"——老仆抬眼看了你一下："客人懂行。这把剑，是家主年轻时断的。修好它，是家主立的「功课」——他每天看一眼，看自己当年错在哪。"）', stat: { wugongXiuwei: 10 }, trait: { chi: 1 } } },
      { label: '投帖求见世家主', effect: { text_after: '（门房回来了，接过名帖看了一眼："家主一年铸三剑，铸谁的剑看缘。帖子留下了——有回音，是缘；没回音，也是缘。"他把帖子压在一摞帖子最底下。那摞，有半人高。）', flags: { gongfang_tie: true } } },
      { label: '退出去——深宅不可窥', effect: { text_after: '（你退出来时，练锤声齐齐停了一瞬——像是少年们都朝门这边看了一眼。然后锤声重新响起，比刚才更响。）' } },
    ],
  },
  ev_qd_yihui_yi: {
    id: 'ev_qd_yihui_yi', nodes: ['qd_yihui'], weight: 4,
    text: '岛主议会吵翻了——两条船同时发现了同一艘沉船，都「插了旗」。年长的岛主一拍桌子："吵什么！旗是死的，船是活的，人呢？人捞上来了没有！"满堂安静。他看见门口的你："外来的客人，你说，该怎么办？"',
    options: [
      { label: '"先救人，再分货。"', effect: { text_after: '（满堂岛主看着你。年长的岛主大笑了三声："好！海盟的规矩，就该这么简单！"他当场定约：救人有份的，分货有份。散会后他单独找到你："客人，海盟缺个「讲理的外人」——调解争端，走一趟三千文。干不干？"）', ledger: { type: '恩', text: '岛主议会一句公道话，海盟记之' }, flags: { haimeng_tiaojie: true } } },
      { label: '"谁先到的，货归谁。"', effect: { text_after: '（年长的岛主摇头："客人，海上的「先到」，说的是第一个跳进水里的人——不是第一个插旗的人。"他还是有条不紊地安排了打捞。你没得到什么，但记住了这句话。）', trait: { wu: 1 } } },
      { label: '不语——外人不好插嘴', effect: { text_after: '（你摇头退到门外。吵声重新响起。你听见年长岛主的声音穿透嘈杂："都少说一句——先捞人！"）' } },
    ],
  },
  ev_nh_bujidao_jiu: {
    id: 'ev_nh_bujidao_jiu', nodes: ['nh_bujidao'], weight: 4,
    text: '补给岛酒肆的角落里，坐着一个满手老茧的海客。他不说话，只喝酒——桌角放着一枚铜铃，锈得看不出形制。岛友低声告诉你："从「勿念」以南回来的。整条船就回来他一个。回来后，一句话都没有。"',
    options: [
      { label: '坐过去，替他满上，不说话', effect: { text_after: '（你陪他坐了一个时辰。他终于开口，声音哑得像生锈："……你们这儿的酒，是甜的。"他没再说别的。走时他把铜铃推给你："拿着。听见它响，别回头。"）', item_add: [{ id: 'item_xiuling', name: '哑铃（南海）', desc: '沉默海客赠的锈铃。"听见它响，别回头。"' }], trait: { yin: 2 } } },
      { label: '问他南边有什么', effect: { text_after: '（他抬起布满血丝的眼睛看了你很久，忽然笑了一下——比不笑还让人心里发毛。"南边？"他说，"南边什么都有。就是没有「回」这个字。"他继续喝酒。你回自己桌上去时，背后一直有点凉。）', beast_seen: 'beast_shangui', trait: { jue: 1 } } },
      { label: '不打扰', effect: { text_after: '（你喝完自己的酒。走时你看见岛友把一盘热菜放到那海客桌上——他没抬头，可筷子动了。海上的人不问来路，只添饭。）' } },
    ],
  },
  // ---------- 妖兽遭遇 ----------
  ev_beast_junma: {
    id: 'ev_beast_junma', nodes: ['tw_mashi'], weight: 4,
    text: '马市的角落里有匹斑白老马，骡马贩子想贱价出手。你走近时，它抬起头——那眼神不像牲口，像「老兵」。',
    options: [
      { label: '喂它一把豆料', effect: { flags: { fed_beast_junma: true }, text_after: '（它吃得很慢，吃完用鼻子顶了顶你的胸口——军马认人，先认「手稳不稳」。骡马贩子在旁边看傻了："这畜生三年不让生人碰！"）', beast_seen: 'beast_junma' } },
      { label: '降服它，结为坐骑', effect: { beast_capture: 'beast_junma' } },
      { label: '跟贩子讲价，花钱买', cond: { moneyMin: 8 }, effect: { money: -8, beast_capture: 'beast_junma', text_after: '（八两银子，贩子乐得合不拢嘴。老马走的时候回头看了马市一眼——看了很久。退役的老兵离开军营，大概也是这样。）' } },
    ],
  },
  ev_beast_pixiu: {
    id: 'ev_beast_pixiu', nodes: ['kw_kuangshi'], weight: 3,
    text: '矿石市一阵骚乱——个圆滚滚的小东西窜过摊位，见了亮的东西就「收」：铜钱、碎银、矿工的铜扣子，来者不拒。"貔貅崽！是貔貅崽！"有人喊，"抓住它值一百两！"',
    options: [
      { label: '把自己袖里的碎银摊开给它', effect: { beast_seen: 'beast_poxiao', flags: { fed_beast_poxiao: true }, money: -1, text_after: '（它盯着你的碎银，喉咙里咕噜咕噜响——那不是「抢」，是「交换」的意思。它从嘴里的「收藏」吐出来一样东西还你：一小块金光闪闪的矿渣。众人大哗——这矿渣是「狗头金」！）', item_add: [{ id: 'item_goutoujin', name: '狗头金', desc: '貔貅崽拿碎银换给你的天然金块——交易公平，童叟无欺。' }] } },
      { label: '降服它', effect: { beast_capture: 'beast_poxiao' } },
      { label: '帮着追——一百两呢', effect: { beast_seen: 'beast_poxiao', chance: 0.3, success: { text_after: '（你堵住巷口，一把薅住了它——软的，暖的，圆的。它在你手里挣了两下，忽然不动了，用一双圆眼睛看你。一百两……你看着那双眼睛，手松了。"算了。"你把它放上墙头。它跑远之前，回头看了你一眼——那眼神你后来想了很多年。）' }, fail: { text_after: '（它钻进矿洞不见了。你在洞口站了半天——矿洞深处黑黢黢的，有风声，像「吞」什么东西的声音。你退了出来。）' } } },
    ],
  },
  ev_beast_xianhe: {
    id: 'ev_beast_xianhe', nodes: ['bc_yaotian', 'qd_wangxianya'], weight: 3,
    text: '一只白顶仙鹤落在你面前的田埂上，单腿立着，歪头看你——药田的草人「防」的就是它。可它一点不怕人，反而朝你走了两步。',
    options: [
      { label: '静静站着，不动', effect: { chance: 0.5, success: { text_after: '（你站着。它看了你半晌——鹤认人，认的是「静气」。然后它收拢翅膀，在你身边站定了，像老友。）', beast_capture: 'beast_xianhe' }, fail: { text_after: '（它看了你半晌，展翅飞走了。飞过一个田垄时，它掉了一根羽毛——是「赠」的意思。你接住了。）', beast_seen: 'beast_xianhe', item_add: [{ id: 'item_heyu', name: '鹤羽', desc: '白顶仙鹤相赠。药王庙的庙祝见了说："此物泡酒，明目。"' }] } } },
      { label: '喂它灵芝——你舍不得，可你喂了', cond: { moneyMin: 3 }, effect: { money: -3, beast_capture: 'beast_xianhe' } },
      { label: '追着摸一把羽毛', effect: { beast_seen: 'beast_xianhe', chance: 0.2, success: { text_after: '（你追了三垄田，摔了两个跟头，最后摸到了一把羽尖——它蹬开你，飞走了，回头叫了一声，像骂人。可你摸到的那几根羽毛还在手里！）', item_add: [{ id: 'item_heyu', name: '鹤羽', desc: '追着摸来的，带着泥。' }] }, fail: { text_after: '（它振翅而起。你摔在田里，满身泥。远处田户笑得直不起腰："鹤是能追的？！后生，那叫「望仙」——你得让它来看你！"）' } } },
    ],
  },
  ev_beast_jiao: {
    id: 'ev_beast_jiao', nodes: ['cl_aogang', 'lg_gongmen'], weight: 2,
    text: '退潮的滩涂上，你看见一条墨绿的「大鱼」搁浅了——鳞片在夕阳下泛蓝光。它的呼吸很沉重。滩上的渔民远远围着，没人敢靠近："是蛟……幼蛟。它娘肯定在深海里看着呢。"',
    options: [
      { label: '把水泼在它身上，守着等涨潮', effect: { beast_seen: 'beast_jiao', chance: 0.6, success: { text_after: '（你舀水泼了半个时辰。涨潮时分，它缓过来了，绕着你游了三圈，用吻部顶了顶你的手腕——蛟认主，认的是「血里的水气」。然后它沉入海中，海面平静如镜。渔民们都说你「疯了」——可海记得你。）', beast_capture: 'beast_jiao' }, fail: { text_after: '（涨潮了。它缓过来，看了你一眼——那一眼很复杂。然后它沉入海中。海面平静如镜，像什么都没发生过。可你手心还留着它吻部顶过的触感。）' } } },
      { label: '招呼渔民一起推它回海', effect: { beast_seen: 'beast_jiao', text_after: '（十几个人一起上手，浪一来，它滑进了海里。它回头望了一眼——这一望，全体渔民在滩上跪了一片："海神爷显灵了！"只有你知道，那不是神。那就是一条被打动的幼蛟。）', ledger: { type: '功德', text: '率渔民救搁浅幼蛟' } } },
      { label: '剥鳞——这是钱', effect: { beast_seen: 'beast_jiao', chance: 0.5, success: { text_after: '（你下手的时候，它没有挣扎。它只是看着你。鳞剥下来三片，你的手一直在抖。远处海面，一道水线无声无息地立起来，又无声无息地落下去——它娘看见了。你攥着鳞片逃也似地离开滩涂。钱是有了。可那天夜里，你梦见整片海压下来。）', items: [{ id: 'mat_jiaolin', name: '蛟鳞', desc: '三片剥来的蛟鳞，带着腥咸。材料是真的——你的手也一直记得。', evil: true }], ledger: { type: '业', text: '滩涂剥蛟鳞，海记下了' } }, fail: { text_after: '（你的刀刚落下，它尾巴一扫——你飞出去两丈远，趴在滩上。它挣起来，拖着伤入海。走前它看了你一眼：不是恨，是「记住了」。你扑空咬了一嘴沙。打消念头吧——有些钱不是钱。）', hp: -15 } } },
    ],
  },
  ev_beast_shangui: {
    id: 'ev_beast_shangui', nodes: ['shanlu', 'bc_yaotian'], weight: 3,
    text: '山路转弯处，一个浑身黑毛的「人」蹲在路中央，捧着一把野果吃。它看见你，不躲也不跑——只是把果子掰了一半，扔给你。',
    options: [
      { label: '接住，吃了，蹲下跟它一起吃', effect: { beast_seen: 'beast_shanxiao', chance: 0.6, success: { text_after: '（果子酸得咧嘴，你还是吃完了。它很满意，吃完拍拍你的肩膀——山魈认人，认的是「肯分食的」。它站起来，朝山里指了指，意思很明白："跟我走。"）', beast_capture: 'beast_shanxiao' }, fail: { text_after: '（你吃了果子。它歪着头看你半晌，起身进山了——走了几步又回头看你，像在「遗憾」。缘分差了半口。）' } } },
      { label: '跟它进山看看', effect: { beast_seen: 'beast_shanxiao', text_after: '（它带你走了两条你从没见过的近道，指给你三个「埋果子」的记号，最后蹲在崖边，看夕阳，看你。日落时它拍拍你，往山里去了。你下山时发现——这条路，比猎户的地图近了半个时辰。山魈交朋友，用路交。）', flags: { shanxiao_lu: true } } },
      { label: '退开——野物不可信', effect: { beast_seen: 'beast_shanxiao', text_after: '（你退开。它也不恼，继续吃它的果子。你走出很远回头，它还在原地蹲着——分食的一半果子，放在一块干净的石头上。是留给你的。）' } },
    ],
  },
  ev_beast_qiongqi: {
    id: 'ev_beast_qiongqi', nodes: ['hq_luanzangling'], weight: 2,
    text: '乱葬岭的夜里，白影出现了——比传闻里大得多。它站在一座无碑的坟前，一动不动。它听见你来了，没有回头。你心里那点没咽下去的恨，忽然烧了起来——它在看的地方，你太熟了。',
    options: [
      { label: '走过去，和它并排站', effect: { chance: 0.5, success: { text_after: '（你没有带刀。它侧过头，盯着你眼睛里那点恨，看了很久——然后打了个哈欠，趴下了。凶兽的信任，从「同类」开始。从这夜起，乱葬岭的白影有了名字，也有了去处。）', beast_capture: 'beast_qiongqi_cub', ledger: { type: '缘', text: '乱葬岭与穷奇幼崽结缘，同类相认' } }, fail: { text_after: '（它盯着你的眼睛看了很久——摇头了。你的恨还不够「干净」：掺了怕，掺了悔。它起身走了，走前用爪子在那座坟头拍了拍，像安魂。你站到天亮。）', beast_seen: 'beast_qiongqi_cub' } } },
      { label: '问它：你在记什么？', effect: { beast_seen: 'beast_qiongqi_cub', text_after: '（它当然不会答。可它让开了半个身位——你顺着它的视线看那座坟：坟头没有草。有人常来「坐」。来的不是它。是……谁？你把这个疑问收进袖中录。）', flags: { luanz_fen: true } } },
      { label: '拔刀——凶兽当除', effect: { beast_seen: 'beast_qiongqi_cub', chance: 0.2, success: { text_after: '（刀出鞘的瞬间它消失了。你的刀劈在夜风里。身后传来一声轻嗤——像在笑你的「勇」。然后夜静了。你握着刀站了半个时辰，手心的汗把刀柄都浸湿了。）' }, fail: { text_after: '（刀出鞘的瞬间，白影欺身而至——快得你根本没看清。一爪拍飞你的刀，一爪把你拍进草窠。它俯视着你，眼里没有怒——只有「不屑」。然后它走了。你在草窠里躺到后半夜，肋骨疼得像断了两根。）', hp: -30 } } },
    ],
  },
  ev_beast_kuiniu: {
    id: 'ev_beast_kuiniu', nodes: ['kw_jianshan'], weight: 2,
    text: '七号矿道的塌方口，一头独脚巨牛立在那里——矿工们全跑光了。它单脚立着，独眼映出你的影子。吼声还没出，山道已经在「嗡」。',
    options: [
      { label: '不跑。抱拳，行矿工的礼', effect: { beast_seen: 'beast_kuiniu', chance: 0.4, success: { text_after: '（你拜下去。它的独眼里映着你弯下去的影子——影子是直的。它吼声没出，收了。然后它单脚一蹬，消失在矿道深处。矿工们回来时都说你命大。只有你知道：是「礼」救了山道。）', ledger: { type: '功德', text: '矿道礼退夔牛，保七号矿洞' } }, fail: { text_after: '（你拜下去。它的独眼盯着你的影子——影子在抖。「抖」不是罪，可它认不出抖的东西。它一声低吼，你被音浪掀出三丈远，趴在碎石上，耳中嗡嗡了半日。）', hp: -25 } } },
      { label: '退——跑得越远越好', effect: { beast_seen: 'beast_kuiniu', text_after: '（你跑出半里地，身后一声雷吼，山道塌方声轰隆作响。回头时，七号矿道没了。矿工们后怕了三天。他们说，夔牛的「起床气」半年一次，"今年这个，是被人惹的"。）' } },
      { label: '猎它——夔牛皮，十倍价', effect: { beast_seen: 'beast_kuiniu', chance: 0.15, success: { text_after: '（你和它周旋了三个时辰。最后它倒下的时候，独眼一直看着你。你剥皮的手，从热到冷。夔牛皮在手里沉得像一座山——不是皮的重量。那天夜里你听见山在「哭」，哭声很低，只有你听得见。）', items: [{ id: 'mat_kuiniu_pi', name: '夔牛皮', desc: '一张完整的夔牛皮。工坊出十倍价——可它沉得像一座山。', evil: true }], ledger: { type: '业', text: '猎杀夔牛取皮，山记下了' } }, fail: { text_after: '（你刚亮出兵刃，它的吼声先到了——音浪如墙，你被掀出去五丈，五脏六腑像换了个位置。你趴在碎石上吐了半天，它从你身边走过，单脚落地，一步一声闷雷——它没杀你。它不屑。）', hp: -40 } } },
    ],
  },
  ev_beast_hanshi: {
    id: 'ev_beast_hanshi', nodes: ['tw_huangyi', 'kw_kuangshi'], weight: 3,
    text: '荒驿的墙角结着一片白霜——荒漠里哪来的霜？你凑近看，霜里蜷着一条白虫，通体透明，吐的丝在寒气里发亮。',
    options: [
      { label: '把手伸过去，掌心向上', effect: { beast_seen: 'beast_hanshi', chance: 0.55, success: { text_after: '（它迟疑了一下，爬上你的掌心，吐了一口丝——冰凉，可你的手稳稳的。冰蚕认人，认的是「手心的温度稳不稳」。它认定了你的手。）', beast_capture: 'beast_hanshi' }, fail: { text_after: '（它在你的掌心吐了一口丝——然后爬走了。冰蚕「焐」过的矿渣会成寒铁，可它没看上你的手。你在原地搓了半天手心——不是冷，是惋惜。）' } } },
      { label: '收它吐在矿渣上的丝', effect: { beast_seen: 'beast_hanshi', text_after: '（你收了一缕寒髓丝——它吐在废渣上的，本就是「弃物」。它看着你收，透明身体里的芯一明一暗，像点头的意思。）', item_add: [{ id: 'mat_hansui_si', name: '寒髓丝', desc: '冰蚕弃丝一缕，缠在剑柄上，暑天也不化。' }] } },
      { label: '戳它一下', effect: { beast_seen: 'beast_hanshi', chance: 0.3, success: { text_after: '（你戳了——指尖结了一小片白霜，麻了半天。它蜷得更紧了。荒驿的老驿卒路过："后生，那东西挡了咱们的道？不。是咱们修的路，占了它祖上的家。"）' }, fail: { text_after: '（你的手指刚碰到，一股寒气直冲指尖——整条手臂麻了半个时辰。老驿卒递给你一碗热汤："冰蚕不咬人。它「记仇」的方式，就是让你冷一会儿。"）', hp: -8 } } },
    ],
  },
  ev_beast_renshen: {
    id: 'ev_beast_renshen', nodes: ['bc_yaotian'], weight: 2,
    text: '你在药田田埂上打盹，迷迷糊糊觉得有人拽你的衣角——睁眼一看，一个三寸高的小人儿，白胖，头顶一簇红缨子似的须，正拽着你的袖子往田里「请」。',
    options: [
      { label: '任它拽——看看它要去哪', effect: { beast_seen: 'beast_renshen', text_after: '（它把你拽到田垄最深处——一块石头后面藏着一丛老参，六品叶，几十年份。它拍拍参叶，又拍拍你的手背，意思是「看好了，这是我们的」。然后它钻进土里不见了。你守着这个秘密——药田底下，有一窝「它们」。）', flags: { renshen_wo: true }, stat: { xiwei: 10 } } },
      { label: '出手——几十年份的老参！', effect: { beast_seen: 'beast_renshen', chance: 0.25, success: { text_after: '（你一把薅住了它！它在手里尖叫挣扎——声音像婴儿哭。你攥着它，它哭着。半晌，你把它放回土里。"走吧。"你说。它钻进土里，钻到一半，回头看了你一眼。那天夜里你睡得格外沉——药田的雾，都比往日甜。）', trait: { ren: 3 } }, fail: { text_after: '（它一缩，从你指缝里滑出去了，钻进土里。你挖了三尺，什么都没有——田垄合拢如初。老人们说过：强留地精，灵气尽散。你若真挖着了，得的就是一块「老参」，失的是一窝「它们」。老天爷没给你这个造孽的机会。）' } } },
      { label: '装睡', effect: { beast_seen: 'beast_renshen', text_after: '（你装睡。它拽了两下没拽动，「叹」了口气——地精会叹气！——然后有一只小手在你额头拍了两下，像大人哄小孩。你忍着没笑出声。它走了以后你才发现，掌心里多了一粒参籽。）', item_add: [{ id: 'item_shenzi', name: '参籽', desc: '人参娃娃拍你额头时落下的。种下去，长不长得出来，看缘。' }] } },
    ],
  },
  ev_beast_shangui2: {
    id: 'ev_beast_shangui2', nodes: ['hq_yaorenfang'], weight: 2,
    text: '妖人坊的后院，一个「半化的孩子」蹲在墙角——耳朵是兽耳，眼睛却干净得吓人。他手里攥着半块饼，看见你，把饼往身后藏了藏。',
    options: [
      { label: '把身上的干粮全给他', effect: { text_after: '（他盯着干粮看了很久，没接。"娘说，白拿的东西有钩子。"他忽然说。你撕开干粮包装，自己先咬了一大口，把剩下的递过去。他这才接了。你离开坊子时，他追出来，往你手里塞了一样东西——一枚「妖骨哨」，"吹这个，东荒的兽都认。"）', item_add: [{ id: 'item_yaogu_shao', name: '妖骨哨', desc: '半妖孩子给的。"吹这个，东荒的兽都认。"' }], ledger: { type: '恩', text: '妖人坊分粮半妖孩童' } } },
      { label: '问他：你怎么不上街？', effect: { text_after: '（"街上人扔石头。"他说得平静，"坊里好。坊里都一样。"你想起小时候。你们两个蹲在墙角，谁也没说话——可那个下午，比很多场谈话都长。）', trait: { ren: 1 } } },
      { label: '报给坊里管事', effect: { text_after: '（管事的领走了孩子。临走孩子回头看了你一眼——那眼神不是感谢。你忽然有点后悔。有些事，「管」字一出口，就变了味。）' } },
    ],
  },
};
