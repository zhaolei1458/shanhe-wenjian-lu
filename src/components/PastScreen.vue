<template>
  <div class="screen past-screen">
    <div class="ps-title">往世簿</div>
    <p class="ps-hint">每一世都是一页。页页不同。</p>

    <div v-if="!store.meta.pastLives.length && !hasCodex" class="ps-empty">
      簿子还是空的。去活一世，再来翻。
    </div>

    <div v-for="(life, i) in [...store.meta.pastLives].reverse()" :key="i" class="ps-life">
      <div class="ps-life-head">
        <b>{{ life.name }}</b> · {{ life.age }}岁 · {{ kindName(life.kind) }} · +{{ life.points }}分家底
      </div>
      <pre class="ps-judge">{{ life.judge }}</pre>
    </div>

    <!-- 十九期：图鉴 -->
    <div v-if="hasCodex" class="ps-codex">
      <div class="ps-title" style="font-size: 1.1em; margin-top: 1.6em;">图鉴</div>
      <p class="ps-hint">见过的都算。江湖的旧档不销。</p>

      <div class="ps-codex-sec">
        <b>成就（{{ store.meta.achievements?.length || 0 }}/{{ totalAch }}）</b>
        <div class="ps-ach-grid">
          <div v-for="a in allAch" :key="a.id" class="ps-ach" :class="{ done: (store.meta.achievements || []).includes(a.id) }">
            <b>{{ a.name }}</b><span>{{ a.desc }}</span>
          </div>
        </div>
      </div>

      <div class="ps-codex-sec" v-if="codex.deathKinds?.length">
        <b>死法全收（{{ codex.deathKinds.length }} 种）</b>
        <div class="ps-tags"><span v-for="k in codex.deathKinds" :key="k">{{ kindName(k) }}</span></div>
      </div>

      <div class="ps-codex-sec" v-if="codex.minghao?.length">
        <b>名号谱（{{ codex.minghao.length }}）</b>
        <div class="ps-tags"><span v-for="m in codex.minghao" :key="m">{{ m }}</span></div>
      </div>

      <div class="ps-codex-sec" v-if="codex.beasts?.length">
        <b>妖兽卷（{{ codex.beasts.length }}）</b>
        <div class="ps-tags"><span v-for="b in codex.beasts" :key="b">{{ beastName(b) }}</span></div>
      </div>

      <div class="ps-codex-sec" v-if="codex.advSeen?.length">
        <b>奇遇见闻录（{{ codex.advSeen.length }}）</b>
        <div class="ps-tags"><span v-for="a in codex.advSeen" :key="a">{{ advTitle(a) }}</span></div>
      </div>
    </div>

    <button class="btn ghost" @click="store.screen = 'title'">合上簿子</button>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { store } from '../main.js';
import { ACHIEVEMENTS } from '../content/achievements.js';
import { ADVENTURES } from '../content/adventures.js';
import { BEASTS } from '../content/beasts.js';

const kindName = (k) => ({ shouzhong: '寿终正寝', hengsi: '横死', qiuren: '求仁得仁', daocheng: '道成', rumo: '入魔' }[k] || '收束');
const codex = computed(() => store.meta.codex || {});
const hasCodex = computed(() => (store.meta.achievements?.length || 0) > 0 || Object.values(codex.value).some(v => v?.length));
const allAch = ACHIEVEMENTS;
const totalAch = ACHIEVEMENTS.length;
const beastName = (id) => BEASTS[id]?.name || id;
const advTitle = (id) => ADVENTURES[id]?.title || id;
</script>
