<template>
  <component
    :is="componentName"
    v-bind="attributes"
    :aria-label="headline"
    class="relative block w-full rounded-xl border text-white"
    :style="{ borderColor: colorStyle.backgroundColor }"
    @click="track"
  >
    <SFPromotionTimer
      v-if="expirationDate && !hideCountdown"
      class="absolute -translate-y-1/2 translate-x-6"
      :time-until="expirationDate"
      data-testid="promotion-countdown"
      :color-style="colorStyle"
    />
    <div class="-m-px rounded-xl px-6 py-4" :style="colorStyle">
      <div class="font-bold">{{ headline }}</div>
      <div v-if="subline" class="text-md">{{ subline }}</div>
    </div>
    <ClientOnly>
      <template #fallback>
        <div class="flex w-full flex-col px-6 py-4">
          <SFSkeletonLoader
            v-for="n in 3"
            :key="n"
            type="custom"
            class="my-1 h-2 w-full rounded-sm"
          />
        </div>
      </template>
      <SFFadeInTransition>
        <div>
          <SFPromotionProgressWrapper
            :promotion="promotion"
            :are-gift-conditions-met="areGiftConditionsMet"
            :is-gift-added-to-basket="isGiftAddedToBasket"
          />
          <div
            v-if="conditions && showCondition"
            class="flex flex-col px-6 py-4 text-md text-gray-600"
          >
            <div class="flex flex-col gap-2">
              <div class="flex items-center gap-1">
                <IconInfoOutlineSquare class="size-4" />
                {{ $t('pdp.promotion.condition') }}
              </div>
              <div class="whitespace-break-spaces text-sm">
                {{ conditions }}
              </div>
            </div>
          </div>
        </div>
      </SFFadeInTransition>
    </ClientOnly>
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Promotion } from '@scayle/storefront-nuxt'
import SFPromotionProgressWrapper from './SFPromotionProgressWrapper.vue'
import SFPromotionTimer from '~/components/promotion/SFPromotionTimer.vue'
import { SFLink } from '~/modules/ui/runtime/components'
import { ClientOnly } from '#components'
import { SFSkeletonLoader, SFFadeInTransition } from '#storefront-ui/components'
import { useTrackingEvents, usePromotionCustomData } from '~/composables'

const { promotion, showCondition = false } = defineProps<{
  promotion: Promotion
  isGiftAddedToBasket?: boolean
  areGiftConditionsMet?: boolean
  showCondition?: boolean
}>()

const {
  headline,
  subline,
  link,
  colorStyle,
  conditions,
  hideCountdown,
  expirationDate,
} = usePromotionCustomData(promotion)

const { trackPromotion } = useTrackingEvents()

function track() {
  if (!link.value) {
    return
  }

  trackPromotion('select_promotion', {
    promotion_id: promotion.id,
    promotion_name: promotion.name,
    creative_name: 'teaser',
    index: '1',
  })
}

const componentName = computed(() => (link.value ? SFLink : 'div'))

const attributes = computed(() => ({
  ...(link.value && { raw: true, to: link.value }),
}))
</script>
