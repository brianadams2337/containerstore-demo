<template>
  <div class="font-medium">
    <span class="ml-2">
      {{ store.name }}
    </span>
    <span class="ml-4 inline-block rounded-3xl bg-gray-100 px-3 py-2">
      {{ formatDistance(store.distance) }}
    </span>
    <div class="mt-5 flex flex-col space-y-2 text-xs">
      <div class="flex items-center justify-start">
        <div class="mr-2 size-4"><IconLocation /></div>
        <div>
          {{ store.address.street }} {{ store.address.houseNumber }} -
          {{ store.address.zipCode }} {{ store.address.city }}
        </div>
      </div>
      <div
        v-if="store.customData && 'phone' in store.customData"
        class="flex items-center justify-start"
      >
        <div class="mr-2 size-4">
          <IconPhone />
        </div>
        <div>{{ store.customData.phone }}</div>
      </div>
      <div class="flex items-center justify-start">
        <div class="mr-2 size-4">
          <IconClock />
        </div>
        <div>
          <span class="font-bold capitalize">
            {{
              store.openingTimes?.currentlyOpen
                ? $t('store_locator.labels.store_open')
                : $t('store_locator.labels.store_closed')
            }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { StoreLocation } from '@scayle/omnichannel-nuxt'

type Props = {
  store: StoreLocation
}
defineProps<Props>()

const formatDistance = useFormatDistance()
</script>
