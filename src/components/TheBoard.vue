<template>
  <div>
    <div v-for="(row, rowIndex) in board" :key="rowIndex" class="flex space-x-0.5 space-y-0.5">
      <div
        v-for="(col, colIndex) in row"
        :key="colIndex"
        class="border-2 border-slate-300 w-4 h-4"
        :class="{ 'bg-gray-700': col.state }"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import useBoard from '@/composables/useBoard'
import { onMounted } from 'vue'

const { board, init, start } = useBoard()

init(40, 60)

onMounted(() => start())
</script>

<style scoped></style>
