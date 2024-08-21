<template>
  <div class="grid grid-cols-8">
    <ProductCard
      :key="`product-disruptor-${product.id}`"
      :class="{
        'col-span-full': width === '1' || width === undefined,
        'col-span-full md:col-span-4 md:col-start-3':
          (width === '2' && listingColumns === 3) || listingColumns === 1,
        'col-span-full md:col-span-8': width === '2' && listingColumns === 2,
      }"
      :product="product"
      :badge-label="badgeLabel"
      :multiple-images="multipleImages"
      :show-add-to-cart="false"
      :loading="fetching"
      class="col-span-full"
      @intersect:product="emit('intersect:product', product)"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, defineOptions } from 'vue'
import type { Product } from '@scayle/storefront-nuxt'
import { useNuxtApp } from '#app'
import { useListingUiState } from '~/composables/useListingUiState'

type CMSProductProps = {
  width?: string
  fetching?: boolean
  multipleImages?: boolean
  product: Product
}
const { listingColumns } = useListingUiState()
const { $i18n } = useNuxtApp()

const props = withDefaults(defineProps<CMSProductProps>(), {
  fetching: false,
  width: undefined,
  multipleImages: false,
})

const emit = defineEmits(['intersect:product'])

const badgeLabel = computed(() => {
  return props.product.isNew ? $i18n.t('badge_labels.new') : undefined
})

defineOptions({ name: 'CMSProduct' })
</script>
