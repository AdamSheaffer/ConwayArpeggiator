<template>
  <div class="space-y-2">
    <div class="flex items-baseline justify-between">
      <FormLabel>{{ label }}</FormLabel>
      <span class="text-2xl font-bold text-primary leading-none">
        {{ model }}
      </span>
    </div>
    <div class="relative pt-1">
      <input
        type="range"
        :min="min"
        :max="max"
        :step="step"
        v-model.number="model"
        class="w-full h-1 accent-primary rounded-none cursor-pointer"
      />
      <div class="flex justify-between mt-1.5">
        <span class="text-xs text-zinc-400">{{ min }}</span>
        <span class="text-xs text-zinc-400">{{ max }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import FormLabel from './FormLabel.vue'

const model = defineModel<number>()

defineProps<{
  min: number
  max: number
  label: string
  step?: number
}>()
</script>
