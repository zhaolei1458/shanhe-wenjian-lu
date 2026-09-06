<template>
  <div class="panel-overlay" v-if="open" @click.self="$emit('close')">
    <div class="panel book-scroll">
      <div class="panel-head">
        <h2>行囊</h2>
        <button class="mini-btn" @click="$emit('close')">收</button>
      </div>
      <div class="panel-body" v-if="items.length || gongfa.length">
        <div class="panel-sec" v-if="items.length">
          <div class="panel-sec-title">随身物件</div>
          <div v-for="i in items" :key="i.id || i.name" class="panel-row panel-item">
            <b>【{{ i.name }}】{{ equipped === i.id ? '（正在用）' : '' }}</b><span>{{ i.desc || '' }}</span>
          </div>
        </div>
        <div class="panel-sec" v-if="estate">
          <div class="panel-sec-title">身家</div>
          <div class="panel-row panel-item"><span v-html="estate"></span></div>
        </div>
        <p class="panel-hint">（装备槽：兵刃/护甲/饰品，第二层填入；眼下点「用起来」即可佩戴。）</p>
      </div>
      <div class="panel-body" v-else>
        <p class="panel-empty">家当少得可怜——穷有穷的轻省。</p>
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
const items = computed(() => life.value.items || []);
const equipped = computed(() => life.value.equipped);
const gongfa = computed(() => life.value.gongfa || []);
const estate = computed(() => {
  const l = life.value;
  const out = [];
  if (l.home) out.push(`居所·${l.home.kind === 'buy' ? '自宅' : '赁居'}于${l.home.place}`);
  if (l.business) out.push('产业·' + (l.business.name || l.business.kind || '铺面'));
  if (l.mount) out.push(`坐骑·${l.mount.name}`);
  return out.join('　');
});
</script>
