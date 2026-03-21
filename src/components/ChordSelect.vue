<template>
  <div>
    <label class="block text-xs tracking-widest text-zinc-400 uppercase mb-4">Progression</label>

    <div class="flex space-x-4">
      <div class="space-y-2">
        <div class="relative">
          <select
            v-model="chord"
            class="w-full bg-zinc-800 border border-zinc-700 text-zinc-100 text-sm px-3 py-2.5 appearance-none rounded-none cursor-pointer focus:outline-none focus:border-purple-500 focus:ring-0 hover:border-zinc-600 transition-colors"
          >
            <option v-for="key in keyOptions" :key="key" :value="key">{{ key }}</option>
          </select>
        </div>
      </div>

      <div class="space-y-2">
        <div class="relative">
          <select
            v-model="quality"
            class="w-full bg-zinc-800 border border-zinc-700 text-zinc-100 text-sm px-3 py-2.5 appearance-none rounded-none cursor-pointer focus:outline-none focus:border-purple-500 focus:ring-0 hover:border-zinc-600 transition-colors"
          >
            <option v-for="opt in chordQualityOptions" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </option>
          </select>
        </div>
      </div>
      <button
        @click="onAdd()"
        class="bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-purple-500 hover:border-zinc-600 transition-colors px-3 py-2.5 rounded-none focus:outline-none focus:border-purple-500 cursor-pointer text-lg leading-none"
      >
        +
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type Chord, type ChordQuality } from '@/composables/useArpeggiatorSettings'
import { keyOptions, chordQualityOptions } from '@/composables/useArpeggiatorSettings'

const chord = defineModel<string>('chord', { required: true })
const quality = defineModel<ChordQuality>('quality', { required: true })
const emit = defineEmits<{ add: [chord: Chord] }>()

function onAdd() {
  emit('add', {
    chord: chord.value,
    quality: quality.value,
  })
}
</script>
