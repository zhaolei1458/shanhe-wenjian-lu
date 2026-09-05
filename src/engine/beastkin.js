// ============================================================
// 十二期 v12.0：灵兽奇缘·获得三式 + 兽寿不同轨（07 册 §四）
// 拾蛋——野外/绝地得蛋，不知何兽，暖养破壳才见真身；
// 救崽——盗猎者/天敌/灾祸中救下幼崽；
// 托孤——高阶灵兽临终托付，看的是你此前对兽、对弱者的作为；
// 兽寿不同轨——凡马二十年，灵鹤三百载，总有一别。
// ============================================================
import { BEASTS } from '../content/beasts.js';
import { BEAST_EGGS, CUB_RESCUES, TUOGU_SCENES } from '../content/beastEggs.js';

// 兽寿表：未列者按类给凡寿
export const MOUNT_LIFESPANS = {
  beast_junma: 18, beast_malanju: 22, beast_luotuoniao: 25, beast_yetu: 10, beast_yegou: 14, beast_yezhu: 16,
  beat_xianhe: 300, beat_dapeng: 500, beast_yinglong: 400, beast_kuiniu: 300, beast_jiao: 200, beast_xuanwu_zai: 400,
};
export const LIFESPAN_DEFAULT = 25;
export function lifespanOf(beastId) { return MOUNT_LIFESPANS[beastId] || LIFESPAN_DEFAULT; }

// ---- 拾蛋（T3 通道）：yearTick 低频掷签 ----
export function maybeFindEgg(game) {
  const life = game.state.life;
  if (!life.eggs) life.eggs = [];
  if (life.eggs.length >= 2 || life.mount) return false;
  if (!game.rng.chance(0.05)) return false;
  const owned = new Set(life.eggs.map(e => e.eggId));
  const pool = BEAST_EGGS.filter(e => !owned.has(e.id));
  if (!pool.length) return false;
  const egg = game.rng.pick(pool);
  life.eggs.push({ eggId: egg.id, progress: 0 });
  game.say(`（${egg.where}，你拾了一枚${egg.name}。不知道是什么兽的蛋——孵出来才算数。${egg.hint}）`, 'ambient');
  game.book('记', `拾得${egg.name}，不知何兽`);
  return true;
}

// ---- 焐蛋孵化：意头「焐蛋」——养法即谜题，暖够三回破壳 ----
export function hatchEgg(game) {
  const life = game.state.life;
  if (!life.eggs || !life.eggs.length) {
    game.say(game.rng.pick([
      '（你身上没有蛋。想孵，先得在路上拾着一枚——缘分不蹲在家里。）',
      '（怀里空空。蛋这东西，是山里海边白捡的机缘，不是钱能买的。）',
    ]), 'ambient');
    return;
  }
  const rec = life.eggs[0];
  const egg = BEAST_EGGS.find(e => e.id === rec.eggId);
  rec.progress += 1;
  if (rec.progress < 3) {
    game.say(`【焐蛋】${game.rng.pick(egg.warm)}\n（${egg.name}——${rec.progress === 1 ? '壳心刚有了活气，还得焐。' : '壳里的动静大了，就这一两回了。'}）`, 'ambient');
    return;
  }
  const b = BEASTS[egg.beastId];
  life.eggs.shift();
  life.mount = {
    id: egg.beastId, name: b?.name || egg.beastId,
    kind: b?.mount?.kind || 'lu', speed: b?.mount?.speed || 1,
    xun: 2, years: 0, cub: true,
    desc: '破壳第一眼看见的是你——它把这一辈子看给你了。',
  };
  if (!life.beastBook.includes(egg.beastId)) life.beastBook.push(egg.beastId);
  game.say(`【破壳】${egg.hatchText}`, 'ambient');
  game.book('缘', `${egg.name}破壳，${life.mount.name}认你为主`);
}

// ---- 救崽：盗猎者/天敌/灾祸，两选项 ----
export function maybeCubRescue(game) {
  const life = game.state.life;
  if (game.pending) return false;
  if (!game.rng.chance(0.035)) return false;
  const done = life.flags.doneCubRescues || [];
  const pool = CUB_RESCUES.filter(s => !done.includes(s.id) && BEASTS[s.beastId]);
  if (!pool.length) return false;
  const sc = game.rng.pick(pool);
  game.fireEvent({
    id: 'cub_' + sc.id,
    title: '救崽',
    text: `${sc.text}\n\n${sc.beastText}`,
    options: [
      { label: '救', cub: { mode: 'rescue', sceneId: sc.id, beastId: sc.beastId }, effect: {} },
      { label: '别多事', effect: { ren: -2 } },
    ],
  });
  return true;
}

// ---- 救崽/托孤结算 ----
export function resolveCubChoice(game, cub) {
  const life = game.state.life;
  if (cub.mode === 'rescue') {
    const b = BEASTS[cub.beastId];
    if (!life.flags.doneCubRescues) life.flags.doneCubRescues = [];
    life.flags.doneCubRescues.push(cub.sceneId);
    if (!life.mount) {
      life.mount = { id: cub.beastId, name: b?.name || cub.beastId, kind: b?.mount?.kind || 'lu', speed: b?.mount?.speed || 1, xun: 3, years: 0, cub: true, desc: '它记得你是从哪儿把它抱走的。忠不可夺。' };
      if (!life.beastBook.includes(cub.beastId)) life.beastBook.push(cub.beastId);
      game.say(`（你把它带走了。${b?.name || '小家伙'}在你怀里抖了抖——它记住这一抱了。兽记恩，比人记恩久。）`, 'ambient');
      game.book('恩', `救下${b?.name || cub.beastId}，结为伙伴`);
    } else {
      game.say(`（你把它从夹子上解下来，敷了药，放了。它瘸着走两步，回头看你一眼——兽不说话，兽记情。）`, 'ambient');
      game.book('恩', `救下${b?.name || cub.beastId}一命`);
    }
  } else if (cub.mode === 'tuogu') {
    const sc = TUOGU_SCENES.find(s => s.id === cub.sceneId);
    if (sc) {
      if (!life.eggs) life.eggs = [];
      life.eggs.push({ eggId: sc.cubId, progress: 2 }); // 托孤之卵已在亲兽翼下焐过，只差一暖
      life.flags.tuogu_duty = { name: BEASTS[sc.beastId]?.name || '灵兽', dueYear: game.state.world.year + 3 };
      game.say(`（${sc.dutyText}）\n（你把那枚卵揣进了怀里。这份托付有分量——护它成年，是你应下的事。）`, 'ambient');
      game.book('诺', `受${BEASTS[sc.beastId]?.name || '灵兽'}临终托孤`);
    }
  }
}

// ---- 托孤择主：缘分门槛——善账 ≥2 笔，或喂过兽/救过崽 ----
export function maybeTuogu(game) {
  const life = game.state.life;
  if (game.pending || life.age < 20) return false;
  if (!game.rng.chance(0.02)) return false;
  const good = game.state.ledger.filter(l => l.type === '恩' || l.type === '善').length;
  const fed = Object.keys(life.flags).some(f => f.startsWith('fed_')) || (life.flags.doneCubRescues || []).length > 0;
  if (good < 2 && !fed) return false;
  const done = life.flags.doneTuogu || [];
  const pool = TUOGU_SCENES.filter(s => !done.includes(s.id) && BEASTS[s.beastId]);
  if (!pool.length) return false;
  const sc = game.rng.pick(pool);
  game.fireEvent({
    id: 'tg_' + sc.id,
    title: '托孤',
    text: `${sc.text}\n\n${sc.dutyText}`,
    options: [
      { label: '应下——护它成年', cub: { mode: 'tuogu', sceneId: sc.id }, effect: {} },
      { label: '摇头走开（我连自己都顾不上）', effect: { xin: -2 } },
    ],
  });
  return true;
}

// ---- 兽寿不同轨：年轮推进 ----
export function mountAging(game) {
  const life = game.state.life;
  if (!life.mount) return;
  const m = life.mount;
  m.years = (m.years || 0) + 1;
  const span = lifespanOf(m.id);
  if (m.cub && m.years === 2) {
    m.cub = false;
    game.say(`（${m.name}长成了。幼时的怯没了，骨架展开了——当年那个小团子，如今站在你身边像一堵墙。）`, 'ambient');
  }
  if (m.years > span) {
    game.say(game.rng.pick([
      `（${m.name}老了。今年开春，它卧在檐下晒太阳，晒着晒着就睡了过去——很安详。它送了你${m.years}年，最后这程，换你送它。）`,
      `（${m.name}没能熬过这个冬天。走的前一夜，它把头搁在你膝上，由着你摸了一夜。兽不说话——它把一辈子都过给你看了。）`,
    ]), 'ambient');
    game.book('殇', `${m.name}寿终，送了它最后一程`);
    if (!life.beastFarewells) life.beastFarewells = [];
    life.beastFarewells.push(m.name);
    life.mount = null;
    return;
  }
  if (m.years === 5) game.say(`（${m.name}随你五年了。它认得你的脚步声，隔着半条街就开始张望。）`, 'ambient');
  else if (m.years === 10) game.say(`（${m.name}随你十年了。鬃毛里掺了霜色——它的十年，抵得过人的半辈子。）`, 'ambient');
  else if (m.years === span - 2) game.say(`（${m.name}老了。它走得慢了，可每次你出门，它还是要起来相送。）`, 'ambient');
}

// ---- 托孤责任应验：三年之诺，到期看崽 ----
export function checkTuoguDuty(game) {
  const life = game.state.life;
  const duty = life.flags.tuogu_duty;
  if (!duty || game.state.world.year < duty.dueYear) return;
  delete life.flags.tuogu_duty;
  const grown = life.mount && life.mount.name === duty.name;
  if (grown) {
    game.say(`（三年前那只${duty.name}托付的崽，如今在你身边长成了——你应下的「护它成年」，办到了。老兽托付的东西，你没让它落空。）`, 'ambient');
    game.book('善', `护${duty.name}成年，不负所托`);
  } else {
    game.say(`（三年前你应下要护它成年——那孩子如今在哪儿，你心里清楚。诺言这东西，兽听不懂，可你听得懂。）`, 'ambient');
    game.book('怨', `未护${duty.name}成年，有负所托`);
  }
}
