<template>
  <SFSlideIn
    class="lg:hidden"
    :name="`wishlistcard_${wishlistItem.product.id}`"
    slide-type="fromBottom"
    slide-class="w-full xl:max-w-none h-auto xl:max-h-none top-auto left-0 p-0 pt-0"
  >
    <template #slide-in-content>
      <div>
        <div
          class="flex cursor-pointer justify-center py-3"
          @click="toggleFilter"
        >
          <IconAngleDown class="size-4" />
        </div>
        <div class="flex justify-end border-b border-b-secondary-700 px-5 pb-3">
          <div class="text-right">
            <strong class="block text-sm">
              {{ formatCurrency(price.withTax) }}
            </strong>
            <div class="text-xs text-secondary">
              {{ $t('price.including_vat') }}
            </div>
          </div>
        </div>
        <div class="px-5 pt-4">
          <SFRadioGroup :items="sizes" @update:model-value="selectRadioSize" />
        </div>
      </div>
    </template>
  </SFSlideIn>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { WishlistItem } from '@scayle/storefront-nuxt'
import { useWishlistItem, useWishlistItemActions } from '~/composables'
import { useFormatHelpers } from '#storefront/composables'

const props = defineProps<{ item: WishlistItem }>()

const { formatCurrency } = useFormatHelpers()

const wishlistItem = computed(() => props.item)

const { price, sizes } = useWishlistItem(wishlistItem)

const { toggleFilter, selectRadioSize } = useWishlistItemActions(wishlistItem)
</script>
