// ============================================================
// 山河问剑录 · 成就名册（十九期）
// test(life, state, meta, kind) —— 死时结算，返回 boolean
// 口径：成就盖「世」章——你做过，江湖的旧档里就永远有一笔。
// ============================================================

export const ACHIEVEMENTS = [
  { id: 'ach_begin', name: '来过', desc: '走完一世。无论长短，都是一世。', test: () => true },
  { id: 'ach_changshou', name: '耄耋', desc: '寿逾九十。岁月这一关，你熬过去了。', test: (life) => life.age >= 90 },
  { id: 'ach_qiyi', name: '期颐', desc: '寿逾百岁。这个岁数，走在路上都有人说你是老神仙。', test: (life) => life.age >= 100 },
  { id: 'ach_lianqi', name: '入品', desc: '修为入练气。凡胎之外，你摸到了门槛。', test: (life) => ['lianqi','zhuji','jindan','yuanying','huashen','lianxu','heti','dacheng','dujie','zhenxian','jinxian','taiyi','daluo','daozun','daozu'].includes(life.realm) },
  { id: 'ach_jindan', name: '丹成', desc: '结成金丹。一条河里，游不了几条这样的鱼。', test: (life) => ['jindan','yuanying','huashen','lianxu','heti','dacheng','dujie','zhenxian','jinxian','taiyi','daluo','daozun','daozu'].includes(life.realm) },
  { id: 'ach_daocheng', name: '坐化', desc: '主动交还此生。来去自如，是为道成。', test: (l, s, m, kind) => kind === 'daocheng' },
  { id: 'ach_hengsi', name: '不测', desc: '死于横事。江湖就是这样收人的。', test: (l, s, m, kind) => kind === 'hengsi' },
  { id: 'ach_rumo', name: '心魔', desc: '入魔而终。松手的那一刻，你听见自己笑了。', test: (l, s, m, kind) => kind === 'rumo' },
  { id: 'ach_shashen', name: '杀孽', desc: '旧账册上杀簿十指。夜深时别数它。', test: (life, state) => state.ledger.filter(l => l.type === '杀').length >= 10 },
  { id: 'ach_jishan', name: '万家生佛', desc: '善账十五笔。你在的地方，总有人心里踏实。', test: (life, state) => state.ledger.filter(l => l.type === '善').length >= 15 },
  { id: 'ach_jiefa', name: '结发', desc: '这一生，有人与你结发。', test: (life) => (life.rels || []).some(r => r.kind === 'spouse') },
  { id: 'ach_ernv', name: '满堂', desc: '三个孩子喊你爹（或娘）。热闹，也吵。', test: (life) => (life.rels || []).filter(r => r.kind === 'child').length >= 3 },
  { id: 'ach_shouqin', name: '兽亲', desc: '走时有兽相送。人与兽的缘分，不比人浅。', test: (life) => !!life.mount },
  { id: 'ach_tanhua', name: '行路三十', desc: '行路志记满三十桩机缘。山川认得你了。', test: (life, state) => state.adventures.seen.length >= 30 },
  { id: 'ach_qianjin', name: '千金之家', desc: '身后留下五百贯。钱是身外物——但你得先有。', test: (life) => life.money >= 500 },
  { id: 'ach_jianling', name: '剑灵', desc: '佩剑养出灵性。铁开口，比人诚实。', test: (life) => (life.swordBond || 0) >= 25 },
  { id: 'ach_minghao', name: '扬名', desc: '江湖给了你一个名号——不管它香还是臭。', test: (life) => !!life.minghao },
  { id: 'ach_guoshuo', name: '过所', desc: '手里攥过三枚过所。井边有个声音，一直记得你。', test: (life, state) => (state._wellTokens || 0) >= 3 },
];
