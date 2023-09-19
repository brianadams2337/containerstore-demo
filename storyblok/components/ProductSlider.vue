<template>
  <div v-editable="blok" :class="marginClasses">
    <div class="flex w-full justify-between px-5 sm:px-14">
      <Headline v-if="blok.headline" tag="p" size="base" type="loud">
        {{ blok.headline }}
      </Headline>

      <DefaultLink v-if="blok.cta_url && blok.cta_label" :to="blok.cta_url">
        {{ blok.cta_label }}
      </DefaultLink>
    </div>

    <HorizontalItemsSlider
      class="mt-4"
      with-arrows
      data-test-id="horizontal-product-slider">
      <Product
        v-for="product in products"
        :key="`product-slider-item-${product.id}`"
        class="box-content w-1/2 shrink-0 snap-start snap-always px-px first:pl-5 last:pr-5 sm:w-1/5 sm:px-0.5 sm:first:pl-14 sm:last:pr-14"
        :product="product"
        :fetching="fetching" />

      <template #prev-button="{ prev, isPrevEnabled }">
        <button
          class="absolute left-0 top-[40%] rounded-sm bg-black text-white disabled:hidden sm:left-14"
          :disabled="!isPrevEnabled"
          @click="prev(sliderOffset)">
          <IconArrowLeft class="h-8 w-8 p-1.5" />
        </button>
      </template>
      <template #next-button="{ next, isNextEnabled }">
        <button
          class="absolute right-0 top-[40%] rounded-sm bg-black text-white disabled:hidden sm:right-14"
          :disabled="!isNextEnabled"
          @click="next(sliderOffset)">
          <IconArrowRight class="h-8 w-8 p-1.5" />
        </button>
      </template>
    </HorizontalItemsSlider>
  </div>
</template>

<script setup lang="ts">
import useStoryblokMargins from '../composables/useStoryblokMargins'
import { SbProductSlider } from '~/storyblok/types/storyblok'

const props = defineProps({
  blok: {
    type: Object as PropType<SbProductSlider>,
    required: true,
  },
})

const { marginClasses } = useStoryblokMargins(props.blok as any)
// const { md } = useBreakpoints()
const md = ref(true)
const sliderOffset = computed(() => (md.value ? 56 : 20))

// const listingMetaData = {
//   name: `ProductSlider-${props.blok.headline}`,
//   id: 'PS',
// }

const productIds = computed(
  () => props.blok.product_ids?.split(',').map((id: string) => parseInt(id)),
)

const { data, fetch, fetching } = await useProductsByIds(
  {
    ids: productIds.value || [],
    with: {
      attributes: {
        withKey: ['color', 'brand', 'name'],
      },
      variants: {
        attributes: {
          withKey: ['price', 'size'],
        },
        lowestPriorPrice: true,
      },
      images: {
        attributes: {
          withKey: ['imageType', 'imageView', 'imageBackground', 'imageKind'],
        },
      },
      priceRange: true,
      lowestPriorPrice: true,
    },
  },
  undefined,
  `productSlider-${props.blok._uid}`,
)

onMounted(() => fetch())

// const fetchProducts = async () => {
//   if (productIds.value) {
//     try {
//       await fetchProductsFromBapi({
//         ids: productIds.value,
//         with: {
//           attributes: {
//             withKey: ['color', 'brand', 'name'],
//           },
//           variants: {
//             attributes: {
//               withKey: ['price', 'size'],
//             },
//             lowestPriorPrice: true,
//           },
//           images: {
//             attributes: {
//               withKey: [
//                 'imageType',
//                 'imageView',
//                 'imageBackground',
//                 'imageKind',
//               ],
//             },
//           },
//           priceRange: true,
//           lowestPriorPrice: true,
//         },
//       })
//     } catch (err) {
//       console.error('Error fetching products by ids', err)
//     }
//   }
// }

// useAsync(() => fetchProducts())

// const trackingCollector = ref<ProductType[]>([])

// const { trackSelectItem, trackViewItemList } = useTrackingEvents()

// const trackProductClick = ({
//   product,
//   index,
// }: {
//   product: ProductType
//   index: number
// }) => {
//   const category = getLatestCategory(product.categories)
//   if (category) {
//     trackSelectItem({
//       product,
//       category: {
//         name: category?.categoryName || '',
//         id: category?.categoryId,
//       },
//       listingMetaData,
//       index,
//       source: `${
//         route.value.fullPath === '/' ? 'home' : route.value.name
//       }|ProductSlider|${props.blok.headline}`,
//       pagePayload: {
//         content_name: route.value.fullPath,
//         page_type: store.state.pageType,
//         page_type_id: contextParams.value.id?.toString() || '',
//       },
//     })
//   }
// }

// const columns = computed(() => (md.value ? 5 : 2))

// const trackIntersection = ({
//   product,
//   index,
// }: {
//   product: any
//   index: number
// }) => {
//   const isTracked =
// trackingCollector.value.findIndex((p) => p.id === product.id) !== -1
//   const isFirstItemInRow = isFirstIndexOfRow(index, columns.value)
// Threat slider as a special case of product list, track all interesected items at once
// But instead of checking is row tracked, check per product
//   if (isFirstItemInRow && !isTracked) {
//     const itemsInSliderRow = [...(data.value || [])]
//       .slice(index, index + columns.value)
//       .map((item, idx) => ({ ...item, index: index + idx }))
//     trackViewItemList({
//       items: itemsInSliderRow,
//       listingMetaData,
//       source: `${
//         route.value.fullPath === '/' ? 'home' : route.value.name
//       }|ProductSlider|${props.blok.headline}`,
//     })
//     trackingCollector.value.push(...itemsInSliderRow)
//   }
// }

const products = computed(() => data.value)
</script>
