<template>
  <div>
    <div v-for="(row, rowIndex) in board" :key="rowIndex" class="flex space-x-px space-y-px">
      <div
        v-for="(col, colIndex) in row"
        :key="colIndex"
        class="border border-slate-300 w-4 h-4"
        :class="{ 'bg-gray-700': col.state }"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import useBoard from '@/composables/useBoard'

const { board, init, start } = useBoard()

init(40, 60)
start()
</script>

<style scoped></style>
