import { computed, ref, shallowRef } from 'vue'
import { useIntervalFn } from '@vueuse/core'

const board = shallowRef<Cell[][]>([])
const speed = ref(500)

function init(rowCount: number, colCount: number, stateThreshold = 0.2) {
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

function nextState(currentlyAlive: boolean, liveNeighbors: number) {
  if (currentlyAlive && liveNeighbors < 2) return false // under-population
  if (currentlyAlive && (liveNeighbors === 2 || liveNeighbors === 3)) return true // survival
  if (currentlyAlive && liveNeighbors > 3) return false // over-population
  if (!currentlyAlive && liveNeighbors === 3) return true // reproduction
  return false
}

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

const {
  pause: stop,
  resume: start,
  isActive: isPlaying,
} = useIntervalFn(tick, speed, { immediate: false })

function toggleCell(cell: Cell) {
  const updatedBoard = [...board.value]
  const currentCell = updatedBoard[cell.row]?.[cell.col]

  if (currentCell) {
    const updatedCell: Cell = { ...currentCell, state: !currentCell.state }
    updatedBoard[cell.row]![cell.col] = updatedCell
    board.value = updatedBoard
  }
}

const liveCells = computed(() => board.value.flat().filter((c) => c.state))

export default function useBoard() {
  return {
    board: computed(() => board.value),
    init,
    isPlaying,
    liveCells,
    speed,
    start,
    stop,
    toggleCell,
  }
}

export interface Cell {
  state: boolean
  row: number
  col: number
}
