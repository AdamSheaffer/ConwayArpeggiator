<template>
  <div class="bg-zinc-950 flex flex-col items-center p-8 font-mono overflow-auto gap-10">
    <div class="w-full">
      <ConfigHeader header="Sequencer Config" subheader="Arpeggiator" />

      <div class="bg-zinc-900 border border-zinc-800 rounded-sm p-6 space-y-7 shadow-2xl">
        <RangeInput v-model="settings.bpm" :min="60" :max="200" label="BPM" />

        <AppDivider />

        <ChordSelect
          v-model:chord="settings.chord"
          v-model:quality="settings.chordQuality"
          @add="addChordToProgression"
        />

        <ChordProgression v-model="settings.progression" :measure="measure" />

        <AppDivider />

        <RangeInput v-model="settings.octaveRange" :min="1" :max="5" label="Octave Range" />
      </div>
    </div>

    <div class="w-full">
      <ConfigHeader header="Conway Config" subheader="Generation" />

      <div class="bg-zinc-900 border border-zinc-800 rounded-sm p-6 space-y-7 shadow-2xl"></div>
    </div>

    <div class="flex gap-4 w-full">
      <AppButton @click="toggleGameOfLife()" :outline="!isGenerating" class="flex-1 text-xs">
        <FaIcon :icon="conwayButtonIcon" />
        Generation
      </AppButton>
      <AppButton @click="toggleArpeggiator()" :outline="!isPlaying" class="flex-1 text-xs">
        <FaIcon :icon="arpeggiatorButtonIcon" />
        Arpeggiator
      </AppButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useArpeggiatorSettings, type Chord } from '@/composables/useArpeggiatorSettings'
import ChordSelect from './ChordSelect.vue'
import ChordProgression from './ChordProgression.vue'
import { useArpeggiator } from '@/composables/useArpeggiator'
import RangeInput from './base/RangeInput.vue'
import AppDivider from './base/AppDivider.vue'
import ConfigHeader from './base/ConfigHeader.vue'
import AppButton from './base/AppButton.vue'
import { computed } from 'vue'
import { faPause, faPlay } from '@fortawesome/free-solid-svg-icons'
import useBoard from '@/composables/useBoard'

const { settings } = useArpeggiatorSettings()
const { measure } = useArpeggiator()
const { isPlaying: isGenerating, start: startGeneration, stop: stopGeneration } = useBoard()

function addChordToProgression(chord: Chord) {
  const newProgression = [...settings.value.progression, chord]
  settings.value = { ...settings.value, progression: newProgression }
}

const { start: startArpeggiator, stop: stopArpeggiator, isPlaying } = useArpeggiator()

function toggleArpeggiator() {
  if (isPlaying.value) {
    stopArpeggiator()
  } else {
    startArpeggiator()
  }
}

function toggleGameOfLife() {
  if (isGenerating.value) {
    stopGeneration()
  } else {
    startGeneration()
  }
}

const arpeggiatorButtonIcon = computed(() => (isPlaying.value ? faPause.iconName : faPlay.iconName))
const conwayButtonIcon = computed(() => (isGenerating.value ? faPause.iconName : faPlay.iconName))
</script>

<style scoped></style>
