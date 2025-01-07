<template>
  <SFProductCard
    :key="`product-disruptor-${product.id}`"
    :product="product"
    :multiple-images="multipleImages"
    class="col-span-full"
    @intersect:product="emit('intersect:product', product)"
  />
</template>

<script setup lang="ts">
import { defineOptions } from 'vue'
import type { Product } from '@scayle/storefront-nuxt'
// TODO: This needs to be decoupled from the CMS module as it is coming from the SFB local components
import SFProductCard from '~/components/product/card/SFProductCard.vue'

type CMSProductProps = {
  multipleImages?: boolean
  product: Product
}

const { multipleImages = false } = defineProps<CMSProductProps>()

const emit = defineEmits(['intersect:product'])

defineOptions({ name: 'CMSProduct' })
</script>
