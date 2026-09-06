<template>
  <div class="screen world-screen">
    <!-- ==================== 顶栏（参考 #top-bar 结构） ==================== -->
    <header id="top-bar">
      <div class="top-title">山河问剑录</div>
      <div class="top-right">
        <div id="amb-ctrl">
          <button class="amb-btn" @click.stop="settingsOpen = !settingsOpen">⚙ 设置</button>
          <div id="amb-panel" class="amb-panel" :class="{ hidden: !settingsOpen }">
            <div class="amb-panel-title">— 设 置 —</div>
            <label class="opt-line"><input type="checkbox" :checked="muted" @change="toggleMute"> 事件音效</label>
            <div class="amb-vol-row">界面字号
              <select v-model.number="fontScale">
                <option :value="100">标准</option>
                <option :value="110">大</option>
                <option :value="122">特大</option>
              </select>
            </div>
            <div class="tip-line">· 中栏「念头」皆是点选——去哪儿、吃什么、和谁搭话，点一下即可。</div>
            <div class="tip-line">· 想不起做什么，就点一下「问天」。</div>
          </div>
        </div>
        <div id="top-info" class="top-info">
          <span class="res-chip res-chapter" v-if="activeQuest" title="主线进度">主线 · 第{{ activeQuest.chapter }}章</span>
          <span class="res-chip" title="眼下所在">{{ locText }}</span>
          <span class="res-chip res-stone" title="盘缠">◈ {{ life.money ?? 0 }} 贯</span>
          <span class="res-chip" title="修为（仙）/ 武学修为（武）">✦ {{ life.xiwei ?? '—' }} <i>·</i> ⚔ {{ life.wugongXiuwei || 0 }}</span>
          <span class="top-meta">{{ scene.time }}</span>
          <span class="top-meta2">{{ life.age ?? '?' }}岁 / 寿元{{ life.lifespanMax || '未卜' }}</span>
        </div>
      </div>
    </header>

    <!-- ==================== 三栏主格栅（参考 #layout） ==================== -->
    <main id="layout">
      <!-- 左：角色状态 -->
      <aside id="panel-left" class="panel">
        <template v-if="hasLife">
          <div class="panel-title">✦ 其人</div>
          <div class="id-card">
            <div class="id-name">{{ life.name }}<span v-if="life.alias" style="color:var(--text-dim)">（化名{{ life.alias }}）</span></div>
            <div class="id-row"><span class="realm-badge">{{ realmWord || '未入修行' }}</span></div>
            <div class="id-line"><span>寿元 <b>{{ life.age }} / {{ life.lifespanMax || '未卜' }}</b></span><span v-if="spanWord" class="hl">{{ spanWord }}</span></div>
          </div>
          <div class="stat-line" v-if="life.sect"><span>师门</span><b class="hl">{{ life.sect.name || '已拜入门墙' }}</b></div>
          <div class="stat-line" v-if="life.home"><span>居所</span><b>{{ life.home.place || '有处安身' }}</b></div>
          <div class="equip-slot"><span>佩戴</span>
            <span v-if="equippedItem">{{ equippedItem.name }} <button class="btn btn-sm" @click="store.submit('卸下' + equippedItem.name)">卸下</button></span>
            <span v-else style="color:var(--text-faint)">无</span>
          </div>
          <div class="sec-title">核心属性</div>
          <div class="core-stat-head"><span class="cs-name hp">气血</span><span class="cs-val">{{ life.hp }} <span class="cs-max">/ {{ life.maxHp }}</span></span></div>
          <div class="bar" :title="`气血 ${life.hp} / ${life.maxHp}`"><div class="bar-fill hp" :class="{ low: life.hp / life.maxHp <= 0.3 }" :style="{ width: hpPct + '%' }"></div><span class="bar-text">{{ hpPct }}%</span></div>
          <div class="attr-mini">
            <span v-for="d in dimList" :key="d.k">{{ d.name }} <b>{{ d.v }}</b></span>
          </div>
          <div class="stat-grid">
            <div class="stat-line"><span>修为</span><b>{{ life.xiwei }}</b></div>
            <div class="stat-line"><span>武学</span><b>{{ life.wugongXiuwei || 0 }}</b></div>
            <div class="stat-line"><span>盘缠</span><b>{{ life.money }} 贯</b></div>
            <div class="stat-line" v-if="life.minghao"><span>名号</span><b class="hl">{{ life.minghao }}</b></div>
          </div>
          <div class="sec-title">眼下状态</div>
          <div class="chip-row">
            <span class="chip" v-if="xinshi" @click="store.submit(`想想「${xinshi.title}」`)" style="cursor:pointer">心事 <b>{{ xinshi.title }}</b></span>
            <span class="chip lucky" v-else>心头无事</span>
            <span class="chip" v-if="gongfaBrief" :title="gongfaBrief">武学 <b>{{ gongfaNames }}</b></span>
          </div>
          <div class="guide-box">
            <div class="guide-title">✦ 当前建议</div>
            <div class="guide-tip" v-for="(t, i) in guideTips" :key="i">
              <span class="guide-tip-text">· {{ t.text }}</span>
              <button v-if="t.go" class="btn btn-sm guide-go" @click="activeTab = t.go">前往 ›</button>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="panel-title">✦ 其人</div>
          <p class="panel-empty">尚未落入此世。</p>
        </template>
      </aside>

      <!-- 中：行动横幅 + 页签 + 内容 + 游历记载 -->
      <section id="panel-center" class="panel center-panel">
        <div id="focus-strip" :class="{ hidden: !focusMain }">
          <template v-if="focusMain">
            <div class="focus-main">
              <span class="focus-label">主 线</span>
              <div class="focus-body">
                <div class="focus-title">{{ focusMain.title }}</div>
                <div class="focus-sub">{{ focusMain.sub }}</div>
              </div>
              <button class="focus-go" @click="activeTab = 'roam'">前 往</button>
            </div>
          </template>
        </div>

        <nav id="tabs">
          <button v-for="t in TABS" :key="t.id" class="tab-btn" :class="{ active: activeTab === t.id }" @click="activeTab = t.id">
            {{ t.name }}<span v-if="t.dot && t.dot()" class="dot"></span>
          </button>
        </nav>

        <div id="tab-content">
          <!-- 行走：光景 / 抉择 / 话头 / 意头 -->
          <template v-if="activeTab === 'roam'">
            <div class="card">
              <div class="card-title">✦ 光景 <span style="font-size:12px;color:var(--text-dim)">{{ locText }} · {{ scene.time }}</span></div>
              <div class="card-desc scene-text">{{ sceneText }}</div>
            </div>
            <div class="card" v-if="pending && pendingOptions.length">
              <div class="card-title">✦ {{ modeLabel }}</div>
              <div class="choice-btns">
                <button v-for="(o, i) in pendingOptions" :key="i" class="btn choice-btn" @click="store.chooseOption(i)">
                  {{ ['一','二','三','四','五','六'][i] }}、{{ o.label }}
                </button>
              </div>
            </div>
            <div class="card" v-else-if="inCombat">
              <div class="card-title">✦ 招来招往</div>
              <div class="card-desc">各凭本事——怎么打，你自己说。</div>
              <div class="choice-btns">
                <button class="btn choice-btn" @click="store.submit('出手，使最熟的一招')">出手</button>
                <button class="btn choice-btn" @click="store.submit('守住门户，观他的气机')">观气</button>
                <button class="btn choice-btn" @click="store.submit('收势守御')">守御</button>
                <button class="btn choice-btn" @click="store.submit('走！')">抽身</button>
              </div>
            </div>
            <div class="card" v-else>
              <div class="card-title">✦ 念头 <span style="font-size:12px;color:var(--text-dim)">点一个，随脚就走</span></div>
              <div class="huatou-wrap">
                <button v-for="(h, i) in shownHuatou" :key="i" class="btn btn-sm huatou-chip" @click="store.submit(h)">{{ h }}</button>
                <button v-if="huatouOverflow > 0 && !huatouExpanded" class="btn btn-sm huatou-chip ghost" @click="huatouExpanded = true">…还有别的念头（{{ huatouOverflow }} 条）</button>
                <button class="btn btn-sm huatou-chip" @click="store.submit('问天')">问天</button>
              </div>
            </div>
          </template>

          <!-- 问道：任务册 -->
          <template v-else-if="activeTab === 'quest'">
            <div class="card" v-if="activeQuest">
              <div class="card-title">✦ 任务册 <span style="font-size:12px;color:var(--text-dim)">了结 {{ doneQuests }} / {{ totalQuests }}</span></div>
              <div class="qz-title">【{{ activeQuest.title }}】</div>
              <div class="card-desc">{{ activeQuest.desc }}</div>
              <div class="qz-goal" v-for="g in activeQuest.goals" :key="g.hint || g.type">
                <i :class="g.done ? 'g-done' : 'g-todo'">{{ g.done ? '✓' : '○' }}</i>{{ g.hint || '（继续）' }}
              </div>
            </div>
            <div class="card" v-else>
              <div class="card-title">✦ 任务册</div>
              <div class="card-desc">（眼下没有挂在心头的差事。走过路过，机缘自会找上门。）</div>
            </div>
            <div class="card">
              <div class="card-title">✦ 章回</div>
              <div class="qz-goal" v-for="q in life.questLog || []" :key="q.id + q.chapter">
                <i :class="q.status === 'completed' ? 'g-done' : 'g-todo'">{{ q.status === 'completed' ? '✓' : '○' }}</i>第{{ q.chapter }}章 · {{ q.title }}
              </div>
            </div>
          </template>

          <!-- 天地：四野之路 -->
          <template v-else>
            <div class="card">
              <div class="card-title">✦ 此地 <span style="font-size:12px;color:var(--text-dim)">{{ locText }}</span></div>
              <div class="card-desc">{{ sceneText }}</div>
            </div>
            <div class="card">
              <div class="card-title">✦ 出得此地</div>
              <div class="huatou-wrap">
                <button v-for="n in scene.links || []" :key="n.id" class="btn btn-sm huatou-chip" @click="store.submit('去' + n.name)">去{{ n.name }}</button>
                <span v-if="!(scene.links || []).length" class="card-desc">（此地已是路的尽头。）</span>
              </div>
            </div>
            <div class="card" v-if="recentPlaces.length">
              <div class="card-title">✦ 行路志</div>
              <div class="card-desc">{{ recentPlaces.join(' · ') }}</div>
            </div>
          </template>
        </div>

        <!-- 游历记载（参考 #log-wrap 结构：折叠 + 过滤 + 暂停 + 清空） -->
        <div id="log-wrap" :class="{ collapsed: !logOpen }">
          <div class="log-head">✦ 游历记载<span class="log-badge" style="display:none"></span>
            <span class="log-tools">
              <span class="log-filters">
                <button v-for="f in LOG_FILTERS" :key="f.k" class="log-tool" :class="{ on: logFilter === f.k }" @click="logFilter = f.k">{{ f.label }}</button>
              </span>
              <button class="log-toggle" @click="logOpen = !logOpen">{{ logOpen ? '收起' : '展开' }}</button>
              <button class="log-tool" :class="{ on: logPaused }" @click="logPaused = !logPaused">{{ logPaused ? '恢复滚动' : '暂停滚动' }}</button>
              <button class="log-tool" @click="clearLog">一键清空</button>
            </span>
          </div>
          <div id="log" ref="logEl">
            <div v-for="m in filteredJournal" :key="m.t" :class="['log-entry', 'log-' + kindClass(m.kind)]">
              <span class="t-time">{{ yearWord }}</span>{{ m.text }}
            </div>
          </div>
        </div>
      </section>

      <!-- 右：行囊 + 菜单 -->
      <aside id="panel-right">
        <div class="panel" id="bag-panel">
          <div class="panel-title">✦ 乾坤袋</div>
          <div class="bag-tabs">
            <button v-for="t in BAG_TABS" :key="t.id" class="bag-tab" :class="{ active: bagTab === t.id }" @click="bagTab = t.id">{{ t.name }}</button>
          </div>
          <div class="bag-list">
            <div class="bag-item" :class="`gq-${it.grade ?? 0}`" v-for="it in bagItems" :key="it.id || it.name">
              <div class="bag-item-head"><span class="bag-item-name">【{{ it.name }}】{{ life.equipped === it.id ? '（正在用）' : '' }}</span></div>
              <div class="bag-item-desc" v-if="it.desc">{{ it.desc }}</div>
              <div class="bag-item-btns">
                <button v-if="it.herb" class="btn btn-sm" @click="store.submit('服下' + it.name)">服下</button>
                <button v-else-if="life.equipped !== it.id" class="btn btn-sm" @click="store.submit('用起来' + it.name)">用起来</button>
              </div>
            </div>
            <div class="bag-empty" v-if="!bagItems.length">—— {{ bagTab === 'pill' ? '囊中无丹' : bagTab === 'gear' ? '身无长物' : '穷有穷的轻省' }} ——</div>
          </div>
        </div>
        <div class="panel menu-panel">
          <div class="panel-title">✦ 菜单</div>
          <div class="menu-btns">
            <div class="menu-group">
              <div class="menu-group-label">记档</div>
              <div class="menu-group-btns">
                <button class="btn btn-sm" @click="openSleeve">袖中录</button>
                <button class="btn btn-sm" @click="activePanel = 'codex'">成就 · 图鉴</button>
                <button class="btn btn-sm" @click="activePanel = 'char'">👤 人物志</button>
                <button class="btn btn-sm" @click="goPast">📜 往世簿</button>
              </div>
            </div>
            <div class="menu-group">
              <div class="menu-group-label">系统</div>
              <div class="menu-group-btns">
                <button class="btn btn-sm" @click="popup = 'save'">存档 / 读档</button>
                <button class="btn btn-sm" @click="popup = 'help'">玩法说明</button>
                <button class="btn btn-sm btn-danger" @click="goTitle">回到开始界面</button>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </main>

    <!-- ==================== 通用弹窗（参考 popup-modal 结构） ==================== -->
    <div id="popup-modal" class="modal" :class="{ hidden: !popup }" @click.self="popup = null">
      <div class="popup-box">
        <div class="popup-title">{{ popupTitle }}</div>
        <div class="popup-body">
          <!-- 袖中录 -->
          <template v-if="popup === 'sleeve'">
            <div class="sd-book" v-for="bk in sleeveBooks" :key="bk.name">
              <b>{{ bk.name }}</b>
              <div class="sd-item" v-for="(p, i) in bk.items" :key="i" v-html="p"></div>
              <div class="sd-item" v-if="!bk.items.length">{{ bk.empty }}</div>
            </div>
          </template>
          <!-- 存档 -->
          <template v-else-if="popup === 'save'">
            <div class="save-menu" style="border:none;flex-direction:column;align-items:stretch">
              <button class="btn" v-for="(s, i) in ['slot1','slot2','slot3']" :key="s" @click="store.saveToSlot(s); popup = null">存入 · 档{{ ['一','二','三'][i] }}</button>
              <button class="btn" v-for="sv in loadableSaves" :key="sv.slot" @click="store.loadFromSlot(sv.slot); popup = null">读 · {{ slotLabel(sv.slot) }}（{{ sv.name }}）</button>
            </div>
          </template>
          <!-- 玩法说明 -->
          <template v-else-if="popup === 'help'">
            <div class="card-desc" style="white-space:pre-wrap;line-height:2">{{ helpText }}</div>
          </template>
        </div>
        <div class="popup-btns"><button class="btn" @click="popup = null">合上</button></div>
      </div>
    </div>

    <!-- 六册弹窗（沿用册页组件） -->
    <CharacterPanel :open="activePanel === 'char'" @close="activePanel = ''" />
    <SkillsPanel :open="activePanel === 'skills'" @close="activePanel = ''" />
    <InventoryPanel :open="activePanel === 'inv'" @close="activePanel = ''" />
    <QuestPanel :open="activePanel === 'quest'" @close="activePanel = ''" />
    <WorldPanel :open="activePanel === 'world'" @close="activePanel = ''" />
    <CodexPanel :open="activePanel === 'codex'" @close="activePanel = ''" />
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue';
import { store } from '../main.js';
import { audio } from '../audio.js';
import CharacterPanel from './panels/CharacterPanel.vue';
import SkillsPanel from './panels/SkillsPanel.vue';
import InventoryPanel from './panels/InventoryPanel.vue';
import QuestPanel from './panels/QuestPanel.vue';
import WorldPanel from './panels/WorldPanel.vue';
import CodexPanel from './panels/CodexPanel.vue';

const game = computed(() => store.game);
const logEl = ref(null);

// ---------- 设置（参考 amb-panel） ----------
const settingsOpen = ref(false);
const muted = ref(!!audio.muted);
function toggleMute() { muted.value = !muted.value; audio.muted = muted.value; }
const fontScale = ref(100);
watch(fontScale, (v) => { document.documentElement.style.fontSize = v + '%'; });

// ---------- 顶栏 ----------
const life = computed(() => (game.value && game.value.state && game.value.state.life) || {});
const hasLife = computed(() => life.value.name !== undefined);
const safeScene = computed(() => {
  try {
    const s = game.value.currentScene();
    if (s && s.city && s.area && s.node) return s;
  } catch {}
  return { city: { name: '—' }, area: { name: '—' }, node: { name: '—' }, time: '', huatou: [], links: [], text: '' };
});
const scene = computed(() => safeScene.value);
const locText = computed(() => `${scene.value.city.name}·${scene.value.area.name}·${scene.value.node.name}`);
const sceneText = computed(() => scene.value.text || scene.value.node?.desc || '');
const realmWord = computed(() => {
  try {
    const eye = game.value && game.value.eyeNow ? game.value.eyeNow() : null;
    return (eye && eye.realmWord) || '';
  } catch { return ''; }
});
const spanWord = computed(() => {
  const l = life.value;
  if (!l.lifespanMax || !l.age) return '';
  const r = l.age / l.lifespanMax;
  if (r >= 0.95) return '油尽灯枯之相';
  if (r >= 0.9) return '鬓角见霜';
  if (r >= 0.7) return '知命之年';
  return '春秋正盛';
});
const hpPct = computed(() => {
  const l = life.value;
  if (!l.maxHp) return 100;
  return Math.max(0, Math.min(100, Math.round((l.hp / l.maxHp) * 100)));
});
const equippedItem = computed(() => {
  const l = life.value;
  if (!l.equipped) return null;
  return (l.items || []).find(i => i.id === l.equipped) || null;
});
const DIM_DEFS = [
  { k: 'gengu', name: '根骨' }, { k: 'wuxing', name: '悟性' }, { k: 'qiyun', name: '气运' },
  { k: 'meili', name: '魅力' }, { k: 'fuyuan', name: '福缘' },
];
const dimList = computed(() => {
  const d = life.value.dims || {};
  return DIM_DEFS.map(x => ({ k: x.k, name: x.name, v: d[x.k] || 0 }));
});
const gongfaNames = computed(() => (life.value.gongfa || []).map(x => x.name).join('、'));
const gongfaBrief = computed(() => (life.value.gongfa || []).map(x => `${x.name}（${levelWord(x.level)}）`).join(' · '));
function levelWord(lv) { return ['入门', '小成', '大成', '圆满', '出神入化'][lv] || '入门'; }

// ---------- 左栏：当前建议（问路式引导） ----------
const xinshi = computed(() => {
  try { return (game.value.eyeNow?.() || {}).xinshi || null; } catch { return null; }
});
const activeQuest = computed(() => (life.value.questLog || []).find(q => q.status === 'active') || null);
const doneQuests = computed(() => (life.value.questLog || []).filter(q => q.status === 'completed').length);
const totalQuests = computed(() => (life.value.questLog || []).length);
const guideTips = computed(() => {
  const tips = [];
  const q = activeQuest.value;
  if (q) {
    const undone = (q.goals || []).filter(g => !g.done);
    tips.push({ text: `第${q.chapter}章·${q.title}——${undone.map(g => g.hint || '（继续）').join('；') || '了结在即'}`, go: 'quest' });
  } else {
    tips.push({ text: '身上没有差事。四处走走，或找人搭句话——路是问出来的。', go: 'roam' });
  }
  if (life.value.hp !== undefined && life.value.hp < life.value.maxHp * 0.35) tips.push({ text: '气血衰微，宜将养、吃点东西。', go: 'roam' });
  if (xinshi.value) tips.push({ text: `心里搁着「${xinshi.value.title}」，想想它。`, go: 'roam' });
  return tips;
});

// ---------- 行动横幅 ----------
const focusMain = computed(() => {
  const q = activeQuest.value;
  if (!q) return null;
  const undone = (q.goals || []).filter(g => !g.done);
  return { title: `第${q.chapter}章·${q.title}`, sub: undone.map(g => g.hint || '（继续）').join('；') || '了结在即' };
});

// ---------- 中央页签 ----------
const TABS = [
  { id: 'roam', name: '行走', dot: () => !!game.value?.pending },
  { id: 'quest', name: '问道', dot: () => !!activeQuest.value },
  { id: 'world', name: '天地', dot: () => false },
];
const activeTab = ref('roam');
const pending = computed(() => game.value?.pending);
const pendingOptions = computed(() => (game.value?.pending?.options) || []);
const modeLabel = computed(() => ({
  event: '眼下的事', adventure: '机缘当前', lifenode: '人生路口',
}[game.value?.ui?.mode] || '抉择'));
const inCombat = computed(() => !!game.value?.state?.combat);

// 话头折叠（沿革：出行/生计/曝光念头永不折叠）
const HUATOU_LIMIT = 10;
const huatouExpanded = ref(false);
const isCoreHuatou = (h) => /^去/.test(h) || /^(做工挣钱|清点行囊|吃点东西|置办用度|拜师|师门功课|安家置业|盘下酒肆|请人看宅|寻龙点穴|查案|用起来)$/.test(h);
const shownHuatou = computed(() => {
  const all = scene.value.huatou || [];
  const go = all.filter(isCoreHuatou);
  const rest = all.filter(h => !isCoreHuatou(h));
  if (huatouExpanded.value) return [...go, ...rest];
  const restRoom = Math.max(0, HUATOU_LIMIT - go.length);
  return [...go, ...rest.slice(0, restRoom)];
});
const huatouOverflow = computed(() => {
  const all = scene.value.huatou || [];
  if (huatouExpanded.value) return 0;
  const go = all.filter(isCoreHuatou).length;
  const rest = all.length - go;
  return Math.max(0, rest - Math.max(0, HUATOU_LIMIT - go));
});
const recentPlaces = computed(() => {
  try { return (game.value.getSleeve().places || []).slice(-8).reverse(); } catch { return []; }
});

// ---------- 游历记载（参考 log 系统） ----------
const logOpen = ref(false);
const logPaused = ref(false);
const logFilter = ref('');
const LOG_FILTERS = [
  { k: '', label: '全部', kinds: null },
  { k: 'battle', label: '战斗', kinds: ['combat'] },
  { k: 'gain', label: '收获', kinds: ['item', 'ledger'] },
  { k: 'story', label: '剧情', kinds: ['event', 'imprint', 'adventure', 'dialog'] },
  { k: 'system', label: '要事', kinds: ['system', 'year', 'death'] },
];
const KIND_CLASS = {
  scene: 'info', echo: 'info', ambient: 'info',
  combat: 'battle', item: 'gain', ledger: 'gain',
  event: 'story', imprint: 'story', adventure: 'story', dialog: 'story',
  system: 'system', year: 'realm', death: 'realm',
};
const kindClass = (k) => KIND_CLASS[k] || 'info';
const yearWord = computed(() => `第${((game.value?.state?.world?.year) || 0) + 1}年`);
const journal = computed(() => (game.value && game.value.journal) || []);
const filteredJournal = computed(() => {
  const f = LOG_FILTERS.find(x => x.k === logFilter.value);
  if (!f || !f.kinds) return journal.value;
  return journal.value.filter(m => f.kinds.includes(m.kind));
});
function clearLog() { if (game.value) game.value.journal = []; }
watch(() => store.journalTick, async () => {
  await nextTick();
  const el = logEl.value;
  if (el && !logPaused.value) el.scrollTop = el.scrollHeight;
  if (game.value && game.value.ui?.mode === 'dead') await store.onDeath();
});

// ---------- 右栏：乾坤袋（参考框架：分类页签 + 列表） ----------
const BAG_TABS = [
  { id: 'all', name: '全部' },
  { id: 'pill', name: '丹药' },
  { id: 'gear', name: '器物' },
];
const bagTab = ref('all');
const bagItems = computed(() => {
  const all = (life.value.items || []).map(i => ({ id: i.id, name: i.name, desc: i.desc, herb: i.herb }));
  if (bagTab.value === 'pill') return all.filter(i => i.herb);
  if (bagTab.value === 'gear') return all.filter(i => !i.herb);
  return all;
});

// ---------- 菜单 / 弹窗 ----------
const activePanel = ref('');
const popup = ref(null);
const popupTitle = computed(() => ({ sleeve: '袖 中 录', save: '存 档 · 读 档', help: '玩 法 说 明' }[popup.value] || ''));
function openSleeve() { popup.value = 'sleeve'; }
function goPast() { store.screen = 'past'; }
function goTitle() { store.screen = 'title'; }
const loadableSaves = computed(() => (store.saveSlots || []).filter(x => x.slot !== 'auto' && x.slot !== 'backup-preimport'));
const SLOT_NAMES = { slot1: '档一', slot2: '档二', slot3: '档三' };
const slotLabel = (s) => SLOT_NAMES[s] || s;
const sleeveBooks = computed(() => {
  let s = {};
  try { s = game.value.getSleeve() || {}; } catch {}
  return [
    { name: '行路志', items: (s.places || []).slice(-12).reverse(), empty: '（走过的地方，会记在这里。）' },
    { name: '人物谱', items: (s.people || []).map(p => `<b>${p.name}</b>——${p.desc}`), empty: '（遇过的人，会记在这里。）' },
    { name: '旧账册', items: (s.ledger || []).map(l => `【${l.type}】${l.text}${l.resolved ? '（已清）' : ''}`), empty: '（恩怨账目，会记在这里。）' },
    { name: '行路志铭', items: (s.xinglu || []), empty: '（路上的铭感之言，会记在这里。）' },
    { name: '秘闻卷', items: (s.miwen || []), empty: '（说书人的掌故，会记在这里。）' },
    { name: '道藏卷', items: (s.daozang || []), empty: '（读过经文、心法要诀，会记在这里。）' },
    { name: '山河卷', items: (s.shanhe || []), empty: '（走过的城、渡过的海，会记在这里。）' },
    { name: '妖兽卷', items: (s.beasts || []), empty: '（见过、收服过的妖兽，会记在这里。）' },
    { name: '器物卷', items: (s.items || []).map(it => `<b>【${it.name}】</b>${it.equipped ? '（正在用）' : ''}${it.desc || ''}`), empty: '（得了器物、丹药、天材地宝，都会记在这里。）' },
  ];
});
const helpText = '一局一生，卷末留册，下世承启。\n\n· 左栏是你这个人：气血、五维、眼下状态与建议。\n· 中栏行走天下：光景里点「念头」即可行事——去哪儿、吃什么、和谁搭话，都是点选。\n· 问天不知方向时，点一下「问天」，天只指个方向。\n· 底部游历记载可过滤、折叠、暂停、清空。\n· 右栏乾坤袋与菜单：袖中录三卷、图鉴、存档读档皆在此。';

</script>
