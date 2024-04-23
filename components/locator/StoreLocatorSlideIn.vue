<template>
  <SlideIn
    name="StoreLocatorSlideIn"
    slide-class="border-t border-l border-primary xl:inset-y-0 !p-0 bg-secondary-50"
  >
    <template #slide-in-header="{ toggle: toggleItem }">
      <div class="bg-white p-5 shadow-[0_3px_24px_0_rgba(0,0,0,0.12)]">
        <div class="flex items-center justify-between">
          <Headline :is-uppercase="false" size="lg" tag="p"
            >{{ $t('store_locator.headline') }}
          </Headline>
          <AppButton
            type="ghost"
            size="xs"
            data-test-id="closeCross"
            @click="toggleItem"
          >
            <template #icon="{ _class }">
              <IconCloseBold :class="_class" />
            </template>
          </AppButton>
        </div>
        <div>
          <p class="mt-5 text-xs">{{ $t('store_locator.subline') }}</p>
        </div>
        <div class="mt-3 flex items-center justify-center gap-4">
          <TextInput
            v-model="address"
            autocomplete="username"
            :placeholder="$t('store_locator.input_placeholder')"
            type="text"
            required
          />
          <AppButton
            data-test-id="choose-store-button"
            type="primary"
            class="ml-auto rounded border border-black p-2 text-xs !normal-case"
            rounded
            :disabled="!address.length"
            @click="searchStore"
          >
            {{ $t('store_locator.buttons.search') }}
          </AppButton>
        </div>
      </div>
    </template>
    <template #slide-in-body>
      <div class="max-h-[calc(100%-250px)] overflow-y-auto scrollbar-hide">
        <div v-if="!stores.length" class="p-5">
          {{ $t('store_locator.no_results') }}
        </div>
        <StoreList
          v-else
          v-model:selectedStoreId="currentSelectedStoreId"
          :stores="stores"
          class="mt-5"
        />
        <div />
      </div>
    </template>
    <template #slide-in-actions>
      <AppButton
        data-test-id="choose-store-button"
        type="primary"
        is-full-width
        class="w-fit rounded border border-black p-2 text-xs !normal-case"
        rounded
        :disabled="stores.length === 0 || currentSelectedStoreId === undefined"
        @click="selectStore"
      >
        {{ $t('store_locator.buttons.select_store') }}
      </AppButton>
    </template>
  </SlideIn>
</template>

<script setup lang="ts">
import type { StoreLocation } from '@scayle/omnichannel-nuxt'

interface Props {
  variantId: number
}

const props = defineProps<Props>()

const { variantStoresData, refreshVariantStores } = useStoreLocator()
const { toggle: toggleStoreLocator } = useSlideIn('StoreLocatorSlideIn')

const address = ref('')

const selectedStoreId = defineModel<number | undefined>('selectedStoreId', {
  type: Number,
  default: undefined,
})

const currentSelectedStoreId = ref<number | undefined>(undefined)

const searchStore = async () => {
  await refreshVariantStores({
    variantId: props.variantId,
    filters: { address: address.value },
  })
}

const stores = computed(
  () => (variantStoresData.value?.stores as StoreLocation[]) ?? [],
)

const selectStore = () => {
  selectedStoreId.value = currentSelectedStoreId.value
  toggleStoreLocator()
}
</script>
