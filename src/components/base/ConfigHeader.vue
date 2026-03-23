<template>
  <div class="mb-8">
    <p class="text-xs tracking-[.3rem] text-zinc-500 uppercase mb-1">{{ header }}</p>
    <h1 class="text-2xl font-bold tracking-tight text-zinc-100 uppercase">{{ subheader }}</h1>
    <div class="mt-3 h-px bg-linear-to-r from-purple-400 via-purple-400 to-transparent"></div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ header: string; subheader: string }>()
</script>
