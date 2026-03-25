import { computed, shallowRef, type Ref } from 'vue'
import { useIntervalFn } from '@vueuse/core'
import { useSettings } from '@/composables/useSettings'

export interface Cell {
  state: boolean
  row: number
  col: number
}

export function useBoard(board: Ref<Cell[][]>) {
  const liveCells = computed(() => board.value.flat().filter((c) => c.state))

  function findNeighbors(rowIndex: number, colIndex: number) {
    const above = board.value[rowIndex - 1] //
    const row = board.value[rowIndex]
    const below = board.value[rowIndex + 1]
    const left = colIndex - 1
    const col = colIndex
    const right = colIndex + 1

    return [
      above?.[left],
      above?.[col],
      above?.[right],

      row?.[left],
      // self
      row?.[right],

      below?.[left],
      below?.[col],
      below?.[right],
    ]
  }

  function nextState(currentlyAlive: boolean, liveNeighbors: number) {
    if (currentlyAlive && liveNeighbors < 2) return false // under-population
    if (currentlyAlive && (liveNeighbors === 2 || liveNeighbors === 3)) return true // survival
    if (currentlyAlive && liveNeighbors > 3) return false // over-population
    if (!currentlyAlive && liveNeighbors === 3) return true // reproduction
    return false
  }

  function tick() {
    const nextGeneration: Cell[][] = board.value.map((row, rowIndex) => {
      return row.map((cell, colIndex) => {
        const liveNeighbors = findNeighbors(rowIndex, colIndex).filter((n) => n?.state)
        return {
          ...cell,
          state: nextState(cell.state, liveNeighbors.length),
        }
      })
    })

    board.value = nextGeneration
  }

  function toggleCell(cell: Cell) {
    const updatedBoard = [...board.value]
    const currentCell = updatedBoard[cell.row]?.[cell.col]

    if (currentCell) {
      const updatedCell: Cell = { ...currentCell, state: !currentCell.state }
      updatedBoard[cell.row]![cell.col] = updatedCell
      board.value = updatedBoard
    }
  }

  function init(rowCount: number, colCount: number, stateThreshold: number) {
    const initialState: Cell[][] = []

    for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
      const row: Cell[] = []
      for (let colIndex = 0; colIndex < colCount; colIndex++) {
        row.push({
          state: Math.random() > 1 - stateThreshold,
          row: rowIndex,
          col: colIndex,
        })
      }
      initialState.push(row)
    }
    board.value = initialState
  }

  const {
    pause: stop,
    resume: start,
    isActive: isPlaying,
  } = useIntervalFn(
    () => {
      tick()
    },
    () => settings.value.generationDuration,
    { immediate: false },
  )

  return {
    init,
    isPlaying,
    liveCells,
    start,
    stop,
    toggleCell,
  }
}

const { settings } = useSettings()
const mainBoard = shallowRef<Cell[][]>([])

const { init, isPlaying, liveCells, start, stop, toggleCell } = useBoard(mainBoard)

export function useMainBoard() {
  return {
    board: computed(() => mainBoard.value),
    init,
    isPlaying,
    liveCells,
    start,
    stop,
    toggleCell,
  }
}
