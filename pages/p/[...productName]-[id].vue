<template>
  <AsyncDataWrapper :status="productDataStatus">
    <div
      class="flex flex-col items-start xl:container max-md:space-y-5 md:flex-row md:space-x-4"
    >
      <ProductGallery
        :product="product"
        class="md:sticky md:top-8 md:mr-4 md:w-1/2"
        product-image-slider-class="md:max-w-[528px]"
      />
      <div class="max-md:px-5 md:ml-32 md:w-1/2">
        <ProductBreadcrumbs
          v-if="longestCategoryList"
          class="mb-8 hidden md:block"
          :product-categories="longestCategoryList"
        />
        <div class="font-semi-bold-variable text-gray-900">{{ brand }}</div>
        <SFHeadline
          size="lg"
          class="text-md !font-normal text-gray-600 md:text-lg"
          data-testid="pdp-product-name"
          tag="h1"
        >
          {{ name }}
        </SFHeadline>
        <div class="my-3 flex space-x-4">
          <SFDropdown v-model="activeVariant" :items="product.variants ?? []">
            {{
              getFirstAttributeValue(activeVariant?.attributes, 'size')?.label
            }}
            <template #item="{ item, selectItem }">
              <div
                class="flex cursor-pointer items-center justify-between space-x-2"
                @click="selectItem(item)"
              >
                {{ getFirstAttributeValue(item.attributes, 'size')?.label }}
                <IconCheck
                  v-if="item.id === activeVariant?.id"
                  class="size-4"
                />
              </div>
            </template>
          </SFDropdown>
          <input v-model="quantity" type="number" />
        </div>
        <ProductPrice
          v-if="price"
          size="xl"
          class="mt-3"
          v-bind="{ product, lowestPriorPrice, price }"
          type="normal"
          show-tax-info
          show-price-reduction-badge
        />
        <SFButton :disabled="!activeVariant" @click="addToBasket"
          >Add to basket</SFButton
        >
        <div class="h-screen bg-slate-400">placeholder</div>
      </div>
    </div>
    <template #loading>
      <SFSkeletonLoader />
    </template>
  </AsyncDataWrapper>
</template>

<script setup lang="ts">
import { computed, defineOptions, ref } from 'vue'
import { getFirstAttributeValue, type Variant } from '@scayle/storefront-nuxt'
import {
  definePageMeta,
  useBasket,
  useProduct,
  useProductBaseInfo,
  useRoute,
} from '#imports'

definePageMeta({
  validate(route) {
    return typeof route.params.id === 'string' && /^\d+$/.test(route.params.id)
  },
})
defineOptions({ name: 'ProductDetail' })

const route = useRoute()
const productNumber = parseInt(route.params.id.toString())

const { data: product, status: productDataStatus } = useProduct({
  params: {
    id: productNumber,
  },
  options: {
    lazy: true,
    deep: false,
  },
  key: `productDetailPage-${route.params.id}`,
})
const activeVariant = ref<Variant>()
const quantity = ref(1)

const { name, brand, lowestPriorPrice, longestCategoryList } =
  useProductBaseInfo(product)

const price = computed(() =>
  activeVariant.value
    ? activeVariant.value.price
    : product.value?.priceRange?.min,
)

const { addItem } = useBasket()

const addToBasket = () => {
  if (!activeVariant.value) {
    return
  }
  addItem({
    variantId: activeVariant.value?.id,
    quantity: quantity.value,
  })
}
</script>
