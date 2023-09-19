<template>
  <FadeInTransition>
    <div
      v-if="state === 'default'"
      class="w-full rounded border border-gray-350 p-4 text-sm lg:p-5">
      <div class="flex w-full" :class="{ 'opacity-50': !inStock }">
        <div
          class="flex w-28 items-center pr-3 lg:w-48 lg:p-0 lg:pr-6"
          @click.capture="selectItem">
          <DefaultLink :to="getProductDetailRoute(product)">
            <NuxtPicture
              :src="imageHash"
              :alt="name"
              provider="default"
              class="object-cover"
              sizes="xl:100vw lg:100vw lg:100vw lg:100vw xs:100vw" />
          </DefaultLink>
        </div>
        <div
          class="flex flex-1 flex-col justify-center gap-2 lg:flex-row lg:gap-0 lg:p-0">
          <div class="flex grow flex-col justify-between gap-2 lg:pt-4">
            <div @click.capture="selectItem">
              <DefaultLink :to="getProductDetailRoute(product)" class="block">
                <BasketCardDetail
                  v-if="brand && name"
                  :label="brand"
                  :value="name"
                  primary />
              </DefaultLink>
            </div>
            <BasketCardDetail
              v-if="size"
              :label="$t('basket_card.size_label')"
              :value="size" />
            <BasketCardDetail
              v-if="color"
              :label="$t('basket_card.color_label')"
              :value="color" />
            <div v-if="!inStock" class="flex gap-2 text-gray-800">
              <p class="pr-3">{{ $t('global.sold_out') }}</p>
            </div>
          </div>
          <div class="flex justify-between gap-2 lg:flex-col">
            <div>
              <Dropdown
                v-if="inStock"
                :model-value="quantity"
                :items="availableQuantity"
                @update:model-value="changeQuantity($event)" />
            </div>
            <div class="text-right font-bold">
              <div v-if="reducedPrice" class="line-through">
                {{ toCurrency(price + reducedPrice) }}
              </div>
              <div v-else>{{ toCurrency(price) }}</div>
              <div v-if="reducedPrice" class="text-red-500">
                {{ toCurrency(price) }}
              </div>
              <p
                v-if="
                  isLowestPreviousPriceActive &&
                  reducedPrice &&
                  lowestPriorPrice?.withTax &&
                  lowestPriorPrice?.relativeDifferenceToPrice
                "
                class="mt-0.5 text-sm text-gray-700">
                {{ $t('price.best_price_30d') }}
                {{ toCurrency(lowestPriorPrice.withTax) }}
                ({{ lowestPriorPrice.relativeDifferenceToPrice * 100 }})%
              </p>
              <p class="text-2xs font-medium opacity-50">
                {{ $t('incl_tax') }}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="flex justify-end pt-4">
        <BasketCardAction
          v-if="!isInWishlist"
          data-test-id="basket-add-to-wishlist-button"
          :class="{ 'absolute right-0 top-0 !p-4': viewport.isLessThan('lg') }"
          @click="addToWishlist">
          <template #icon="{ _class }">
            <IconHeart :class="_class" />
          </template>
          {{
            viewport.isGreaterOrEquals('lg')
              ? $t('basket_card.add_to_wishlist_label')
              : ''
          }}
        </BasketCardAction>

        <BasketCardAction
          v-if="isInWishlist"
          :class="{ 'absolute right-0 top-0 !p-4': !viewport.isLessThan('lg') }"
          data-test-id="basket-remove-from-wishlist-button"
          @click="removeFromWishlist">
          <template #icon="{ _class }">
            <IconHeartFull :class="_class" />
          </template>
          {{
            viewport.isGreaterOrEquals('lg')
              ? $t('basket_card.remove_from_wishlist_label')
              : ''
          }}
        </BasketCardAction>

        <BasketCardAction
          data-test-id="basket-remove-item-button"
          @click="onPressDelete">
          <template #icon="{ _class }">
            <IconCloseS :class="_class" />
          </template>
          {{ $t('basket_card.remove_label') }}
        </BasketCardAction>
      </div>
      <div v-if="addOnItems.length" class="ml-8 mt-8 overflow-hidden">
        <AddOnItems :items="addOnItems" />
      </div>
    </div>
    <BasketCardConfirmDelete
      v-else-if="state === 'confirmDelete' && imageHash"
      key="confirmDelete"
      :name="name ?? ''"
      :image-hash="imageHash"
      @click:confirm="onConfirmDelete"
      @click:cancel="onCancelDelete" />
  </FadeInTransition>
</template>

<script setup lang="ts">
import {
  BasketItem,
  getFirstAttributeValue,
  getTotalAppliedReductions,
  ExistingItemHandling,
  isInStock,
  getSizeFromVariant,
  getProductColors,
} from '@scayle/storefront-nuxt'
import { Action } from '~/constants'
// import useTrackingEvents from '~/composables/tracking/useTrackingEvents'

const _listingMetaData = {
  name: 'Basket List',
  id: 'BL',
}

const props = defineProps({
  item: {
    type: Object as PropType<BasketItem>,
    default: undefined,
  },
  index: {
    type: Number,
    required: true,
  },
  itemsGroup: {
    type: Array as PropType<BasketItem[]>,
    default: undefined,
  },
})

const { $i18n, $alert } = useNuxtApp()
const wishlist = await useWishlist()
const basket = await useBasket()
// const {
//   trackRemoveFromWishlist,
//   trackAddToWishlist,
//   trackAddToBasket,
//   trackRemoveFromBasket,
// } = useTrackingEvents()
const viewport = useViewport()
const currentShop = useCurrentShop()
const state = ref('default')

// const index = toRef(props, 'index')
const product = computed(() => mainItem.value!.product)
const variant = computed(() => mainItem.value!.variant)
const inStock = computed(() => isInStock(variant.value))
const name = computed(
  () => getFirstAttributeValue(product.value.attributes, 'name')?.label,
)
const brand = computed(
  () => getFirstAttributeValue(product.value.attributes, 'brand')?.label,
)
const size = computed(
  () => getSizeFromVariant(mainItem.value!.variant, 'size')?.label,
)
const color = computed(() =>
  getProductColors(mainItem.value!.product, 'color').join('/'),
)

const imageHash = computed(
  () =>
    getImageFromList(
      mainItem.value!.product.images,
      ProductImageType.BUST,
      'front',
    )?.hash,
)

const mainItem = computed(() => {
  return props.itemsGroup
    ? props.itemsGroup.find((item) => item.itemGroup?.isMainItem)
    : props.item
})

const addOnItems = computed(() =>
  props.itemsGroup
    ? props.itemsGroup.filter((item) => !item.itemGroup?.isMainItem)
    : [],
)

const reducedPrice = computed(() => {
  const total = mainItem.value?.price.total
  if (!total) {
    return
  }
  return getTotalAppliedReductions(total)?.absoluteWithTax
})

const price = computed(() => mainItem.value?.price.total.withTax ?? 0)
const lowestPriorPrice = computed(
  () => mainItem.value?.variant.lowestPriorPrice,
)
const quantity = computed(() => mainItem.value?.quantity)
const availableQuantity = computed(() => {
  const quantity = Math.max(
    Math.min(mainItem.value?.availableQuantity || 0, 9),
    0,
  )

  return Array.from({ length: quantity }, (_, i) => i)
})
const isInWishlist = computed(() =>
  wishlist.contains({
    productId: product.value.id,
  }),
)

const addToWishlist = async () => {
  if (!mainItem.value) {
    return
  }
  const { product } = mainItem.value
  // const { product, _variant, _quantity = 1 } = mainItem.value
  // trackAddToWishlist({
  //   product,
  //   variant,
  //   quantity,
  //   listingMetaData,
  //   index: index.value,
  //   pagePayload: {
  //     content_name: route.value.fullPath,
  //     page_type: store.state.pageType,
  //     page_type_id: params.value.id?.toString() || '',
  //   },
  // })

  await wishlist.addItem({ productId: product.id })
  const message = $i18n.t('wishlist.notification.add_to_wishlist', {
    productName: name.value || $i18n.t('wishlist.product'),
  })
  $alert.show(message, Action.ROUTE, '/wishlist')
}

const removeFromWishlist = async () => {
  const productName = name.value || $i18n.t('wishlist.product')
  const message = $i18n.t('wishlist.notification.remove_from_wishlist', {
    productName,
  })
  // trackRemoveFromWishlist({
  //   product: product.value,
  //   variant: variant.value,
  //   quantity: quantity.value,
  //   index: index.value,
  //   listingMetaData: { ...listingMetaData, index: index.value },

  //   pagePayload: {
  //     content_name: route.value.fullPath,
  //     page_type: store.state.pageType,
  //     page_type_id: params.value.id?.toString() || '',
  //   },
  // })

  const data = wishlist.findItem({ variantId: variant.value.id })
    ? { variantId: variant.value.id }
    : { productId: product.value.id }

  await wishlist.removeItem(data)

  $alert.show(message, Action.CONFIRM)
}

const emit = defineEmits(['item:remove', 'item:select'])

const removeItem = () => emit('item:remove', mainItem.value)

const selectItem = () => emit('item:select', mainItem.value)

const onPressDelete = () => {
  state.value = 'confirmDelete'
}

const onCancelDelete = () => {
  state.value = 'default'
}

const onConfirmDelete = () => {
  state.value = 'default'
  removeItem()
}

const changeQuantity = async (newQuantity: number) => {
  if (newQuantity === 0) {
    return onPressDelete()
  }
  const basketItem = basket.findItem({ variantId: variant.value.id })
  if (!basketItem) {
    return
  }

  if (basketItem.quantity < newQuantity) {
    console.log('track add to basket')
    // trackAddToBasket({
    //   product: product.value,
    //   quantity: newQuantity - basketItem.quantity,
    //   variant: variant.value,
    //   index: index.value,
    //   list: listingMetaData,
    // })
  } else if (basketItem.quantity > newQuantity) {
    console.log('track remove from basket')
    // trackRemoveFromBasket(
    //   product.value,
    //   basketItem.quantity - newQuantity,
    //   variant.value,
    //   index.value,
    // )
  }

  await basket.addItem({
    variantId: variant.value.id,
    quantity: newQuantity,
    existingItemHandling: ExistingItemHandling.ReplaceExisting,
  })
}

const isLowestPreviousPriceActive = computed(
  () => !!currentShop.value?.isLowestPreviousPriceActive,
)
</script>
