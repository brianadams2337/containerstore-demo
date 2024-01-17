<template>
  <div v-if="computedAddOns.length" class="text-sm">
    <div
      v-for="addOn in computedAddOns"
      :key="`${addOn.variantId}`"
      class="mb-3 flex items-center last:mb-0"
    >
      <input
        class="!focus:border-none m-0 mr-3 focus:outline-0"
        type="checkbox"
        @change="(event) => onSelectionChanged(event, addOn)"
      />
      <p>
        {{ addOn.label }}
        {{ formatCurrency(addOn.price) }}
        <span class="text-2xs">
          {{ $t('price.including_vat') }}
        </span>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  getFirstAttributeValue,
  type CentAmount,
} from '@scayle/storefront-nuxt'

type AddOnItem = {
  label: string
  price: CentAmount
  variantId: number
}

const props = defineProps<{ addOnVariantIds: number[] }>()

const emit = defineEmits(['click:service-selection'])

const variantsIds = computed(() => {
  return props.addOnVariantIds.map((id) => parseInt(id.toString()))
})

const keyPostfix = computed(() => props.addOnVariantIds.join('-'))
const { formatCurrency } = useFormatHelpers()

const { data: variants } = await useVariant({
  params: { ids: variantsIds.value },
  key: `addonVariants-${keyPostfix.value}`,
})

const productIds = computed(() => {
  return variants.value?.map((variant) => variant.productId)
})

const { data: products } = await useProductsByIds({
  params: { ids: productIds.value },
  key: `addonProducts-${keyPostfix.value}`,
})

const sortedProductsById = computed(() => {
  return useSort(products.value || [], ({ id }) => id)
})

const sortedVariantsByProductId = computed(() => {
  return useSort(variants.value || [], ({ productId }) => productId)
})

const computedAddOns = computed(() => {
  return sortedProductsById.value.map((product, idx) => ({
    label:
      getFirstAttributeValue(product.attributes, 'name')?.label ?? 'add on',
    price: sortedVariantsByProductId.value![idx]?.price.withoutTax,
    variantId: sortedVariantsByProductId.value![idx].id,
  }))
})

const onSelectionChanged = (event: any, { variantId }: AddOnItem) => {
  emit('click:service-selection', {
    isSelected: event.target.checked,
    variantId,
  })
}
</script>
