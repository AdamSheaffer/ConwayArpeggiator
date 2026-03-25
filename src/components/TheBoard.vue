<template>
  <div class="border-4 border-primary/8 shadow-2xl">
    <div class="bg-transparent rounded-md overflow-hidden p-0.5">
      <div v-for="(row, rowIndex) in board" :key="rowIndex" class="flex gap-0.5 mb-0.5 last:mb-0">
        <div
          v-for="(cell, colIndex) in row"
          @click="toggleCell(cell)"
          @dragenter="onTemplateDragOver(cell)"
          @dragover.prevent
          @drop="onTemplateDrop(cell)"
          :key="colIndex"
          class="w-4 h-4 transition-all duration-100"
          :class="{
            'bg-red-500 shadow-lg scale-120 border-red-700 border':
              cell.state && cell.row === activeCell?.row && cell.col === activeCell.col,
            'bg-primary shadow-lg': cell.state && !cell.previewing,
            'bg-amber-400/70 shadow-lg': cell.previewing,
            'bg-slate-900 border border-slate-800': !cell.state && !cell.previewing,
          }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useArpeggiator } from '@/composables/useArpeggiator'
import { useMainBoard, type Cell } from '@/composables/useBoard'
import { useDraggableTemplate } from '@/composables/useDraggableTemplate'
import { useDebounceFn } from '@vueuse/core'

const { board, init, toggleCell, setPreviewBlock, dropTemplate } = useMainBoard()
init(30, 50, 0.15)

const { activeCell } = useArpeggiator()

const { spacing, draggedTemplate } = useDraggableTemplate()

function topLeftCellOfDragArea(cell: Cell) {
  if (!spacing.value) return

  const { row, col } = cell
  const topLeftRow = row - spacing.value.rowOffset
  const topLeftCol = col - spacing.value.colOffset
  const topLeftCell = board.value[topLeftRow]?.[topLeftCol]

  return topLeftCell
}

function onTemplateDragOver(cell: Cell) {
  previewTemplateDrop(cell)
}

const previewTemplateDrop = useDebounceFn((cell: Cell) => {
  const topLeftCell = topLeftCellOfDragArea(cell)

  if (!topLeftCell || !spacing.value) return

  setPreviewBlock(topLeftCell, spacing.value.rowCount, spacing.value.colCount)
}, 100)

function onTemplateDrop(cell: Cell) {
  const topLeftCell = topLeftCellOfDragArea(cell)

  if (!topLeftCell || !spacing.value || !draggedTemplate.value) return

  dropTemplate(topLeftCell, draggedTemplate.value)
}
</script>

<style scoped></style>
