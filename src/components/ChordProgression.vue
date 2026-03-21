<template>
  <div class="flex space-x-2 space-y-2 flex-wrap">
    <ChordProgressionChord
      v-for="(sequence, i) in progression"
      :key="i"
      :active="measure === i + 1"
      :chord="sequence"
      @remove="removeChord(i)"
    />
  </div>
</template>

<script setup lang="ts">
import { type Chord } from '@/composables/useArpeggiatorSettings'
import ChordProgressionChord from './ChordProgressionChord.vue'

const progression = defineModel<Chord[]>({ required: true })
defineProps<{ measure: number }>()

function removeChord(index: number) {
  const newProgression = [...progression.value]
  newProgression.splice(index, 1)
  progression.value = newProgression
}
</script>

<style scoped></style>
