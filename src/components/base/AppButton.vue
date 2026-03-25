<template>
  <button
    class="hover:border-purple-500 transition-all duration-200 text-white font-bold py-2 px-4 border-2 border-primary cursor-pointer uppercase"
    :class="{
      'bg-primary hover:bg-purple-500': !outline,
      'shadow-lg hover:shadow-secondary': shadow,
    }"
  >
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
defineProps<{ outline?: boolean; shadow?: boolean }>()
</script>
