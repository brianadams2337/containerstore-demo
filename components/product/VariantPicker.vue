<template>
  <SFDropdown
    v-model="activeVariant"
    v-model:visible="isVariantListVisible"
    :items="variants"
    class="h-full"
    radius="xl"
    :disabled="hasOneVariantOnly"
    data-testid="variant-picker"
  >
    <span
      v-if="getFirstAttributeValue(activeVariant?.attributes, 'size')?.label"
      class="font-medium text-black"
      >{{
        getFirstAttributeValue(activeVariant?.attributes, 'size')?.label
      }}</span
    >
    <span v-else class="font-medium text-gray-500">{{
      $t('pdp.select_size')
    }}</span>
    <template #item="{ item, selectItem }">
      <button
        :disabled="item.stock.quantity === 0"
        class="group flex w-full cursor-pointer items-center justify-between space-x-2 rounded-xl border-b border-gray-200 p-2 transition-all last-of-type:border-none hover:bg-gray-200"
        @click="selectItem(item)"
      >
        <span class="flex items-center gap-3">
          <span
            class="size-4 rounded-full border border-gray-500 bg-white"
            :class="{
              'border-[5px] !border-accent': item.id === activeVariant?.id,
            }"
          />
          <span
            class="group-disabled:line-through"
            :class="
              item.id === activeVariant?.id ? 'text-black' : 'text-gray-500'
            "
          >
            {{ getFirstAttributeValue(item.attributes, 'size')?.label }}
          </span>
        </span>
        <ProductPrice
          v-if="item.stock.quantity !== 0"
          size="lg"
          :promotion="automaticDiscountPromotion"
          :price="item.price"
          type="normal"
        />
        <span v-else>{{ $t('global.sold_out') }}</span>
      </button>
    </template>
  </SFDropdown>
</template>

<script setup lang="ts">
import { defineModel } from 'vue'
import { getFirstAttributeValue, type Variant } from '@scayle/storefront-nuxt'
import SFDropdown from '~/modules/ui/runtime/components/form/Dropdown.vue'

type Props = {
  variants: Variant[]
  automaticDiscountPromotion: Promotion | null | undefined
  hasOneVariantOnly?: boolean
}

withDefaults(defineProps<Props>(), {
  hasOneVariantOnly: false,
})

const isVariantListVisible = defineModel<boolean>('visible', { default: false })

const activeVariant = defineModel<Variant>()
</script>
