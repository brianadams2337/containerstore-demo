<template>
  <SFButton
    data-testid="toggle-promotion-banner-button"
    variant="raw"
    size="xs"
    class="min-h-9 min-w-44 items-center !px-2 !py-1 text-xs font-semibold leading-5 text-white -outline-offset-5 hover:text-white focus-visible:shadow-inner-solid"
    :aria-expanded="isPromotionBannerShown.toString()"
    :style="backgroundColorStyle"
    :class="{ [borderClass]: isPromotionBannerShown }"
    @click.stop="togglePromotionBanner()"
  >
    <IconGift class="size-3" />
    <span v-if="isPromotionBannerShown">
      {{ $t('promotion.hide_my_promotions') }}
    </span>
    <span v-else> {{ $t('promotion.see_my_promotions') }}</span>
    <template #append-icon="{ _class }">
      <component
        :is="isMobileView ? 'IconChevronDown' : 'IconChevronUp'"
        v-if="isPromotionBannerShown"
        :class="_class"
      />
      <component
        :is="isMobileView ? 'IconChevronUp' : 'IconChevronDown'"
        v-else
        :class="_class"
      />
    </template>
  </SFButton>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useCurrentPromotion, usePromotionActions } from '~/composables'
import { SFButton } from '#storefront-ui/components'

const { isMobileView = false } = defineProps<{ isMobileView?: boolean }>()

const { backgroundColorStyle } = useCurrentPromotion()
const { togglePromotionBanner, isPromotionBannerShown } = usePromotionActions()

const borderClass = computed(() =>
  isMobileView ? '!border-b-[0.5px]' : '!border-t-[0.5px]',
)
</script>
