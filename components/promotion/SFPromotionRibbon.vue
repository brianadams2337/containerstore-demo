<template>
  <component
    :is="component"
    v-bind="attributes"
    v-if="highestPriorityPromotion"
    class="flex justify-between px-4 lg:justify-around lg:px-7"
    :style="colorStyle"
  >
    <div class="flex items-center justify-between space-x-4 py-3 max-lg:w-full">
      <div class="flex flex-col lg:flex-row lg:divide-x">
        <span class="text-md font-semibold lg:pr-1">{{ headline }}</span>
        <span
          clasS="text-sm font-normal leading-none lg:pl-1 lg:text-md lg:font-medium"
          :style="{ borderColor: colorStyle.color }"
        >
          {{ subline }}
        </span>
      </div>
      <SFPromotionTimer
        v-if="!hideCountdown"
        :time-until="expirationDate"
        :color-style="colorStyle"
      />
    </div>
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Promotion } from '@scayle/storefront-nuxt'
import SFPromotionTimer from './SFPromotionTimer.vue'
import SFLink from '~/modules/ui/runtime/components/links/SFLink.vue'
import { usePromotionCustomData, useTrackingEvents } from '~/composables'
import { sortPromotionsByPriority } from '#storefront-promotions/utils'

const { promotions } = defineProps<{
  promotions: Promotion[]
}>()

const highestPriorityPromotion = computed(() => {
  return promotions.toSorted(sortPromotionsByPriority)[0]
})

const { link, colorStyle, expirationDate, headline, hideCountdown, subline } =
  usePromotionCustomData(highestPriorityPromotion)

const { trackPromotion } = useTrackingEvents()
const track = () => {
  trackPromotion('view_promotion', {
    promotion_id: highestPriorityPromotion.value.id,
    promotion_name: headline.value,
    index: '0',
  })
}

const component = computed(() => {
  return link.value ? SFLink : 'div'
})
const attributes = computed(() => ({
  ...(link && { raw: true, to: link, onClick: track }),
}))
</script>
