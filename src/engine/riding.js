// 二期 v2.0：坐骑宠物——捕捉→驯服→喂养→进化，每一步都是故事文字，不是进度条。
import { BEASTS } from '../content/beasts.js';

// 驯化档位（叙事化呈现，绝不写数值）
export const XUN_LEVELS = [
  { at: 0,  name: '生分', text: '它还认生，喂食要放在地上，退三步。' },
  { at: 2,  name: '认食', text: '它记住你的喂食时辰了——你没来，它就望着路口。' },
  { at: 5,  name: '亲近', text: '它肯让你摸了。摸头时它眯着眼——像一家人。' },
  { at: 9,  name: '认主', text: '它认定你了。外人靠近，它先炸毛——凶归凶，护的是你。' },
  { at: 14, name: '通灵', text: '它开始"懂"你。你抬手它就知道去哪，你叹气它就靠过来——畜生通灵，不在话术，在日子。' },
];

export function xunLevelOf(n) {
  let cur = XUN_LEVELS[0];
  for (const l of XUN_LEVELS) if (n >= l.at) cur = l;
  return cur;
}

// 降服判定：战斗获胜后的"降服"选项，或节点际遇。cond: hate/tough 看心性旗标。
export function tryCapture(game, beastId) {
  const b = BEASTS[beastId];
  if (!b || !b.tame) return { ok: false, text: '（这东西不是能"养"的。它自己有日子要过——你看着它走远，没伸手。）' };
  const life = game.state.life;
  let p = b.tame.base;
  // 心性相投加成
  if (b.tame.cond === 'hate' && (life.xinXing.kuang || life.xinXing.ao)) p += 0.25;
  if (b.tame.cond === 'tough' && (life.xinXing.yi || life.xinXing.gang)) p += 0.25;
  // 喂过食加成
  if ((life.flags['fed_' + beastId] || 0) > 0) p += 0.2;
  const ok = game.rng.chance(Math.min(p, 0.9));
  if (ok) {
    life.mount = { id: b.id, name: b.name, kind: b.mount.kind, speed: b.mount.speed, xun: 0, desc: b.mount.desc };
    if (!life.beastBook.includes(b.id)) life.beastBook.push(b.id);
    game.book('记', `降服${b.name}，结为伙伴`);
    return { ok: true, text: `${b.tame.flavor}\n（你把它带走了。袖中录的妖兽卷上，添了${b.name}的名字——不是"收藏"，是"结识"。）` };
  }
  return { ok: false, text: `（${b.tame.flavor}\n可它最终没跟你走。缘分这东西，强求不得。）` };
}

// 喂养：同节点互动，累计驯化。凶兽/灵植各有说法。
export function feedMount(game) {
  const life = game.state.life;
  if (!life.mount) {
    return { text: game.rng.pick([
      '（你身边没有伙伴。路上遇见过几个"野物"，都只是擦肩——缘分还没到。）',
      '（想喂点什么，才发现身边空空。你对自己的影子笑了笑。）',
    ]) };
  }
  const b = BEASTS[life.mount.id];
  if (life.money < 1) return { text: '（摸遍全身，连一把豆子都没有。' + life.mount.name + '倒不嫌弃，用脑袋蹭了蹭你——可你心里不是滋味。）' };
  life.money -= 1;
  life.mount.xun += 1;
  const lvl = xunLevelOf(life.mount.xun);
  const texts = {
    lu: [`${life.mount.name}把豆料吃干净，用鼻子拱了拱你的袖子。`, `${life.mount.name}吃得香。你坐在旁边看它吃——这画面能看一辈子。`],
    fei: [`${life.mount.name}低头啄食，吃完在你头顶盘了一圈。`, `它衔走了食，飞上高处慢慢吃——鹤有鹤的吃相。`],
    shui: [`${life.mount.name}在水边进食，尾巴拍着水花。`, `它把食顶在吻上，看你一眼，才咽下去——它记着你的好。`],
    xiong: [`${life.mount.name}三口两口吞了，喉里发出满足的咕噜。`, `它把最大的一口让给你——凶兽报恩，用食物开头。`],
  };
  const pool = texts[b?.mount?.kind === 'fei' ? 'fei' : b?.mount?.kind === 'shui' ? 'shui' : b?.mount?.kind === 'xiong' ? 'xiong' : 'lu'];
  const extra = b?.mount?.kind === 'fei' ? '' : '';
  return { text: `${game.rng.pick(pool)}\n（驯化情状：${lvl.name}——${lvl.text}）${extra}` };
}

// 骑乘：travel 已接 speed；这里给"骑乘互动"文案
export function rideFlavor(game) {
  const life = game.state.life;
  if (!life.mount) return null;
  const lvl = xunLevelOf(life.mount.xun);
  return `（${life.mount.name}驮着你，${lvl.name}的情状：${lvl.text}）`;
}

// 坐骑死亡回响（战斗/横死时调用）
export function mountDeath(game) {
  const life = game.state.life;
  if (!life.mount) return;
  game.state.world.deadNpcs.push({ name: life.mount.name, kind: 'mount' });
  game.book('殇', `痛失${life.mount.name}`);
  game.say(`（${life.mount.name}倒下了。它最后望了你的那一眼，你会记一辈子。）\n（袖中录的妖兽卷上，${life.mount.name}的名字画了一道线——猎户的规矩：画线的名字，不提。）`, 'system');
  life.mount = null;
}
