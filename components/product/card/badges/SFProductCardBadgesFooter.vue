<template>
  <div
    data-testid="product-card-footer-badges"
    class="z-10 flex flex-col"
    :class="
      isPromotionBadgeFullWidth ? 'bottom-0 max-w-full ' : 'items-start w-full'
    "
  >
    <div
      v-if="isProductAddedToBasket && !isBasketPage && mounted"
      class="h-4 w-fit self-end rounded-tl-md bg-gray-600 px-2 text-xs font-medium text-gray-100"
    >
      {{ $t('badge_labels.already_in_basket') }}
    </div>
    <SFProductPromotionBadges
      :product="product"
      :is-full-width="isPromotionBadgeFullWidth"
      class="mt-px"
      :class="{ '!max-w-full': isBasketPage }"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Product } from '@scayle/storefront-nuxt'
import { useMounted } from '@vueuse/core'
import SFProductPromotionBadges from '../../promotion/SFProductPromotionBadges.vue'
import { routeList } from '~/utils'
import { useLocalePath } from '#i18n'
import { useRoute } from '#app/composables/router'
import { useBasket } from '#storefront/composables'

type Props = {
  product: Product
  isPromotionBadgeFullWidth?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isPromotionBadgeFullWidth: true,
})

const route = useRoute()
const localePath = useLocalePath()

const { data: basketData } = useBasket()

const isProductAddedToBasket = computed(() => {
  return (basketData.value?.items ?? []).some((item) => {
    return item.product.id === props.product.id
  })
})

const isBasketPage = computed(() => route.path === localePath(routeList.basket))
const mounted = useMounted()
</script>
