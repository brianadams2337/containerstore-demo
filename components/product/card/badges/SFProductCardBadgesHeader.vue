<template>
  <div data-testid="product-badges" class="flex flex-col">
    <SFProductBadge v-if="labels.length" :text="labels" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { type Product, getFirstAttributeValue } from '@scayle/storefront-nuxt'
import SFProductBadge from '../../SFProductBadge.vue'
import { useNuxtApp } from '#app/nuxt'

const props = defineProps<{ product: Product }>()

const { $i18n } = useNuxtApp()

const customAttributes = computed(() => {
  return getFirstAttributeValue(props.product.attributes, 'storefrontBadge')
})

const labels = computed(() => {
  return [
    props.product.isNew ? $i18n.t('badge_labels.new') : null,
    customAttributes.value?.label,
  ].filter((item): item is string => !!item)
})
</script>
