<template>
  <div
    class="px-5 text-2xl font-medium md:inset-x-0 md:m-auto md:max-w-screen-xl md:px-4"
  >
    <div class="md:divide-y">
      <SFAccordionEntry
        v-for="[key, values] in filteredAttributeGroups"
        :id="`${key}`"
        :key="key"
      >
        <template #title>
          <h2>
            {{ $t('pdp.information.' + key) }}
          </h2>
        </template>
        <div class="flex flex-col gap-2">
          <div v-if="key === 'design' && description" class="mb-2">
            {{ description }}
          </div>
          <ul v-for="value in values" :key="value">
            <li class="flex items-center gap-2 leading-none">
              <div class="size-1 rounded-full bg-black" />
              {{ value }}
            </li>
          </ul>
        </div>
      </SFAccordionEntry>
      <SFAccordionEntry
        id="product-details-shipping"
        :title="$t('pdp.shipping_return_heading')"
      >
        <div class="mb-8">{{ $t('pdp.shipping.general_info') }}</div>
        <div class="mb-1 font-semi-bold-variable">
          {{ $t('pdp.shipping.dhl_headline') }}
        </div>
        <div class="mb-8">{{ $t('pdp.shipping.dhl_paragraph') }}</div>
        <div class="mb-1 font-semi-bold-variable">
          {{ $t('pdp.shipping.hermes_headline') }}
        </div>
        <div class="mb-8">{{ $t('pdp.shipping.hermes_paragraph') }}</div>
        <div>{{ $t('pdp.shipping.return_information') }}</div>
      </SFAccordionEntry>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Product } from '@scayle/storefront-nuxt'
import { useProductBaseInfo } from '~/composables/useProductBaseInfo'
import { SFAccordionEntry } from '#storefront-ui/components'
import { getFilteredAttributeGroups } from '#storefront-product-detail'

const { product } = defineProps<{ product: Product }>()

const types = ['fit_size', 'extras', 'design']
const { description } = useProductBaseInfo(() => product)
const filteredAttributeGroups = computed(
  () =>
    product.attributes && getFilteredAttributeGroups(product.attributes, types),
)
</script>
