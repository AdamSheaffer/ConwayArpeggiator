import { computed, ref, type Ref } from 'vue'
import type { Cell } from './useBoard'

// prettier-ignore
export const blinker = Object.freeze([
  '⚪⚪⚪⚪⚪',
  '⚪⚪🔴⚪⚪',
  '⚪⚪🔴⚪⚪',
  '⚪⚪🔴⚪⚪',
  '⚪⚪⚪⚪⚪',
])

// prettier-ignore
export const toad = Object.freeze([
  '⚪⚪⚪⚪⚪⚪',
  '⚪⚪⚪⚪⚪⚪',
  '⚪⚪🔴🔴🔴⚪',
  '⚪🔴🔴🔴⚪⚪',
  '⚪⚪⚪⚪⚪⚪',
  '⚪⚪⚪⚪⚪⚪',
])

// prettier-ignore
export const beacon = Object.freeze([
  '⚪⚪⚪⚪⚪⚪',
  '⚪🔴🔴⚪⚪⚪',
  '⚪🔴🔴⚪⚪⚪',
  '⚪⚪⚪🔴🔴⚪',
  '⚪⚪⚪🔴🔴⚪',
  '⚪⚪⚪⚪⚪⚪',
])

// prettier-ignore
export const pulsar = Object.freeze([
  '⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪',
  '⚪⚪⚪🔴🔴🔴⚪⚪⚪🔴🔴🔴⚪⚪⚪',
  '⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪',
  '⚪🔴⚪⚪⚪⚪🔴⚪🔴⚪⚪⚪⚪🔴⚪',
  '⚪🔴⚪⚪⚪⚪🔴⚪🔴⚪⚪⚪⚪🔴⚪',
  '⚪🔴⚪⚪⚪⚪🔴⚪🔴⚪⚪⚪⚪🔴⚪',
  '⚪⚪⚪🔴🔴🔴⚪⚪⚪🔴🔴🔴⚪⚪⚪',
  '⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪',
  '⚪⚪⚪🔴🔴🔴⚪⚪⚪🔴🔴🔴⚪⚪⚪',
  '⚪🔴⚪⚪⚪⚪🔴⚪🔴⚪⚪⚪⚪🔴⚪',
  '⚪🔴⚪⚪⚪⚪🔴⚪🔴⚪⚪⚪⚪🔴⚪',
  '⚪🔴⚪⚪⚪⚪🔴⚪🔴⚪⚪⚪⚪🔴⚪',
  '⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪',
  '⚪⚪⚪🔴🔴🔴⚪⚪⚪🔴🔴🔴⚪⚪⚪',
  '⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪',
])

// prettier-ignore
export const pentadecathlon = Object.freeze([
  '⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪',
  '⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪',
  '⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪',
  '⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪',
  '⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪',
  '⚪⚪🔴⚪⚪🔴⚪🔴🔴⚪🔴⚪⚪🔴⚪⚪',
  '⚪⚪🔴🔴🔴🔴⚪🔴🔴⚪🔴🔴🔴🔴⚪⚪',
  '⚪⚪🔴⚪⚪🔴⚪🔴🔴⚪🔴⚪⚪🔴⚪⚪',
  '⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪',
  '⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪',
  '⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪',
  '⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪',
  '⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪',
])

// prettier-ignore
export const aforall = Object.freeze([
  '⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪',
  '⚪⚪⚪⚪⚪🔴🔴⚪⚪⚪⚪⚪',
  '⚪⚪⚪⚪🔴⚪⚪🔴⚪⚪⚪⚪',
  '⚪⚪⚪⚪🔴🔴🔴🔴⚪⚪⚪⚪',
  '⚪⚪🔴⚪🔴⚪⚪🔴⚪🔴⚪⚪',
  '⚪🔴⚪⚪⚪⚪⚪⚪⚪⚪🔴⚪',
  '⚪🔴⚪⚪⚪⚪⚪⚪⚪⚪🔴⚪',
  '⚪⚪🔴⚪🔴⚪⚪🔴⚪🔴⚪⚪',
  '⚪⚪⚪⚪🔴🔴🔴🔴⚪⚪⚪⚪',
  '⚪⚪⚪⚪🔴⚪⚪🔴⚪⚪⚪⚪',
  '⚪⚪⚪⚪⚪🔴🔴⚪⚪⚪⚪⚪',
  '⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪',
])

// prettier-ignore
export const block = Object.freeze([
  '⚪⚪⚪⚪',
  '⚪🔴🔴⚪',
  '⚪🔴🔴⚪',
  '⚪⚪⚪⚪',
])

// prettier-ignore
export const beehive = Object.freeze([
  '⚪⚪⚪⚪⚪⚪',
  '⚪⚪🔴🔴⚪⚪',
  '⚪🔴⚪⚪🔴⚪',
  '⚪⚪🔴🔴⚪⚪',
  '⚪⚪⚪⚪⚪⚪',
])

export const loaf = Object.freeze([
  '⚪⚪⚪⚪⚪⚪',
  '⚪⚪🔴🔴⚪⚪',
  '⚪🔴⚪⚪🔴⚪',
  '⚪⚪🔴⚪🔴⚪',
  '⚪⚪⚪🔴⚪⚪',
  '⚪⚪⚪⚪⚪⚪',
])

// prettier-ignore
export const boat = Object.freeze([
  '⚪⚪⚪⚪⚪',
  '⚪🔴🔴⚪⚪',
  '⚪🔴⚪🔴⚪',
  '⚪⚪🔴⚪⚪',
  '⚪⚪⚪⚪⚪',
])

// prettier-ignore
export const tub = Object.freeze([
  '⚪⚪⚪⚪⚪',
  '⚪⚪🔴⚪⚪',
  '⚪🔴⚪🔴⚪',
  '⚪⚪🔴⚪⚪',
  '⚪⚪⚪⚪⚪',
])

export function toCells(emojiGrid: readonly string[]): Ref<Cell[][]> {
  const grid = emojiGrid.map((row, rowIndex) => {
    const cols = [...row]
    return cols.map((col, colIndex) => {
      const cell: Cell = {
        row: rowIndex,
        col: colIndex,
        state: col !== '⚪',
      }
      return cell
    })
  })
  return ref(grid)
}

const draggedTemplate = ref<Cell[][] | null>(null)

const spacing = computed(() => {
  if (!draggedTemplate.value) return null

  const rowCount = draggedTemplate.value.length ?? 0
  const colCount = draggedTemplate.value[0]?.length ?? 0

  const centerRow = Math.ceil(rowCount / 2)
  const centerCol = Math.ceil(colCount / 2)

  return {
    rowCount,
    colCount,
    rowOffset: rowCount - centerRow,
    colOffset: colCount - centerCol,
  }
})

export function useDraggableTemplate() {
  return { spacing, draggedTemplate }
}
