// 四期 v4.0：第四层 仙界·九重天。
// 天庭衙署/瑶池/魔渊/幽冥/轮回井/天外混沌——渡劫圆满者方能南天门验籍而入。
// 场景化铁律照旧：城区结构+光景基调+活法+际遇四件套。
export const CITIES4 = {
  xianjie: { id: 'xianjie', name: '仙界', entry: 'xj_nantianmen',
    desc: '九重天。云是路，星是灯，时间是「不用管」的东西。仙界的规矩比人间少一条——人情；也多一条——天条。' },
};

export const AREAS4 = {
  xj_tiangong: { id: 'xj_tiangong', name: '天宫', city: 'xianjie',
    blurb: '云阶之上，宫阙无声。仙官们各司其职——职责这东西，连仙也躲不掉。' },
  xj_yuanming: { id: 'xj_yuanming', name: '渊冥', city: 'xianjie',
    blurb: '仙界也有背面。魔渊在云层之下，幽冥在星海之背——背面不是脏，是「账」。' },
  xj_tianwai: { id: 'xj_tianwai', name: '天外', city: 'xianjie',
    blurb: '九重天之外。混沌无光无声无形——仙人们到这儿，才重新变回「学生」。' },
};

export const NODES4 = {
  xj_nantianmen: { id: 'xj_nantianmen', name: '南天门', city: 'xianjie', area: 'xj_tiangong',
    desc: '南天门比传说里朴素——没有金光万丈，只有一道门，和门里门外两种时间。验籍的灵官坐在门边，座前队伍排得很长，很长，长得看不出头尾。仙界的头一条规矩写在门楣上：「到此者，皆弃了旧名。」',
    links: ['xj_yashu', 'xj_yaochi', 'xj_moyuan'], npcs: ['xj_lingguan'],
    huatou: ['排队验仙籍', '看门楣上的规矩', '跟灵官搭话'], events: [] },
  xj_yashu: { id: 'xj_yashu', name: '天庭衙署', city: 'xianjie', area: 'xj_tiangong',
    desc: '衙署里的公文是活的——一篇篇在空中自己翻页。仙官们办的都是人间的事：哪年该旱，哪年该涝，哪个凡人阳寿到了。星官的笔尖悬着，一笔下去就是一道天条。堂上悬匾：「天道无亲，账目为凭」。',
    links: ['xj_nantianmen', 'xj_yaochi'], npcs: ['xj_xinguan'],
    huatou: ['翻看人间公文', '问星官领仙差', '旁听天条议定'], events: [] },
  xj_yaochi: { id: 'xj_yaochi', name: '瑶池', city: 'xianjie', area: 'xj_tiangong',
    desc: '瑶池的水是「静」的——不是没有波，是波走了八千里还没走到岸。池边仙草自饮月光，赴宴的仙人们下棋、论道、也 gossip——你这才明白，仙界的人情，只是换了个海拔。',
    links: ['xj_nantianmen', 'xj_yashu'], npcs: ['xj_yannu'],
    huatou: ['尝一口瑶池水', '旁听仙人论道', '看仙子们酿酒'], events: [] },
  xj_moyuan: { id: 'xj_moyuan', name: '魔渊', city: 'xianjie', area: 'xj_yuanming',
    desc: '云层在这里裂开一道缝，缝里吹上来的风是「黑」的。魔渊封着仙界自己造的东西——当年争天条输了的那些，连同他们「不甘」的道理。渊口没有栏杆。仙界的意思是：你若想去，说明你该去。',
    links: ['xj_nantianmen'], npcs: [],
    huatou: ['在渊口听风', '往深处看一眼', '捡一片渊边黑羽'], events: [], tags: ['wild'] },
  xj_youming: { id: 'xj_youming', name: '幽冥', city: 'xianjie', area: 'xj_yuanming',
    desc: '星海之背，故人档案馆。每一盏灯是一个名字，每一盏灯下是一生。阴差们提着灯来来去去，像在整理一座巨大的图书馆——谁的灯灭了，谁的新灯要点上，都记着账。',
    links: ['xj_lunhui'], npcs: ['xj_yincha'],
    huatou: ['翻看故人的灯', '帮阴差整理灯档', '在灯下静坐'], events: [] },
  xj_lunhui: { id: 'xj_lunhui', name: '轮回井', city: 'xianjie', area: 'xj_yuanming',
    desc: '井不深，深的是井里的「时候」。凑近了看，井水映出的不是你的脸——是你每一世的脸，一张一张，换得很快。井边石凳是给「要走的人」坐的。井栏上刻着一行小字：「记得带走的，才带得走。」',
    links: ['xj_youming', 'xj_hundun'], npcs: ['xj_jingling'],
    huatou: ['在井水里找前世的自己', '问井灵轮回的规矩', '在石凳上坐一坐'], events: [] },
  xj_hundun: { id: 'xj_hundun', name: '天外混沌', city: 'xianjie', area: 'xj_tianwai',
    desc: '九重天到这里就「没有了」——不是尽头，是没有了「里外上下」。混沌里没有光，也没有暗，因为两种东西还没被造出来。仙人们说，开天辟地前，所有人都从这儿来；说这话时，他们都朝同一个方向看，那方向不存在的。',
    links: ['xj_lunhui'], npcs: [],
    huatou: ['在混沌边缘坐观', '试着听混沌的声音', '转身回去'], events: [], tags: ['wild', 'hidden'] },
};

export const NPCS4 = {
  xj_lingguan: { id: 'xj_lingguan', name: '验籍灵官', aliases: ['灵官', '验籍灵官'], city: 'xianjie',
    desc: '在南天门坐了不知几千年。他不看册子验籍——他直接看「人」。据说从没有人瞒过他，也从没有人值得他多看第二眼。',
    zhishi: [
      { keys: ['仙籍', '验籍', '资格'], answer: '仙籍不验修为——修为是「本事」，本事仙界不缺。验的是你把那一身本事，用成了什么样。' },
      { keys: ['天条', '规矩', '犯'], answer: '天条一共三千条，比人间律法少。为什么少？（他敲敲桌）因为仙活得久，久到逃不掉任何一条。' },
      { keys: ['人间', '下去', '凡'], answer: '下去？门就在那儿。可下去的人，十个里九个会想念这儿的水——人间的水太吵。' },
    ],
    greeting: '（他不抬头）排队。到你了再说。', personality: '倦而不惰' },
  xj_xinguan: { id: 'xj_xinguan', name: '执笔星官', aliases: ['星官', '执笔星官'], city: 'xianjie',
    desc: '掌人间风雨簿。他的笔是仙界最重的笔——一笔下去，人间一季。他写字很慢，慢得像在跟每个字商量。',
    zhishi: [
      { keys: ['仙差', '差事', '领'], answer: '仙差不养闲人。想领差，先答一题：你下去办事，是替天行道，还是替「人」行道？——答错不罚，答对也不赏。这道题要答一辈子。' },
      { keys: ['公文', '人间', '旱涝'], answer: '（他指指空中的翻页公文）你看这一页——某年某月，某地大旱。写它的人手抖过没有？我不知道。我只知道我写的时候，手从来不敢稳。' },
      { keys: ['天条', '议', '改'], answer: '天条三千年一小议。改一条，要三千仙连署——不是难，是仙太记得「当年为什么这么写」。' },
    ],
    greeting: '（笔尖悬在半空）轻些说话。这一笔是人间三月的雨。', personality: '慎而重' },
  xj_yannu: { id: 'xj_yannu', name: '瑶池宴女', aliases: ['宴女', '仙子'], city: 'xianjie',
    desc: '管瑶池的酒和话。仙界的 gossip 一半出自她口——另一半她故意不说，留着下回卖。',
    zhishi: [
      { keys: ['酒', '酿', '瑶池'], answer: '瑶池的酒不酿五谷——酿的是「时候」。醉一场，等于老一瞬。仙人们抢着醉，就是抢着「休息一下」。' },
      { keys: ['论道', '仙人', '下棋'], answer: '你听他们在那边吵什么？吵「情之一字算不算道」。吵了八百年了——我看呐，谁也不想要答案，答案是答案了，棋就下不下去了。' },
      { keys: ['人间', '凡', '想'], answer: '（她忽然认真）仙界的酒再好，没有一样比得上「热」。人间灶上的热。这话别跟人说——说了显得我官低了半头。' },
    ],
    greeting: '来了？池边坐。酒自取——仙界的规矩，第一碗自己倒。', personality: '慧而近人' },
  xj_yincha: { id: 'xj_yincha', name: '掌灯阴差', aliases: ['阴差', '掌灯阴差'], city: 'xianjie',
    desc: '幽冥档案馆的管理员。他的灯不照路——照名字。他记得每一盏灯的位置，包括那些「没人记得的」。',
    zhishi: [
      { keys: ['灯', '故人', '名字'], answer: '一盏灯一生。灯不灭——只是暗。暗到没人记得，就归档。你若记得谁，谁的灯就亮一分。这不是比喻，是「制度」。' },
      { keys: ['轮回', '投胎', '井'], answer: '井在那边。规矩就一条：带不走的别惦记，惦记的才带得走。（他指指自己的脑袋）惦记，是一种「形状」，井水冲不变形状。' },
      { keys: ['账', '恩', '仇'], answer: '恩仇都入档。但档案不追债——追债的是活人自己。我们只管把账本保存好，等你哪一世想起来翻。' },
    ],
    greeting: '（他把一盏灯摆正）小心脚下。灯多人杂。', personality: '静而悯' },
  xj_jingling: { id: 'xj_jingling', name: '轮回井灵', aliases: ['井灵', '井灵儿'], city: 'xianjie',
    desc: '井水成灵。声音像很多个人同时说话——因为井里泡着所有时候。她（姑且是「她」）对每一世的事都好奇，唯独对「下一世」绝口不提。',
    zhishi: [
      { keys: ['轮回', '转世', '投'], answer: '（千百个声音叠在一起）往下跳，就是往「前」走。井里没有上下——只有「换」。你把这一世叠好，下一世才铺得开。' },
      { keys: ['记得', '带', '传'], answer: '井栏上刻着呢：记得带走的，才带得走。什么算「记得」？（她笑）你惦记了整世的，就是记得的。惦记这东西，比仙籍还硬。' },
      { keys: ['前世', '旧账', '账'], answer: '你的账都在水里漂着呢——要看吗？看可以，捞不动。账这东西，只能自己「长」到能拿起它的那一世。' },
    ],
    greeting: '（井水轻轻晃了一下，像点头）新来的？还是……旧的回来了？', personality: '古而柔' },
};

