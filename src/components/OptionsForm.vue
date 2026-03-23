<template>
  <div class="bg-zinc-950 flex justify-center p-8 font-mono">
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

const { settings } = useArpeggiatorSettings()
const { measure } = useArpeggiator()

function addChordToProgression(chord: Chord) {
  const newProgression = [...settings.value.progression, chord]
  settings.value = { ...settings.value, progression: newProgression }
}
</script>

<style scoped></style>
