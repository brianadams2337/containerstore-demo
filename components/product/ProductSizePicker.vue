<template>
  <SFListbox
    v-slot="{ isOpen, list }"
    :name="`product-size-picker-menu-${id}`"
    :before-input="handleBeforeInput"
    class="w-full"
  >
    <SFListboxButton
      :list-name="list"
      :disabled="disabled"
      data-test-id="product-size-picker-toggle"
      class="flex h-12 w-full items-center justify-between rounded-md border border-gray-350 px-4 py-2 text-sm font-semibold"
    >
      <span v-if="selectedSize">
        {{ selectedSize.label }}
      </span>
      <span v-else>{{ $t('pdp.select_size') }}</span>
      <span>
        <IconDropdown
          class="size-3 text-primary transition"
          :class="{ 'rotate-180': isOpen }"
        />
      </span>
    </SFListboxButton>
    <div class="relative w-full">
      <Transition
        leave-active-class="transition ease-in duration-100"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <SFListboxOptions
          v-if="isOpen"
          class="absolute inset-0 z-40 mt-2 h-fit max-h-32 overflow-y-auto overflow-x-hidden overscroll-none rounded-md border border-gray-300 bg-white shadow-lg"
        >
          <SFListboxOption
            v-for="(size, idx) in sizes"
            v-slot="{ isActive }"
            :key="idx"
            :list-name="list"
            :value="{ ...size, disabled: !size.isAvailable }"
            data-test-id="product-size"
            class="cursor-pointer px-4 py-2 hover:bg-gray-200"
            :class="{ 'cursor-not-allowed': !size.isAvailable }"
          >
            <SFButton
              v-if="size"
              type="ghost"
              class="w-full !justify-start"
              :disabled="!size.isAvailable"
              :class="{
                'font-bold': isActive,
                'font-normal text-gray-400 line-through': !size.isAvailable,
              }"
              @click.capture="selectSize(size)"
            >
              {{ size.label }}
            </SFButton>
          </SFListboxOption>
        </SFListboxOptions>
      </Transition>
    </div>
  </SFListbox>
</template>

<script setup lang="ts">
import { computed, toRef } from 'vue'
import { sort } from 'radash'

import {
  type Variant,
  getFirstAttributeValue,
  isVariantInStock,
} from '@scayle/storefront-nuxt'
import { getVariantAvailability } from '~/utils/product'
import { type VariantSize, getVariantSizes } from '~/utils/sizes'

type Props = {
  id: number
  variants: Variant[]
  value?: string
  disabled?: boolean
  availabilityBy?: (v: Variant) => boolean
}

const props = withDefaults(defineProps<Props>(), {
  value: undefined,
  disabled: false,
  availabilityBy: (v: Variant) => getVariantAvailability(v).available,
})

const emit = defineEmits(['select-size', 'input'])

const handleBeforeInput = (value: any) =>
  isVariantInStock(props.variants, value, 'size')
const variants = toRef(props, 'variants')

const getSizeFromVariant = (variant: Variant) => {
  const size = getFirstAttributeValue(variant.attributes, 'size')
  return {
    variantId: variant.id,
    label: size?.label || '',
    value: size?.value || '',
    isAvailable: props.availabilityBy(variant),
  }
}

const _sizes = computed(() => {
  if (!variants.value?.length) {
    return []
  }
  return sort([...props.variants], ({ attributes }) => {
    return Number(getFirstAttributeValue(attributes, 'sort')?.value || '0')
  }).map(getSizeFromVariant)
})

const sizes = computed(() => getVariantSizes(props.variants))
const selectedSize = computed(() => {
  return _sizes.value.find((s) => s.value === props.value)
})

const selectSize = (newSize: VariantSize) => {
  emit('select-size', newSize)
  const found = props.variants.find(
    (variant: Variant) => variant.id === newSize?.variantId,
  )
  emit('input', found)
}
</script>
