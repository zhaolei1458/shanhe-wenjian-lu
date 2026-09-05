import fs from 'fs';
const base = 'C:/Users/Administrator/Desktop/shanhe-bot-player/logs';
const runs = fs.readdirSync(base).map(d => ({
  dir: d.slice(-8),
  entries: fs.readFileSync(`${base}/${d}/transcript.jsonl`, 'utf8').trim().split('\n').map(x => JSON.parse(x)),
}));

// A) 动作->回应 的重复度：同一类动作，游戏回复去重后还剩几句
console.log('--- 动作类型 -> 游戏回应的多样性（五轮合并）---');
const resp = {};
for (const r of runs) {
  const es = r.entries;
  for (let i = 0; i < es.length; i++) {
    if (es[i].kind !== 'act') continue;
    // 找其后第一条 seen
    let j = i + 1;
    while (j < es.length && es[j].kind !== 'seen') j++;
    if (j >= es.length) continue;
    const act = String(es[i].text);
    let cat = '其他';
    if (/打坐/.test(act)) cat = '打坐吐纳';
    else if (/练武|练功|练枪|习武/.test(act)) cat = '练武';
    else if (/村长/.test(act)) cat = '和村长聊';
    else if (/老猎户/.test(act)) cat = '找老猎户';
    else if (/后山/.test(act)) cat = '去后山';
    else if (/逛/.test(act)) cat = '逛逛';
    else if (/心事|念头|话头/.test(act)) cat = '点话头/心事';
    else if (/输入/.test(act)) cat = '自由输入';
    const seen = String(es[j].text).replace(/\d+/g, '#').slice(0, 120);
    (resp[cat] = resp[cat] || { total: 0, uniq: new Set() });
    resp[cat].total++;
    resp[cat].uniq.add(seen);
  }
}
for (const [k, v] of Object.entries(resp).sort((a, b) => b[1].total - a[1].total)) {
  console.log(`  ${k}: 共 ${v.total} 次, 回应只有 ${v.uniq.size} 种`);
}

// B) 场景分布：机器人这一世都在哪儿（按 seen 的场景头统计）
console.log('\n--- 场景分布（按见闻首条场景标记）---');
const scene = {};
for (const r of runs) {
  for (const e of r.entries.filter(x => x.kind === 'seen')) {
    const m = String(e.text).match(/【([^】]+)】/);
    const s = m ? m[1] : '(无场景标记)';
    scene[s] = (scene[s] || 0) + 1;
  }
}
for (const [k, v] of Object.entries(scene).sort((a, b) => b[1] - a[1]).slice(0, 12)) console.log(`  ${v}x ${k}`);

// C) 岁月流速：每轮 步数 / 长了几岁
console.log('\n--- 时间流速（步数:游戏内时间跨度）---');
for (const r of runs) {
  const stamps = [];
  for (const e of r.entries.filter(x => x.kind === 'seen')) {
    const m = String(e.text).match(/(\d{1,2})岁/);
    if (m) stamps.push(Number(m[1]));
  }
  const acts = r.entries.filter(e => e.kind === 'act').length;
  if (stamps.length) console.log(`  ${r.dir}: ${acts} 步, 年龄从 ${stamps[0]} 到 ${stamps[stamps.length - 1]}`);
}

// D) 话头点了 5 连没推进的现场：抓「白影寻踪」的回应原文
console.log('\n--- 「白影寻踪」连点时的回应（第2轮）---');
const r2 = runs.find(r => r.dir === '13-11-39');
if (r2) {
  let shown = 0;
  for (let i = 0; i < r2.entries.length && shown < 6; i++) {
    const e = r2.entries[i];
    if (e.kind === 'act' && /白影寻踪/.test(e.text)) {
      let j = i + 1;
      while (j < r2.entries.length && r2.entries[j].kind !== 'seen') j++;
      if (j < r2.entries.length) { console.log('  > ' + String(r2.entries[j].text).slice(0, 110)); shown++; }
    }
  }
}

// E) 「看不见路」出现次数
console.log('\n--- 「看不见路」拒绝出行出现次数 ---');
let nogo = 0, travel = 0;
for (const r of runs) for (const e of r.entries.filter(x => x.kind === 'seen')) {
  if (/看不见路/.test(e.text)) nogo++;
  if (/到了|抵达|走进|赶路/.test(e.text)) travel++;
}
console.log(`  「看不见路」: ${nogo} 次; 出行抵达类回应: ${travel} 次`);
