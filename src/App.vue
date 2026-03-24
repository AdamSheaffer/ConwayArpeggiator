<template>
  <main class="h-screen w-screen overflow-hidden flex">
    <div class="flex-1">
      <div
        class="flex flex-col items-center min-h-screen bg-linear-to-br from-slate-950 via-purple-950 to-slate-950 p-4"
      >
        <div class="flex-1 flex items-center">
          <TheBoard />
        </div>
        <h1
          class="self-start uppercase tracking-tighter font-mono text-primary text-shadow-2xs text-shadow-cyan-500 text-xs"
        >
          Conway Arpeggiator
        </h1>
      </div>
    </div>
    <SettingsMenu />
  </main>
</template>

<script setup lang="ts">
import SettingsMenu from './components/SettingsMenu.vue'
import TheBoard from './components/TheBoard.vue'
</script>
