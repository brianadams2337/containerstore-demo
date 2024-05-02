<template>
  <div>
    <div>
      <div
        class="mt-2 w-full justify-between py-2 text-xs font-medium text-primary opacity-50"
      >
        <p v-if="title">{{ title }}</p>
        <p v-if="name">{{ name }}</p>
      </div>
      <div>
        <ProductPrice
          data-test-id="wishlist-product-price"
          v-bind="{ price, lowestPriorPrice }"
          :product="item.product"
          type="whisper"
          size="sm"
          class="text-primary"
        />
      </div>
      <div v-if="isAvailable" class="hidden lg:block">
        <div
          v-if="!hasOneSizeVariantOnly && isChangingSize"
          :key="item.product.id"
          class="items-center space-x-2 py-4"
        >
          <ProductSizePicker
            :id="item.product.id"
            class="justify-center"
            :variants="item.product?.variants || []"
            :value="selectedSize?.value"
            @select-size="selectPickerSize"
            @click:outside="isChangingSize = false"
          />
        </div>
        <SFButton
          v-if="!hasOneSizeVariantOnly && !isChangingSize"
          data-test-id="wishlist-card-product-size"
          type="secondary"
          class="mr-2 mt-4"
          @click="isChangingSize = !isChangingSize"
        >
          {{ selectedSize?.label || $t('wishlist.change_size_label') }}
        </SFButton>
        <SFButton
          v-if="!isChangingSize"
          :disabled="sizeSavingId === item.product.id"
          data-test-id="wishlist-card-add-to-cart"
          class="mt-4"
          @click="addItemToCart(index)"
        >
          {{ $t('pdp.add_label') }}
        </SFButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { WishlistItem } from '@scayle/storefront-nuxt'

type Props = {
  index: number
  item: WishlistItem
  name?: string
  title?: string
}

const props = defineProps<Props>()

const wishlistItem = computed(() => props.item)

const {
  hasOneSizeVariantOnly,
  price,
  isAvailable,
  selectedSize,
  lowestPriorPrice,
} = useWishlistItem(wishlistItem)

const { addItemToCart, selectPickerSize, isChangingSize, sizeSavingId } =
  await useWishlistItemActions(wishlistItem)
</script>
