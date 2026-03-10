import { computed, shallowRef } from 'vue'

const board = shallowRef<Cell[][]>([])
let intervalId: number | null = null

function init(rowCount: number, colCount: number, stateThreshold = 0.2) {
  const initialState: Cell[][] = []

  for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
    const row: Cell[] = []
    for (let colIndex = 0; colIndex < colCount; colIndex++) {
      row.push({ state: Math.random() > 1 - stateThreshold })
    }
    initialState.push(row)
  }
  board.value = initialState
}

function tick() {
  const nextGeneration: Cell[][] = board.value.map((row, rowIndex) => {
    return row.map((cell, colIndex) => {
      const liveNeighbors = findNeighbors(rowIndex, colIndex).filter((n) => n?.state)
      return { state: nextState(cell.state, liveNeighbors.length) }
    })
  })

  board.value = nextGeneration
}

function nextState(currentlyAlive: boolean, liveNeighbors: number) {
  if (currentlyAlive && liveNeighbors < 2) return false // under-population
  if (currentlyAlive && liveNeighbors === 3) return true
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
    row?.[col],
    row?.[right],
    below?.[left],
    below?.[col],
    below?.[right],
  ]
}

function start() {
  stop()
  intervalId = setInterval(tick, 1000)
}

function stop() {
  if (intervalId) {
    clearInterval(intervalId)
  }
}

export default function useBoard() {
  return {
    board: computed(() => board.value),
    gridSize: computed(() => board.value.length),
    init,
    start,
    stop,
  }
}

export interface Cell {
  state: boolean
}
