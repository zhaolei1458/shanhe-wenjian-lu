<template>
  <div class="screen death-screen" v-if="j">
    <div class="ds-seal">盖棺</div>
    <div class="ds-name">{{ j.name }} · 享年 {{ j.age }}</div>

    <div class="ds-section">
      <div class="ds-h">临终光景</div>
      <div class="ds-text">{{ lastWords }}</div>
    </div>

    <div class="ds-section">
      <div class="ds-h">旧账册（这一世的账）</div>
      <div class="ds-ledger">
        <div v-for="(l, i) in j.ledger" :key="i" class="ds-ledger-row">
          【{{ l.type }}】{{ l.text }}<span v-if="!l.resolved" class="ds-unresolved">（未了）</span>
        </div>
        <div v-if="!j.ledger.length" class="ds-ledger-row">——一生没有入账的大事。这样的一生，也是一种活法。</div>
      </div>
    </div>

    <div class="ds-section ds-judge">
      <div class="ds-h">判词</div>
      <div class="ds-text judge">{{ j.judge }}</div>
    </div>

    <div class="ds-section" v-if="j.chronicle && j.chronicle.length">
      <div class="ds-h">编年史（一生大事记）</div>
      <div class="ds-ledger">
        <div v-for="(c, i) in j.chronicle" :key="i" class="ds-ledger-row">{{ c }}</div>
      </div>
    </div>

    <div class="ds-section">
      <div class="ds-h">往世印记</div>
      <div class="ds-text imprint"><b>{{ j.imprint.name }}</b><br/>{{ j.imprint.text }}</div>
    </div>

    <div class="ds-section">
      <div class="ds-h">传薪</div>
      <div class="ds-text">这一世，你给往世簿添了 {{ j.points }} 分家底。往世簿记下：{{ j.name }}，{{ kindName }}。</div>
    </div>

    <button class="btn primary" @click="store.nextLife()">落笔往世簿，去往下一世</button>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { store } from '../main.js';

const j = computed(() => store.meta.pastLives[store.meta.pastLives.length - 1]);
const kindName = computed(() => ({ shouzhong: '寿终正寝', hengsi: '横死', qiuren: '求仁得仁', daocheng: '道成' }[j.value?.kind] || '收束'));
const lastWords = computed(() => {
  const g = store.game;
  if (!g) return '';
  const deaths = g.journal.filter(m => m.kind === 'death');
  return deaths.length ? deaths[deaths.length - 1].text : '';
});
</script>
