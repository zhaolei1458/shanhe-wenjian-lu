// 二期 v2.0：山海经妖兽图鉴。规格：分布地固定、个体强度带随机；杀兽取材是恶业（佛修折寿、魔修如常）。
// 六类：陆行/飞行/水行/凶兽/灵植精怪/材料兽
import { BEASTS4 } from './beasts4.js';

export const BEASTS = {
  // ---- 陆行 ----
  beast_junma: {
    id: 'beast_junma', name: '铁瓦军马', kind: 'lu', tier: 1,
    haunts: ['tw_mashi'], intro: '军中淘汰的老马，认得回营的路，荒年还能救主。毛色斑白，眼睛却亮得很。',
    tame: { base: 0.5, flavor: '它嗅了嗅你的手心——军马认人，先认"手稳不稳"。' },
    mount: { kind: 'lu', speed: 1, desc: '铁瓦军马，脚程稳，认路。' },
    material: { id: 'mat_mapi', name: '军马鬃', desc: '一把油亮的马鬃。老马换毛时自然脱落的——你没剪，是它赠的。' },
  },
  beast_poxiao: {
    id: 'beast_poxiao', name: '貔貅崽', kind: 'lu', tier: 3,
    haunts: ['kw_kuangshi'], intro: '矿区传闻里的"吞金兽"幼崽，圆滚滚一团，见了亮的东西眼睛就直了。传说貔貅招财——也传说它能把主人吃穷。',
    tame: { base: 0.3, flavor: '它盯着你袖里的碎银，喉咙里咕噜咕噜响——那是"交换"的意思，不是"抢"。' },
    mount: { kind: 'lu', speed: 1, desc: '貔貅崽，走得慢，可它的"鼻子"总能嗅出值钱的东西。' },
    material: { id: 'mat_pixiu_lin', name: '貔貅碎鳞', desc: '幼崽换牙期掉的金鳞，指甲盖大小，握久了微微发热。' },
  },
  // ---- 飞行 ----
  beat_xianhe: {
    id: 'beast_xianhe', name: '白顶仙鹤', kind: 'fei', tier: 2,
    haunts: ['bc_yaotian', 'qd_wangxianya'], intro: '药田草人"防的"就是它——仙鹤偷吃药谷的灵芝，一偷就是十几年。通人性，认药理，眼白多的人说它能"望气"。',
    tame: { base: 0.35, flavor: '它歪着头看你，单腿站了半晌——鹤认人，认的是"静气"。' },
    mount: { kind: 'fei', speed: 2, desc: '白顶仙鹤，能驮一人短程飞天——跨城远行它不干，它嫌"没意思"。' },
    material: { id: 'mat_heyu', name: '鹤羽', desc: '一根自然脱落的飞羽，白得发光。药王庙的庙祝见了说："此物泡酒，明目。"' },
  },
  beat_dapeng: {
    id: 'beast_dapeng', name: '风鹏幼鸟', kind: 'fei', tier: 4,
    haunts: ['qd_wangxianya'], intro: '望仙崖上空偶尔掠过的黑影。成年的风鹏能遮天蔽日——幼鸟坠崖被渔家救起的事，群岛上流传过三回。',
    tame: { base: 0.12, flavor: '它饿得发抖，还是把喙对准了你的眼睛——风鹏幼鸟天生怀疑一切，包括善意。' },
    mount: { kind: 'fei', speed: 3, desc: '风鹏幼鸟，翅膀一展三丈。养大了，雪山仙山界外都去得——那是后话。' },
    material: { id: 'mat_pengyu', name: '鹏翎', desc: '一支鹏翎，比人手臂还长，风穿过羽管会呜呜地响。' },
  },
  // ---- 水行 ----
  beast_jiao: {
    id: 'beast_jiao', name: '墨鳞小蛟', kind: 'shui', tier: 3,
    haunts: ['lg_gongmen', 'cl_aogang'], intro: '龙宫遗族。墨绿的鳞片在水中泛蓝光——渔民网到"龙鳞"的传闻，多半是它掉的鳞。',
    tame: { base: 0.2, flavor: '它绕着你游了三圈，用吻部顶了顶你的手腕——蛟认主，认的是"血里的水气"。' },
    mount: { kind: 'shui', speed: 2, desc: '墨鳞小蛟，水中如飞。骑着它下龙宫旧脉，不用闭气。' },
    material: { id: 'mat_jiaolin', name: '蛟鳞', desc: '一枚自然蜕下的蛟鳞，青黑色，入水不沉。' },
  },
  beast_shangui: {
    id: 'beast_shangui', name: '驮山龟', kind: 'shui', tier: 2,
    haunts: ['nh_bujidao'], intro: '背甲上长着小山似的藻，游得极慢，却从不出错——它认洋流，比任何海图都准。海市牙人管它叫"活的罗盘"。',
    tame: { base: 0.4, flavor: '它把头探出水面，看了你足足一炷香——龟认人最慢，也最牢。' },
    mount: { kind: 'shui', speed: 1, desc: '驮山龟，慢，却认得所有洋流。它游过的水路，没有迷航这一说。' },
    material: { id: 'mat_guijia', name: '龟甲蜕', desc: '一片自然蜕下的甲缘，纹路天然成卦。' },
  },
  // ---- 凶兽伙伴 ----
  beast_qiongqi_cub: {
    id: 'beast_qiongqi_cub', name: '穷奇幼崽', kind: 'xiong', tier: 4,
    haunts: ['hq_luanzangling'], intro: '乱葬岭夜里的白影——它不是在"找"什么，是在"记"什么。穷奇认主认的是性情相投：心里同样有恨的人。',
    tame: { base: 0.15, flavor: '它没有咬你。它盯着你眼睛里的那点恨意，看了很久——然后打了个哈欠，趴下了。凶兽的信任，从"同类"开始。', cond: 'hate' },
    mount: { kind: 'lu', speed: 2, desc: '穷奇幼崽，凶兽伙伴。战斗时会替你挡下致命一击——"同类"不讲道理。' },
    material: { id: 'mat_qiongqi_mao', name: '穷奇白毫', desc: '一根带凶纹的白毫。凶兽自然褪下的毛，黑市上能换一座宅子。' },
  },
  beast_jiuying_cub: {
    id: 'beast_jiuying_cub', name: '九婴残雏', kind: 'xiong', tier: 4,
    haunts: ['lg_huilang'], intro: '龙宫水牢里的传说——九婴当年被斩了六首，残雏困在遗迹里。九个头只剩三个，三个都饿。',
    tame: { base: 0.1, flavor: '三个头先打了一架，然后同时看你——九婴认主认的是"扛得住它的饿"。', cond: 'tough' },
    mount: { kind: 'shui', speed: 2, desc: '九婴残雏，三个头三条心思，水中凶悍无匹——三张嘴，同时撕咬。' },
    material: { id: 'mat_jiuying_lin', name: '九婴逆鳞', desc: '一枚逆生的鳞片，摸起来糙，握紧了烫手。' },
  },
  // ---- 灵植精怪 ----
  beast_renshen_wawa: {
    id: 'beast_renshen_wawa', name: '人参娃娃', kind: 'ling', tier: 3,
    haunts: ['bc_yaotian'], intro: '药田里偷跑的小东西，一追就是十年——你追不上它，因为它跑的时候地里所有的垄沟都在帮它。',
    tame: null, // 灵植精怪可遇可交不可养
    note: '它们自己有日子要过——强留则灵气尽散，化为一块老参。',
  },
  beast_shuyao: {
    id: 'beast_shuyao', name: '药谷树妖', kind: 'ling', tier: 2,
    haunts: ['bc_yaotian', 'bc_yaowangmiao'], intro: '药王庙后那棵老桂树。月圆之夜影子会挪半步——坞里老人都当没看见。',
    tame: null,
    note: '树妖守着药谷的"气"。它若肯为你落一枝花，那是天大的缘。',
  },
  // ---- 材料兽（猎杀/降服两难） ----
  beast_kuiniu: {
    id: 'beast_kuiniu', name: '夔牛', kind: 'cailiao', tier: 4,
    haunts: ['kw_jianshan'], intro: '独脚神兽，吼声如雷。矿工们说七号支洞的塌方就是它的"起床气"。夔牛皮制鼓，声震百里——可杀它，是恶业。',
    tame: { base: 0.1, flavor: '它单脚立着看你，独眼里映出你的影子——夔牛认人，认的是"你的影子直不直"。' },
    mount: null,
    material: { id: 'mat_kuiniu_pi', name: '夔牛皮', desc: '一张完整的夔牛皮（若是活取剥换的，工坊出十倍价）。制鼓可震退海族。' },
  },
  beast_yinglong: {
    id: 'beast_yinglong', name: '应龙', kind: 'cailiao', tier: 5,
    haunts: ['lg_huilang'], intro: '龙骨回廊最深处盘着的传说。缚应龙炼化，可得飞行坐骑——"活取的龙鳞"，昆吾剑炉只认这个。',
    tame: { base: 0.05, flavor: '它睁开一只眼。那只眼里没有怒，只有疲惫——它等一个"问对了问题"的人，等了几百年。' },
    mount: { kind: 'fei', speed: 3, desc: '应龙（缚），飞行坐骑。缚着它飞，它不顺路——可它认路，认的是"该去的路"。' },
    material: { id: 'mat_yinglong_lin', name: '应龙鳞（活取）', desc: '活取的应龙鳞，鳞尖还带着体温。昆吾剑炉只认"活取"二字。' },
  },
  beast_hanshi: {
    id: 'beast_hanshi', name: '寒髓冰蚕', kind: 'cailiao', tier: 3,
    haunts: ['tw_huangyi', 'kw_kuangshi'], intro: '矿道深处的白虫，吐的丝寒气逼人——寒铁要它"焐"过才成器。矿工们喂它矿石渣，喂了三代。',
    tame: { base: 0.45, flavor: '它在你掌心吐了一口丝——冰凉。冰蚕认人，认的是"手心的温度稳不稳"。' },
    mount: null,
    material: { id: 'mat_hansui_si', name: '寒髓丝', desc: '一缕寒髓冰丝，缠在剑柄上，暑天也不化。' },
  },
  beast_shanxiao: {
    id: 'beast_shanxiao', name: '山魈', kind: 'xiong', tier: 2,
    haunts: ['shanlu', 'bc_yaotian'], intro: '山里的"夜行者"。劫道的货郎说它是鬼，猎户说它只是护食——它抢吃的，也埋吃的。埋完做个记号，下年来取。',
    tame: { base: 0.35, flavor: '它把手里的野果掰了一半扔给你——山魈认人，认的是"肯分食的"。' },
    mount: { kind: 'lu', speed: 1, desc: '山魈，认山路的伙伴。它带的路，比猎户的地图多三分险，也多三分近。' },
    material: { id: 'mat_shanxiao_gu', name: '山魈骨珠', desc: '一颗自然脱落的手骨指节，磨成珠。老猎户说戴上它，山里的路"都认你"。' },
  },
};

// 图鉴成就句（见过的兽数 → 文案）
export const BESTIARY_MARKS = [
  { n: 1, text: '（你开始记下见过的每一头"有名字的"——袖中录的妖兽卷，第一笔。）' },
  { n: 3, text: '（妖兽卷记了三头。猎户们的规矩："认兽先认名，认名不结仇。"）' },
  { n: 5, text: '（妖兽卷过半。你发现一件事：图鉴里"凶名在外"的，多半只是饿。）' },
  { n: 8, text: '（妖兽卷快记满了。老猎户看了你的卷子，半晌说了一句："这不是猎人的册子——是山里人的。"）' },
];

// 四期合并：百兽图鉴扩编（图鉴至 50）
Object.assign(BEASTS, BEASTS4);
