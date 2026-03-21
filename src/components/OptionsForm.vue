<template>
  <div class="min-h-screen bg-zinc-950 flex items-center justify-center p-8 font-mono">
    <div class="w-full">
      <div class="mb-8">
        <p class="text-xs tracking-[0.3em] text-zinc-500 uppercase mb-1">Sequencer Config</p>
        <h1 class="text-2xl font-bold tracking-tight text-zinc-100 uppercase">Arpeggiator</h1>
        <div class="mt-3 h-px bg-linear-to-r from-purple-500 via-purple-400 to-transparent"></div>
      </div>

      <div class="bg-zinc-900 border border-zinc-800 rounded-sm p-6 space-y-7 shadow-2xl">
        <!-- BPM -->
        <div class="space-y-2">
          <div class="flex items-baseline justify-between">
            <label class="text-xs tracking-widest text-zinc-400 uppercase">BPM</label>
            <span class="text-2xl font-bold text-purple-400 leading-none">
              {{ settings.bpm }}
            </span>
          </div>
          <div class="relative pt-1">
            <input
              type="range"
              min="60"
              max="200"
              v-model.number="settings.bpm"
              class="w-full h-1 bg-zinc-700 rounded-none appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-purple-400 [&::-webkit-slider-thumb]:rounded-none [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-0 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-purple-400 [&::-moz-range-thumb]:rounded-none [&::-moz-range-thumb]:border-0"
            />
            <div class="flex justify-between mt-1.5">
              <span class="text-[10px] text-zinc-600">60</span>
              <span class="text-[10px] text-zinc-600">200</span>
            </div>
          </div>
        </div>

        <div class="h-px bg-zinc-800"></div>

        <ChordSelect
          v-model:chord="settings.chord"
          v-model:quality="settings.chordQuality"
          @add="addChordToProgression"
        />

        <ChordProgression v-model="settings.progression" :measure="measure" />

        <div class="h-px bg-zinc-800"></div>

        <!-- Octave Range -->
        <div class="space-y-2">
          <div class="flex items-baseline justify-between">
            <label class="text-xs tracking-widest text-zinc-400 uppercase">Octave Range</label>
            <span class="text-2xl font-bold text-purple-400 tabular-nums leading-none">
              {{ settings.octaveRange }}
            </span>
          </div>
          <div class="pt-1">
            <!-- Pip track -->
            <div class="relative">
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                v-model.number="settings.octaveRange"
                class="w-full h-1 bg-zinc-700 rounded-none appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-purple-400 [&::-webkit-slider-thumb]:rounded-none [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-0 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-purple-400 [&::-moz-range-thumb]:rounded-none [&::-moz-range-thumb]:border-0"
              />
            </div>
            <div class="flex justify-between mt-1.5 px-0">
              <span
                v-for="n in 5"
                :key="n"
                class="text-[10px] tabular-nums transition-colors"
                :class="n <= settings.octaveRange ? 'text-purple-500' : 'text-zinc-600'"
              >
                {{ n }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useArpeggiatorSettings, type Chord } from '@/composables/useArpeggiatorSettings'
import ChordSelect from './ChordSelect.vue'
import ChordProgression from './ChordProgression.vue'
import { useArpeggiator } from '@/composables/useArpeggiator'

const { settings } = useArpeggiatorSettings()
const { measure } = useArpeggiator()

function addChordToProgression(chord: Chord) {
  const newProgression = [...settings.value.progression, chord]
  settings.value = { ...settings.value, progression: newProgression }
}
</script>

<style scoped></style>
