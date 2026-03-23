import * as Tone from 'tone'
import type { Cell } from './useBoard'
import { computed, ref } from 'vue'
import { useIntervalFn } from '@vueuse/core'
import { chords, useArpeggiatorSettings, type ChordQuality } from './useArpeggiatorSettings'
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

interface ChordOscillatorChain {
  osc: Tone.Oscillator
  vol: Tone.Volume
  // I'll maybe add more options here
}
