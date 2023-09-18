<template>
  <div>
    <!-- desktop tabular -->
    <div v-if="md" class="mt-10 xl:w-[827px]">
      <div
        class="relative box-border flex h-12 justify-between rounded-md border border-gray-350">
        <div
          class="absolute h-full w-1/3 rounded-md border border-gray-900 transition-all duration-300 ease-in-out"
          :style="{ left: slidingWindowOffset + '%' }" />
        <ProductDetailTabHeading
          v-for="(tab, idx) in tabs"
          :key="tab"
          :heading="$t(tab)"
          :is-active="selectedIndex === idx"
          @click:tab="selectedIndex = idx" />
      </div>
      <div class="mt-9 min-h-2xs leading-normal md:text-xs">
        <ProductDescription
          v-if="tabs[selectedIndex] === 'pdp.product_info_heading'"
          :product-description-info="productDescriptionInfo"
          :product-infos="productInfos"
          :fit-infos="fitInfos" />
        <ProductCompositionAndCare
          v-if="tabs[selectedIndex] === 'pdp.composition_care_heading'"
          :material-info="materialInfo"
          :care-info="careInfo" />
        <ProductShippingAndReturn
          v-if="tabs[selectedIndex] === 'pdp.shipping_return_heading'" />
      </div>
    </div>

    <!-- mobile accordion -->
    <div v-else class="mx-auto max-w-6xl md:mx-0">
      <!-- <div class="max-w-3xl">
        <div class="divide-y divide-gray-300">
          <ProductDetailAccordionEntry :title="$t('pdp.product_info_heading')">
            <ProductDescription
              :product-description-info="productDescriptionInfo"
              :product-infos="productInfos"
              :fit-infos="fitInfos" />
          </ProductDetailAccordionEntry>
          <ProductDetailAccordionEntry
            :title="$t('pdp.composition_care_heading')">
            <ProductCompositionAndCare
              :material-info="materialInfo"
              :care-info="careInfo" />
          </ProductDetailAccordionEntry>
          <ProductDetailAccordionEntry
            :title="$t('pdp.shipping_return_heading')">
            <ProductShippingAndReturn />
          </ProductDetailAccordionEntry>
        </div>
      </div> -->
      MOBILE PRODUCT DETAILS
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  getAttributeValueTuples,
  getFirstAttributeValue,
  getFlattenedMaterialComposition,
  flattenFieldSet,
  Product,
} from '@scayle/storefront-nuxt'

const props = defineProps({
  product: {
    type: Object as PropType<Product | null>,
    default: () => null,
  },
})

const productInfos = computed(() => {
  const keys = [
    'productDescription',
    'fastenerType',
    'design',
    'extras',
    'material',
    'print',
  ]

  return keys
    .map((key) => getAttributeValueTuples(props.product?.attributes, key))
    .filter((entry) => !!entry && !!entry.length)
    .map((entry) => entry.map((item) => item?.label).join(', '))
})

const fitInfos = computed(() => {
  const keys = [
    'fitting',
    'upperLength',
    'sleeveLength',
    'shirtCut',
    'shortsLength',
    'trousersLength',
    'trousersCut',
    'skirtLength',
    'neckline',
  ]

  const result: Record<string, any> = {}

  keys.forEach((key) => {
    result[key] = getFirstAttributeValue(props.product?.attributes, key)?.label
  })

  return result
})

const materialInfo = computed(() => {
  return getFlattenedMaterialComposition(
    props.product?.advancedAttributes?.materialCompositionTextile?.values || [],
  ).map((entry: any) => {
    return {
      materialGroupName: entry?.materialGroupName,
      values: entry?.values
        .map((value: any) => `${value.value}${value.unit} ${value.material}`)
        .join(', '),
    }
  })
})

const productDescriptionInfo = computed(() => {
  if (
    props.product?.advancedAttributes?.productDescription?.values[0].fieldSet
  ) {
    return flattenFieldSet(
      props.product?.advancedAttributes?.productDescription?.values[0].fieldSet,
      // @ts-ignore
    )[0].value
  }
})

const careInfo = computed(() =>
  getAttributeValueTuples(props.product?.attributes, 'careInstructions'),
)
const tabs = [
  'pdp.product_info_heading',
  'pdp.composition_care_heading',
  'pdp.shipping_return_heading',
]
const selectedIndex = ref(0)
const slidingWindowOffset = computed(
  () => (100 / tabs.length) * selectedIndex.value,
)

const { isGreaterOrEquals } = useViewport()
const md = computed(() => isGreaterOrEquals('md'))
</script>
