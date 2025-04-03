<template>
  <SFSlideIn name="PromotionSlideIn">
    <template #slide-in-header="{ toggle: toggleItem }">
      <div class="flex w-full items-center justify-between">
        <SFHeadline size="2xl" tag="p">
          {{ $t('promotion.slide_in_headline') }}
        </SFHeadline>
        <SFButton
          class="group my-3 -mr-2 bg-gray-100 md:bg-transparent hover:md:bg-gray-100"
          fab
          variant="raw"
          data-testid="close-promotions"
          :aria-label="$t('promotion.close')"
          @click="toggleItem"
        >
          <template #icon>
            <IconClose
              aria-hidden="true"
              class="size-5 md:size-4 md:text-gray-400 group-hover:md:text-gray-900"
            />
          </template>
        </SFButton>
      </div>
    </template>
    <template #slide-in-body>
      <div class="p-6">
        <div class="mb-2 flex items-center gap-2 font-semi-bold-variable">
          {{
            first10Promotions.length
              ? $t('promotion.slide_in_active')
              : $t('promotion.slide_in_no_active_headline')
          }}
          <span
            v-if="first10Promotions.length"
            class="inline-flex h-4 items-center justify-center rounded-full bg-black px-1.5 text-xs text-white"
            data-testid="promotion-counter"
          >
            {{ first10Promotions.length }}
          </span>
        </div>
        <div class="mb-8 text-md">{{ $t('promotion.slide_in_subline') }}</div>

        <div v-if="!first10Promotions.length">
          {{ $t('promotion.slide_in_no_active_subline') }}
        </div>
        <ul v-else class="flex flex-col gap-6">
          <li v-for="promotion in first10Promotions" :key="promotion.id">
            <SFProductPromotionBanner :promotion="promotion" show-condition />
          </li>
        </ul>
      </div>
    </template>
  </SFSlideIn>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { SFSlideIn, SFButton, SFHeadline } from '#storefront-ui/components'
import { useCurrentPromotions } from '#storefront/composables'
import SFProductPromotionBanner from '~/components/product/promotion/banners/SFProductPromotionBanner.vue'
import { PROMOTION_SLIDE_IN_LIMIT } from '~/constants'

const { data } = useCurrentPromotions(
  { params: { pagination: { perPage: PROMOTION_SLIDE_IN_LIMIT } } },
  'promotion-slide-in',
)

const first10Promotions = computed(() => data?.value?.entities || [])
</script>
