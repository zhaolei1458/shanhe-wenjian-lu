<template>
  <div class="screen title-screen">
    <div class="title-seal">山河问剑录</div>
    <div class="title-sub">一本会记住你的文字江湖</div>
    <p class="title-motto">
      每局随机投生一人，用这一世活完他的一生——<br/>
      或得道飞升、跳出轮回；或身死道消、化作后人的一桩谈资；<br/>
      然后带着一缕往世印记，重入下一世的山水。
    </p>

    <div class="title-actions">
      <button class="btn primary" @click="store.goRebirth()">投生 · 新的一世</button>
      <button v-if="autoSave" class="btn" @click="store.loadFromSlot('auto')">续前缘 · {{ autoSave.name }}</button>
      <button class="btn" @click="store.screen = 'past'">往世簿</button>
    </div>

    <div class="legacy-line">
      家底厚薄：{{ store.meta.legacyPoints > 12 ? '颇厚' : store.meta.legacyPoints > 5 ? '有些积攒' : store.meta.legacyPoints > 0 ? '薄' : '白手起家' }}
      <template v-if="store.meta.pastLives.length">｜历世 {{ store.meta.pastLives.length }} 世</template>
    </div>

    <!-- 二十期：档管折叠区（导出/导入，docs/设计-存档导出导入.md） -->
    <div class="port-zone">
      <button class="mini-btn ghost" @click="portOpen = !portOpen; importMsg = ''">{{ portOpen ? '收起档管' : '档管 · 备份与还档' }}</button>
      <div v-if="portOpen" class="port-panel">
        <button class="mini-btn" @click="doExport">导出整卷</button>
        <label class="mini-btn import-label">导入存档<input type="file" accept=".json,application/json" @change="onPickFile" /></label>
        <div v-if="pendingImport" class="port-preview">
          <p>认出一份存档：历世 {{ pendingImport.summary.lives }} 世 · 家底 {{ pendingImport.summary.legacyPoints }} · 档位 {{ pendingImport.summary.slots }} 个（{{ pendingImport.summary.names.join('、') || '无' }}）</p>
          <p class="port-warn">还档会整卷替换现有进度——当前进度自动备份到「导入前的旧进度」档。</p>
          <button class="mini-btn danger" @click="doImport">还档</button>
          <button class="mini-btn ghost" @click="pendingImport = null">算了</button>
        </div>
        <p v-if="importMsg" class="port-msg">{{ importMsg }}</p>
      </div>
    </div>

    <button class="mini-btn ghost title-sound" @click="toggleSound">声 · {{ soundOn ? '开' : '关' }}</button>

    <div class="title-footer">纯文字 · 单机 · 向死而生</div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue';
import { store } from '../main.js';
import { buildExportDoc, exportToFile, parseImportText, importAll } from '../save/port.js';
import { audio } from '../audio.js';

const autoSave = computed(() => store.saveSlots.find(s => s.slot === 'auto'));
const portOpen = ref(false);
const pendingImport = ref(null);
const importMsg = ref('');
const soundOn = ref(!audio.muted);

async function doExport() {
  const saves = await import('../save/db.js').then(m => m.Save.listSaves());
  const doc = buildExportDoc(store.meta, saves);
  exportToFile(doc);
  importMsg.value = '整卷已导出——带走的：往世簿与全部档位。';
}

function onPickFile(ev) {
  const f = ev.target.files && ev.target.files[0];
  ev.target.value = ''; // 同名文件二次选择也能触发
  if (!f) return;
  const reader = new FileReader();
  reader.onload = () => {
    const v = parseImportText(String(reader.result));
    if (!v.ok) { pendingImport.value = null; importMsg.value = v.error; return; }
    importMsg.value = '';
    pendingImport.value = v;
  };
  reader.readAsText(f, 'utf-8');
}

async function doImport() {
  if (!pendingImport.value) return;
  const doc = pendingImport.value.rawDoc;
  const { Save } = await import('../save/db.js');
  const saveLike = {
    saveGame: (slot, state, name) => Save.saveGame(slot, state, name),
    saveMeta: (meta) => Save.saveMeta(meta),
    currentMeta: () => Promise.resolve(store.meta && store.meta.pastLives !== undefined ? store.meta : null),
  };
  const r = await importAll(saveLike, doc);
  if (!r.ok) { importMsg.value = r.error; pendingImport.value = null; return; }
  store.meta = doc.meta;
  await store.refreshSaves();
  pendingImport.value = null;
  importMsg.value = `还档毕——带回 ${r.summary.lives} 世、${r.summary.slots} 个档位。旧进度在「导入前的旧进度」档里。`;
}

function toggleSound() {
  audio.setMuted(soundOn.value);
  soundOn.value = !soundOn.value;
}

onMounted(() => { soundOn.value = !audio.muted; });
</script>
