<template>
  <div
    class="w-full border-2 border-primary grid gap-0.5 bg-purple-950 transition-all duration-200 cursor-move"
    :class="{
      'border-secondary shadow-md shadow-secondary scale-[1.02]': hoverActive,
    }"
    :style="`grid-template-columns: repeat(${columnCount}, minmax(0, 1fr))`"
    @mouseenter="onMouseEnter()"
    @mouseleave="onMouseLeave()"
    draggable="true"
    @dragstart="onDragStart()"
    @dragend="onDragEnd()"
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
import { useBoard, useMainBoard, type Cell } from '@/composables/useBoard'
import { computed, ref } from 'vue'
import { useDraggableTemplate } from '@/composables/useDraggableTemplate'

const grid = defineModel<Cell[][]>({ required: true })
const props = defineProps<{ static?: boolean }>()

const columnCount = computed(() => grid.value[0]?.length ?? 0)
const flattenedCells = computed(() => grid.value.flat())

const { stop, start } = useBoard(grid)
const { removePreviewBlock } = useMainBoard()

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

const { draggedTemplate } = useDraggableTemplate()

const dragging = ref(false)

function onDragStart() {
  dragging.value = true
  draggedTemplate.value = grid.value
}

function onDragEnd() {
  dragging.value = false
  removePreviewBlock()
}
</script>

<style scoped></style>
