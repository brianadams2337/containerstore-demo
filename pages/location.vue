<template>
  <div class="relative">
    <div class="h-[calc(100vh-220px)] w-full">
      <StoreLocatorMap
        v-model:selectedStoreId="selectedStoreId"
        :stores="stores"
        :api-key="googleMapsKey"
      />
    </div>
    <div
      class="absolute z-50 w-[480px] overflow-auto rounded"
      :class="{
        'inset-0 m-auto h-[230px]': !stores.length,
        'inset-10 bg-secondary-400': stores.length,
      }"
    >
      <div
        class="flex flex-col items-stretch justify-between rounded bg-white p-5"
        :class="{ 'shadow-[0_3px_24px_0_rgba(0,0,0,0.12)]': stores.length }"
      >
        <Headline :is-uppercase="false" size="xl" tag="p" class="mb-5"
          >{{ $t('store_locator.modal_headline') }}
        </Headline>
        <p class="mb-5 text-sm">{{ $t('store_locator.subline') }}</p>
        <div class="mt-3 flex items-center justify-evenly">
          <AppButton
            class="flex size-12 cursor-pointer items-center justify-center"
            type="ghost"
            :disabled="searching"
            @click="findStoresInUserLocation()"
          >
            <IconLocation />
          </AppButton>

          <TextInput
            v-model="searchAddress"
            class="mr-2"
            type="text"
            required
            :readonly="searching"
            :placeholder="$t('store_locator.input_placeholder')"
            @keydown.enter="
              !searching && searchAddress.length && searchForStores()
            "
          />
          <AppButton
            type="primary"
            class="ml-auto rounded border-4 border-black p-2 text-xs !normal-case"
            rounded
            :disabled="!searchAddress.length || searching"
            @click="searchForStores()"
          >
            {{ $t('store_locator.buttons.search') }}
          </AppButton>
        </div>
      </div>
      <div
        v-if="stores.length"
        class="overflow-hidden overflow-y-auto pb-0 scrollbar-hide"
      >
        <div class="mt-5 p-5">
          <div
            v-for="(store, index) in stores"
            :key="store.id"
            ref="storeContainers"
            class="mb-5 rounded border-2 bg-white p-5 text-sm"
            :class="{
              'border-primary': selectedStoreId === store.id,
              'border-gray-350': selectedStoreId !== store.id,
            }"
          >
            <SlideInStore
              v-bind="store"
              :index="index + 1"
              :opening-days="store.openingTimes"
              @click.prevent="selectedStoreId = store.id"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
const config = useRuntimeConfig()
const googleMapsKey = config.public.googleMapsApiKey
const { storesData, refreshStores } = useStoreLocator()

const stores = computed(() => storesData.value ?? [])

const selectedStoreId = ref<number | undefined>(undefined)
const searching = ref(false)

const searchAddress = ref('')
const searchRadius = ref(5000)

onMounted(() =>
  refreshStores({
    filters: { address: searchAddress.value, radius: searchRadius.value },
  }),
)

const searchForStores = () => {
  refreshStores({
    filters: { address: searchAddress.value, radius: searchRadius.value },
  })
}

const getClientLocation = (): Promise<GeolocationPosition> =>
  new Promise((resolve, reject) => {
    if (!('geolocation' in navigator)) {
      reject(new Error('Geolocation is not available.'))
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve(pos)
      },
      (err) => {
        reject(err)
      },
    )
  })

const findStoresInUserLocation = async () => {
  const { coords } = await getClientLocation()
  searchAddress.value = ''
  searching.value = true

  await refreshStores({
    filters: {
      radius: 10000,
      geoPoint: {
        lat: coords.latitude,
        lng: coords.longitude,
      },
    },
  })
  searching.value = false
}
</script>
