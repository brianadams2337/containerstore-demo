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
      class="absolute inset-10 w-[480px] overflow-auto rounded"
      :class="{
        'm-auto h-[230px]': !stores.length,
        'bg-secondary-400': stores.length,
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
            class="mr-2 flex size-12 cursor-pointer items-center justify-center border-2 border-black"
            type="ghost"
            :disabled="searching"
            @click="findStoresInUserLocation()"
          >
            <IconLocation class="size-8" />
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
            :disabled="!searchAddress?.length || searching"
            :loading="searching"
            @click="searchForStores()"
          >
            {{ $t('store_locator.buttons.search') }}
          </AppButton>
        </div>
      </div>
      <StoreList
        v-if="stores.length"
        v-model:selectedStoreId="selectedStoreId"
        :stores="stores"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
const config = useRuntimeConfig()
const googleMapsKey = config.public.googleMapsApiKey
const { storesData, refreshStores } = useStoreLocator()

const stores = computed(() => storesData.value ?? [])

const selectedStoreId = ref<number | undefined>(undefined)
const searching = ref<boolean>(false)

const searchAddress = ref('')
const searchRadius = ref(5000)

const searchForStores = async () => {
  searching.value = true
  try {
    await refreshStores({
      filters: { address: searchAddress.value, radius: searchRadius.value },
    })
  } catch {}

  searching.value = false
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

  try {
    await refreshStores({
      filters: {
        radius: 10000,
        geoPoint: {
          lat: coords.latitude,
          lng: coords.longitude,
        },
      },
    })
  } catch {}
  searching.value = false
}

const { t } = useI18n()
useSeoMeta({ robots: 'index,follow', title: t('navigation.location') })

defineOptions({ name: 'LocationPage' })
definePageMeta({ pageType: 'location_page' })
</script>
