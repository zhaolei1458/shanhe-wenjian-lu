// ============================================================
// 山河问剑录 · 2.0 第三层：长生引导线「登楼」
// 身世局了结后接上（quest.js mainline_done → appendLongevity）
// 把人往高境界、往世界深处引：寻访仙山 → 拜入名门 → 突破筑基 → 突破金丹
// 目标类型：node/city/flag/realm/sect（quest.js 消费面，见坑册 2.2）
// ============================================================

export const LONGEVITY = {
  id: 'ql_changsheng',
  title: '长生·登楼',
  chapters: [
    {
      id: 'q_cs_1', chapter: 1, title: '寻访仙山',
      brief: '身世的账清了，往前的路却宽了。江湖上有句老话：凡人望山是风景，修行人望山是门。昆仑墟、蜀山、蓬莱——三座仙山，任登一座，去亲眼看看"上面"长什么样子。',
      goals: [{ type: 'city', target: ['kunlunxu', 'shushan', 'penglai'], hint: '登临昆仑墟、蜀山、蓬莱任一处仙山' }],
      rewards: {
        xiwei: 30,
        say: '（仙山的气机从天灵盖灌下来，你打了个寒噤——不是冷，是身体认出了更高处的东西。回望来路，人间烟火细如针脚，你头一回明白了"修行"两个字为什么这么写。）',
      },
      next: 'q_cs_2',
    },
    {
      id: 'q_cs_2', chapter: 2, title: '拜入名门',
      brief: '独行快，众行远。山上的东西看过了，你明白一件事：没人引路，仙缘只是风景。寻一处名门正派拜进去——师门传功、同门印证、长者指途，这些是独行人拿命换不来的。',
      goals: [{ type: 'sect', hint: '寻访名门（各城门派驻使或山门），拜入师门' }],
      rewards: {
        say: '（从此你有了师承。晨钟暮鼓里练功，比一个人对着夜空摸索快得多——你不是一个人在修了。）',
      },
      next: 'q_cs_3',
    },
    {
      id: 'q_cs_3', chapter: 3, title: '突破筑基',
      brief: '师门在手，仙山在望，剩下的是把地基打深。凡俗的寿数禁不起等——把修为攒到圆满，寻一处灵地（或一场雷雨，或一个契机），破入筑基。筑基功成，寿约两百，你才有资格谈"长生"二字。',
      goals: [{ type: 'realm', target: 'zhuji', hint: '修为攒至练气圆满，寻灵地或契机破入筑基' }],
      rewards: {
        say: '（筑基功成。你夜里照旧打坐，却在入静时听见了很远的地方有人说话——修行的路，真的分了层。你在这条路上，站稳了第一级台阶。）',
      },
      next: 'q_cs_4',
    },
    {
      id: 'q_cs_4', chapter: 4, title: '突破金丹',
      brief: '筑基之后，气海鼓荡如潮，可凝不成那个"圆"。梦里总有一片海——静得能听见心跳的海。老话说，金丹契机在海底。去海边，去龙宫，去任何"静得下来"的地方，把丹凝出来。',
      goals: [{ type: 'realm', target: 'jindan', hint: '修为攒至筑基圆满，往海底灵地（龙宫回廊/宫门）凝丹' }],
      rewards: {
        say: '（金丹天成。寿约五百，一郡活神仙。你坐在海边看日出——五百年后的日出你也许看得到，也许看不到。但这辈子，你总算把"长生"从一个念头，走成了一条路。）',
      },
      next: 'q_cs_5',
    },
    // ---- 2.0 第四层（plan 4.3）：登顶后段——往仙界、往边域、往天上 ----
    {
      id: 'q_cs_5', chapter: 5, title: '突破元婴',
      brief: '金丹圆满如镜，镜里却总照见一线青山——望仙崖上望得见仙山现影的人，才有资格问"下一步"。把修为攒到金丹圆满，上望仙崖去。',
      goals: [{ type: 'realm', target: 'yuanying', hint: '修为攒至金丹圆满，往望仙崖（群岛）破婴' }],
      rewards: {
        say: '（元婴出窍那一瞬，你看见了盘坐在自己顶门上的"自己"。甲子从此如一瞬——寿约千载，人间的高处，你已经站上去了。）',
      },
      next: 'q_cs_6',
    },
    {
      id: 'q_cs_6', chapter: 6, title: '化神通仙',
      brief: '元婴在识海里徘徊，它总朝一个方向"看"：断壁、剑痕、云海、仙市。化神要借古仙的气机——昆仑墟、蜀山、蓬莱，任一处仙山，再登一次。',
      goals: [{ type: 'realm', target: 'huashen', hint: '修为攒至元婴圆满，重登仙山（昆仑墟/蜀山/蓬莱）借古仙气机化神' }],
      rewards: {
        say: '（化神之后，一念之间神游万里。你坐在仙山的雪线上往下看——人间烟火细如针脚，而天上的门，已经隐约可辨。）',
      },
      next: 'q_cs_7',
    },
    {
      id: 'q_cs_7', chapter: 7, title: '东荒妖域',
      brief: '化神之后，你的名字传进了边域。东荒妖域的妖师们捎来话：人族修士走到这一步，按老规矩，该来边域"对一次名"——万妖盟的盟契上，还没有你的那一笔。去东荒。',
      goals: [{ type: 'city', target: 'donghuang', hint: '亲赴东荒妖域，赴万妖之约' }],
      rewards: {
        say: '（东荒的风里有獠牙，也有酒。万妖盟的妖师与你共饮一坛，盟契上添了你的名字——人妖两界，从此你都是"有名字的"。）',
      },
      next: 'q_cs_8',
    },
    {
      id: 'q_cs_8', chapter: 8, title: '渡劫飞升',
      brief: '边域归来，你的气机已经瞒不过天。雷云在头顶积了三年不散——大乘圆满之后，是渡劫。劫云之下无活口，也无懦夫。把修为攒到尽头，站进雷里去。',
      goals: [{ type: 'realm', target: 'dujie', hint: '修为攒至大乘圆满，候一场雷劫，站进去' }],
      rewards: {
        say: '（九道雷落完，你还站着——焦了半边，可站着。天门在雷云后开了一条缝。人间的雨，从今往后淋不到你了。）',
      },
      next: 'q_cs_9',
    },
    {
      id: 'q_cs_9', chapter: 9, title: '南天门验籍',
      brief: '天门后是南天门。仙籍司的灵官要验你的籍——名姓、来历、此生账目，一笔一笔对。验过了，你的名字从生死簿挪进仙箓。去天街。',
      goals: [{ type: 'realm', target: 'zhenxian', hint: '修为渡劫圆满，登天街（仙界）受仙籍司验籍' }],
      rewards: {
        say: '（验籍灵官在你的名字下落了一笔朱砂："从今日起，寿数归天条管。"你抬头看天——天还是那个天，但从今往后，你在天的里面。长生登顶——这条从青溪村/黄泉集/宫墙里开始的线，走完了。往后是天条之内的事。）',
      },
    },
  ],
};

// 身世局了结后的衔接（幂等：已挂长生线则不重复）
export function appendLongevity(game) {
  const life = game.state.life;
  if (!life || !Array.isArray(life.questLog)) return;
  if (life.questLog.some(q => q.id === 'q_cs_1')) return;
  life.questLog.push(...LONGEVITY.chapters.map((c, i) => ({
    id: c.id,
    chapter: c.chapter,
    title: c.title,
    desc: c.brief,
    goals: (c.goals || []).map(g => ({ ...g, done: false })),
    status: i === 0 ? 'active' : 'locked',
  })));
  const first = life.questLog[life.questLog.length - 4];
  game.say(`【主线·${LONGEVITY.title}】第一章·${first.title}\n${first.desc}`, 'system');
}
