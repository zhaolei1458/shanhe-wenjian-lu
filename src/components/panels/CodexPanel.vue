<template>
  <div class="panel-overlay" v-if="open" @click.self="$emit('close')">
    <div class="panel book-scroll">
      <div class="panel-head">
        <h2>图鉴·成就</h2>
        <button class="mini-btn" @click="$emit('close')">收</button>
      </div>
      <div class="panel-body">
        <div class="panel-sec">
          <div class="panel-sec-title">成就名册（{{ doneCount }} / {{ total }}）</div>
          <div v-for="a in achList" :key="a.id" class="panel-row panel-item" :class="{ 'ach-off': !a.done }">
            <b>【{{ a.name }}】{{ a.done ? '' : '（未得）' }}</b><span>{{ a.desc }}</span>
          </div>
        </div>
        <div class="panel-sec">
          <div class="panel-sec-title">跨世图鉴（见过的都算）</div>
          <div class="panel-row"><span>了结方式</span><b>{{ codex.deathKinds.length }} 种</b></div>
          <div class="panel-row"><span>江湖名号</span><b>{{ codex.minghao.length }} 个</b></div>
          <div class="panel-row"><span>妖兽图录</span><b>{{ codex.beasts.length }} 种</b></div>
          <div class="panel-row"><span>机缘见闻</span><b>{{ codex.advSeen.length }} 桩</b></div>
        </div>
        <p class="panel-hint">（图鉴盖的是"世"章——你见过的、做过的，跨世记在这里。成就永不下架。）</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { store } from '../../main.js';
import { ACHIEVEMENTS } from '../../content/achievements.js';

defineProps({ open: Boolean });
defineEmits(['close']);

const meta = computed(() => (store.game && store.game.meta) || {});
const achList = computed(() => {
  const done = new Set(meta.value.achievements || []);
  return ACHIEVEMENTS.map(a => ({ ...a, done: done.has(a.id) }));
});
const doneCount = computed(() => achList.value.filter(a => a.done).length);
const total = ACHIEVEMENTS.length;
const codex = computed(() => meta.value.codex || { deathKinds: [], minghao: [], beasts: [], advSeen: [] });
</script>
