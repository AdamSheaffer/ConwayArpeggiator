<template>
  <main class="h-screen w-screen overflow-hidden flex">
    <div class="flex-1">
      <TheBoard />
    </div>
    <OptionsForm />
  </main>
</template>

<script setup lang="ts">
import OptionsForm from './components/OptionsForm.vue'
import TheBoard from './components/TheBoard.vue'
</script>
