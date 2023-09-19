<template>
  <div v-if="computedAddOns.length" class="text-sm">
    <div
      v-for="addOn in computedAddOns"
      :key="`${addOn.variantId}`"
      class="mb-3 flex items-center last:mb-0">
      <input
        class="!focus:border-none m-0 mr-3 focus:outline-0"
        type="checkbox"
        @change="(event) => onSelectionChanged(event, addOn)" />
      <p>
        {{ addOn.label }}
        {{ toCurrency(addOn.price) }}
        <span class="text-2xs">
          {{ $t('price.including_vat') }}
        </span>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getFirstAttributeValue } from '@scayle/storefront-nuxt'
import { AddOnItem } from '~/types'

const props = defineProps({
  addOnVariantIds: {
    type: Array as PropType<number[]>,
    required: true,
  },
})

const emit = defineEmits(['click:service-selection'])

const keyPostfix = computed(() => props.addOnVariantIds.join('-'))

const { data: variants, fetch: fetchVariants } = await useVariant(
  () => ({
    ids: props.addOnVariantIds.map((addOn) => parseInt(addOn.toString())),
  }),
  undefined,
  `addonVariants-${keyPostfix.value}`,
)

const { data: products, fetch: fetchProducts } = await useProductsByIds(
  () => ({
    ids: variants.value?.map((variant) => variant.productId),
  }),
  undefined,
  `addonProducts-${keyPostfix.value}`,
)
const computedAddOns = ref<AddOnItem[]>([])

onMounted(() => {
  return resolveVariantInfo()
})

const onSelectionChanged = (event: any, { variantId }: AddOnItem) => {
  emit('click:service-selection', {
    isSelected: event.target.checked,
    variantId,
  })
}

const resolveVariantInfo = async () => {
  await fetchVariants()
  await fetchProducts()
  // sorting by productId ensures 1-1 mapping by index for later computation of label and price
  products.value?.sort((a, b) => a.id - b.id)
  variants.value?.sort((a, b) => a.productId - b.productId)

  computedAddOns.value = (products.value || []).map((product, idx) => ({
    label:
      getFirstAttributeValue(product.attributes, 'name')?.label ?? 'add on',
    price: variants.value![idx]?.price.withoutTax,
    variantId: variants.value![idx].id,
  }))
}
</script>
