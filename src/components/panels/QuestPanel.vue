<template>
  <div class="panel-overlay" v-if="open" @click.self="$emit('close')">
    <div class="panel book-scroll">
      <div class="panel-head">
        <h2>任务</h2>
        <button class="mini-btn" @click="$emit('close')">收</button>
      </div>
      <div class="panel-body" v-if="quests.length">
        <div class="panel-sec">
          <div class="panel-sec-title">进行中</div>
          <div v-for="q in quests" :key="q.id" class="panel-row panel-item">
            <b>{{ q.status === 'locked' ? '🔒 ' : '' }}第{{ q.chapter }}章·{{ q.title }}</b>
            <span v-if="q.status === 'locked'">（前章了结后展开）</span>
            <span v-else>{{ q.desc }}</span>
            <span v-if="q.status === 'active'" class="panel-goal">▶ {{ goalHint(q) }}</span>
          </div>
        </div>
        <div class="panel-sec" v-if="done.length">
          <div class="panel-sec-title">已了结</div>
          <div v-for="q in done" :key="q.id" class="panel-row panel-item done">
            <b>✓ {{ q.title }}</b>
          </div>
        </div>
      </div>
      <div class="panel-body" v-else>
        <p class="panel-empty">眼下没有记在册上的事。</p>
        <p class="panel-hint" v-if="xinshi">（心里搁着一桩事：<b>{{ xinshi }}</b>——琢磨琢磨它，或按着线索走一趟。）</p>
        <p class="panel-hint" v-else>（2.0 主线核第一层铺入后，身世局各章节都会记在这里，牵着人走。）</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { store } from '../../main.js';

defineProps({ open: Boolean });
defineEmits(['close']);

const life = computed(() => (store.game && store.game.state && store.game.state.life) || {});
const quests = computed(() => (life.value.questLog || []).filter(q => q.status !== 'completed'));
const done = computed(() => (life.value.questLog || []).filter(q => q.status === 'completed'));
const xinshi = computed(() => {
  try {
    const eye = store.game && store.game.eyeNow ? store.game.eyeNow() : null;
    return eye && eye.xinshi ? eye.xinshi.title : null;
  } catch { return null; }
});
function goalHint(q) {
  const pend = (q.goals || []).filter(g => !g.done);
  return pend.length ? pend.map(g => g.hint || '继续推进').join('；') : '（目标达成中——下一拍推进）';
}
</script>
