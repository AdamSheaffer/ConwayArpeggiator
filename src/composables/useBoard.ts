import { computed, shallowRef, type Ref } from 'vue'
import { useIntervalFn } from '@vueuse/core'
import { useSettings } from '@/composables/useSettings'

export interface Cell {
  state: boolean
  row: number
  col: number
  previewing?: boolean
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

  function setPreviewBlock(topLeftCell: Cell, rows: number, cols: number) {
    const startingRow = topLeftCell.row
    const endingRow = topLeftCell.row + rows - 1
    const startingCol = topLeftCell.col
    const endingCol = topLeftCell.col + cols - 1

    board.value = board.value.map((rows) =>
      rows.map((cell) => {
        const inPreviewRow = cell.row >= startingRow && cell.row <= endingRow
        const inPreviewCol = cell.col >= startingCol && cell.col <= endingCol
        const previewing = inPreviewRow && inPreviewCol
        return { ...cell, previewing }
      }),
    )
  }

  function dropTemplate(topLeftCell: Cell, template: Cell[][]) {
    const templateRowCount = template.length
    const templateColCount = template[0]?.length ?? 0
    const startingRow = topLeftCell.row
    const endingRow = topLeftCell.row + templateRowCount - 1
    const startingCol = topLeftCell.col
    const endingCol = topLeftCell.col + templateColCount - 1

    board.value = board.value.map((row) =>
      row.map((mainCell) => {
        const isInDropZoneRow = mainCell.row >= startingRow && mainCell.row <= endingRow
        const isInDropZoneCol = mainCell.col >= startingCol && mainCell.col <= endingCol
        if (!isInDropZoneRow || !isInDropZoneCol) return { ...mainCell }

        const templateCell =
          template[mainCell.row - topLeftCell.row]?.[mainCell.col - topLeftCell.col]
        return { ...mainCell, state: templateCell?.state ?? false }
      }),
    )
  }

  function removePreviewBlock() {
    board.value = board.value.map((row) => row.map((col) => ({ ...col, previewing: false })))
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
    dropTemplate,
    init,
    isPlaying,
    liveCells,
    setPreviewBlock,
    removePreviewBlock,
    start,
    stop,
    toggleCell,
  }
}

const { settings } = useSettings()
const mainBoard = shallowRef<Cell[][]>([])

const {
  dropTemplate,
  init,
  isPlaying,
  liveCells,
  start,
  stop,
  toggleCell,
  setPreviewBlock,
  removePreviewBlock,
} = useBoard(mainBoard)

export function useMainBoard() {
  return {
    board: computed(() => mainBoard.value),
    dropTemplate,
    init,
    isPlaying,
    liveCells,
    setPreviewBlock,
    removePreviewBlock,
    start,
    stop,
    toggleCell,
  }
}
