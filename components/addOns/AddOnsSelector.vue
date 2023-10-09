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
import {
  getFirstAttributeValue,
  type CentAmount,
} from '@scayle/storefront-nuxt'

type AddOnItem = {
  label: string
  price: CentAmount
  variantId: number
}

const props = defineProps({
  addOnVariantIds: {
    type: Array as PropType<number[]>,
    required: true,
  },
})

const emit = defineEmits(['click:service-selection'])

const keyPostfix = computed(() => props.addOnVariantIds.join('-'))

const { data: variants } = await useVariant({
  params: {
    ids: props.addOnVariantIds.map((addOn) => parseInt(addOn.toString())),
  },
  key: `addonVariants-${keyPostfix.value}`,
})

const { data: products } = await useProductsByIds({
  params: {
    ids: variants.value?.map((variant) => variant.productId),
  },
  key: `addonProducts-${keyPostfix.value}`,
})
const computedAddOns = ref<AddOnItem[]>([])

onMounted(() => resolveVariantInfo())

const onSelectionChanged = (event: any, { variantId }: AddOnItem) => {
  emit('click:service-selection', {
    isSelected: event.target.checked,
    variantId,
  })
}

const resolveVariantInfo = () => {
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
