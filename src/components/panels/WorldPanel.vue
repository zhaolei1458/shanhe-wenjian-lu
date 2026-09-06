<template>
  <div class="panel-overlay" v-if="open" @click.self="$emit('close')">
    <div class="panel book-scroll">
      <div class="panel-head">
        <h2>天地</h2>
        <button class="mini-btn" @click="$emit('close')">收</button>
      </div>
      <div class="panel-body" v-if="where">
        <div class="panel-sec">
          <div class="panel-sec-title">眼下</div>
          <div class="panel-row"><span>所在</span><b>{{ where }}</b></div>
          <div class="panel-row"><span>天时</span><b>大衍承平{{ year }}年 · {{ seasonAndWeather }}</b></div>
        </div>
        <div class="panel-sec" v-if="near.length">
          <div class="panel-sec-title">出得此地</div>
          <div class="panel-row panel-item"><span>{{ near.join('、') }}</span></div>
        </div>
        <div class="panel-sec" v-if="far.length">
          <div class="panel-sec-title">跨城行路</div>
          <div class="panel-row panel-item"><span>{{ far.join('、') }}</span></div>
        </div>
        <p class="panel-hint">（2.0 天地册：地图页签与天下大势，第四层填入。）</p>
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

const game = computed(() => store.game);
const life = computed(() => (game.value && game.value.state && game.value.state.life) || {});
const where = computed(() => {
  try { return game.value.currentScene ? `${game.value.currentScene().city.name} · ${game.value.currentScene().node.name}` : ''; }
  catch { return ''; }
});
const year = computed(() => (game.value && game.value.state && game.value.state.world ? 30 + game.value.state.world.year : ''));
const seasonAndWeather = computed(() => {
  const l = life.value;
  return l.weather ? `${l.season === 0 ? '春' : l.season === 1 ? '夏' : l.season === 2 ? '秋' : '冬'} · ${l.weather}` : '';
});
const routes = computed(() => {
  try { return game.value.routesOfHere ? game.value.routesOfHere() : { near: [], far: [] }; }
  catch { return { near: [], far: [] }; }
});
const near = computed(() => routes.value.near || []);
const far = computed(() => (routes.value.far || []).map(f => String(f).replace(/（.*/, '')));
</script>
