import { watchDebounced } from '@vueuse/core'
import { ref, watchEffect, type WatchHandle } from 'vue'

export const keyOptions = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#']
export const chordQualityOptions: { label: string; value: ChordQuality }[] = [
  { label: 'Major', value: 'major' },
  { label: 'Major 7', value: 'major7' },
  { label: '7', value: 'dominant7' },
  { label: 'Minor', value: 'minor' },
  { label: 'Minor 7', value: 'minor7' },
]

const settings = ref<ArpeggiatorSettings>({
  bpm: 120,
  chord: 'C',
  chordQuality: 'major',
  progression: [],
  octaveRange: 3,
  timeSignature: 3,
})

let settingsWatchHandler: WatchHandle | null = null

export function useArpeggiatorSettings() {
  settingsWatchHandler?.stop()

  const savedJsonSettings = localStorage.getItem('settings')
  const savedSettings = savedJsonSettings
    ? (JSON.parse(savedJsonSettings) as ArpeggiatorSettings)
    : null

  if (savedSettings) {
    settings.value = {
      ...settings.value,
      ...savedSettings,
    }
  }

  settingsWatchHandler = watchDebounced(
    settings,
    (settings) => {
      localStorage.setItem('settings', JSON.stringify(settings))
    },
    { debounce: 200, deep: true },
  )

  return { settings }
}

export interface ArpeggiatorSettings {
  bpm: number
  chord: string
  chordQuality: ChordQuality
  progression: Chord[]
  octaveRange: number
  timeSignature: number
}

export interface Chord {
  chord: string
  quality: ChordQuality
}

export interface ChordDef {
  major: string[]
  minor: string[]
  major7: string[]
  dominant7: string[]
  minor7: string[]
}

export type ChordQuality = keyof ChordDef
