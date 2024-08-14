<template>
  <div>
    <!-- desktop tabular -->
    <div class="mt-10 hidden sm:block xl:w-[827px]">
      <div
        class="relative box-border flex h-12 justify-between rounded-md border border-gray-350"
      >
        <div
          class="absolute h-full w-1/3 rounded-md border border-gray-900 transition-all duration-300 ease-in-out"
          :style="{ left: slidingWindowOffset + '%' }"
        />
        <ProductDetailTabHeading
          v-for="(tab, idx) in tabs"
          :key="tab"
          :heading="$t(tab)"
          :is-active="selectedIndex === idx"
          @click:tab="selectedIndex = idx"
        />
      </div>
      <div class="mt-9 min-h-2xs leading-normal md:text-xs">
        <ProductDescription
          v-if="tabs[selectedIndex] === 'pdp.product_info_heading'"
          v-bind="{ description, baseInfos, fitInfos }"
        />
        <ProductCompositionAndCare
          v-if="tabs[selectedIndex] === 'pdp.composition_care_heading'"
          v-bind="{ materialInfo, careInfo }"
        />
        <ProductShippingAndReturn
          v-if="tabs[selectedIndex] === 'pdp.shipping_return_heading'"
        />
      </div>
    </div>

    <!-- mobile accordion -->
    <div class="mx-auto max-w-6xl sm:hidden md:mx-0">
      <div class="max-w-3xl">
        <div class="divide-y divide-gray-300">
          <ProductDetailAccordionEntry :title="$t('pdp.product_info_heading')">
            <ProductDescription v-bind="{ description, baseInfos, fitInfos }" />
          </ProductDetailAccordionEntry>
          <ProductDetailAccordionEntry
            :title="$t('pdp.composition_care_heading')"
          >
            <ProductCompositionAndCare v-bind="{ materialInfo, careInfo }" />
          </ProductDetailAccordionEntry>
          <ProductDetailAccordionEntry
            :title="$t('pdp.shipping_return_heading')"
          >
            <ProductShippingAndReturn />
          </ProductDetailAccordionEntry>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { PropType } from 'vue'
import {
  type Product,
  flattenFieldSet,
  getAttributeValueTuples,
  getFirstAttributeValue,
  getFlattenedMaterialComposition,
} from '@scayle/storefront-nuxt'
import type { MaterialInfo } from '~/components/product/detail/ProductCompositionAndCare.vue'

const props = defineProps({
  product: {
    type: Object as PropType<Product | null>,
    default: null,
  },
})

const baseInfos = computed(() => {
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

  const result: Record<string, string> = {}

  keys.forEach((key) => {
    const value = getFirstAttributeValue(props.product?.attributes, key)?.label
    if (value) {
      result[key] = value
    }
  })

  return result
})

const materialInfo = computed<MaterialInfo[]>(() => {
  return getFlattenedMaterialComposition(
    props.product?.advancedAttributes?.materialCompositionTextile?.values || [],
  ).map((entry) => {
    return {
      materialGroupName: entry?.materialGroupName ?? '',
      values: entry.values
        .map((value) => `${value.value}${value.unit} ${value.material}`)
        .join(', '),
    }
  })
})

const description = computed(() => {
  if (
    !props.product?.advancedAttributes?.productDescription?.values[0].fieldSet
  ) {
    return
  }

  return flattenFieldSet(
    props.product?.advancedAttributes?.productDescription?.values[0].fieldSet,
    // @ts-expect-error Property 'value' does not exist on type '{ [key: string]: string | number | null | undefined; }[]'. Did you mean 'values'? ts-plugin(2551)
  )[0].value
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
</script>
