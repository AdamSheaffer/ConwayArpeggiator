<template>
  <div
    class="flex flex-col items-center justify-center min-h-screen bg-linear-to-br from-slate-950 via-purple-950 to-slate-950 p-8"
  >
    <div class="border-4 border-cyan-400 rounded-lg shadow-lg">
      <div class="bg-black rounded-md overflow-hidden p-2">
        <div v-for="(row, rowIndex) in board" :key="rowIndex" class="flex gap-1 mb-0.5 last:mb-0">
          <div
            v-for="(col, colIndex) in row"
            :key="colIndex"
            class="w-5 h-5 rounded-full transition-all duration-300"
            :class="col.state ? 'bg-cyan-300 shadow-lg' : 'bg-slate-900 border border-slate-800'"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import useBoard from '@/composables/useBoard'

const { board, init, start } = useBoard()

init(30, 50)
start(1000)
</script>

<style scoped></style>
