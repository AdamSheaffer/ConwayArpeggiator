import * as Tone from 'tone'
import type { Cell } from './useBoard'
import { computed, ref } from 'vue'
import { useIntervalFn } from '@vueuse/core'
import { useArpeggiatorSettings, type ChordDef, type ChordQuality } from './useArpeggiatorSettings'
import useBoard from './useBoard'

const { settings } = useArpeggiatorSettings()
const { liveCells } = useBoard()

export function useArpeggiator() {
  return {
    start,
    stop,
    activeCell,
    isPlaying,
    measure,
    activeChord,
    arpeggioNotes,
  }
}

const arpeggioSynth = new Tone.PolySynth().toDestination()
let chordOscillators: ChordOscillatorChain[] = []

const activeCell = ref<Cell | undefined>()
const measure = ref(1)
const isPlaying = ref(false)

const eighthNoteCount = ref(1)
const eighthNotesPerMeasure = computed(() => settings.value.timeSignature * 2)

const activeChord = computed(() => {
  const progressionIndex = measure.value - 1
  return settings.value.progression[progressionIndex]
})

const chordNotes = computed(() => {
  return activeChord.value ? getChordValues(activeChord.value.chord, activeChord.value.quality) : []
})
const arpeggioNotes = computed(() => {
  if (!activeChord.value) return []

  return getArpeggioValues(
    activeChord.value.chord,
    activeChord.value.quality,
    settings.value.octaveRange,
  )
})
const activeArpeggioNote = computed(() => {
  const index = (activeCell.value?.col ?? 0) % arpeggioNotes.value.length
  return arpeggioNotes.value[index]
})
const arpeggiatorEightNoteInterval = computed(() => {
  const quarterNote = (60 / settings.value.bpm) * 1000
  return quarterNote / 2
})

function startChordOscillators() {
  chordOscillators = chordNotes.value.map((note, index) => {
    const isRoot = index === 0
    const vol = new Tone.Volume(isRoot ? -20 : -25).toDestination()
    const osc = new Tone.Oscillator({ type: 'sawtooth5', frequency: note })
    osc.chain(vol)
    osc.start()
    return { osc, vol }
  })
}

function stopChordOscillators() {
  chordOscillators.forEach(({ osc, vol }) => {
    osc.stop()
    osc.dispose()
    vol.dispose()
  })
  chordOscillators = []
}

const { pause: stopArpeggiator, resume: startArpeggiator } = useIntervalFn(
  () => {
    activeCell.value = findNextActiveCell()
    setEighthNoteCountAndChord()
    playActiveCell()
  },
  arpeggiatorEightNoteInterval,
  { immediate: false },
)

async function start() {
  stop()

  await Tone.start()

  startChordOscillators()
  startArpeggiator()

  isPlaying.value = true
}

function stop() {
  stopChordOscillators()
  stopArpeggiator()

  activeCell.value = liveCells.value[0]
  isPlaying.value = false
}

function findNextActiveCell() {
  const current = activeCell.value

  if (!current) {
    return liveCells.value[0]
  }

  const next = liveCells.value.find(({ row, col }) => {
    if (row === current.row) return col > current.col

    return row > current.row
  })

  return next ?? liveCells.value[0]
}

function playActiveCell() {
  if (activeArpeggioNote.value) {
    arpeggioSynth?.triggerAttackRelease(activeArpeggioNote.value!, 0.2)
  }
}

function getChordValues(chordKey: string, quality: ChordQuality, octave = 2) {
  const options = chords[chordKey]
  if (!options) {
    console.error(`${chordKey} is not a valid chord`)
    return []
  }

  return options[quality].map((note) => note + octave)
}

function getArpeggioValues(chordKey: string, quality: ChordQuality, octaveRange: number) {
  const options = chords[chordKey]
  if (!options) {
    console.error(`${chordKey} is not a valid chord`)
    return []
  }

  const bottomOctave = 2
  const arpeggioValues: string[] = []
  for (let octave = bottomOctave; octave < bottomOctave + octaveRange; octave++) {
    const notes = options[quality].map((note) => note + octave)
    arpeggioValues.push(...notes)
  }
  return arpeggioValues
}

function setEighthNoteCountAndChord() {
  eighthNoteCount.value =
    eighthNoteCount.value === eighthNotesPerMeasure.value ? 1 : eighthNoteCount.value + 1

  const shouldMoveToNextChord = eighthNoteCount.value === 1

  if (shouldMoveToNextChord) {
    measure.value = measure.value >= settings.value.progression.length ? 1 : measure.value + 1
    stopChordOscillators()
    startChordOscillators()
  }
}

export const keyOptions = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#']
export const variationOptions: { label: string; value: ChordQuality }[] = [
  { label: 'Major', value: 'major' },
  { label: 'Major 7', value: 'major7' },
  { label: 'Dominant 7', value: 'dominant7' },
  { label: 'Minor', value: 'minor' },
  { label: 'Minor 7', value: 'minor7' },
]

const chords: Record<string, ChordDef> = {
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

interface ChordOscillatorChain {
  osc: Tone.Oscillator
  vol: Tone.Volume
  // I'll maybe add more options here
}
