<template>
  <div
    class="flex flex-col items-center justify-center min-h-screen bg-linear-to-br from-slate-950 via-purple-950 to-slate-950 p-8"
  >
    <div class="border-4 border-cyan-400 rounded-lg shadow-lg">
      <div class="bg-black rounded-md overflow-hidden p-2">
        <div v-for="(row, rowIndex) in board" :key="rowIndex" class="flex gap-1 mb-0.5 last:mb-0">
          <div
            v-for="(cell, colIndex) in row"
            @click="cell.state = false"
            :key="colIndex"
            class="w-5 h-5 rounded-full transition-all duration-300"
            :class="{
              'bg-red-900 shadow-lg':
                cell.state && cell.row === activeCell?.row && cell.col === activeCell.col,
              'bg-cyan-300 shadow-lg': cell.state && cell,
              'bg-slate-900 border border-slate-800': !cell.state,
            }"
          ></div>
        </div>
      </div>
    </div>

    <section class="text-white">
      <button @click="toggleArpeggiator()">Arpeggiator</button>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useArpeggiator } from '@/composables/useArpeggiator'
import useBoard from '@/composables/useBoard'

const { board, init, start: startConwayGenerations } = useBoard()
init(30, 50, 0.15)
startConwayGenerations()

const { start: startArpeggiator, stop: stopArpeggiator, activeCell, isPlaying } = useArpeggiator()

function toggleArpeggiator() {
  if (isPlaying.value) {
    stopArpeggiator()
  } else {
    startArpeggiator()
  }
}
</script>

<style scoped></style>
