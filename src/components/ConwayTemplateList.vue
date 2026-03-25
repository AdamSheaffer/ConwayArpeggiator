<template>
  <div>
    <div class="flex justify-between">
      <FormLabel>Repeaters</FormLabel>
      <div class="text-[.65rem] text-slate-400">drag & drop</div>
    </div>

    <div class="grid grid-cols-2 flex-wrap gap-3">
      <ConwayTemplate v-model="blinkerGrid" />
      <ConwayTemplate v-model="beaconGrid" />
      <ConwayTemplate v-model="toadGrid" />
      <ConwayTemplate v-model="pentadecathlonGrid" />
      <ConwayTemplate v-model="pulsarGrid" />
      <ConwayTemplate v-model="aforallGrid" />
    </div>

    <div class="flex justify-between mt-8">
      <FormLabel>Static</FormLabel>
      <div class="text-[.65rem] text-slate-400">drag & drop</div>
    </div>

    <div class="grid grid-cols-2 flex-wrap gap-3">
      <ConwayTemplate static v-model="blockGrid" />
      <ConwayTemplate static v-model="beehiveGrid" />
      <ConwayTemplate static v-model="loafGrid" />
      <ConwayTemplate static v-model="boatGrid" />
      <ConwayTemplate static v-model="tubGrid" />
    </div>
  </div>
</template>

<script setup lang="ts">
import FormLabel from './base/FormLabel.vue'
import ConwayTemplate from './ConwayTemplate.vue'
import {
  beacon,
  pentadecathlon,
  toad,
  pulsar,
  blinker,
  toCells,
  block,
  beehive,
  loaf,
  boat,
  tub,
  aforall,
} from '@/composables/useDraggableTemplate'

// Repeaters
const blinkerGrid = toCells(blinker)
const beaconGrid = toCells(beacon)
const toadGrid = toCells(toad)
const pulsarGrid = toCells(pulsar)
const pentadecathlonGrid = toCells(pentadecathlon)
const aforallGrid = toCells(aforall)

// Static
const blockGrid = toCells(block)
const beehiveGrid = toCells(beehive)
const loafGrid = toCells(loaf)
const boatGrid = toCells(boat)
const tubGrid = toCells(tub)
</script>

<style scoped></style>
