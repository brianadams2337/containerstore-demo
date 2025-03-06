<template>
  <SFLocalizedLink
    v-if="link"
    :aria-label="`${brand}, ${name}, ${color}, ${size}`"
    class="flex flex-col gap-1"
    raw
    :to="link"
  >
    <div class="flex gap-4">
      <SFProductImage
        v-if="product.images[0]"
        :image="product.images[0]"
        :alt="alt"
        :sizes="'80px'"
        class="size-20 max-h-20 overflow-hidden rounded-lg border"
      />
      <div class="flex flex-col gap-4">
        <div class="flex flex-col text-gray-900">
          <div class="text-base font-semi-bold-variable">{{ brand }}</div>
          <div class="text-sm">{{ name }}</div>
        </div>
        <ul class="flex flex-col gap-2 text-sm text-gray-600">
          <li v-if="color" class="flex gap-1">
            <span class="font-medium">{{ $t('osp.color') }}:</span>
            <span>{{ color }}</span>
          </li>

          <li v-if="size" class="flex gap-1">
            <span class="font-medium">{{ $t('osp.size') }}:</span>
            <span>{{ size }}</span>
          </li>

          <li class="flex gap-1">
            <span class="font-medium">{{ $t('osp.quantity_label') }}:</span>
            <span>{{ quantity }}</span>
          </li>
        </ul>
        <div v-if="subscription" class="flex flex-col gap-2">
          <div class="text-sm font-semi-bold-variable text-gray-900">
            {{ $t('osp.subscription.title') }}
          </div>
          <ul class="flex flex-col gap-2 text-sm text-gray-600">
            <li class="flex gap-1">
              <span class="font-medium"
                >{{ $t('osp.subscription.interval') }}:</span
              ><span>{{
                $t(
                  'osp.subscription.interval_keys.' +
                    subscription.subscriptionInterval,
                )
              }}</span>
            </li>
            <li class="flex gap-1">
              <span class="font-medium"
                >{{ $t('osp.subscription.follow_up_delivery') }}:</span
              ><span>{{
                $t(
                  'osp.subscription.delivery_keys.' +
                    subscription.subscriptionDeliveryDate,
                )
              }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="flex flex-col justify-end">
      <SFProductPrice
        :price="price"
        class="ml-auto"
        data-testid="basket-card-prices"
        :inline="false"
        :show-badges="true"
        :lowest-prior-price="lowestPriorPrice"
      />
    </div>
  </SFLocalizedLink>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  type AttributeGroup,
  type Attributes,
  getFirstAttributeValue,
  getAttributeValueTuples,
} from '@scayle/storefront-nuxt'
import { useI18n } from '#imports'
import SFProductPrice from '~/components/product/SFProductPrice.vue'
import SFProductImage from '~/components/product/SFProductImage.vue'
import SFLocalizedLink from '~/components/SFLocalizedLink.vue'
import type { OrderProduct, OrderVariant, OrderPrice } from '~/types/order'
import { useRouteHelpers } from '~/composables'
import { formatColors } from '~/utils'

const {
  product,
  variant,
  quantity = 1,
  price,
} = defineProps<{
  product: OrderProduct
  variant: OrderVariant
  quantity?: number
  price: OrderPrice
  subscription?: Record<string, string>
}>()

const { getProductDetailRoute } = useRouteHelpers()

const { t } = useI18n()

const name = computed(() => product.name)

const color = computed(() => {
  const attrs = mapAttributes(product.attributes)
  return getFirstAttributeValue(attrs, 'color')?.label
})

const brand = computed(() => {
  const attrs = mapAttributes(product.attributes)
  return getFirstAttributeValue(attrs, 'brand')?.label
})

const size = computed(() => variant.attributes?.size?.values.label)

const link = computed(() => {
  return product ? getProductDetailRoute(product.id, name.value) : undefined
})

const alt = computed(() => {
  return t('product_image.alt', {
    productName: name.value,
    colors: formatColors(getAttributeValueTuples(product.attributes, 'color')),
    brand: brand.value,
  })
})

const lowestPriorPrice = computed(() => variant.lowestPriorPrice)

const mapAttributes = (attributes: OrderProduct['attributes']): Attributes => {
  return Object.fromEntries(
    Object.entries(attributes).map(([k, v]) => {
      const val = { ...v, id: null, type: null } as AttributeGroup

      return [k, val]
    }),
  )
}
</script>
