<template>
  <div class="overflow-hidden overflow-y-auto pb-0 scrollbar-hide">
    <div class="mt-5 p-5">
      <div
        v-for="(store, index) in stores"
        :key="store.id"
        ref="storeContainers"
        class="mb-5 rounded border-2 bg-white p-5 text-sm"
        :class="{
          'border-primary': selectedStoreId === store.id,
          'border-gray-350': selectedStoreId !== store.id,
        }"
      >
        <SlideInStore
          v-bind="store"
          :index="index + 1"
          :opening-times="store.openingTimes"
          @click.prevent="selectedStoreId = store.id"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { Store } from '@scayle/omnichannel-nuxt'

defineProps({
  stores: {
    type: Array as PropType<Store[]>,
    default: () => [],
  },
})

const selectedStoreId = defineModel('selectedStoreId', {
  type: Number,
  default: undefined,
})
</script>
