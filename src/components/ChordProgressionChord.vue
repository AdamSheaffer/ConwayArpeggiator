<template>
  <div
    @mouseenter="showDeleteButton = true"
    @mouseleave="showDeleteButton = false"
    class="relative w-14 h-14 border-2 border-cyan-300 flex justify-center items-center transition-colors duration-300"
    :class="{ 'bg-cyan-300 text-zinc-950': active, 'text-cyan-300': !active }"
  >
    <div>
      <span>{{ chord.chord }}</span>
      <sup>{{ superScriptText }}</sup>
    </div>

    <button
      v-if="showDeleteButton"
      @click="emit('remove')"
      class="absolute -top-1/4 -right-1/4 w-6 h-6 rounded-full bg-amber-200 text-zinc-950 flex justify-center items-center text-xs cursor-pointer"
    >
      X
    </button>
  </div>
</template>

<script setup lang="ts">
import type { Chord } from '@/composables/useArpeggiatorSettings'
import { computed, ref } from 'vue'

const props = defineProps<{
  chord: Chord
  active: boolean
}>()

const emit = defineEmits<{ remove: [] }>()

const showDeleteButton = ref(false)

const superScriptText = computed(() => {
  switch (props.chord.quality) {
    case 'major7':
      return 'maj7'
    case 'dominant7':
      return '7'
    case 'minor':
      return 'min'
    case 'minor7':
      return 'min7'
    default:
      return ''
  }
})
</script>

<style scoped></style>
