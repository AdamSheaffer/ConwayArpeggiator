<template>
  <div class="grid grid-cols-4 gap-2">
    <div
      v-for="(sequence, i) in progression"
      :key="i"
      draggable="true"
      @dragstart="dragIndex = i"
      @dragover.prevent="dropIndex = i"
      @dragend="onDragEnd()"
      :class="[
        'transition-opacity duration-150',
        dropIndex === i && dragIndex !== i ? 'opacity-40' : 'opacity-100',
      ]"
    >
      <ChordProgressionChord
        :active="measure === i + 1"
        :chord="sequence"
        @remove="removeChord(i)"
        class="cursor-move"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { type Chord } from '@/composables/useSettings'
import ChordProgressionChord from './ChordProgressionChord.vue'

const progression = defineModel<Chord[]>({ required: true })
defineProps<{ measure: number }>()

const dragIndex = ref<number | null>(null)
const dropIndex = ref<number | null>(null)

function onDragEnd() {
  if (dragIndex.value !== null && dropIndex.value !== null && dragIndex.value !== dropIndex.value) {
    const newProgression = [...progression.value]
    const [moved] = newProgression.splice(dragIndex.value, 1)

    if (moved) {
      newProgression.splice(dropIndex.value, 0, moved)
      progression.value = newProgression
    }
  }

  dragIndex.value = null
  dropIndex.value = null
}

function removeChord(index: number) {
  const newProgression = [...progression.value]
  newProgression.splice(index, 1)
  progression.value = newProgression
}
</script>
