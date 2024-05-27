<template>
  <ClientOnly>
    <template #fallback>
      <SFSkeletonLoader
        type="custom"
        class="mt-2 h-24 w-full rounded-md xs:hidden md:block"
      />
    </template>
    <SFFadeInTransition>
      <PromotionHurryToSaveBanners
        v-if="areHurryToSaveBannersShown"
        :product="product"
        class="mt-2 w-full xs:hidden md:flex"
      />
      <ProductPromotionDefaultBanners
        v-else
        :product="product"
        class="mt-2 xs:hidden md:flex"
      />
    </SFFadeInTransition>
  </ClientOnly>
</template>

<script setup lang="ts">
import type { Product } from '@scayle/storefront-nuxt'

const props = defineProps<{ product: Product }>()

const { areHurryToSaveBannersShown } = await useProductPromotions(props.product)
</script>
