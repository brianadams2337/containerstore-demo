<template>
  <div>
    <div class="flex flex-row items-center justify-between">
      <p class="flex-none basis-1/2 font-bold">
        {{ nameWithIndex }}
      </p>
      <div
        class="flex grow basis-1/2 flex-row flex-nowrap items-center justify-between text-xs font-bold"
      >
        <div v-if="distance" class="rounded-full bg-secondary-400 px-2 py-1">
          {{ formatDistance(distance) }}
        </div>
        <div v-if="quantity !== undefined" class="rounded-full px-2 py-1">
          {{
            quantity < 5
              ? $t('store_locator.labels.low_stock')
              : $t('store_locator.labels.available')
          }}
        </div>
        <StoreFavoriteToggle :store-id="id" />
      </div>
    </div>
    <div class="mt-5 flex flex-col space-y-2 text-xs">
      <div class="flex items-center justify-start">
        <div class="mr-2 size-4"><IconLocation /></div>
        <div>
          {{ address.street }} {{ address.houseNumber }} -
          {{ address.zipCode }} {{ address.city }}
        </div>
      </div>
      <div v-if="customData?.phone" class="flex items-center justify-start">
        <div class="mr-2 size-4">
          <IconPhone />
        </div>
        <div>{{ customData.phone }}</div>
      </div>
      <div class="flex items-center justify-start">
        <div class="mr-2 size-4">
          <IconClock />
        </div>
        <div>
          <span class="font-bold">{{
            openingTimes.currentlyOpen
              ? $t('store_locator.labels.store_open')
              : $t('store_locator.labels.store_closed')
          }}</span>
          <span v-if="openingTimes.currentlyOpen">{{
            ' ' +
            $t(
              'store_locator.labels.store_closes_in',
              closesInTime(openingTimes.minutesUntilClosed),
            )
          }}</span>
        </div>
      </div>
    </div>
    <StoreOpeningTimesSummary :opening-times="openingTimes" />
  </div>
</template>

<script setup lang="ts">
import type { OpeningTimes, StoreAddress } from '@scayle/omnichannel-nuxt'

interface Props {
  id: number
  name: string
  index: number
  distance?: number
  quantity: number
  address: StoreAddress
  customData: Partial<{ phone: string }>
  openingTimes: OpeningTimes
}

const props = withDefaults(defineProps<Props>(), {
  quantity: undefined,
  index: 0,
})

const formatDistance = useFormatDistance()

const nameWithIndex = computed(() =>
  props.index > 0 ? `${props.index}. ${props.name}` : `${props.name}`,
)

const closesInTime = (totalMinutes: number) => {
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  return { hours, minutes }
}
</script>
