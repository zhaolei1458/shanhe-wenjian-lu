// ============================================================
// 山河问剑录 · 引擎/指令解析器 v1（GDD §八 解析管道四层）
// 归一 → 意图识别 → 槽位提取 → 场景裁决
// 铁律：任何输入必须有预写回声，绝无"无法理解"类系统话（冷场率 0）
// ============================================================

// ---- 别名表（归一层）----
export const ALIASES = [
  [/[的的]/g, '的'],
  [/(吧|呀|啊|嘛|哦|么|吗)$/, ''],
  [/^我想|^我要|^给我|^帮我/, ''],
  [/^请问/, ''],
  [/打坐修炼|修炼打坐|打坐吐纳|吐纳打坐/, '打坐'],
  [/^修炼$/, '打坐'],
  [/练功|练武|习武/, '练功'],
  [/拜观求道|递帖入帮|求入.+门下|求拜.+门下|拜入.+门下|想拜师|投个师/, '拜师'],
  [/师门日常|领日常|做功课|做师门功课/, '师门功课'],
  [/逛逛|走一走|转转|随便走走|闲逛|^随便逛/, '闲逛'],
  // 二十二期修 A：玩家口语宽解析——出门/出去/四处走走 都是闲逛；找地方歇 是休息
  [/^出门.*/, '闲逛'],
  [/^出去.*/, '闲逛'],
  [/^上街.*/, '闲逛'],
  [/四处走走|到处走走|出去走走|^走走/, '闲逛'],
  [/^找个地方.+/, '休息'],
  [/歇歇脚|歇脚/, '休息'],
  [/打听|问问|探听|询问/, '问'],
  [/聊天|攀谈|搭话|交谈|说话/, '聊'],
  [/^在.{1,6}?(逛|走|看)/, '$1'], // 二十一期：在…逛逛/走走/看看 剥掉前置（话头全可解析口径）
  [/四周|周围|^四处|^随便看/, '看'],
  [/^一下，?|^一下/, ''],
  [/^[，,、\s]+/, ''],
  [/盘缠|银子|钱币|铜钱|银两/, '钱'],
  [/袖中录|行囊/, '袖中录'],
  [/咋办|怎么办|做什么|能干啥|能做什么|干点啥|有何事|指条路|指引/, '问天'],
  [/帮助|help|指令/, '问天'],
];

// 虚词剔除
const STOPWORDS = /^[\s，。！？、,.\s]+|[\s，。！？、,.\s]+$/g;

export function normalize(raw) {
  let s = (raw || '').trim();
  for (const [re, to] of ALIASES) s = s.replace(re, to);
  s = s.replace(STOPWORDS, '');
  return s;
}

// ---- 意图识别（关键词/句式模板）----
export const INTENTS = [
  { id: 'help',     re: /^(问天|指路|怎么办|能做什么|有何事|能干啥|干点啥|帮助|help|指引)/ },
  { id: 'ponder',   re: /^(想想|琢磨)/ }, // 二十一期修 C：琢磨心事（暗线话头）
  { id: 'baishi',   re: /^(拜师|拜入|投师|求师|拜(个)?师父|入门|进山门)/ },
  { id: 'duty',     re: /^(领日常|师门日常|师门功课|做功课|功课|当值|值役|师门(任务|差事))/ },
  { id: 'leave',    re: /^(叛出|叛离|退出师门|离开师门|还俗|下山还俗)/ },
  { id: 'equip',    re: /^(用起来|装备|佩戴|佩上|抄起|背上|把.+用起来|取出.+)/ },
  { id: 'inscribe', re: /^(题诗|题壁|题字|留字|题一首|题壁诗|题下.+)/ },
  { id: 'settle', re: /^(安家|置宅|买宅|买下宅|租房|赁屋|赁个院子|安顿下来|住下)/ },
  { id: 'alias', re: /^(化名|易容|改名|报上化名|以假名示人)/ },
  { id: 'realname', re: /^(以真名示人|恢复真名|洗去易容)/ },
  { id: 'investigate', re: /^(查案|断案|接案|查访|看案|问问案子)/ },
  { id: 'business', re: /^(盘下|开张|接手|盘个)/ },
  { id: 'foundsect', re: /^(开宗|立派|开宗立派|创立门派|自立门户)/ },
  { id: 'wander',   re: /^(出门|出去|上街)/ }, // 二十二期修 A：须在 go 之前——"出门"不该被"出"劫走
  { id: 'go',       re: /^(去|往|到|回|进|出|离开?|前往|搬去?)\s*(.+)/ },
  { id: 'travel',   re: /(官道|赶路|行路|启程|动身|出发|去.{1,6}(府|镇|关|城|集|村))/ },
  { id: 'sleeve',   re: /^(袖中录|行路志|人物谱|旧账册|妖兽卷|图鉴|翻(看)?账|看看(旧)?账)/ },
  { id: 'feed',     re: /^(喂|喂养|投喂|喂(它|坐骑|伙伴))/ },
  { id: 'hatch',    re: /^(焐蛋|孵蛋|暖蛋|抱蛋|焐(一)?焐|把蛋焐上)/ },
  { id: 'kanyu',    re: /^(看风水|堪舆|请人看宅|相宅|看宅|宅子风水|请堪舆|看下风水)/ },
  { id: 'zhenwu',   re: /^(请镇物|请一尊镇物|请个镇物|安镇物|请件镇物|镇宅)/ },
  { id: 'xunlong',  re: /^(寻龙|点穴|寻龙点穴|探古墓|探墓|寻穴|探穴)/ },
  { id: 'craft',    re: /^(炼器|铸器|开炉|请(老师傅)?掌眼|掌眼)/ },
  { id: 'look',     re: /^(看|瞧|打量|望|观察|环顾|四下|四周)/ },
  { id: 'talk',     re: /^(和|跟|与|同)?\s*(.+?)(聊|说说话|谈谈|攀谈)/ },
  { id: 'ask',      re: /^(问|向|找)\s*(.+)/ },
  { id: 'cultivate',re: /^(打坐|修炼|运功|行功|吐纳)/ },
  { id: 'practice', re: /^(练功|练剑|练刀|练拳|练招|习武|操练)/ },
  { id: 'rest',     re: /^(休息|睡|歇|宿|休整|疗伤|将养)/ },
  { id: 'work',     re: /^(干活|做工|做事|接活|打工|营生|谋生|找活)/ },
  { id: 'buy',      re: /^(买|购|置|换点?)\s*(.+)/ },
  { id: 'eat',      re: /^(吃|喝|饮|打酒|来一?碗|点一?(碗|壶|份))/ },
  { id: 'wander',   re: /^(闲逛|散步|消磨|混日子|打发|逛)/ }, // 二十一期：在…逛逛 也算闲逛（话头全可解析口径）
  { id: 'items',    re: /^(物品|家当|翻翻(身上)?|看看(身上)?|清点)/ },
  { id: 'wait',     re: /^(等|候|住下|待几日)/ },
  { id: 'name',     re: /^(我叫|我叫自己|自名)/ },
];

export function recognizeIntent(text) {
  for (const it of INTENTS) {
    const m = text.match(it.re);
    if (m) return { id: it.id, match: m };
  }
  return null;
}

// ---- 槽位提取（位置/NPC/主题）----
export function extractSlots(text, scene, worldData) {
  const slots = { npc: null, place: null, topic: null, item: null };
  // NPC 匹配：场景在场 NPC（含别名）
  const npcs = sceneNpcs(scene, worldData);
  for (const npc of npcs) {
    if (text.includes(npc.name) || (npc.aliases || []).some(a => text.includes(a))) {
      slots.npc = npc; break;
    }
  }
  // 去处匹配：本城全部去处（含出口）
  const places = scenePlaces(scene, worldData);
  for (const p of places) {
    if (text.includes(p.name) || (p.aliases || []).some(a => text.includes(a))) {
      slots.place = p; break;
    }
  }
  // 主题：去虚词后剩余中段
  const t = text.replace(/^(去|往|到|回|离开?|问|向|找|和|跟|与|同)\s*/, '')
                .replace(/(聊|说说话|谈谈|攀谈|打听)$/, '');
  if (t && t.length <= 12) slots.topic = t;
  // 七期：服/用类动词后的物品名
  const mUse = text.match(/^(服下|服用|吞服|吞下|炼化|使用|用掉|用)\s*(.+)$/);
  if (mUse) slots.item = mUse[2];
  return slots;
}

function sceneNpcs(scene, wd) {
  if (!scene || !scene.npcs) return [];
  return scene.npcs.map(id => wd.npcs[id]).filter(Boolean);
}
function scenePlaces(scene, wd) {
  if (!scene || !scene.links) return [];
  const out = [];
  for (const nodeId of scene.links) {
    const node = wd.nodes[nodeId];
    if (node) out.push(node);
  }
  return out;
}

// ---- 场景裁决 ----
// 返回 { verdict: 'hit'|'partial'|'miss', intent, slots, normalized }
export function parse(raw, scene, worldData) {
  const normalized = normalize(raw);
  if (!normalized) return { verdict: 'miss', intent: null, slots: {}, normalized };
  const hit = recognizeIntent(normalized);
  const slots = extractSlots(normalized, scene, worldData);
  let verdict = 'miss';
  if (hit) {
    const needTarget = ['go', 'ask', 'talk', 'buy'].includes(hit.id);
    if (!needTarget) verdict = 'hit';
    else if (slots.npc || slots.place || slots.topic) verdict = 'hit';
    else verdict = 'partial';
    // go 必须有去处
    if (hit.id === 'go' && !slots.place) verdict = 'partial';
  }
  return { verdict, intent: hit ? hit.id : null, slots, normalized };
}
