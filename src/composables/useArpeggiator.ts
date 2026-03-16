import * as Tone from 'tone'
import type { Cell } from './useBoard'
import { computed, ref, watch, type Ref } from 'vue'
import { useIntervalFn } from '@vueuse/core'

export function useArpeggiator(liveCells: Ref<Cell[]>) {
  let arpeggioSynth: Tone.PolySynth
  let chordOscillators: ChordOscillatorChain[] = []

  const key = ref<string>('C')
  const keyVariation = ref<ChordVariation>('major7')
  const octaveRange = ref(2)
  const bpmTempo = ref(180)
  const activeCell = ref<Cell | undefined>()
  const isPlaying = ref(false)

  const chordNotes = computed(() => getChordValues(key.value, keyVariation.value))
  const arpeggioNotes = computed(() =>
    getArpeggioValues(key.value, keyVariation.value, octaveRange.value),
  )
  const activeArpeggioNote = computed(() => {
    const index = (activeCell.value?.col ?? 0) % arpeggioNotes.value.length
    return arpeggioNotes.value[index]
  })
  const arpeggiatorEightNoteInterval = computed(() => {
    const quarterNote = (60 / bpmTempo.value) * 1000
    return quarterNote / 2
  })

  function startChordOscillators() {
    arpeggioSynth = new Tone.PolySynth().toDestination()

    const vol = new Tone.Volume(-30).toDestination()

    chordOscillators = chordNotes.value.map((note) => {
      const osc = new Tone.Oscillator({ type: 'sawtooth', frequency: note })
      osc.chain(vol)
      osc.start()
      return { osc }
    })
  }

  function stopChordOscillators() {
    chordOscillators.forEach(({ osc }) => osc.stop())
  }

  const { pause: stopArpeggiator, resume: startArpeggiator } = useIntervalFn(
    () => {
      activeCell.value = findNextActiveCell()
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

  watch([key, keyVariation], () => {
    stopChordOscillators()
    startChordOscillators()
  })

  function playActiveCell() {
    if (activeArpeggioNote.value) {
      arpeggioSynth?.triggerAttackRelease(activeArpeggioNote.value!, 0.2)
    }
  }

  return { start, stop, activeCell, isPlaying, key, keyVariation, bpmTempo }
}

function getChordValues(chordKey: string, variation: keyof ChordDef, octave = 2) {
  const options = chords[chordKey]
  if (!options) {
    console.error(`${chordKey} is not a valid chord`)
    return []
  }

  return options[variation].map((note) => note + octave)
}

function getArpeggioValues(chordKey: string, variation: keyof ChordDef, octaveRange = 3) {
  const options = chords[chordKey]
  if (!options) {
    console.error(`${chordKey} is not a valid chord`)
    return []
  }

  const bottomOctave = 2
  const arpeggioValues: string[] = []
  for (let octave = bottomOctave; octave < bottomOctave + octaveRange; octave++) {
    const notes = options[variation].map((note) => note + octave)
    arpeggioValues.push(...notes)
  }
  return arpeggioValues
}

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

interface ChordDef {
  major: string[]
  minor: string[]
  major7: string[]
  dominant7: string[]
  minor7: string[]
}

type ChordVariation = keyof ChordDef

interface ChordOscillatorChain {
  osc: Tone.Oscillator
}
