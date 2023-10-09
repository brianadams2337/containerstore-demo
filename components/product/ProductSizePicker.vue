<template>
  <Listbox
    v-slot="{ isOpen, list }"
    :name="`product-size-picker-menu-${id}`"
    :before-input="handleBeforeInput"
    class="w-full">
    <ListboxButton
      :list-name="list"
      data-test-id="product-size-picker-toggle"
      class="flex h-12 w-full items-center justify-between rounded border border-gray-350 px-4 py-2 text-sm font-semibold">
      <span v-if="selectedSize">
        {{ selectedSize.label }}
      </span>
      <span v-else>{{ $t('pdp.select_size') }}</span>
      <span>
        <IconDown
          class="h-6 w-6 text-primary"
          :class="{ 'rotate-180': isOpen }" />
      </span>
    </ListboxButton>
    <div class="relative w-full">
      <transition
        leave-active-class="transition ease-in duration-100"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0">
        <ListboxOptions
          v-if="isOpen"
          class="absolute inset-0 z-40 h-32 overflow-y-auto overflow-x-hidden overscroll-none bg-white shadow-md">
          <ListboxOption
            v-for="(size, idx) in sizes"
            v-slot="{ isActive }"
            :key="idx"
            :list-name="list"
            :value="{ ...size, disabled: !size.isAvailable }"
            data-test-id="product-size"
            class="cursor-pointer px-4 py-2 hover:bg-gray-200"
            :class="{ 'cursor-not-allowed': !size.isAvailable }">
            <AppButton
              v-if="size"
              type="ghost"
              class="w-full !justify-start"
              :disabled="!size.isAvailable"
              :class="{
                'font-bold': isActive,
                'font-normal text-gray-400 line-through': !size.isAvailable,
              }"
              @click.capture="selectSize(size)">
              {{ size.label }}
            </AppButton>
          </ListboxOption>
        </ListboxOptions>
      </transition>
    </div>
  </Listbox>
</template>

<script setup lang="ts">
import {
  getFirstAttributeValue,
  isVariantInStock,
  Variant,
} from '@scayle/storefront-nuxt'
import { getVariantAvailability } from '~/utils/product'

const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
  variants: {
    type: Array as PropType<Variant[]>,
    required: true,
  },
  value: {
    type: String,
    default: undefined,
  },
  availabilityBy: {
    type: Function as PropType<(v: Variant) => boolean>,
    default: (v: Variant) => getVariantAvailability(v).available,
  },
})
const emit = defineEmits(['select-size', 'input'])

const handleBeforeInput = (value: any) =>
  isVariantInStock(props.variants, value, 'size')
const _sizes = ref<VariantSize[]>([]) //
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

watch(
  variants,
  () => {
    if (!variants.value?.length) {
      return
    }
    _sizes.value = [...props.variants]
      .sort((a, b) => {
        const left = getFirstAttributeValue(a.attributes, 'sort')?.value || '0'
        const right = getFirstAttributeValue(b.attributes, 'sort')?.value || '0'

        return parseInt(left, 10) - parseInt(right, 10)
      })
      .map(getSizeFromVariant)
  },
  { immediate: true },
)

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
