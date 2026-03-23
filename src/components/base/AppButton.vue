<template>
  <button
    class="hover:border-purple-500 transition-colors text-white font-bold py-2 px-4 border-2 border-primary cursor-pointer"
    :class="{ 'bg-primary hover:bg-purple-500': !outline }"
  >
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
defineProps<{ outline?: boolean }>()
</script>
