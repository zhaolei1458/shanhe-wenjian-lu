
/* ======================================================================
 * §27 v21 挖宝系统 DigSys（藏宝图使用 → 按档结算奖池）
 * 藏宝图 type:'map'，digTier 1/2/3 对应 GameData.TREASURE_POOL 三档奖池；
 * 随处可挖（公子定夺：不做地域限制）。负面彩蛋：挖空 / 惊动守宝妖兽。
 * ====================================================================== */
const DigSys = {
  /** 挖掘开场叙事（按档） */
  OPEN_TEXT: {
    1: ['你按图索骥，在荒坡野径间寻到一处微微隆起的土丘——图上所记「老槐三尺」，正是此处。',
        '图上墨迹残缺，你比对着山形水势走了半日，总算在乱石堆下觅得一处可疑的松土。'],
    2: ['图上灵光隐现，你循着灵机涨落之处掘开浮土——底下赫然是一方古修埋藏的青石匣。',
        '古图所载的断碑犹在，碑后三尺，灵机隐隐。你屏息下铲——'],
    3: ['图角仙篆微微发烫，你依着星位推演，脚下灵机如潮涌动——仙家遗宝，近在咫尺。',
        '掘地丈余，一缕先天灵光自土缝中溢出——图上仙篆所指，正是此地！'],
  },
  EMPTY_TEXT: [
    '掘开之后，只有半截断碑，字迹早已难辨——此图所记，怕是早已被人捷足先登。',
    '坑底空空如也，只余一只朽烂的木匣——来人比你早了不知几百年。',
    '掘到三尺，挖出一窝冬眠的灵鼠——它们龇着牙看你，图中宝藏却杳无踪影。',
  ],
  /** 守宝妖兽候选（按档，取 power 相近者） */
  GUARD_POOL: {
    1: ['m_yezhu', 'm_dushe', 'm_shanlang', 'm_qingbei'],
    2: ['m_tiexia', 'm_liedi', 'm_xiezi', 'm_fengbao'],
    3: ['m_yaohu', 'm_heijiao', 'm_xiongyuan', 'm_yinshou'],
  },

  /** 使用藏宝图（背包「寻宝」入口） */
  async dig(mapId) {
    const p = Game.player;
    if (Battle.active || p.dead) return;
    const def = GameData.ITEMS[mapId];
    if (!def || def.type !== 'map' || !Bag.count(mapId)) return;
    const tier = def.digTier || 1;
    const open = Utils.pick(this.OPEN_TEXT[tier] || this.OPEN_TEXT[1]);
    const ok = await UI.popup({
      title: `寻宝 · ${def.name}`,
      html: `${open}<br><br><span class="tip-line">掘宝或有斩获，亦可能挖空，甚至惊动守宝之物——且挖且珍惜。</span>`,
      options: [{ text: '开 掘', value: true, primary: true }, { text: '再等等', value: false }],
    });
    if (!ok) return;
    Bag.removeItem(mapId, 1);
    Time.add(2);
    if (p.dead) return;
    p.counters.digs = (p.counters.digs || 0) + 1;
    const eco = GameData.stoneEco(p.realmIdx);
    // 负面彩蛋（约一成）：挖空 / 守宝妖兽
    const bad = Utils.chance(10);
    if (bad && Utils.chance(40)) {
      Log.add(`${open}你奋力掘开——${Utils.pick(this.EMPTY_TEXT)}`, 'loss');
      Game.afterAction();
      return;
    }
    if (bad) {
      const mid = Utils.pick(this.GUARD_POOL[tier] || this.GUARD_POOL[1]);
      Log.add(`${open}铲下铮然一声脆响——土中沉睡的 <b>${GameData.MONSTERS[mid].name}</b> 被惊醒了！它双目赤红，直扑你而来！`, 'warn');
      await Utils.sleep(500);
      Game.afterAction();   // 先持久化，再入战斗；战胜后正常结算掉落
      Battle.start(mid, { mapName: '藏宝之地', ambush: true });
      return;
    }
    // 奖池结算
    const pool = (GameData.TREASURE_POOL || {})[tier] || [];
    const gains = [];
    const nPick = 1 + (Utils.chance(25) ? 1 : 0);   // 四分之一几率双彩
    for (let i = 0; i < nPick; i++) {
      const entry = this.rollPool(pool);
      if (!entry) continue;
      if (entry.stones) {
        const amount = Math.round(Utils.rand(entry.stones[0], entry.stones[1]) * eco);
        Bag.addStones(amount);
        gains.push(`灵石 ${Utils.fmtNum(amount)}`);
      } else if (entry.item) {
        const q = entry.qty || 1;
        Bag.addItem(entry.item, q);
        gains.push(`${GameData.ITEMS[entry.item].name} ×${q}`);
      } else if (entry.mats) {
        const t = Utils.clamp(entry.mats[Utils.rand(0, entry.mats.length - 1)], 1, 4);
        const mat = Utils.pick(GameData.matsByTier(t));
        Bag.addItem(mat, 1);
        gains.push(`${GameData.ITEMS[mat].name} ×1`);
      } else if (entry.from) {
        const id = Utils.pick(entry.from);
        Bag.addItem(id, 1);
        gains.push(`${GameData.ITEMS[id].name} ×1`);
      }
    }
    const tail = Utils.pick([
      '你拂去尘土，将宝物收入储物袋——古人诚不我欺。',
      '掘宝功成。你拱手朝土丘一拜：「叨扰了。」',
      '匣开宝现，灵光盈袖——这一趟，值了。',
    ]);
    Log.add(`你掘开藏宝之所，得：<b class="hl">${gains.join('、') || '一捧灵土'}</b>。${tail}`, 'gain');
    if (gains.length >= 2) Ambience.sfx('rare');
    Game.afterAction();
  },
  /** 加权抽取一个奖池条目 */
  rollPool(pool) {
    if (!pool || !pool.length) return null;
    const total = pool.reduce((s, e) => s + (e.w || 1), 0);
    let r = Math.random() * total;
    for (const e of pool) { r -= (e.w || 1); if (r <= 0) return e; }
    return pool[pool.length - 1];
  },
};
