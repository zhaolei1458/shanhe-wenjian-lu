<template>
  <div class="screen world-screen">
    <!-- 顶栏：名号境界 + 资源条（2.1 焕新：常驻可见，不开面板） -->
    <header class="ws-topbar">
      <div class="top-title">山河问剑录</div>
      <div class="top-info">
        <span class="ti-name">{{ life.name || '无名' }}<em v-if="realmWord">·{{ realmWord }}</em></span>
        <span class="ti-res ti-loc">{{ scene.city.name }}·{{ scene.area.name }}·{{ scene.node.name }} {{ scene.time }}</span>
        <span class="ti-res ti-hp">气血 {{ life.hp ?? '—' }}/{{ life.maxHp ?? '—' }}</span>
        <span class="ti-res">修为 {{ life.xiwei ?? '—' }}</span>
        <span class="ti-res">武学 {{ life.wugongXiuwei || 0 }}</span>
        <span class="ti-res ti-money">{{ life.money ?? 0 }} 贯</span>
        <span class="ti-res ti-age">{{ life.age ?? '?' }} 岁</span>
      </div>
      <div class="top-right">
        <button class="mini-btn" @click="store.sleeveOpen = !store.sleeveOpen">袖中录</button>
        <button class="mini-btn" @click="saveMenu = !saveMenu">存档</button>
      </div>
    </header>

    <div v-if="saveMenu" class="save-menu">
      <button class="mini-btn" v-for="(s, i) in ['slot1','slot2','slot3']" :key="s" @click="store.saveToSlot(s); saveMenu=false">存入·档{{ ['一','二','三'][i] }}</button>
      <span v-for="sv in loadableSaves" :key="sv.slot" class="save-item">
        <button class="mini-btn ghost" @click="store.loadFromSlot(sv.slot)">读·{{ slotLabel(sv.slot) }}（{{ sv.name }}）</button>
      </span>
    </div>

    <!-- 2.1 三栏布局：左角色 · 中卷轴 · 右任务行囊（移动端塌缩，用底导航面板） -->
    <main class="ws-layout">
      <!-- 左：角色状态常驻 -->
      <aside class="ws-col ws-left panel-card" v-if="life.name !== undefined">
        <div class="card-title">✦ 其人</div>
        <div class="lr-row"><span>名姓</span><b>{{ life.name }}{{ life.alias ? `（化名"${life.alias}"）` : '' }}</b></div>
        <div class="lr-row"><span>年岁</span><b>{{ life.age }} 岁</b></div>
        <div class="lr-row"><span>境界</span><b>{{ realmWord || '未入修行' }}</b></div>
        <div class="lr-row"><span>寿元</span><b>{{ life.lifespanMax ? `约 ${life.lifespanMax} 岁（现年 ${life.age}${spanWord}）` : '未卜' }}</b></div>
        <div class="card-title" style="margin-top:10px">✦ 家底</div>
        <div class="lr-row"><span>气血</span><b>{{ life.hp }} / {{ life.maxHp }}</b></div>
        <div class="lr-row"><span>修为</span><b>{{ life.xiwei }}</b></div>
        <div class="lr-row"><span>武学</span><b>{{ life.wugongXiuwei || 0 }}</b></div>
        <div class="lr-row"><span>盘缠</span><b>{{ life.money }} 贯</b></div>
        <div class="card-title" style="margin-top:10px">✦ 五维</div>
        <div class="dim-bar" v-for="d in dimList" :key="d.k">
          <span class="dim-name">{{ d.name }}</span>
          <span class="dim-track"><i class="dim-fill" :style="{ width: d.v + '%' }"></i></span>
          <b class="dim-val">{{ d.v }}</b>
        </div>
        <p class="panel-hint" v-if="gongfaBrief">武学：{{ gongfaBrief }}</p>
      </aside>
      <aside class="ws-col ws-left panel-card" v-else>
        <div class="card-title">✦ 其人</div>
        <p class="panel-empty">尚未落入此世。</p>
      </aside>

      <!-- 中：卷轴 + 抉择 + 输入（山河之魂，原样保留） -->
      <section class="ws-center">
        <!-- 二十一期修 F：眼下栏（常驻锚点） -->
        <div v-if="xinshi || realmWord" class="ws-eyesnow">
          <button v-if="xinshi" class="mini-btn ghost eye-chip" @click="store.submit(`想想「${xinshi.title}」`)">心事·{{ xinshi.title }}</button>
          <span v-else class="eye-quiet">心头无事</span>
          <span v-if="realmWord" class="eye-realm">{{ realmWord }}</span>
        </div>

        <!-- 游历记载：过滤页签（2.1 对齐参考框架） -->
        <div class="log-filters">
          <button v-for="f in FILTERS" :key="f.k" class="log-tool" :class="{ on: logFilter === f.k }" @click="logFilter = f.k">{{ f.label }}</button>
        </div>

        <!-- 卷轴：光景与回声 -->
        <div class="ws-scroll" ref="scroller">
          <div v-for="m in filteredJournal" :key="m.t" :class="['jm', 'jm-' + m.kind]">{{ m.text }}</div>
        </div>

        <!-- 挂起选项：事件/奇遇/人生节点 -->
        <div v-if="pending && pendingOptions.length" class="ws-options">
          <div class="opt-hint">{{ modeLabel }}</div>
          <button v-for="(o, i) in pendingOptions" :key="i" class="opt-btn" @click="store.chooseOption(i)">
            {{ ['一','二','三','四','五','六'][i] }}、{{ o.label }}
          </button>
        </div>

        <!-- 战斗快捷 -->
        <div v-else-if="inCombat" class="ws-options">
          <div class="opt-hint">招来招往，各凭本事——怎么打，你自己说。</div>
          <button class="opt-btn" @click="combat('出手，使最熟的一招')">出手</button>
          <button class="opt-btn" @click="combat('守住门户，观他的气机')">观气</button>
          <button class="opt-btn" @click="combat('收势守御')">守御</button>
          <button class="opt-btn" @click="combat('走！')">抽身</button>
        </div>

        <!-- 话头扶手 -->
        <div v-else class="ws-huatou">
          <button v-for="(h, i) in shownHuatou" :key="i" class="huatou-btn" @click="store.submit(h)">{{ h }}</button>
          <button v-if="huatouOverflow > 0 && !huatouExpanded" class="huatou-btn ghost" @click="huatouExpanded = true">…还有别的念头（{{ huatouOverflow }} 条）</button>
        </div>

        <!-- 输入框（意头） -->
        <div class="ws-inputrow">
          <input
            v-model="inputText"
            class="ws-input"
            :placeholder="inCombat ? '（战斗中——招式、守御、观气、抽身，皆随你）' : '意头随意打：去东市、和老道攀谈、打听漕银的案子、打坐……'"
            @keydown.enter="send"
          />
          <button class="btn primary" @click="send">行</button>
          <button class="btn ghost" @click="store.submit('问天')">问天</button>
        </div>
      </section>

      <!-- 右：任务册 + 行囊 + 菜单（桌面常驻；移动端收进底导航面板） -->
      <aside class="ws-col ws-right">
        <div class="panel-card" v-if="activeQuest">
          <div class="card-title">✦ 任务册</div>
          <div class="qz-title">【{{ activeQuest.title }}】</div>
          <div class="qz-desc">{{ activeQuest.desc }}</div>
          <div class="qz-goal" v-for="g in activeQuest.goals" :key="g.hint || g.type">
            <i :class="g.done ? 'g-done' : 'g-todo'">{{ g.done ? '✓' : '○' }}</i>{{ g.hint || '（继续）' }}
          </div>
          <div class="qz-done-count">了结 {{ doneQuests }} / {{ totalQuests }}</div>
        </div>
        <div class="panel-card">
          <div class="card-title">✦ 行囊</div>
          <div class="bag-item" v-for="i in bagBrief" :key="i.id || i.name">
            <b>【{{ i.name }}】</b>{{ equipped === i.id ? '（正在用）' : '' }}
          </div>
          <div v-if="!bagBrief.length" class="qz-desc">（穷有穷的轻省。）</div>
        </div>
        <div class="panel-card">
          <div class="card-title">✦ 菜单</div>
          <div class="menu-btns">
            <button class="mini-btn" @click="activePanel = 'codex'">成就·图鉴</button>
            <button class="mini-btn" @click="activePanel = 'skills'">武学册</button>
            <button class="mini-btn" @click="activePanel = 'world'">天地册</button>
            <button class="mini-btn" @click="store.sleeveOpen = true">袖中录</button>
          </div>
        </div>
      </aside>
    </main>

    <!-- 底导航（移动端） -->
    <nav class="bottom-nav">
      <button v-for="t in NAVS" :key="t.key" class="bn-btn" :class="{ on: activePanel === t.key }" @click="activePanel = activePanel === t.key ? '' : t.key">
        <span class="bn-ico">{{ t.ico }}</span><span class="bn-label">{{ t.label }}</span>
      </button>
    </nav>
    <CharacterPanel :open="activePanel === 'char'" @close="activePanel = ''" />
    <SkillsPanel :open="activePanel === 'skills'" @close="activePanel = ''" />
    <InventoryPanel :open="activePanel === 'inv'" @close="activePanel = ''" />
    <QuestPanel :open="activePanel === 'quest'" @close="activePanel = ''" />
    <WorldPanel :open="activePanel === 'world'" @close="activePanel = ''" />
    <CodexPanel :open="activePanel === 'codex'" @close="activePanel = ''" />

    <!-- 袖中录抽屉 -->
    <div v-if="store.sleeveOpen" class="sleeve-drawer">
      <div class="sd-head">
        <span>袖中录</span>
        <button class="mini-btn" @click="store.sleeveOpen = false">收</button>
      </div>
      <div class="sd-body">
        <div class="sd-book"><b>行路志</b>
          <div v-for="(p,i) in sleeve.places.slice(-12).reverse()" :key="i" class="sd-item">{{ p }}</div>
        </div>
        <div class="sd-book"><b>人物谱</b>
          <div v-for="(p,i) in sleeve.people" :key="i" class="sd-item"><b>{{ p.name }}</b>——{{ p.desc }}</div>
        </div>
        <div class="sd-book"><b>旧账册</b>
          <div v-for="(l,i) in sleeve.ledger" :key="i" class="sd-item">【{{ l.type }}】{{ l.text }}<span v-if="l.resolved" class="sd-resolved">（已清）</span></div>
        </div>
        <div class="sd-book"><b>行路志铭</b>
          <div v-for="(x,i) in sleeve.xinglu" :key="i" class="sd-item xinglu">{{ x }}</div>
        </div>
        <div class="sd-book"><b>秘闻卷</b>
          <div v-for="(x,i) in sleeve.miwen" :key="i" class="sd-item">{{ x }}</div>
          <div v-if="!sleeve.miwen.length" class="sd-item">（说书人的掌故，会记在这里。）</div>
        </div>
        <div class="sd-book"><b>道藏卷</b>
          <div v-for="(x,i) in sleeve.daozang" :key="i" class="sd-item">{{ x }}</div>
          <div v-if="!sleeve.daozang.length" class="sd-item">（读过经文、心法要诀，会记在这里。）</div>
        </div>
        <div class="sd-book"><b>山河卷</b>
          <div v-for="(x,i) in sleeve.shanhe" :key="i" class="sd-item">{{ x }}</div>
          <div v-if="!sleeve.shanhe.length" class="sd-item">（走过的城、渡过的海，会记在这里。）</div>
        </div>
        <div class="sd-book"><b>妖兽卷</b>
          <div v-for="(x,i) in sleeve.beasts" :key="i" class="sd-item">{{ x }}</div>
          <div v-if="!sleeve.beasts.length" class="sd-item">（见过、收服过的妖兽，会记在这里。）</div>
        </div>
        <div class="sd-book"><b>器物卷</b>
          <div v-for="it in (sleeve.items || [])" :key="it.id" class="sd-item">
            <b>【{{ it.name }}】</b>{{ it.equipped ? '（正在用）' : '' }}{{ it.desc }}
            <span v-if="it.herb">
              <button class="mini-btn ghost" @click="store.submit('服下' + it.name)">服下</button>
            </span>
            <span v-else-if="!it.equipped">
              <button class="mini-btn ghost" @click="store.submit('用起来' + it.name)">用起来</button>
            </span>
          </div>
          <div v-if="!(sleeve.items || []).length" class="sd-item">（得了器物、丹药、天材地宝，都会记在这里。）</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue';
import { store } from '../main.js';
import CharacterPanel from './panels/CharacterPanel.vue';
import SkillsPanel from './panels/SkillsPanel.vue';
import InventoryPanel from './panels/InventoryPanel.vue';
import QuestPanel from './panels/QuestPanel.vue';
import WorldPanel from './panels/WorldPanel.vue';
import CodexPanel from './panels/CodexPanel.vue';

// 2.0 第零层：底导航五本册页；2.0 第四层（4.4）：图鉴成就第六册
const NAVS = [
  { key: 'char', label: '人物', ico: '人' },
  { key: 'skills', label: '武学', ico: '武' },
  { key: 'inv', label: '行囊', ico: '囊' },
  { key: 'quest', label: '任务', ico: '事' },
  { key: 'world', label: '天地', ico: '天' },
  { key: 'codex', label: '图鉴', ico: '鉴' },
];
const activePanel = ref('');

const game = computed(() => store.game);
const inputText = ref('');
const saveMenu = ref(false);
const scroller = ref(null);

const pending = computed(() => game.value.pending);
const pendingOptions = computed(() => (game.value.pending?.options) || []);
const modeLabel = computed(() => ({
  event: '眼下的事', adventure: '机缘当前', lifenode: '人生路口',
}[game.value.ui?.mode] || '抉择'));
const inCombat = computed(() => !!game.value.state?.combat);
const sleeve = computed(() => game.value.getSleeve());

// 2.1 焕新：顶栏 + 三栏布局数据口（沿用凡人问道框架的"角色常驻左、任务行囊常驻右"）
const life = computed(() => (game.value && game.value.state && game.value.state.life) || {});
const safeScene = computed(() => {
  try {
    const s = game.value.currentScene();
    if (s && s.city && s.area && s.node) return s;
  } catch {}
  return { city: { name: '—' }, area: { name: '—' }, node: { name: '—' }, time: '', huatou: [] };
});
const scene = computed(() => safeScene.value);

// 寿数分档（与 CharacterPanel 同源）
const spanWord = computed(() => {
  const l = life.value;
  if (!l.lifespanMax || !l.age) return '';
  const r = l.age / l.lifespanMax;
  if (r >= 0.95) return '·油尽灯枯之相';
  if (r >= 0.9) return '·鬓角见霜';
  if (r >= 0.7) return '·知命之年';
  return '·春秋正盛';
});

// 五维条
const DIM_DEFS = [
  { k: 'gengu', name: '根骨' }, { k: 'wuxing', name: '悟性' }, { k: 'qiyun', name: '气运' },
  { k: 'meili', name: '魅力' }, { k: 'fuyuan', name: '福缘' },
];
const dimList = computed(() => {
  const d = life.value.dims || {};
  return DIM_DEFS.map(x => ({ k: x.k, name: x.name, v: d[x.k] || 0 }));
});

// 武学功法一句话
const gongfaBrief = computed(() => {
  const g = life.value.gongfa || [];
  if (!g.length) return '';
  return g.map(x => x.name + (x.level ? `（${levelWord(x.level)}）` : '')).join(' · ');
});
function levelWord(lv) {
  return ['入门', '小成', '大成', '圆满', '出神入化'][lv] || '入门';
}

// 卷轴过滤页签：全卷 / 要事 / 刀兵 / 得失 / 回声
const FILTERS = [
  { k: 'all', label: '全卷', kinds: null },
  { k: 'sys', label: '要事', kinds: ['system', 'event', 'imprint', 'year', 'death'] },
  { k: 'combat', label: '刀兵', kinds: ['combat'] },
  { k: 'gain', label: '得失', kinds: ['item', 'ledger'] },
  { k: 'echo', label: '回声', kinds: ['echo'] },
];
const logFilter = ref('all');
const journal = computed(() => (game.value && game.value.journal) || []);
const filteredJournal = computed(() => {
  const f = FILTERS.find(x => x.k === logFilter.value);
  if (!f || !f.kinds) return journal.value;
  return journal.value.filter(m => f.kinds.includes(m.kind));
});

// 右栏：任务册 / 行囊
const activeQuest = computed(() => (life.value.questLog || []).find(q => q.status === 'active') || null);
const doneQuests = computed(() => (life.value.questLog || []).filter(q => q.status === 'completed').length);
const totalQuests = computed(() => (life.value.questLog || []).length);
const bagBrief = computed(() => (life.value.items || []).map(i => ({ id: i.id, name: i.name })));
const equipped = computed(() => life.value.equipped);

// 二十一期修 E：话头折叠；二十三期修 F：出行念头（去X）置顶且永不折叠——路必须首屏可见
const HUATOU_LIMIT = 8;
const huatouExpanded = ref(false);
const isGoHuatou = (h) => /^去/.test(h);
// 二十四期修 B：生计动词与出行同权——核心生活动作永不折叠（折叠区新手看不到就等于不存在）
// 二十四期夜巡修 G：曝光念头与生计同权——修C/D/E/F挂进去的拜师/功课/安家/盘业/看宅/
// 寻龙/查案/佩戴此前排在折叠区队尾，「打坐/练武」永远先占名额（rest 队列按数组顺序截断），
// 数据梯度证实：拜师(rest第3位)触达200，定居(第5位)24，装备(末位)仅4。曝光不被折叠才算曝光。
const isCoreHuatou = (h) => isGoHuatou(h) || /^(做工挣钱|清点行囊|吃点东西|置办用度|拜师|师门功课|安家置业|盘下酒肆|请人看宅|寻龙点穴|查案|用起来)$/.test(h);
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

// 二十一期修 F：眼下栏数据（暗线 chip + 境界词，反数值——只给词不给数）
const eye = computed(() => game.value.eyeNow?.() || {});
const xinshi = computed(() => eye.value.xinshi || null);
const realmWord = computed(() => eye.value.realmWord || '');

// 存档槽位措辞（修 H）
const loadableSaves = computed(() => (store.saveSlots || []).filter(x => x.slot !== 'auto' && x.slot !== 'backup-preimport'));
const SLOT_NAMES = { slot1: '档一', slot2: '档二', slot3: '档三', 'backup-preimport': '导入前的旧进度' };
const slotLabel = (s) => SLOT_NAMES[s] || s;

function send() {
  const t = inputText.value.trim();
  if (!t) return;
  inputText.value = '';
  store.submit(t);
}
function combat(t) { store.submit(t); }

watch(() => store.journalTick, async () => {
  await nextTick();
  if (scroller.value) scroller.value.scrollTop = scroller.value.scrollHeight;
  // 死亡收束 → 盖棺
  if (game.value && game.value.ui?.mode === 'dead') {
    await store.onDeath();
  }
});
</script>
