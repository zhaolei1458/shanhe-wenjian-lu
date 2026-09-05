// ============================================================
// 山河问剑录 · 内容/五期事件（跨世回响 + 大因果 + 心魔）
// 04 册 §3.2/§3.3：大因果改区域状态；跨世回响每世限一两次。
// ============================================================

export const EVENTS5 = {
  // ---------- 跨世回响：恩人的后代（cond.crossSaved） ----------
  ev_kuashi_en: {
    id: 'ev_kuashi_en', title: '面善的陌生人', weight: 2,
    nodes: ['chengmen_dashi', 'yh_changjie', 'lj_shuimen', 'guandao'],
    cond: { flags: ['crossSaved'] },
    text: '一位老者在街口叫住你，端详了半晌："后生……冒昧问一句，你家祖上，可曾行过医、救过人？"\n他浑浊的眼睛忽然亮了："像。太像了。我祖父临终前念叨了一辈子——说当年有个人救了他全家，连姓名都没留。他说那人面相有个记号……"\n他说不出记号是什么，你也说不清自己为什么站着没走。老者执意塞给你一个钱袋："不为什么。我祖父说了，见着面善的行路人，替他暖一暖手。"',
    options: [
      { label: '郑重收下，替那位"恩公"道谢', effect: { money: 6, trait: { ren: 1 }, flags: ['crossEchoSeen'] }, text_after: '老者走远了。你低头看那个钱袋，针脚很旧——是缝补过许多次的那种旧。这世上有人的谢意，隔了一辈人还在赶路。' },
      { label: '推辞不受，只受了那句"面善"', effect: { trait: { xia: 1 }, flags: ['crossEchoSeen'] }, text_after: '你把话听完了，钱袋没接。老者也不勉强，笑着作揖去了。奇怪的是，这一整天你心里都是暖的——像有人替你把一件旧债，还成了新的人情。' },
    ],
  },

  // ---------- 跨世回响：仇家的后人（cond.crossEnemy） ----------
  ev_kuashi_chou: {
    id: 'ev_kuashi_chou', title: '看一眼仇人长什么样', weight: 2,
    nodes: ['chengmen_dashi', 'yh_changjie', 'guandao', 'tw_guanqiang'],
    cond: { flags: ['crossEnemy'] },
    text: '一个白发老者带着孙儿拦在路前。他不拦别人，只拦你。\n"不必紧张。"他声音很平，"我找了一辈子，就为了带孙子来看一眼——看看仇人长什么样。"\n他孙儿怯生生躲在他身后。老者看着你，看了很久，忽然叹了口气："……原来也是个普通人。"\n他摆摆手，像卸下一担水："罢了。债是上一辈的，路是这一辈的。走吧。"',
    options: [
      { label: '深深一揖，一言不发', effect: { trait: { yi: 1 }, flags: ['crossEchoSeen'] }, text_after: '老者怔了怔，还了你半揖。两代人的账，在两个人都不说话的地方，两清了。' },
      { label: '把当年的事原原本本讲给他听', effect: { flags: ['crossEchoSeen'], ledger: { type: '怨', text: '向仇家后人陈清了当年之事——旧账说了破，可说了' }, resolved: true }, text_after: '你讲了很久。讲到一半，老者摆手止住你："不用讲了。我等这一句，等了四十年。"他拉着孙儿走了，背影比来时直了一些。' },
    ],
  },

  // ---------- 心魔劫（不饮孟婆汤者，GDD §6.3：心魔即旧账） ----------
  ev_xinmo: {
    id: 'ev_xinmo', title: '心魔', weight: 3,
    nodes: ['chengmen_dashi', 'yh_changjie', 'lj_shuimen', 'guandao', 'tw_guanqiang', 'bc_yaomen'],
    cond: { flags: ['xinmo_zhong'] },
    text: '夜里你做了个梦。梦里没有脸，只有一句话，翻来覆去地问——问的是你上辈子没答完的那件事。\n惊醒时天还没亮，你坐在炕上喘气，像刚从水里被人捞出来。那块"焐不化的东西"还在心里，今晚它翻了个身。',
    options: [
      { label: '点灯静坐，与它对峙到天明', effect: { trait: { chi: 1 }, hp: -5 }, text_after: '你与那块东西对坐了一夜。天亮时它没化，但它退了半寸——心魔怕的不是强者，是不肯睡的人。' },
      { label: '起身出门，走到哪里算哪里', effect: { hp: -2, flags: ['xinmo_wander'] }, text_after: '你在晨雾里走了很远。回来时天光大亮，心里的东西沉了下去——没消失，只是学会了安静。有些债，要用日子慢慢还。' },
    ],
  },

  // ---------- 大因果：瘟疫救人（区域改写·百草坞） ----------
  ev_baicao_wenyi: {
    id: 'ev_baicao_wenyi', title: '瘟疫来了', weight: 2,
    nodes: ['bc_yaomen', 'bc_yaoshi', 'bc_yaowangmiao'],
    text: '药市大街的吆喝声停了。三天之内，坞里咳声四起，药王庙前的长队从殿门排到巷口——瘟疫来了。\n老药师看着你："坞里药力只够一半人。要么按户分发，谁家先病谁先得；要么凑给病重的一线希望——博一把。"',
    options: [
      { label: '按户分发，不落一户', effect: { trait: { ren: 2 }, ledger: { type: '善', text: '瘟疫之年按户施药，百草坞一户未落' }, resolved: true, region: { place: 'baicao', state: 'prosper', note: '百草坞瘟疫之年得活人无数——坞门后来为你留了块匾的位置' } }, text_after: '药发下去，病退了。秋后坞里凑钱在药王庙前立了块碑，碑上刻的名字里有你。那年冬天的药市，比哪一年都热闹。（百草坞·兴）' },
      { label: '孤注一掷，先救重症', effect: { chance: 0.6, success: { trait: { ren: 1, xia: 1 }, ledger: { type: '善', text: '瘟疫之年孤注一掷，重症尽活——赌赢了' }, resolved: true, region: { place: 'baicao', state: 'prosper', note: '那一把赌赢了，百草坞的药香比往年都浓' } }, fail: { ledger: { type: '怨', text: '瘟疫之年孤注一掷，重症没救回来，按户的人家也误了' }, region: { place: 'baicao', state: 'ruin', note: '那一把没赌赢。有些门后来关了，再没开过' } }, text_after: '' }, text_after: '' },
    ],
  },

  // ---------- 大因果：白灾围城（区域改写·铁瓦关） ----------
  ev_tiewa_baizai: {
    id: 'ev_tiewa_baizai', title: '白灾围城', weight: 2,
    nodes: ['tw_guanqiang', 'tw_mashi', 'tw_huangyi'],
    text: '大雪下了七天七夜，关外的商路全断了。城里的柴价一天翻一倍，马市上开始有人卖鞍具换粮——白灾围城，就在眼前。\n守将的告示贴在关墙上：征志愿运粮队，出关一趟，赏十贯。告示下没几个人站住脚。',
    options: [
      { label: '应征出关，走一趟雪线', effect: { chance: 0.55, success: { money: 10, trait: { xia: 2 }, ledger: { type: '善', text: '白灾围城时应征运粮，雪线三进三出' }, resolved: true, region: { place: 'tiewa', state: 'prosper', note: '白灾那年运粮队踩出来的路，后来成了官道' } }, fail: { hp: -40, ledger: { type: '伤', text: '雪线运粮，冻掉了半根脚趾——粮送到了' }, resolved: true, region: { place: 'tiewa', state: 'prosper', note: '粮是送到了。代价记在你的骨头上' } }, text_after: '' }, text_after: '' },
      { label: '组织街坊匀粮设粥棚', effect: { money: -4, trait: { ren: 2 }, ledger: { type: '善', text: '白灾之年领头设粥棚，全坊无一人饿死' }, resolved: true, region: { place: 'tiewa', state: 'prosper', note: '那条街的粥棚支了一冬，坊里人至今提起' } }, text_after: '你把街坊们拢起来，一家匀出一把米。粥棚支了一冬，全坊无一人饿死。开春雪化，坊正领人在粥棚原址立了根拴马桩——"留个念想，给后来人看看，那年是谁把大家拢起来的。"（铁瓦关·兴）' },
    ],
  },
};
