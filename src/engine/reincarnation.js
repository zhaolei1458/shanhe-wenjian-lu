// ============================================================
// 山河问剑录 · 前世主线引擎（十八期）
// captureCross：die() 时捕获未了之局（宿敌/托孤）入 meta
// rebirthEchoes：rebirth() 时接回响（旗标+印文）
// reincarnationYearTick：宿敌寻上门 / 托孤寻恩 / 守井人过所
// resolveReincarnationChoice：opt.reline 三线结算
// 口径：守井人线在第二世起开闸，每世至多现身一次；灌顶每份 meta 一次。
// ============================================================
import { NEMESIS_RETURN, TUOGU_RETURN, WELL_KEEPER } from '../content/reincarnation.js';

// ---------- die() 捕获 ----------
export function captureCross(game) {
  const life = game.state.life;
  // 宿敌：活着的关系里的宿敌——你没跟他算完
  const nem = (life.rels || []).find(r => r.kind === 'nemesis' && r.alive);
  if (nem) game.meta.crossNemesis = { name: nem.name };
  // 托孤：应了护它成年却没护到
  if (life.flags.tuogu_duty) {
    game.meta.crossTuogu = { name: life.flags.tuogu_duty.name };
    delete life.flags.tuogu_duty;
  }
}

// ---------- rebirth() 接回响 ----------
export function rebirthEchoes(game) {
  const life = game.state.life;
  const meta = game.meta;
  if (meta.crossNemesis) {
    life.flags.nemesisReturn = { ...meta.crossNemesis };
    game.say(NEMESIS_RETURN.imprint(meta.crossNemesis.name), 'imprint');
    delete meta.crossNemesis; // 一次性：账已递到今生，不再回响
  }
  if (meta.crossTuogu) {
    life.flags.tuoguReturn = { ...meta.crossTuogu };
    game.say(TUOGU_RETURN.imprint(meta.crossTuogu.name), 'imprint');
    delete meta.crossTuogu;
  }
  if ((meta.wellTokens || 0) > 0) {
    game.say(`（包袱最底下有一枚旧陶牌，刻着井纹。你从没买过它，也从没想过丢开它。）`, 'imprint');
  }
}

// ---------- 年轮三线 ----------
export function reincarnationYearTick(game) {
  const life = game.state.life;
  const meta = game.meta;
  const lives = (meta.pastLives || []).length;

  // 一、宿敌转世找上门（16 岁后每年 15%）
  if (life.flags.nemesisReturn && life.age >= 16 && game.rng.chance(0.15)) {
    const n = life.flags.nemesisReturn.name;
    life.flags.lastNemName = n;
    game.fireEvent({
      id: 're_nemesis_' + life.age,
      title: '转世的账',
      text: NEMESIS_RETURN.meetText(n),
      options: NEMESIS_RETURN.options,
    });
    delete life.flags.nemesisReturn;
    return true;
  }
  // 二、托孤的它长大了（18 岁后每年 12%）
  if (life.flags.tuoguReturn && life.age >= 18 && game.rng.chance(0.12)) {
    const n = life.flags.tuoguReturn.name;
    life.flags.lastCubName = n;
    game.fireEvent({
      id: 're_tuogu_' + life.age,
      title: '它长大了',
      text: TUOGU_RETURN.meetText(n),
      options: TUOGU_RETURN.options,
    });
    delete life.flags.tuoguReturn;
    return true;
  }
  // 三、守井人（第二世起，每世至多一次，3%）
  if (lives >= 1 && !life.flags.wellMetThisLife && game.rng.chance(0.03)) {
    life.flags.wellMetThisLife = true;
    const tokens = meta.wellTokens || 0;
    if (tokens >= 3 && !meta.wellEnlightened) {
      game.fireEvent({
        id: 're_well_offer_' + life.age,
        title: '过所齐了',
        text: WELL_KEEPER.offerText(tokens),
        options: [
          { label: '换——前世就前世，我认', reline: { act: 'enlighten' } },
          { label: '再等等——这个约不急', reline: { act: 'keep' } },
        ],
      });
    } else {
      game.fireEvent({
        id: 're_well_meet_' + life.age,
        title: '井边过所',
        text: tokens === 0 ? WELL_KEEPER.firstMeet : WELL_KEEPER.againMeet(tokens + 1),
        options: [{ label: '把陶牌收好', reline: { act: 'token' } }],
      });
    }
    return true;
  }
  return false;
}

// ---------- 结算 ----------
export function resolveReincarnationChoice(game, opt) {
  const life = game.state.life;
  const meta = game.meta;
  const act = opt.reline.act;

  if (act === 'end') {
    life.corruption = Math.min(10, (life.corruption || 0) + 1);
    game.book('怨', '与转世的宿敌滩涂死战，账虽清，手上的戾气洗不掉了');
    game.say(NEMESIS_RETURN.endWin(life.flags.lastNemName || '那个人'), 'event');
  } else if (act === 'resolve') {
    game.book('善', '把上辈子的仇化在这辈子——冤家路窄，你让了路');
    game.say(NEMESIS_RETURN.resolveText(life.flags.lastNemName || '那个人'), 'event');
  } else if (act === 'carry') {
    life.flags.nemesisCarry = true;
    game.say(NEMESIS_RETURN.carryText(life.flags.lastNemName || '那个人'), 'event');
  } else if (act === 'cub_home') {
    const n = life.flags.lastCubName || '灵兽';
    if (!life.mount) life.mount = { name: n, kind: 'kuashu', xun: 2, years: life.age };
    game.book('恩', `${n}跨世寻主，旧绳结一解，它自己留下了`);
    game.say(TUOGU_RETURN.homeText(n), 'event');
    game.state.sleeve.people['rel_kua_nem_' + n] = { name: n, desc: '跨世寻来的兽。旧绳结一解，它自由了，却自己留下了。' };
  } else if (act === 'cub_free') {
    const n = life.flags.lastCubName || '灵兽';
    life.items.push({ id: 'item_kua_fang', name: '一枚兽牙', kind: 'relic', desc: '它留下的。也许它只是来看看，你过得好不好。' });
    game.book('善', `送跨世寻恩的${n}归山，不拴野性`);
    game.say(TUOGU_RETURN.freeText(n), 'event');
  } else if (act === 'token') {
    meta.wellTokens = (meta.wellTokens || 0) + 1;
    game.say(`（袖中录·器物卷多了一枚陶牌——过所·第${meta.wellTokens}枚。）`, 'ledger');
  } else if (act === 'enlighten') {
    meta.wellTokens = 0;
    meta.wellEnlightened = true;
    life.xiwei += 200;
    game.say(WELL_KEEPER.enlightenText, 'event');
    game.book('喜', '井灵以过所换你一眼前世——记性归位，行路不同');
  } else if (act === 'keep') {
    game.say(WELL_KEEPER.keepText, 'event');
  }
}
