// 二期 v2.0：材料炼器闭环——昆吾剑炉。杀兽取材是恶业（佛修折寿、魔修如常），活取则器灵更盛。
import { rollItem } from './equipment.js';

// 炼器配方：材料组合 → 装备档位
export const CRAFT_RECIPES = [
  { id: 'craft_jiaopi_gu', mats: ['mat_kuiniu_pi'], tier: 3, kind: 'relic',
    name: '夔皮鼓', desc: '夔牛皮蒙的鼓。击之，声震百里——海上之物，闻鼓而退。', need: 'kunwu' },
  { id: 'craft_jiaojian', mats: ['mat_jiaolin', 'mat_hansui_si'], tier: 3, kind: 'weapon',
    name: null, desc: null, need: 'kunwu' }, // null 名走 rollItem 组合（蛟鳞×寒髓丝）
  { id: 'craft_longlin_jian', mats: ['mat_yinglong_lin'], tier: 4, kind: 'weapon',
    name: null, desc: null, need: 'kunwu', note: '昆吾剑炉只认"活取的龙鳞"。' },
  { id: 'craft_hansui_jian', mats: ['mat_hansui_si', 'mat_hansui_si'], tier: 2, kind: 'weapon',
    name: null, desc: null, need: 'kunwu' },
  { id: 'craft_guiya_bu', mats: ['mat_guijia'], tier: 2, kind: 'relic',
    name: '龟甲卜盘', desc: '驮山龟的甲蜕刻成卦盘。握着它掷卦，十中九——不是它灵，是"海在借你的手说话"。', need: 'kunwu' },
  { id: 'craft_pengyu_shan', mats: ['mat_pengyu'], tier: 3, kind: 'relic',
    name: '鹏翎扇', desc: '鹏翎扎的扇子。扇一扇，暑气全消——起风的日子，扇子自己会动。', need: 'kunwu' },
];

// 判断是否能炼：材料齐 + 在昆吾
export function canCraft(game, recipe) {
  const life = game.state.life;
  if (recipe.need && life.location.city !== recipe.need) return { ok: false, why: '炉子在昆吾剑炉街——好料要认好火。' };
  const have = (life.items || []).map(i => i.id);
  for (const m of recipe.mats) {
    if (!have.includes(m)) return { ok: false, why: `还缺材料——炉子认料不认钱，凑齐了再来。` };
  }
  return { ok: true };
}

// 执行炼器：移除材料，产出装备。killSource: 材料来源是否"杀兽取材"（恶业记账）
export function doCraft(game, recipe) {
  const check = canCraft(game, recipe);
  if (!check.ok) return { ok: false, text: check.why };
  const life = game.state.life;
  // 消耗材料（记录是否"杀兽取材"）
  let evil = false;
  for (const m of recipe.mats) {
    const idx = life.items.findIndex(i => i.id === m);
    if (idx >= 0) { if (life.items[idx].evil) evil = true; life.items.splice(idx, 1); }
  }
  let item;
  if (recipe.name) {
    item = { id: 'item_' + recipe.id, name: recipe.name, kind: recipe.kind, tier: recipe.tier, combat: recipe.tier * 2, desc: recipe.desc };
  } else {
    item = rollItem(game.rng, recipe.tier, recipe.kind);
    item.id = 'item_' + recipe.id;
  }
  life.items.push(item);
  // 恶业入账：杀兽取材，佛修折寿、魔修如常
  if (evil) {
    if (life.sect?.id === 'baoguo') {
      life.flags.evil_karma = (life.flags.evil_karma || 0) + 1;
      game.book('业', '杀兽取材炼器，佛门戒律有亏');
    }
    game.state.ledger.push({ type: '业', text: '杀兽取材，炉火记下了这笔账' });
  }
  game.book('得', `昆吾炉成：${item.name}`);
  return { ok: true, item, text: `（老师傅接过材料，一锤听音，点头。）\n"料是真心。等三个月——"（他顿了顿）"算了，看在你料的份上，加急。"\n七日后，${item.name}出炉。老师傅亲自递给你："好器认主。往后它折了，别怨火。"`, evil };
}
