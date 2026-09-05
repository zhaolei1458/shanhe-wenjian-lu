import fs from 'fs';
const base = 'C:/Users/Administrator/Desktop/shanhe-bot-player/logs';
const runs = fs.readdirSync(base).map(d => {
  const p = `${base}/${d}/transcript.jsonl`;
  if (!fs.existsSync(p)) return null;
  return { dir: d, entries: fs.readFileSync(p, 'utf8').trim().split('\n').map(x => JSON.parse(x)) };
}).filter(Boolean);

const all = [];
for (const r of runs) {
  for (const e of r.entries) all.push({ ...e, run: r.dir });
}
console.log(`=== 共 ${runs.length} 轮, ${all.length} 条记录 ===`);

// 1) 每轮概况
console.log('\n--- 每轮概况 ---');
for (const r of runs) {
  const acts = r.entries.filter(e => e.kind === 'act');
  const probs = r.entries.filter(e => e.kind === 'problem');
  const lives = r.entries.filter(e => e.text && e.text.includes('世开始'));
  console.log(r.dir.slice(-8) + ': ' + acts.length + ' 步动作, ' + lives.length + ' 世, ' + probs.length + ' 条问题');
  for (const p of probs) console.log('   [问题] ' + String(p.text).slice(0, 90));
}

// 2) 动作词频
console.log('\n--- 动作分类词频 ---');
const freq = {};
for (const e of all.filter(x => x.kind === 'act')) {
  const t = String(e.text);
  let key = '其他';
  if (/输入/.test(t) && /「(.+?)」/.test(t)) key = '自由输入「' + t.match(/「(.+?)」/)[1] + '」';
  else if (/投生/.test(t)) key = '投生/命帖';
  else if (/话头/.test(t)) key = '点话头按钮';
  else if (/问天/.test(t)) key = '点问天(求助)';
  else if (/卷轴/.test(t) || (/滚动/.test(t))) key = '翻卷轴';
  else if (/^.点/.test(t)) key = '点按钮';
  else if (/^.选/.test(t)) key = '选选项';
  freq[key] = (freq[key] || 0) + 1;
}
for (const [k, v] of Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 30)) console.log('  ' + v + 'x ' + k);

// 3) 连续重复动作
console.log('\n--- 连续重复 TOP（同一动作连做 N 次=磨练/迷茫信号）---');
const streaks = [];
const norm = t => String(t).replace(/\d+/g, '#').replace(/第 # /g, '第# ').slice(0, 40);
for (const r of runs) {
  const acts = r.entries.filter(e => e.kind === 'act');
  let i = 0;
  while (i < acts.length) {
    let j = i;
    const b = norm(acts[i].text);
    while (j + 1 < acts.length && norm(acts[j + 1].text) === b) j++;
    const n = j - i + 1;
    if (n >= 4) streaks.push({ run: r.dir.slice(-8), n, text: String(acts[i].text).slice(0, 80) });
    i = j + 1;
  }
}
streaks.sort((a, b) => b.n - a.n);
for (const s of streaks.slice(0, 18)) console.log('  [' + s.run + '] 连续' + s.n + '次: ' + s.text);

// 4) 自由输入全集
console.log('\n--- 自由输入全集 ---');
const inputs = {};
for (const e of all.filter(x => x.kind === 'act')) {
  const m = String(e.text).match(/输入[了:]? ?「(.+?)」/);
  if (m) inputs[m[1]] = (inputs[m[1]] || 0) + 1;
}
for (const [k, v] of Object.entries(inputs).sort((a, b) => b[1] - a[1])) console.log('  ' + v + 'x 「' + k + '」');
