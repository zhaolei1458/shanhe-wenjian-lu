import { createApp, reactive } from 'vue';
import App from './App.vue';
import { Game, loadBigPools } from './engine/game.js';
import { Save } from './save/db.js';
import { newSeed } from './engine/rng.js';
import { play, pickSfx } from './audio.js';
import './styles/main.css';

export const store = reactive({
  screen: 'title',            // title | rebirth | world | dead | past
  game: null,
  meta: { legacyPoints: 0, pastLives: [], crossSeenAdventures: [] },
  fateCards: [],
  name: '',
  rerolled: false,
  journalTick: 0,
  sleeveOpen: false,
  heavenOpen: false,
  saveSlots: [],
  busy: false,
});

store.refreshSaves = async () => {
  try { store.saveSlots = await Save.listSaves(); } catch (e) { store.saveSlots = []; }
};

store.boot = async () => {
  store.meta = await Save.loadMeta();
  await store.refreshSaves();
  await loadBigPools(); // 十五期：奇遇大池（2.2MB）动态加载——首屏不带，进世前灌满
};

store.goRebirth = () => {
  const seed = newSeed();
  store.fateCards = Game.rollFateCards(seed, store.meta);
  store.name = '';
  store.rerolled = false;
  store.screen = 'rebirth';
};

store.rerollFates = () => {
  if (store.rerolled) return;
  store.fateCards = Game.rerollFateCards(store.fateCards, seed());
  store.rerolled = true;
  function seed() { return newSeed(); }
};

store.claimFate = async (card) => {
  if (!card) return;
  store.busy = true;
  await loadBigPools(); // 幂等闸：无论多快点进投生，大池必先就绪
  // 传承点兑换：带一件旧物（家底 ≥5 可用，由 UI 侧决定 passItem）
  const passItem = store.passItem && store.meta.legacyPoints >= 5;
  if (passItem) {
    store.meta.legacyPoints -= 5;
    card = { ...card, startItems: [...(card.startItems || []), { id: 'item_jiawu', name: '一件旧物', desc: '来路说不清的一件旧物。你总觉得它该在某个人手里——虽然你不记得那人。', kind: 'relic' }] };
    Save.saveMeta(store.meta);
  }
  store.game = new Game(null, store.meta);
  store.game.rebirth(card, store.name || '无名氏', store.meta);
  if (passItem) {
    store.game.say('（往世簿里那份"家底"动用了——你身上多了件说不出来历的旧物。天地不解释，你也不问。）', 'imprint');
  }
  store.screen = 'world';
  store.busy = false;
};

// 二十期：音效接线（UI 层专属——引擎层零依赖，见 docs/设计-音效系统.md）
store.sfxTail = () => {
  if (!store.game) return;
  const sfx = pickSfx(store.game.journal.slice(-4));
  if (sfx) play(sfx);
};

store.submit = (raw) => {
  if (!store.game) return;
  store.game.input(raw);
  store.journalTick++;
  store.sfxTail();
  store.saveAuto();
};

store.chooseOption = (i) => {
  if (!store.game) return;
  store.game.chooseOption(i);
  store.journalTick++;
  store.sfxTail();
  store.saveAuto();
};

// 按钮声：全局委托，不逐个绑
if (typeof document !== 'undefined') {
  document.addEventListener('click', (ev) => {
    if (ev.target.closest && ev.target.closest('.btn, .mini-btn')) play('tick');
  }, { capture: true });
}

store.saveAuto = async () => {
  if (!store.game || !store.game.state?.life) return;
  store.game.persist();
  try { await Save.saveGame('auto', store.game.state, store.game.state.life.name + '·' + store.game.state.life.age + '岁'); } catch (e) { /* 存档失败静默 */ }
  store.game.resume();
};

store.saveToSlot = async (slot) => {
  if (!store.game) return;
  store.game.persist();
  await Save.saveGame(slot, store.game.state, store.game.state.life.name + '·' + store.game.state.life.age + '岁');
  store.game.resume();
  await store.refreshSaves();
};

store.loadFromSlot = async (slot) => {
  const data = await Save.loadGame(slot);
  if (!data) return;
  store.game = new Game(data.state, store.meta);
  store.game.resume();
  store.screen = 'world';
};

store.onDeath = async (summary) => {
  // 结算传承：印记 + 传承点 + 往世簿
  const j = summary || store.game.judgment;
  store.meta.legacyPoints += j.points;
  store.meta.lastImprint = j.imprint;
  // 跨世防重复（一生一遇档以上）
  for (const id of j.adventures || []) {
    const adv = id;
    store.meta.crossSeenAdventures.push(adv);
  }
  store.meta.crossSeenAdventures = [...new Set(store.meta.crossSeenAdventures)].slice(-24);
  store.meta.pastLives.push({ name: j.name, age: j.age, kind: j.kind, judge: j.judge, imprint: j.imprint, points: j.points, mengpo: j.mengpo || null, minghao: j.minghao || null, topGongfa: j.topGongfa || null, chronicle: j.chronicle || [], swordBond: j.swordBond || 0 });
  store.meta.pastLives = store.meta.pastLives.slice(-12);
  await Save.saveMeta(store.meta);
  store.screen = 'dead';
};

store.nextLife = () => { store.screen = 'title'; };

const app = createApp(App);
app.mount('#app');
