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
            <b>【{{ g.name }}】</b><span>{{ g.desc || '' }}</span>
          </div>
        </div>
        <p class="panel-hint">（招式等级小成/大成/圆满，第二层战斗核落地后填入。）</p>
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
</script>
