<template>
  <section>
    <label
      v-if="label"
      class="mb-3 mt-1 block text-sm font-semibold"
      :for="`${label}-product-list`"
    >
      {{ label }}
    </label>
    <ul :id="`${label}-product-list`" class="space-y-2.5">
      <SearchResultItem
        v-for="item in items"
        :key="item.productSuggestion.product.id"
        :to="
          getProductDetailRoute(
            item.productSuggestion.product.id,
            getSuggestionName(item),
          )
        "
        :image-url="getImageUrl(item)"
        @click:result="emit('click:result', item)"
      >
        <div class="w-full overflow-hidden">
          <div class="truncate text-2xs font-medium text-secondary">
            {{ getCategoryName(item) }}
          </div>
          <div class="flex overflow-hidden text-sm font-semibold text-primary">
            <div class="shrink truncate">
              {{ getSuggestionName(item) }}
            </div>
            <div
              v-if="item.productSuggestion.product.priceRange"
              class="ml-auto shrink-0"
            >
              {{
                formatCurrency(
                  item.productSuggestion.product.priceRange.min.withTax,
                )
              }}
            </div>
          </div>
        </div>
      </SearchResultItem>
    </ul>
  </section>
</template>

<script setup lang="ts">
import type { ProductSearchSuggestion } from '@scayle/storefront-nuxt'
import SearchResultItem from './SearchResultItem.vue'
import { getFirstModelImage } from '~/utils/image'
import { useRouteHelpers } from '~/composables/useRouteHelpers'
import { useFormatHelpers } from '#storefront/composables'
import { getSuggestionName } from '~/utils/search'

type Props = {
  label: string
  items: ProductSearchSuggestion[]
  showImages?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  items: () => [],
  showImages: false,
})

const { formatCurrency } = useFormatHelpers()
const { getProductDetailRoute } = useRouteHelpers()

const getCategoryName = ({ productSuggestion }: ProductSearchSuggestion) => {
  return productSuggestion.product.categories?.[0]?.at(-1)?.categoryName
}

const getImageUrl = ({ productSuggestion }: ProductSearchSuggestion) => {
  return props.showImages
    ? getFirstModelImage(productSuggestion.product.images).hash
    : ''
}

const emit = defineEmits<{
  'click:result': [value: ProductSearchSuggestion]
}>()
</script>
