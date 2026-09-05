import fs from 'fs';
const base = 'C:/Users/Administrator/Desktop/shanhe-bot-player/logs';
// v22 回归轮
const r22 = fs.readFileSync(`${base}/run-2026-09-05-15-18-11/transcript.jsonl`, 'utf8').trim().split('\n').map(x => JSON.parse(x));
// v21 基线：把五轮旧记录合并当基线
const oldRuns = fs.readdirSync(base).filter(d => d !== 'run-2026-09-05-15-18-11').map(d => ({
  es: fs.readFileSync(`${base}/${d}/transcript.jsonl`, 'utf8').trim().split('\n').map(x => JSON.parse(x)),
}));
const oldAll = oldRuns.flatMap(r => r.es);

function metrics(entries, label) {
  const acts = entries.filter(e => e.kind === 'act');
  // 抵达：出城行路成功（「到了。」/visitedCities 里程碑）
  let arrivals = 0, nogo = 0;
  for (const e of entries.filter(x => x.kind === 'seen')) {
    if (/到了。|头一回真正离开家/.test(e.text)) arrivals++;
    if (/看不见路|走不通|被自己的话问住/.test(e.text)) nogo++;
  }
  // 触达：玩法关键词出现在见闻（代表浮上屏幕）
  const kw = {
    '拜师/门派': /拜师|山门|门派|递帖|收徒|学徒/,
    '镖局/行会': /镖局|镖队|镖车|行会/,
    '比武/战斗': /比武|过招|出手|交手/,
    '赏金/悬案': /赏格|赏银|悬案|断案/,
    '江湖消息': /秘闻|江湖上|风声/,
    '纪年出现': /承平\d+年/,
    '时间标价': /耗了半日|耗了一日|一整日/,
    '可为之事': /此地可为之事/,
    '袖中录亮相': /袖中录/,
    '出村引力': /货郎|镖头|官道|山外的世界/,
  };
  const touch = {};
  for (const [k, re] of Object.entries(kw)) touch[k] = entries.filter(e => e.kind === 'seen' && re.test(e.text)).length;
  // 复读率：打坐/练武/村长 回应去重度（同 v21 口径）
  const resp = {};
  for (let i = 0; i < entries.length; i++) {
    if (entries[i].kind !== 'act') continue;
    let j = i + 1; while (j < entries.length && entries[j].kind !== 'seen') j++;
    if (j >= entries.length) continue;
    const act = String(entries[i].text);
    let cat = null;
    if (/打坐/.test(act)) cat = '打坐';
    else if (/练武|练功/.test(act)) cat = '练武';
    else if (/村长/.test(act)) cat = '村长';
    else if (/商|买|卖|市/.test(act)) cat = '商铺';
    if (!cat) continue;
    (resp[cat] = resp[cat] || { total: 0, uniq: new Set() });
    resp[cat].total++;
    resp[cat].uniq.add(String(entries[j].text).replace(/\d+/g, '#').slice(0, 100));
  }
  console.log(`\n=== ${label}（${acts.length} 步）===`);
  console.log(`抵达/行路成功见闻: ${arrivals} 次 | 出行被拒: ${nogo} 次`);
  for (const [k, v] of Object.entries(touch)) console.log(`  触达[${k}]: ${v}`);
  for (const [k, v] of Object.entries(resp)) console.log(`  复读[${k}]: ${v.total} 次 / ${v.uniq.size} 种 (${Math.round((1 - v.uniq.size / v.total) * 100)}%复读)`);
}
metrics(oldAll, 'v21 基线（旧五轮合并）');
metrics(r22, 'v22 回归（15-18-11 轮）');
