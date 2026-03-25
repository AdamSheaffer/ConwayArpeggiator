<template>
  <div>
    <FormLabel>Generation Speed</FormLabel>
    <div class="grid grid-cols-3">
      <AppButton @click="update('slow')" :outline="model !== options.slow">Slow</AppButton>
      <AppButton @click="update('medium')" :outline="model !== options.medium" class="border-x-0">
        Medium
      </AppButton>
      <AppButton @click="update('fast')" :outline="model !== options.fast">Fast</AppButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppButton from './base/AppButton.vue'
import FormLabel from './base/FormLabel.vue'

const model = defineModel<number>()

const options = {
  slow: 2000,
  medium: 750,
  fast: 250,
}

function update(value: keyof typeof options) {
  model.value = options[value]
}
</script>
