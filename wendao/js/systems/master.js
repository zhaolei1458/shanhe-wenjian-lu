/* ======================================================================
 * §27 师承系统 MasterSys（3.6a 散人拜师最小闭环）
 * 设计：设计-3.6-师承与门派恩仇.md
 *   - 拜师不锁死门派：八位散人高人可拜（叶孤鸿/燕回时/陆吾/谢惊鸿/姜暮寒/红绡/云无月/老酒鬼）
 *   - 拜师三关：递帖（好感门槛）→ 考验（切磋或奉物）→ 奉礼
 *   - 教导五事：传功（拜师礼赠功法）/ 指路（师命任务）/ 护道（战败救援）/ 赐宝（请安偶得）/ 传艺（被动加成）
 *   - 敬师值 bond 0~100：请安/论道/师命涨，护道耗；60 可求传功，40/70 两档被动
 * ====================================================================== */
const MasterSys = {
  /* ---------- 师父名册（npcId → 师承定义） ---------- */
  DEFS: {
    n4:  { line: '刀道', temperKey: '冷厉', bondNeed: 55,
      trial: { kind: 'spar', name: '接他三刀', desc: '叶孤鸿斜眼打量你半晌，下巴朝切磋台一抬："接我三刀。刀下站着的，才配问路。"' },
      teach: { gongfa: 'gf_hansha', needRealm: 1, name: '寒沙掌' },
      passive: { atkPct: 6 }, giftPool: ['pill_shengui'],
      quips: ['「……」', '「还活着。」', '「刀，磨了没有。」', '「别死在别人手里。」'] },
    n24: { line: '侠剑', temperKey: '侠气', bondNeed: 40,
      trial: { kind: 'spar', name: '侠者三问', desc: '燕回时按剑而笑："剑上有三分侠气吗？先与我走三招，再谈拜师。"' },
      teach: { gongfa: 'gf_fenglei', needRealm: 1, name: '风雷剑诀' },
      passive: { atkPct: 5 }, giftPool: ['tal_jinguang'],
      quips: ['「路见不平，还是躲远点？」', '「剑要直，人要正。」', '「今日行侠了么？」'] },
    n6:  { line: '炼体', temperKey: '豪爽', bondNeed: 40,
      trial: { kind: 'spar', name: '站桩挨拳', desc: '陆吾咧嘴一笑："俺这师父没啥教的，就一条——站得住！来，挨俺三拳试试！"' },
      teach: { gongfa: 'gf_bumie', needRealm: 1, name: '不灭金身' },
      passive: { hpPct: 6, defPct: 3 }, giftPool: ['pill_shengui', 'pill_liaoshang'],
      quips: ['「吃饱没？吃饱才有力气练！」', '「骨头还硬朗嘛！」', '「练体如盖房，地基要实！」'] },
    n12: { line: '盗术·身法', temperKey: '狡黠', bondNeed: 50,
      trial: { kind: 'fetch', items: [['m_yaopi', 2]], name: '顺手牵皮', desc: '谢惊鸿眼珠一转："想学我的本事？行啊——去弄两张妖皮来。怎么弄的，我不问。"' },
      teach: { gongfa: 'gf_zhouyu', needRealm: 2, name: '周天御风步' },
      passive: { dodge: 3, stonePct: 5 }, giftPool: ['pill_huiyuan'],
      quips: ['「嘘——今天谁也没见过我。」', '「身法这东西，练的是心虚。」', '「昨夜月色不错。」'] },
    n9:  { line: '符道', temperKey: '古怪', bondNeed: 50,
      trial: { kind: 'fetch', items: [['tal_huoshe', 2]], name: '画符过关', desc: '姜暮寒头也不抬："手稳不稳，画两道火蛇符来看看。歪一分，滚。"' },
      teach: { gongfa: 'gf_zixiao', needRealm: 2, name: '紫霄仙雷' },
      passive: { pillPct: 8 }, giftPool: ['tal_zilei'],
      quips: ['「朱砂又贵了……」', '「笔锋抖什么。」', '「雷符之祖，画的是天意。」'] },
    n22: { line: '离火', temperKey: '危险', bondNeed: 60,
      trial: { kind: 'fetch', items: [['m_lingzhi', 3]], name: '灵草炼命', desc: '红绡指尖绕着一缕发丝："血罗刹也怕死——三株灵芝，炼命续魂的方子缺药。弄来，我传你三分火候。"' },
      teach: { gongfa: 'gf_lihuo', needRealm: 2, name: '离火焚天诀' },
      passive: { atkPct: 5 }, giftPool: ['pill_liaoshang', 'pill_bixue'],
      quips: ['「这世道，恩怨分明才活得长。」', '「火候到了，人心也就熟了。」'] },
    n13: { line: '魔功', temperKey: '危险', bondNeed: 60,
      trial: { kind: 'fetch', items: [['m_zhenxiu', 2]], name: '魔宫夜宴', desc: '云无月笑意不达眼底："魔宫夜宴缺一道主菜，珍馐两味。去办。——别问席上坐的是谁。"' },
      teach: { gongfa: 'gf_tumo', needRealm: 3, name: '屠魔剑典' },
      passive: { atkPct: 8 }, giftPool: ['pill_bixue'],
      quips: ['「胆子不小。」', '「正道的人，都这么无趣么？」', '「月色很好，适合办事。」'] },
    n23: { line: '醉道', temperKey: '癫狂', bondNeed: 45,
      trial: { kind: 'spar', name: '醉里乾坤', desc: '老酒鬼打了个酒嗝："想学？先陪我过三招——嗝——赢了这壶酒就归你！"' },
      teach: { gongfa: 'gf_taiji', needRealm: 3, name: '太极衍图' },
      passive: { cult: 8 }, giftPool: ['pill_huiyuan'],
      quips: ['「酒！酒呢！」', '「天地一壶，众生皆醉……嗝。」', '「你身上有股仄气，像三年前的我。」'] },
  },

  /* ---------- 查询 ---------- */
  def(id) { return this.DEFS[id] || null; },
  master(p) { return (p.master && p.master.stage) ? p.master : null; },
  state(p, id) { return (p.npcs && p.npcs[id]) || null; },
  isCandidate(p, id) {
    const d = this.def(id), s = this.state(p, id);
    if (!d || !s || !s.alive) return false;
    const cur = p.master;
    if (cur && cur.stage && cur.stage !== 'dead') return false;   // 已有师父（含考验中）；先师既去可另投
    if (p.partner === id || (p.sworn || []).includes(id)) return false;  // 道侣/结拜不收徒（各论各的）
    return s.realmIdx > p.realmIdx;                  // 师父须高你一境
  },
  today(p) { return Math.floor(p.day || 0); },

  /* ---------- 拜师三关 ---------- */
  async baishi(id) {
    const p = Game.player;
    const d = this.def(id);
    if (!this.isCandidate(p, id)) return;
    const D = this.def(id), s = this.state(p, id);
    const need = D.bondNeed;
    if (s.rel < need) {
      UI.toast(`交情不足：${d.name} 的性子，交情须过 ${need}（当前 ${s.rel}）。江湖同行、赠礼论道，慢慢来。`);
      return;
    }
    const ok = await UI.popup({
      title: `执弟子礼 · ${d.name}`,
      html: `<b>${d.name}</b>（${d.title} · ${GameData.REALM_NAMES[s.realmIdx]}期 · ${D.line}一脉）<br><br>${D.trial.desc}<br><br><span style="color:var(--text-faint)">考验方式：${D.trial.kind === 'spar' ? '与师父切磋获胜一场' : '备齐考验所需之物，回来递帖'}</span>`,
      options: [{ text: '递上拜师帖', value: true, primary: true }, { text: '再想想', value: false }],
    });
    if (!ok) return;
    p.master = {
      npcId: id, stage: 'trial', bond: 0, joinedDay: this.today(p),
      trial: { kind: D.trial.kind, name: D.trial.name, items: D.trial.kind === 'fetch' ? D.trial.items.map(x => [x[0], x[1]]) : null, wins0: s.sparWins || 0 },
      task: null, qinganDay: -1, lundaoDay: -1, protectDay: -1, taught: [], gifts: [],
    };
    Log.add(`你向 ${d.name} 递上拜师帖。考验·【${D.trial.name}】开始了。`, 'event');
    Story.chron(`递帖拜师：${d.name} 门下，考验【${D.trial.name}】`);
    if (D.trial.kind === 'spar') NpcSys.spar(id);   // 直接开切磋
    else UI.toast('备齐考验之物后，来师承页递帖。');
    Game.afterAction();
  },
  /** 考验是否已成 */
  trialReady(p) {
    const m = this.master(p);
    if (!m || m.stage !== 'trial') return false;
    const D = this.def(m.npcId), s = this.state(p, m.npcId);
    if (!D || !s) return false;
    if (D.trial.kind === 'spar') return (s.sparWins || 0) > m.trial.wins0;
    if (D.trial.kind === 'fetch') return D.trial.items.every(([iid, n]) => Bag.count(iid) >= n);
    return false;
  },
  /** 第三关·奉礼，转正 */
  async offerGift() {
    const p = Game.player;
    const m = this.master(p);
    if (!m || m.stage !== 'trial' || !this.trialReady(p)) return;
    const D = this.def(m.npcId), d = NpcSys.def(m.npcId);
    const cost = D.line === '盗术·身法' ? 0 : Math.round(200 * GameData.stoneEco(this.state(p, m.npcId).realmIdx));
    let html = `${D.trial.name}——成了！<br>${d.name} 眼里的审视淡了几分。`;
    if (cost > 0) html += `<br><br>拜师礼：灵石 <b>${Utils.fmtNum(cost)}</b>`;
    else html += `<br><br>${d.name} 摆摆手："钱免了，心诚就够。"`;
    const st0 = Game.player.stones, total = st0.low + st0.mid * 100 + st0.high * 10000;   // 门槛看总资产（spendStones 会自动兑换）
    if (total < cost) { UI.toast('拜师礼的灵石还凑不齐'); return; }
    if (cost > 0) {
      const go = await UI.popup({ title: '第三关 · 奉礼', html, options: [{ text: '焚香奉礼', value: true, primary: true }, { text: '缓一缓', value: false }] });
      if (!go) return;
      Bag.spendStones(cost);
    } else {
      UI.popup({ title: '第三关 · 奉礼', html, options: [{ text: '叩首', value: true, primary: true }] });
    }
    if (D.trial.kind === 'fetch') {
      for (const [iid, n] of D.trial.items) Bag.removeItem(iid, n);
    }
    m.stage = 'active';
    m.bond = 35;
    Log.add(`三拜九叩，礼成！<b>${d.name}</b> 正式收你入门墙——师承 ${D.line}一脉。（敬师值 +35）`, 'system');
    Story.chron(`拜入 ${d.name} 门下（${D.line}一脉）`);
    Game.afterAction();
  },

  /* ---------- 教导五事 ---------- */
  async qingan() {
    const p = Game.player;
    const m = this.master(p);
    if (!m || m.stage !== 'active') return;
    const d = NpcSys.def(m.npcId), s = this.state(p, m.npcId);
    if (!s || !s.alive) return;
    if (m.qinganDay === this.today(p)) { UI.toast('今日已请过安了'); return; }
    m.qinganDay = this.today(p);
    const D = this.def(m.npcId);
    const gain = Utils.rand(2, 4);
    m.bond = Utils.clamp(m.bond + gain, 0, 100);
    Time.add(1);
    let extra = '';
    if (m.bond >= 50 && Utils.chance(15)) {
      const g = Utils.pick(D.giftPool);
      Bag.addItem(g, 1);
      m.gifts.push(g);
      extra = `<br>${d.name} 从袖中取出一件物事：「拿着。——你如今是我门中人，别坠了名头。」<br>获赠【${GameData.ITEMS[g].name}】`;
      Log.add(`师赐！【${GameData.ITEMS[g].name}】`, 'gain');
    }
    const quip = Utils.pick(D.quips);
    Log.add(`你至 ${d.name} 处请安问礼。${quip ? `<span style="color:var(--text-faint)">${d.name}：${quip}</span>` : ''}（敬师 +${gain}）${extra}`, 'info');
    Game.afterAction();
  },
  async lundao() {
    const p = Game.player;
    const m = this.master(p);
    if (!m || m.stage !== 'active') return;
    const d = NpcSys.def(m.npcId), s = this.state(p, m.npcId);
    if (!s || !s.alive) return;
    if (m.lundaoDay === this.today(p)) { UI.toast('今日已论过道了'); return; }
    if (m.bond < 30) { UI.toast('师徒之谊尚浅，师父只肯点到即止'); return; }
    m.lundaoDay = this.today(p);
    const D = this.def(m.npcId);
    const gain = Math.round((60 + s.realmIdx * 40) * GameData.eco(p.realmIdx) * (0.8 + s.realmIdx * 0.1));
    Cultivate.addExp(p, gain);
    p.insight = Math.min(100, (p.insight || 0) + 2);
    m.bond = Utils.clamp(m.bond + 1, 0, 100);
    Time.add(2);
    Log.add(`你与师父 ${d.name} 席地论道，一言一语皆有进益。（修为 +${Utils.fmtNum(gain)}，感悟 +2，敬师 +1）`, 'gain');
    Game.afterAction();
  },
  /** 师命：接 */
  async taskAccept() {
    const p = Game.player;
    const m = this.master(p);
    if (!m || m.stage !== 'active') return;
    if (m.task) { UI.toast('师命在身，先去办完'); return; }
    const s = this.state(p, m.npcId);
    const D = this.def(m.npcId);
    const mrp = Utils.clamp(s.realmIdx * 4 + s.layer, 0, 60);
    let t = null;
    if (Utils.chance(55)) {
      const pool = SectSys.taskMonsters(mrp).filter(id => GameData.MONSTERS[id] && GameData.MONSTERS[id].power <= mrp + 4);
      const target = pool.length ? Utils.pick(pool) : null;
      if (target) { const need = Utils.rand(3, 5); t = { type: 'kill', target, need, progress: 0, name: `师命 · 斩除${GameData.MONSTERS[target].name}`, desc: `师父吩咐：击杀 ${GameData.MONSTERS[target].name} ×${need}` }; }
    }
    if (!t) {
      const tier = Math.min(4, Math.floor(s.realmIdx / 2) + 1);
      const pool = GameData.matsByTier(tier);
      const target = pool.length ? Utils.pick(pool) : 'm_lingcao';
      const need2 = Utils.rand(3, 6);
      t = { type: 'collect', target, need: need2, progress: 0, name: `师命 · 备办${GameData.ITEMS[target].name}`, desc: `师父吩咐：取 ${GameData.ITEMS[target].name} ×${need2}` };
    }
    m.task = t;
    Log.add(`师父有命：【${t.name}】——${t.desc}。`, 'event');
    Story.chron(`领师命【${t.name}】`);
    Game.afterAction();
  },
  onKill(monsterId) {
    const p = Game.player;
    const m = this.master(p);
    if (!m || !m.task || m.task.type !== 'kill' || m.task.progress >= m.task.need) return;
    if (m.task.target !== monsterId) return;
    m.task.progress++;
    if (m.task.progress >= m.task.need) Log.add('师命已办成，可去师父处复命！', 'gain');
    else Log.add(`师命进度：${m.task.progress}/${m.task.need}。`, 'info');
  },
  async taskSubmit() {
    const p = Game.player;
    const m = this.master(p);
    if (!m || !m.task) return;
    const t = m.task;
    if (t.type === 'kill') {
      if (t.progress < t.need) { UI.toast('师命未成，再去做完'); return; }
    } else {
      const have = Bag.count(t.target);
      if (have < t.need) { UI.toast(`还差 ${GameData.ITEMS[t.target].name} ×${t.need - have}`); return; }
      Bag.removeItem(t.target, t.need);
    }
    const s = this.state(p, m.npcId);
    const stones = Math.round(80 * GameData.stoneEco(Math.max(1, s.realmIdx)));
    Bag.addStones(stones);
    m.bond = Utils.clamp(m.bond + 5, 0, 100);
    m.task = null;
    Log.add(`复命！师父颔首：“办事牢靠。”（灵石 +${Utils.fmtNum(stones)}，敬师 +5）`, 'gain');
    Game.afterAction();
  },
  /** 传功：拜师礼赠功法（敬师 60 + 境界到门槛） */
  async teach() {
    const p = Game.player;
    const m = this.master(p);
    if (!m || m.stage !== 'active') return;
    const D = this.def(m.npcId), d = NpcSys.def(m.npcId);
    if (m.taught.includes(D.teach.gongfa)) { UI.toast('本门压箱底的，都已在你了'); return; }
    if (m.bond < 60) { UI.toast(`敬师值未到 60（当前 ${m.bond}）——师父还没把你当自己人`); return; }
    if (p.realmIdx < D.teach.needRealm) { UI.toast(`境界未到：需 ${GameData.REALM_NAMES[D.teach.needRealm]}期方堪传授`); return; }
    const ok = await UI.popup({
      title: `传功 · ${D.teach.name}`,
      html: `${d.name} 沉吟片刻：“${D.teach.name}，是本脉压箱底的根基。今日传你——记牢了，莫要外传。”`,
      options: [{ text: '跪领功法', value: true, primary: true }, { text: '尚未准备好', value: false }],
    });
    if (!ok) return;
    Bag.addItem(D.teach.gongfa, 1);
    m.taught.push(D.teach.gongfa);
    m.bond = Utils.clamp(m.bond + 3, 0, 100);
    Time.add(1);
    Log.add(`师父倾囊相授，【<b>${D.teach.name}</b>】已入你行囊，可研习修持！`, 'system');
    Story.chron(`师父传功【${D.teach.name}】`);
    Game.afterAction();
  },
  /** 护道：战败濒死时师父出手（每日一次，耗敬师 20） */
  tryProtect(p) {
    const m = this.master(p);
    if (!m || m.stage !== 'active' || m.bond < 30) return null;
    if (m.protectDay === this.today(p)) return null;
    const s = this.state(p, m.npcId);
    if (!s || !s.alive) return null;
    m.protectDay = this.today(p);
    m.bond = Utils.clamp(m.bond - 20, 0, 100);
    const d = NpcSys.def(m.npcId);
    return { name: d.name };
  },
  /** 师父身陨 → 衣钵（3.6a 简仪：遗产入袋 + 恩仇继承；全事件 3.6c） */
  checkInheritance(p) {
    const m = this.master(p);
    if (!m || m.stage !== 'active') return;
    const s = this.state(p, m.npcId);
    if (!s || s.alive) return;
    const D = this.def(m.npcId), d = NpcSys.def(m.npcId);
    m.stage = 'dead';
    m.bond = 100;
    for (const g of D.giftPool) { Bag.addItem(g, 1); m.gifts.push(g); }
    if (s.grudge) p.master.grudgeInherited = true;
    Log.add(`<b>讣音传来——</b>${d.name} 道陨了。你在灵前长跪三日，接过衣钵：${D.giftPool.map(g => `【${GameData.ITEMS[g].name}】`).join('、')}。<br><span style="color:var(--text-faint)">师门有恩必偿，有仇必报。师父的账，如今是你的账。</span>`, 'warn');
    Story.chron(`师父 ${d.name} 道陨，承其衣钵`);
  },

  /* ---------- 加成与提示 ---------- */
  /** 传艺被动：敬师 40 半效 / 70 满效 */
  bonusOf(p) {
    const m = this.master(p);
    if (!m || m.stage !== 'active') return {};
    const D = this.def(m.npcId);
    if (!D || m.bond < 40) return {};
    const k = m.bond >= 70 ? 1 : 0.5;
    const out = {};
    for (const [key, v] of Object.entries(D.passive)) out[key] = Math.round(v * k * 10) / 10;
    return out;
  },
  bondLabel(b) {
    if (b >= 90) return '亲传骨肉';
    if (b >= 70) return '倾囊相授';
    if (b >= 40) return '渐入师门';
    if (b >= 15) return '初收门墙';
    return '名分未深';
  },
  dot(p) {
    const m = this.master(p);
    if (!m) return false;
    if (m.stage === 'trial') return this.trialReady(p);
    if (m.stage === 'active' && m.task) return m.task.type === 'kill' ? m.task.progress >= m.task.need : Bag.count(m.task.target) >= m.task.need;
    return false;
  },
};
