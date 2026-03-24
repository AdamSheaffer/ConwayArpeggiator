<template>
  <div class="border-4 border-primary/8 shadow-2xl">
    <div class="bg-transparent rounded-md overflow-hidden p-0.5">
      <div v-for="(row, rowIndex) in board" :key="rowIndex" class="flex gap-0.5 mb-0.5 last:mb-0">
        <div
          v-for="(cell, colIndex) in row"
          @click="toggleCell(cell)"
          :key="colIndex"
          class="w-4 h-4 transition-all duration-100"
          :class="{
            'bg-red-500 shadow-lg scale-120 border-red-700 border':
              cell.state && cell.row === activeCell?.row && cell.col === activeCell.col,
            'bg-primary shadow-lg': cell.state && cell,
            'bg-slate-900 border border-slate-800': !cell.state,
          }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useArpeggiator } from '@/composables/useArpeggiator'
import useBoard from '@/composables/useBoard'

const { board, init, toggleCell } = useBoard()
init(30, 50, 0.15)

const { activeCell } = useArpeggiator()
</script>

<style scoped></style>
