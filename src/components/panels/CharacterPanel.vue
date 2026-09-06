<template>
  <div class="panel-overlay" v-if="open" @click.self="$emit('close')">
    <div class="panel book-scroll">
      <div class="panel-head">
        <h2>人物</h2>
        <button class="mini-btn" @click="$emit('close')">收</button>
      </div>
      <div class="panel-body" v-if="life && life.name !== undefined">
        <div class="panel-sec">
          <div class="panel-sec-title">其人</div>
          <div class="panel-row"><span>名姓</span><b>{{ life.name }}{{ life.alias ? `（化名"${life.alias}"）` : '' }}</b></div>
          <div class="panel-row"><span>年岁</span><b>{{ life.age }} 岁</b></div>
          <div class="panel-row"><span>境届</span><b>{{ realmWord }}</b></div>
          <div class="panel-row"><span>寿元</span><b>{{ life.lifespanMax ? `约 ${life.lifespanMax} 岁` : '未卜' }}</b></div>
        </div>
        <div class="panel-sec">
          <div class="panel-sec-title">家底</div>
          <div class="panel-row"><span>气血</span><b>{{ life.hp }} / {{ life.maxHp }}</b></div>
          <div class="panel-row"><span>修为</span><b>{{ life.xiwei }}</b></div>
          <div class="panel-row"><span>盘缠</span><b>{{ life.money }} 贯</b></div>
        </div>
        <p class="panel-hint">（2.0 成长核：五维根骨/悟性，第二层填入。）</p>
      </div>
      <div class="panel-body" v-else>
        <p class="panel-empty">尚未落入此世。</p>
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
const realmWord = computed(() => {
  try {
    const eye = store.game && store.game.eyeNow ? store.game.eyeNow() : null;
    return (eye && eye.realmWord) || '未入修行';
  } catch { return '未入修行'; }
});
</script>
