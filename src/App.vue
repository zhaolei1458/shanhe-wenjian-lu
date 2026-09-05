<template>
  <div class="app">
    <TitleScreen v-if="store.screen === 'title'" />
    <RebirthScreen v-else-if="store.screen === 'rebirth'" />
    <WorldScreen v-else-if="store.screen === 'world'" />
    <DeathScreen v-else-if="store.screen === 'dead'" />
    <PastScreen v-else-if="store.screen === 'past'" />
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { store } from './main.js';
import TitleScreen from './components/TitleScreen.vue';
import RebirthScreen from './components/RebirthScreen.vue';
import WorldScreen from './components/WorldScreen.vue';
import DeathScreen from './components/DeathScreen.vue';
import PastScreen from './components/PastScreen.vue';

onMounted(() => { store.boot(); });
</script>
