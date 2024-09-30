<template>
  <div class="mt-4 flex items-center rounded border border-gray-300 p-5">
    <div v-if="!!selectedStoreData">
      <div class="flex items-start space-x-2">
        <div
          class="mt-2 size-2 rounded-full"
          :class="{
            'bg-green-neon': selectedStoreData.available,
            'bg-red': !selectedStoreData.available,
          }"
        />
        <div class="flex flex-col">
          <div class="font-bold">
            {{
              selectedStoreData.available
                ? $t('store_locator.labels.available')
                : $t('store_locator.labels.not_available')
            }}
          </div>
          <div class="text-xs">
            {{ selectedStoreData.storeName }}
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <p class="font-bold text-black">
        {{ $t('store_locator.labels.store_availability') }}
      </p>
      <p class="text-xs text-primary">
        {{ $t('store_locator.labels.store_availability_subline') }}
      </p>
    </div>
    <SFButton
      data-testid="choose-store-button"
      type="secondary"
      class="ml-auto !normal-case"
      rounded
      @click="toggleStoreLocator"
    >
      {{
        selectedStoreId
          ? $t('store_locator.buttons.change_store')
          : $t('store_locator.buttons.choose_store')
      }}
    </SFButton>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useStoreLocator } from '#omnichannel/composables'
import { useSlideIn } from '#storefront-ui/composables'
import { SFButton } from '#storefront-ui/components'

interface Props {
  selectedStoreId: number | undefined
  variantId: number
}

interface StoreVariantInfo {
  available: boolean
  storeName: string
}

const { storeVariantData, refreshStoreVariant } = useStoreLocator(
  'useStoreLocator',
  ['openingTimes'],
)

const { toggle: toggleStoreLocator } = useSlideIn('StoreLocatorSlideIn')

const props = defineProps<Props>()

const selectedStoreData = computed<StoreVariantInfo | undefined>(() => {
  if (!storeVariantData.value) {
    return
  }

  return {
    available: !!storeVariantData.value.items.length,
    storeName: storeVariantData.value.name,
  }
})

watch(
  [() => props.selectedStoreId, () => props.variantId],
  ([storeId, variantId]) => {
    if (variantId && storeId) {
      refreshStoreVariant(variantId, storeId)
    }
  },
  { immediate: true },
)
</script>
