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
          @click.prevent="clickStore(store.id)"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { defineModel } from 'vue'
import type { Store } from '@scayle/omnichannel-nuxt'
import SlideInStore from './SlideInStore.vue'

withDefaults(defineProps<{ stores: Store[] }>(), { stores: () => [] })

const selectedStoreId = defineModel<number | undefined>('selectedStoreId', {
  type: Number,
  default: undefined,
})

const clickStore = (storeId: number) => {
  if (selectedStoreId.value === storeId) {
    selectedStoreId.value = undefined
  } else {
    selectedStoreId.value = storeId
  }
}
</script>
