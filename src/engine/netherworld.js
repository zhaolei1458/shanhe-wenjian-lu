// ============================================================
// 山河问剑录 · 引擎/幽冥余程（盖棺之后、轮回之前）
// 蓝图 §六 + GDD §4.4：寿终者走幽冥主线；横死者可被勾魂（短流程）；
// 道成者不入幽冥，直接跳出轮回。
// 实现方式：动态构建事件链（正文全部预写在 content/youming.js），
// 复用事件系统的选项交互；轮回井抉择落定后 finalizeDeath。
// ============================================================

import {
  DIAN, LEDGER_DIAN, DIYU, HUANGQUAN, WANGXIANG,
  NAIHEQIAO, MENGPO_ASK, MENGPO_DRINK, MENGPO_REFUSE,
  LUNHUI_INTRO, LUNHUI_PATHS, GUREN_SOUL, GOUHUN_SHORT,
} from '../content/youming.js';

// ---------- 入口：death 分派到这里（game.die 调用） ----------
export function beginNetherworld(game, kind, text) {
  const state = game.state;
  const life = state.life;
  life.diedOf = kind;
  state.afterlife = { kind, step: 'huangquan' };
  game.say(text || '那一日，你躺下来，就没能再起来。', 'death');
  game.ui.mode = 'event';
  game.nwStep('huangquan');
}

// ---------- 各步构建 ----------
export function buildStep(game, step) {
  const state = game.state;
  const life = state.life;
  const aw = state.afterlife;

  if (step === 'huangquan') {
    const body = (kind => {
      const arr = HUANGQUAN[kind] || HUANGQUAN.shouzhong;
      return arr[game.rng.int(0, arr.length - 1)];
    })(aw.kind);
    // 横死被勾魂：短流程提示后直抵望乡台
    const opts = aw.kind === 'hengsi'
      ? [{ label: '随阴差前行', effect: {}, text_after: GOUHUN_SHORT[0], nw: { goto: 'wangxiang' } }]
      : [{ label: '沿黄泉路前行', effect: {}, nw: { goto: 'wangxiang' } }];
    return { id: 'nw_huangquan', text: body, options: opts };
  }

  if (step === 'wangxiang') {
    return {
      id: 'nw_wangxiang',
      text: WANGXIANG[0],
      options: [{ label: '看完这最后一眼，转身', effect: {}, nw: { goto: 'after_wangxiang' } }],
    };
  }

  if (step === 'guren') {
    // 恩账有解者：故人魂魄相候（每世至多一次）
    const en = state.ledger.find(l => l.type === '恩' && l.resolved);
    if (en) {
      aw.gurenDone = true;
      return {
        id: 'nw_guren',
        text: GUREN_SOUL[0] + `\n（【恩】${en.text}）`,
        options: [{ label: '郑重收下，道谢作别', effect: { karmicClear: '恩' }, nw: { goto: 'dian_or_qiao' } }],
      };
    }
    return null;
  }

  if (step === 'dian') {
    // 十殿审账：按账册类型分派（蓝图：每一殿对应旧账册的一类条目）
    const queue = aw.dianQueue || [];
    const dianId = queue[aw.dianIdx || 0];
    const d = DIAN[dianId];
    aw.dianIdx = (aw.dianIdx || 0) + 1;
    const entries = state.ledger.filter(l => LEDGER_DIAN[l.type] === dianId).slice(0, 2);
    const entryText = entries.map(l => `【${l.type}】${l.text}${l.resolved ? '（已了）' : '（未了）'}`).join('\n');
    const opts = [];
    if (dianId === 'liudian' && entries.some(l => !l.resolved)) {
      opts.push({
        label: '喊冤——把没说清的说清',
        effect: {},
        text_after: '你把那桩事的来龙去脉原原本本讲了。卞城王听完，从满殿未拆的信里拣出一封，拆开、念完，提笔批了四个字："情有可原。"那笔未了的账，在你眼前化开了。（旧账册添批：已了。）',
        effect2: { karmicResolve: true },
        nw: { goto: 'next' },
      });
    } else {
      opts.push({
        label: '静默过殿',
        effect: {},
        text_after: dianId === 'yidian'
          ? '秦广王翻完总账，用朱笔在册尾轻轻勾了一道。善行者过殿如流水——你这一殿，走得不算慢，但走得干净。'
          : '你低着头，把这一殿的账一笔一笔听完。烛火很静，静得能听见账页翻动的声音。',
        nw: { goto: 'next' },
      });
    }
    return { id: 'nw_dian_' + dianId, text: `${d.scene}\n${entryText ? '案上摊开的，正是你的账：\n' + entryText : ''}`, options: opts };
  }

  if (step === 'shibaceng') {
    // 业重者受审/游历；有恩账二笔以上可代刑（蓝图：死后最重的落子）
    const sha = state.ledger.filter(l => l.type === '杀').length;
    const e_en = state.ledger.filter(l => l.type === '恩' && l.resolved).length;
    const layers = DIYU.slice(0, Math.max(1, Math.min(4, sha)));
    const body = layers.map(x => x.text).join('\n');
    const opts = [];
    if (e_en >= 1 && sha >= 1) {
      opts.push({
        label: '代刑——以你的善业，替故人抵一层',
        effect: { daiti: true },
        text_after: '你跪在刀山前，把那份恩业双手捧了出去。刀山深处传来一声极轻的响，像有人卸下了千斤担。十八层从不减免，但今日——有一层，是替别人扛的。（旧账册批注：代刑一笔，恩业化尽。）',
        nw: { goto: 'naiheqiao' },
      });
    }
    opts.push({ label: '一步一步走完', effect: {}, text_after: '你走完了属于自己的层。每一层都留了点什么，也都拿走了点什么。出来时，掌刑的鬼差难得递给你一碗热水。', nw: { goto: 'naiheqiao' } });
    return { id: 'nw_shibaceng', text: `十八层的门在你面前打开。门后是很深很深的下行台阶。\n${body}`, options: opts };
  }

  if (step === 'naiheqiao') {
    return {
      id: 'nw_naiheqiao',
      text: NAIHEQIAO[0] + '\n' + MENGPO_ASK[0],
      options: [
        { label: '端起碗，一饮而尽（抹去印记，重新开始）', effect: {}, text_after: MENGPO_DRINK[0], nw: { goto: 'lunhui', mengpo: 'drink' } },
        { label: '把碗推回去，带着执念过桥（印记浓，来世心魔重）', effect: {}, text_after: MENGPO_REFUSE[0], nw: { goto: 'lunhui', mengpo: 'refuse' } },
      ],
    };
  }

  if (step === 'lunhui') {
    // 六道分派（文字化定来世底色）
    const mai = ['yao', 'mo', 'fo', 'ti', 'jian'].filter(m => life.gongfa.some(g => g.mai === m)).length;
    const sha = state.ledger.filter(l => l.type === '杀').length;
    const realmIdx = game.REALMS ? (game.REALMS[life.realm]?.idx || 0) : 0;
    const path = realmIdx >= 4 || mai >= 3 ? LUNHUI_PATHS.xian
      : sha >= 3 ? LUNHUI_PATHS.xiu
        : sha >= 1 && state.ledger.filter(l => l.type === '恩').length === 0 ? LUNHUI_PATHS.chu
          : LUNHUI_PATHS.ren;
    aw.path = path.name;
    return {
      id: 'nw_lunhui',
      text: LUNHUI_INTRO[0] + '\n' + path.text,
      options: [{ label: '纵身，入光', effect: {}, nw: { final: 'lunhui' } }],
    };
  }

  return null;
}

// ---------- 链调度（game.nwStep 调用） ----------
export function nwAdvance(game, step) {
  const aw = game.state.afterlife;
  if (!aw) return;
  const state = game.state;

  // 调度步：不构建事件，只决定下一步
  if (step === 'after_wangxiang') {
    // 横死短流程直抵奈何桥；寿终/求仁走 故人→十殿
    if (aw.kind === 'hengsi') return game.nwStep('naiheqiao');
    const hasGuren = state.ledger.some(l => l.type === '恩' && l.resolved) && !aw.gurenDone;
    if (hasGuren) return game.nwStep('guren');
    return game.nwStep((aw.dianQueue || []).length ? 'dian' : 'naiheqiao');
  }
  if (step === 'dian_or_qiao') {
    return game.nwStep((aw.dianQueue || []).length ? 'dian' : 'naiheqiao');
  }
  if (step === 'next') {
    // 过完一殿：还有殿继续；否则按业判十八层或直抵桥
    const queue = aw.dianQueue || [];
    if ((aw.dianIdx || 0) < queue.length) return game.nwStep('dian');
    const sha = state.ledger.filter(l => l.type === '杀').length;
    const eBad = state.ledger.filter(l => l.type === '恶').length;
    return game.nwStep(sha + eBad >= 2 ? 'shibaceng' : 'naiheqiao');
  }

  const ev = buildStep(game, step);
  if (!ev) return game.nwStep('naiheqiao');
  game.fireEvent(ev);
}

// ---------- 入幽冥前算好过殿队列（放 state.afterlife.dianQueue） ----------
export function planDianQueue(state) {
  const seen = [];
  for (const l of state.ledger) {
    const d = LEDGER_DIAN[l.type];
    if (d && !seen.includes(d)) seen.push(d);
  }
  // 恒过：一殿总账、九殿总评、十殿发配
  for (const must of ['yidian', 'jiudian', 'shidian']) if (!seen.includes(must)) seen.push(must);
  return seen;
}
