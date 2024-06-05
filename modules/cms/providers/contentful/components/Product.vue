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
      v-bind="{ product, badgeLabel }"
      :show-add-to-cart="false"
      :loading="fetching"
      class="col-span-full"
      @intersect:product="emit('intersect:product', product)"
    />
  </div>
</template>

<script setup lang="ts">
import { defineOptions , computed } from 'vue'
import { useNuxtApp } from '#app/nuxt'
import { useListingUiState } from '~/composables/useListingUiState'
import { type Product } from '@scayle/storefront-nuxt'

type CMSProductProps = {
  width?: string
  fetching?: boolean
  product: Product
}

const { listingColumns } = useListingUiState()

const props = defineProps<CMSProductProps>()
const { $i18n } = useNuxtApp()

const emit = defineEmits(['intersect:product'])
const badgeLabel = computed(() => {
  if (props.product.isNew) {
    return $i18n.t('badge_labels.new')
  }

  return undefined
})

defineOptions({ name: 'CMSProduct' })
</script>
