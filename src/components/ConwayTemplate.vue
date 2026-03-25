<template>
  <div
    class="w-full border-2 border-primary grid gap-0.5 bg-purple-950 transition-all duration-200 cursor-move"
    :class="{ 'border-secondary shadow-md shadow-secondary scale-[1.02]': hoverActive }"
    :style="`grid-template-columns: repeat(${columnCount}, minmax(0, 1fr))`"
    @mouseenter="onMouseEnter()"
    @mouseleave="onMouseLeave()"
  >
    <div
      v-for="(cell, i) in flattenedCells"
      :key="i"
      class="w-full aspect-square"
      :class="{
        'bg-slate-900 border border-slate-800': !cell.state,
        'bg-primary': cell.state,
      }"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { useBoard, type Cell } from '@/composables/useBoard'
import { computed, ref } from 'vue'

const grid = defineModel<Cell[][]>({ required: true })
const props = defineProps<{ static?: boolean }>()

const columnCount = computed(() => grid.value[0]?.length ?? 0)
const flattenedCells = computed(() => grid.value.flat())

const { stop, start } = useBoard(grid)

const hoverActive = ref(false)

function onMouseEnter() {
  if (!props.static) {
    start()
  }
  hoverActive.value = true
}

function onMouseLeave() {
  if (!props.static) {
    stop()
  }
  hoverActive.value = false
}
</script>

<style scoped></style>
