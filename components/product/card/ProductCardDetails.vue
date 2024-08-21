<template>
  <SFLink
    :to="link"
    raw
    class="min-h-[9.25rem] max-md:pl-2 md:min-h-[6.375rem]"
  >
    <component
      :is="divOrTransition"
      class="w-full overflow-hidden md:h-[5.375rem]"
    >
      <div v-if="isProductHovered || isSmallerThenMd" class="mt-2 md:mt-3">
        <slot name="details-actions" :siblings="siblings">
          <ProductCardSiblingsPicker
            :product="product"
            :siblings="siblings"
            :limit="siblingsLimit"
            class="max-md:hidden"
          />
          <ProductCardSiblingsSlider
            :product="product"
            :siblings="siblings"
            class="md:hidden"
          />
        </slot>
      </div>
      <ProductCardDescription
        v-if="!isProductHovered || isSmallerThenMd"
        class="mt-3 max-md:mb-6 md:mt-5"
        :name="name"
        :brand="brand"
      />
    </component>
    <slot name="details-price" :price="price">
      <ProductPrice
        v-if="price"
        :price="price"
        :lowest-prior-price="lowestPriorPrice"
        :product="product"
        show-price-reduction-badge
        show-price-from
        class="absolute bottom-0 left-2 md:left-0"
      />
    </slot>
  </SFLink>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Product } from '@scayle/storefront-nuxt'
import { useMounted } from '@vueuse/core'
import { useProductBaseInfo, useDefaultBreakpoints } from '~/composables'
import { SFFadeInFromBottomGroupTransition } from '#components'

const props = defineProps<{
  product: Product
  isProductHovered: boolean
  link: string
}>()

const isMounted = useMounted()

const {
  brand,
  name,
  price,
  lowestPriorPrice,
  nonSoldOutSiblings: siblings,
} = useProductBaseInfo(props.product)

const { smallerOrEqual, greater } = useDefaultBreakpoints()

const isSmallerThenMd = smallerOrEqual('md')
const isSmallerThenXl = smallerOrEqual('xl')
const isGreaterThen2Xl = greater('2xl')

const siblingsLimit = computed(() => {
  if (isGreaterThen2Xl.value) return 4
  return isSmallerThenXl.value ? 2 : 3
})

const divOrTransition = computed(() => {
  return isSmallerThenMd.value || !isMounted.value
    ? 'div'
    : SFFadeInFromBottomGroupTransition
})
</script>
