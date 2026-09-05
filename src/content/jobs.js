// 四期 v4.0：江湖百业十业。谋生不只是「赚两吊钱」——每一业是一副活法。
// doWork 按节点匹配在业：业有行话、有滋味、有入行账。
export const JOBS10 = {
  ye_biaoshi: { id: 'ye_biaoshi', name: '镖师', kind: '武行', places: ['yh_biaoju', 'yh_changjie'],
    flavor: [
      '你给镖队搭了把手，押一段短镖。车辙压过官道，你在车辕上打了个盹——打盹也是镖师的功课：半只耳朵睡觉，半只耳朵听风。',
      '镖行短工。你跟着喊了一嗓子「合——吾——」，满街的骡马都竖起了耳朵。趟子手的日子，嗓子就是饭碗。',
    ],
    effect: { money: 2, stat: { wugongXiuwei: 2 } },
    ledgerText: '以镖师为业，走过几趟短镖' },
  ye_yumin: { id: 'ye_yumin', name: '渔家', kind: '水活', places: ['cl_aogang', 'qd_yucun', 'yy_shangceng', 'nh_bujidao'],
    flavor: [
      '你随渔船出了一日海。撒网、收网、分拣——指尖被海水泡得发皱。船老大说：海给饭吃，但要你先把手泡进海里。',
      '你帮着补了半日的网。补网补的是耐心——渔家的话：网眼匀了，鱼才知道进不进。',
    ],
    effect: { money: 2, hp: -3 },
    ledgerText: '以渔为业，手上的皱纹里都是盐' },
  ye_yaonong: { id: 'ye_yaonong', name: '药农', kind: '山活', places: ['bc_yaotian', 'bc_yaowangmiao', 'bc_yaomen'],
    flavor: [
      '你上山药田帮工半日。挖药、抖土、晾晒——药农的规矩：采一株留一株。你不是药农出身，可你也照做了——山看着呢。',
      '你替药铺分拣药材，学会了辨三味药。掌柜说：认药如认人——模样会骗人，纹路不会。',
    ],
    effect: { money: 2, stat: { xiwei: 2 } },
    ledgerText: '以药农为业，袖子里常年一股药香' },
  ye_kuanggong: { id: 'ye_kuanggong', name: '矿工', kind: '苦力', places: ['kw_kuangshi', 'kw_jianshan', 'tw_guanqiang'],
    flavor: [
      '你下了一日矿。矿道里黑得连黑都省了，只有镐声和喘声。工头收工时多给了你一瓢酒：「下过矿的人，命硬。」',
      '你在矿市帮工，把矿石按成色分堆。分到后来，你闭着眼一摸就知道哪块含铁——手比眼先学会了认矿。',
    ],
    effect: { money: 3, hp: -5 },
    ledgerText: '下过矿——命硬,是矿道里泡出来的' },
  ye_shuli: { id: 'ye_shuli', name: '书吏', kind: '文活', places: ['chengmen_dashi', 'tianjige', 'lj_shuimen'],
    flavor: [
      '你替衙门口的书吏抄了一日文书。字要端正，心要放空——抄到后来，你连自己抄的是什么都忘了，只剩下笔在纸上走。书吏说：这就是这行的滋味。',
      '你帮店铺写了一下午的账。算盘打得噼啪响——账房先生夸你一句：「指头稳，心不贪。这行当里，第二句比第一句金贵。」',
    ],
    effect: { money: 2, stat: { wuxing: 1 } },
    ledgerText: '做过书吏营生，一手字端正得能当路引' },
  ye_shuoshu: { id: 'ye_shuoshu', name: '说书人', kind: '嘴皮活', places: ['yh_changjie', 'guishi', 'sipailou', 'lj_shuimen'],
    flavor: [
      '你在茶棚说了半日书。说到紧要处惊堂木一拍——满棚的茶碗都跟着一颤。散场时兜里多了七文钱，和三个新听来的故事。',
      '你替病了的说书先生顶了一场。说的是老段子，可你添了点自己的经历——听客们没听出来，可你自己知道：今天这段，是你的。',
    ],
    effect: { money: 2, trait: { cha: 1 } },
    ledgerText: '说过书——惊堂木一拍，半条街的耳朵归你管' },
  ye_huolang: { id: 'ye_huolang', name: '货郎', kind: '脚力', places: ['guandao', 'shanlu', 'tw_guanqiang', 'bc_yaoshi'],
    flavor: [
      '你挑着货担走了一日村路。拨浪鼓摇得「咚咚」响，换回来一篮子鸡蛋和三村的新鲜话。货郎的学问：东西换东西，话换话。',
      '你在集市帮人看了一日摊。看摊看的是眼力——谁真想买，谁只是热，谁的手在袖子里——摊主说：这三样看明白了，你就出师了。',
    ],
    effect: { money: 2, trait: { cha: 1 } },
    ledgerText: '挑过货担——一村一村走出来的眼力' },
  ye_shipu: { id: 'ye_shipu', name: '船工', kind: '水活', places: ['lj_shuimen', 'cl_aogang', 'lg_gongmen', 'pl_dukou'],
    flavor: [
      '你上了一日船。摇橹、撑篙、看水色——船工的手艺全在「顺」字上：顺着水，顺着风，顺着船的脾气。',
      '你帮船家卸了一日的货。肩上压出的红印子要到明早才消——船工的话：疼是活计的收条。',
    ],
    effect: { money: 2, hp: -2, stat: { wugongXiuwei: 1 } },
    ledgerText: '做过船工，橹把磨出的茧还没退' },
  ye_liehu: { id: 'ye_liehu', name: '猎户', kind: '山活', places: ['qingxi', 'shanlu', 'by_xueyuan', 'dh_wanyao'],
    flavor: [
      '你随猎队进了一日山。下套、看踪、守伏——猎户的规矩你入耳就记下了：打三留一。山养人，人得给山留后路。',
      '你帮着剥了一日的皮子。手艺生疏，老猎户也没嫌——「皮子剥坏了可惜，人练坏了也可惜。慢慢来。」',
    ],
    effect: { money: 2, stat: { wugongXiuwei: 2 } },
    ledgerText: '随猎户进过山——打三留一，记在心里' },
  ye_gufang: { id: 'ye_gufang', name: '账房', kind: '文活', places: ['guishi', 'nh_haishi', 'cl_huozhan', 'xiaojinku'],
    flavor: [
      '你给鬼市柜上当了一夜临时账房。地下的账目比地上的还清爽——每一笔都记着「谁的账，谁的命」。大掌柜的看了你记的账：「字丑，账清。留你。」',
      '你帮海市理了一日的货账。海商的账要「三算」：算货、算程、算人心——你前两样学会了，第三样，掌柜的说要靠年头。',
    ],
    effect: { money: 3, trait: { chi: 1 } },
    ledgerText: '做过账房——账目清白，是这行当的身家' },
};

// 节点 → 业 反查索引
const nodeJobIndex = {};
for (const job of Object.values(JOBS10)) {
  for (const nid of job.places) (nodeJobIndex[nid] = nodeJobIndex[nid] || []).push(job.id);
}

export function jobAt(nodeId) {
  const ids = nodeJobIndex[nodeId];
  return ids ? ids[0] : null;
}
