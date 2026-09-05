import fs from 'fs';
const base = 'C:/Users/Administrator/Desktop/shanhe-bot-player/logs';
const runs = fs.readdirSync(base).map(d => ({
  dir: d.slice(-8),
  entries: fs.readFileSync(`${base}/${d}/transcript.jsonl`, 'utf8').trim().split('\n').map(x => JSON.parse(x)),
}));
const all = runs.flatMap(r => r.entries);

// 内容面清单：关键词 -> 玩法系统。统计它在"见闻/回应"里出现过几次（见到≠玩到），在"动作"里主动做过几次（玩到）
const contentMap = [
  ['商铺买卖', /买|卖|掌柜|铺子|文钱|银两|付账|还价/],
  ['拜师学艺', /拜师|师承|师父|学艺|传功|指点/],
  ['奇遇（动态事件）', /奇遇|缘分|际遇/],
  ['行会/门派', /行会|门派|帮派|入会|香主|堂口/],
  ['风水堪舆', /堪舆|风水|寻龙|镇物/],
  ['古墓探穴', /古墓|墓穴|洞窟|探穴/],
  ['名号系统', /名号|诨号|江湖人称/],
  ['入魔/心魔', /心魔|入魔|魔气|戾气/],
  ['幽冥/轮回', /幽冥|轮回|往世簿|投生/],
  ['图鉴/成就', /图鉴|成就/],
  ['修炼突破', /突破|境界|内息|修为|打通/],
  ['比武/战斗', /比武|动手|交手|过招|出手/],
  ['结义/姻缘', /结义|拜把子|婚|姻缘|情愫/],
  ['置产/定居', /置办|置产|买宅|定居|赁/],
  [' Craft 抄录', /抄书|抄录|题诗|留墨/],
];
console.log('--- 玩法内容触达面（五轮 2568 条合并）---');
console.log('（"见闻提及"= 屏幕上出现过；"主动动作" = 机器人真去做了）');
for (const [name, re] of contentMap) {
  let seenN = 0, actN = 0;
  for (const e of all) {
    if (e.kind === 'seen' && re.test(e.text)) seenN++;
    if (e.kind === 'act' && re.test(e.text)) actN++;
  }
  const flag = actN === 0 ? ' ←【从未玩到】' : '';
  console.log(`  ${name.padEnd(10)} 见闻提及 ${String(seenN).padStart(4)} 次 | 主动去做 ${String(actN).padStart(3)} 次${flag}`);
}

// 屏幕功能入口：机器人点过的 UI 层
console.log('\n--- 屏幕 UI 入口使用 ---');
const ui = { '问天按钮': /问天/, '话头/念头/心事按钮': /念头|心事|话头/, '袖中录按钮': /袖中录/, '存档按钮': /存档/, '投生/往世簿': /投生|往世簿/, '卷轴滚动': /滚动|卷轴/ };
for (const [name, re] of Object.entries(ui)) {
  const n = all.filter(e => e.kind === 'act' && re.test(e.text)).length;
  console.log(`  ${name}: 主动操作 ${n} 次`);
}

// 银钱状态：见闻里提过几次钱
let money = 0;
for (const e of all) if (e.kind === 'seen' && /文钱|银|两钱|铜钱/.test(e.text)) money++;
console.log(`\n--- 银钱出现在见闻里 ${money} 次 ---`);

// 死亡/盖棺：五轮有没有玩到一世终点
const deaths = all.filter(e => e.kind === 'seen' && /盖棺|殁|寿终|崩逝|亡故/.test(e.text)).length;
console.log(`--- 死亡/盖棺见闻 ${deaths} 次（五轮 1600+ 步竟无一世走到终点）---`);
