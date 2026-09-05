<template>
  <div class="screen world-screen">
    <!-- 顶栏 -->
    <div class="ws-topbar">
      <span class="ws-loc">{{ scene.city.name }} · {{ scene.area.name }} · {{ scene.node.name }}</span>
      <span class="ws-time">{{ scene.time }}</span>
      <span class="ws-actions">
        <button class="mini-btn" @click="store.sleeveOpen = !store.sleeveOpen">袖中录</button>
        <button class="mini-btn" @click="saveMenu = !saveMenu">存档</button>
      </span>
    </div>

    <div v-if="saveMenu" class="save-menu">
      <button class="mini-btn" v-for="(s, i) in ['slot1','slot2','slot3']" :key="s" @click="store.saveToSlot(s); saveMenu=false">存入·档{{ ['一','二','三'][i] }}</button>
      <span v-for="sv in loadableSaves" :key="sv.slot" class="save-item">
        <button class="mini-btn ghost" @click="store.loadFromSlot(sv.slot)">读·{{ slotLabel(sv.slot) }}（{{ sv.name }}）</button>
      </span>
    </div>

    <!-- 二十一期修 F：眼下栏（常驻锚点——暗线与境界，只给词不给数） -->
    <div v-if="xinshi || realmWord" class="ws-eyesnow">
      <button v-if="xinshi" class="mini-btn ghost eye-chip" @click="store.submit(`想想「${xinshi.title}」`)">心事·{{ xinshi.title }}</button>
      <span v-else class="eye-quiet">心头无事</span>
      <span v-if="realmWord" class="eye-realm">{{ realmWord }}</span>
    </div>

    <!-- 卷轴：光景与回声 -->
    <div class="ws-scroll" ref="scroller">
      <div v-for="m in game.journal" :key="m.t" :class="['jm', 'jm-' + m.kind]">{{ m.text }}</div>
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

    <!-- 话头扶手（二十一期修 E：超过 8 条折叠，宁可少摆不吓人） -->
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

const game = computed(() => store.game);
const inputText = ref('');
const saveMenu = ref(false);
const scroller = ref(null);

const scene = computed(() => game.value.currentScene());
const pending = computed(() => game.value.pending);
const pendingOptions = computed(() => (game.value.pending?.options) || []);
const modeLabel = computed(() => ({
  event: '眼下的事', adventure: '机缘当前', lifenode: '人生路口',
}[game.value.ui?.mode] || '抉择'));
const inCombat = computed(() => !!game.value.state?.combat);
const sleeve = computed(() => game.value.getSleeve());

// 二十一期修 E：话头折叠；二十三期修 F：出行念头（去X）置顶且永不折叠——路必须首屏可见
const HUATOU_LIMIT = 8;
const huatouExpanded = ref(false);
const isGoHuatou = (h) => /^去/.test(h);
// 二十四期修 B：生计动词与出行同权——核心生活动作永不折叠（折叠区新手看不到就等于不存在）
const isCoreHuatou = (h) => isGoHuatou(h) || /^(做工挣钱|清点行囊|吃点东西|置办用度)$/.test(h);
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
