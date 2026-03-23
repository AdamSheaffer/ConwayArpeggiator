<template>
  <div>
    <FormLabel>Progression</FormLabel>

    <div class="flex space-x-2">
      <SelectInput v-model="chord" :options="keyDropdownOptions" />

      <SelectInput v-model="quality" :options="chordQualityOptions" />

      <AppButton @click="onAdd()" title="Add chord"> + </AppButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type Chord, type ChordQuality } from '@/composables/useArpeggiatorSettings'
import { keyOptions, chordQualityOptions } from '@/composables/useArpeggiatorSettings'
import SelectInput from './base/SelectInput.vue'
import FormLabel from './base/FormLabel.vue'
import AppButton from './base/AppButton.vue'

const chord = defineModel<string>('chord', { required: true })
const quality = defineModel<ChordQuality>('quality', { required: true })
const emit = defineEmits<{ add: [chord: Chord] }>()

const keyDropdownOptions = keyOptions.map((k) => ({ value: k, label: k }))

function onAdd() {
  emit('add', {
    chord: chord.value,
    quality: quality.value,
  })
}
</script>
