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
