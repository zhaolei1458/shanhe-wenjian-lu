<template>
  <div class="panel-overlay" v-if="open" @click.self="$emit('close')">
    <div class="panel book-scroll">
      <div class="panel-head">
        <h2>武学</h2>
        <button class="mini-btn" @click="$emit('close')">收</button>
      </div>
      <div class="panel-body" v-if="gongfa.length">
        <div class="panel-sec">
          <div class="panel-sec-title">已学功法</div>
          <div v-for="g in gongfa" :key="g.id || g.name" class="panel-row panel-item">
            <b>【{{ g.name }}】{{ levelWord(g.level) }}</b><span>{{ g.desc || '' }}</span>
          </div>
        </div>
      </div>
      <div class="panel-body" v-else>
        <p class="panel-empty">未学一式。</p>
        <p class="panel-hint">（拜师学艺、打赢缴获、奇遇传授——武学都会记在这里。）</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { store } from '../../main.js';

defineProps({ open: Boolean });
defineEmits(['close']);

const gongfa = computed(() => (store.game && store.game.state && store.game.state.life && store.game.state.life.gongfa) || []);
// 2.0 第二层：功法火候可视化（level 参与战斗结算，玩家看见的是"火候"）
function levelWord(lv) {
  if (lv === undefined || lv === null) return '';
  return { 0: '（初窥）', 1: '（入门）', 2: '（小成）', 3: '（大成）', 4: '（圆满）' }[lv] || `（第${lv}重）`;
}
</script>
