import { watchDebounced } from '@vueuse/core'
import { ref, type WatchHandle } from 'vue'

export const keyOptions = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#']

export const chordQualityOptions: { label: string; value: ChordQuality }[] = [
  { label: 'Major', value: 'major' },
  { label: 'Major 7', value: 'major7' },
  { label: '7', value: 'dominant7' },
  { label: 'Minor', value: 'minor' },
  { label: 'Minor 7', value: 'minor7' },
]

export const chords: Record<string, ChordDef> = {
  A: {
    major: ['A', 'C#', 'E'],
    minor: ['A', 'C', 'E'],
    major7: ['A', 'C#', 'E', 'G#'],
    dominant7: ['A', 'C#', 'E', 'G'],
    minor7: ['A', 'C', 'E', 'G'],
  },
  'A#': {
    major: ['A#', 'D', 'F'],
    minor: ['A#', 'C#', 'F'],
    major7: ['A#', 'D', 'F', 'A'],
    dominant7: ['A#', 'D', 'F', 'G#'],
    minor7: ['A#', 'C#', 'F', 'G#'],
  },
  B: {
    major: ['B', 'D#', 'F#'],
    minor: ['B', 'D', 'F#'],
    major7: ['B', 'D#', 'F#', 'A#'],
    dominant7: ['B', 'D#', 'F#', 'A'],
    minor7: ['B', 'D', 'F#', 'A'],
  },
  C: {
    major: ['C', 'E', 'G'],
    minor: ['C', 'D#', 'G'],
    major7: ['C', 'E', 'G', 'B'],
    dominant7: ['C', 'E', 'G', 'A#'],
    minor7: ['C', 'D#', 'G', 'A#'],
  },
  'C#': {
    major: ['C#', 'F', 'G#'],
    minor: ['C#', 'E', 'G#'],
    major7: ['C#', 'F', 'G#', 'C'],
    dominant7: ['C#', 'F', 'G#', 'B'],
    minor7: ['C#', 'E', 'G#', 'B'],
  },
  D: {
    major: ['D', 'F#', 'A'],
    minor: ['D', 'F', 'A'],
    major7: ['D', 'F#', 'A', 'C#'],
    dominant7: ['D', 'F#', 'A', 'C'],
    minor7: ['D', 'F', 'A', 'C'],
  },
  'D#': {
    major: ['D#', 'G', 'A#'],
    minor: ['D#', 'F#', 'A#'],
    major7: ['D#', 'G', 'A#', 'D'],
    dominant7: ['D#', 'G', 'A#', 'C#'],
    minor7: ['D#', 'F#', 'A#', 'C#'],
  },
  E: {
    major: ['E', 'G#', 'B'],
    minor: ['E', 'G', 'B'],
    major7: ['E', 'G#', 'B', 'D#'],
    dominant7: ['E', 'G#', 'B', 'D'],
    minor7: ['E', 'G', 'B', 'D'],
  },
  F: {
    major: ['F', 'A', 'C'],
    minor: ['F', 'G#', 'C'],
    major7: ['F', 'A', 'C', 'E'],
    dominant7: ['F', 'A', 'C', 'D#'],
    minor7: ['F', 'G#', 'C', 'D#'],
  },
  'F#': {
    major: ['F#', 'A#', 'C#'],
    minor: ['F#', 'A', 'C#'],
    major7: ['F#', 'A#', 'C#', 'F'],
    dominant7: ['F#', 'A#', 'C#', 'E'],
    minor7: ['F#', 'A', 'C#', 'E'],
  },
  G: {
    major: ['G', 'B', 'D'],
    minor: ['G', 'A#', 'D'],
    major7: ['G', 'B', 'D', 'F#'],
    dominant7: ['G', 'B', 'D', 'F'],
    minor7: ['G', 'A#', 'D', 'F'],
  },
  'G#': {
    major: ['G#', 'C', 'D#'],
    minor: ['G#', 'B', 'D#'],
    major7: ['G#', 'C', 'D#', 'G'],
    dominant7: ['G#', 'C', 'D#', 'F#'],
    minor7: ['G#', 'B', 'D#', 'F#'],
  },
}

const settings = ref<ArpeggiatorSettings>({
  bpm: 120,
  chord: 'C',
  chordQuality: 'major',
  progression: [],
  octaveRange: 3,
  timeSignature: 4,
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
