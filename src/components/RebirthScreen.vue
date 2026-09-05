<template>
  <div class="screen rebirth-screen">
    <div class="rb-title">天地发帖</div>
    <p class="rb-hint">三张命帖，认领一张。命帖上写的是你的来处、你的软肋、和你躲不开的那道闸。</p>

    <div class="fate-cards">
      <div v-for="card in store.fateCards" :key="card.id" class="fate-card" @click="picked = card">
        <div class="fc-origin">{{ card.originName }} · {{ card.age }}岁</div>
        <div class="fc-row"><span class="fc-label">来处</span>{{ card.laichu }}</div>
        <div class="fc-row"><span class="fc-label">软肋</span>{{ card.ruanle }}</div>
        <div class="fc-row"><span class="fc-label">钩子</span>{{ card.gouzi }}</div>
      </div>
    </div>

    <div v-if="picked" class="rb-confirm">
      <div class="rb-name-row">
        <label>姓名：</label>
        <input v-model="store.name" maxlength="12" placeholder="认领后，名字自己起" class="rb-name-input" />
      </div>
      <label v-if="store.meta.legacyPoints >= 5" class="rb-pass">
        <input type="checkbox" v-model="passItem" />
        动用家底——带一件说不出来历的旧物（扣 5 分家底）
      </label>
      <button class="btn primary" @click="store.claimFate(picked)">认领此帖，落入此世</button>
    </div>

    <div class="rb-actions">
      <button class="btn" :disabled="store.rerolled" @click="store.rerollFates()">换一次手气{{ store.rerolled ? '（已换）' : '' }}</button>
      <button class="btn ghost" @click="store.screen = 'title'">回选世屏</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { store } from '../main.js';
const picked = ref(null);
const passItem = ref(false);
</script>
