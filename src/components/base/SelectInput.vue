<template>
  <select
    v-model="model"
    class="bg-zinc-800 border border-zinc-700 text-zinc-100 focus:border-primary focus:ring-0 hover:border-zinc-600 transition-colors"
  >
    <option v-for="(option, i) in options" :key="i" :value="option.value">
      {{ option.label }}
    </option>
  </select>
</template>

<script setup lang="ts" generic="T">
const model = defineModel<T>()

defineProps<{ options: { label: string; value: T }[] }>()
</script>
