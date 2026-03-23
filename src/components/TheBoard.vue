<template>
  <div
    class="flex flex-col items-center justify-center min-h-screen bg-linear-to-br from-slate-950 via-purple-950 to-slate-950 p-8"
  >
    <div class="border-4 border-primary shadow-lg">
      <div class="bg-black rounded-md overflow-hidden p-2">
        <div v-for="(row, rowIndex) in board" :key="rowIndex" class="flex gap-1 mb-0.5 last:mb-0">
          <div
            v-for="(cell, colIndex) in row"
            @click="cell.state = false"
            :key="colIndex"
            class="w-4 h-4 transition-all duration-300"
            :class="{
              'bg-red-500 shadow-lg':
                cell.state && cell.row === activeCell?.row && cell.col === activeCell.col,
              'bg-primary shadow-lg': cell.state && cell,
              'bg-slate-900 border border-slate-800': !cell.state,
            }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useArpeggiator } from '@/composables/useArpeggiator'
import useBoard from '@/composables/useBoard'

const { board, init, start: startConwayGenerations } = useBoard()
init(30, 50, 0.15)
startConwayGenerations()

const { activeCell } = useArpeggiator()
</script>

<style scoped></style>
