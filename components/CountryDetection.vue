<template>
  <SFModal v-model:visible="modalOpen">
    <div class="mt-8 flex flex-col items-center gap-4">
      <div>
        {{ $t('country_selection.prompt', { country: suggestedCountry }) }}
      </div>
      <div class="mt-8 flex flex-col items-center gap-3">
        <SFButton
          v-for="(shop, index) in suggestedShops"
          :key="shop.shopId"
          :autofocus="index === 0"
          type="primary"
          class="w-fit"
          @click="switchToShop(shop)"
          >{{
            $t('country_selection.switch_to_shop', {
              country: getShopCountryName(shop, suggestedShops.length > 1),
            })
          }}</SFButton
        >
        <SFButton type="secondary" class="w-fit" @click="stayInShop">{{
          $t('country_selection.stay_in_shop', { country: currentCountry })
        }}</SFButton>
      </div>
    </div>
  </SFModal>
</template>
<script lang="ts" setup>
import { computed, ref, onMounted } from 'vue'
import { useSessionStorage } from '@vueuse/core'
import { useNuxtApp } from '#app'
import { useSwitchLocalePath } from '#i18n'
import { useTrackingEvents } from '~/composables'
import {
  useUser,
  useAvailableShops,
  useCurrentShop,
} from '#storefront/composables'
import { getCurrentCountryFromTimezone } from '~/utils'

const trackingEvents = useTrackingEvents()
const switchLocalePath = useSwitchLocalePath()
const currentShop = useCurrentShop()
const availableShops = useAvailableShops()
const { isLoggedIn } = useUser()
const { $i18n } = useNuxtApp()

const hasPromptedUser = useSessionStorage<boolean>(
  'hasPromptedCountrySwitch',
  null,
  {
    serializer: {
      read: (value) => (value ? JSON.parse(value) : false),
      write: (value) => JSON.stringify(value),
    },
  },
)

interface ShopInfo {
  path?: string
  locale: string
  shopId: number
}

const suggestedShops = ref<ShopInfo[]>([])
const modalOpen = ref<boolean>()

const switchToShop = function (shop: ShopInfo) {
  modalOpen.value = false
  hasPromptedUser.value = true
  trackingEvents.trackShopChange()
  if (shop.path) {
    window.location.replace(switchLocalePath(shop.path).split('?')[0])
  }
}

const stayInShop = function () {
  modalOpen.value = false
  hasPromptedUser.value = true
}

/**
 * Get the shops matching a region code
 * @param region The two character region code to search for
 * @param fallbackShopId The shop ID to use if there is no match
 */
function getShopsForRegion(region: string, fallbackShopId?: number) {
  const shopsForRegion = availableShops.value.filter(
    (shop) => new Intl.Locale(shop.locale).region === region,
  )
  if (shopsForRegion.length === 0 && fallbackShopId) {
    return availableShops.value.filter((shop) => shop.shopId === fallbackShopId)
  }

  return shopsForRegion
}

const regionNames = new Intl.DisplayNames([currentShop.value.locale], {
  type: 'region',
})
const languageNames = new Intl.DisplayNames([currentShop.value.locale], {
  type: 'language',
})

const currentCountry = computed<string | undefined>(() => {
  return getShopCountryName(currentShop.value, false)
})

const suggestedCountry = ref<string | undefined>()

const getShopCountryName = (shop: ShopInfo, includeLanguage: boolean) => {
  const locale = new Intl.Locale(shop.locale)
  if (!locale.region) {
    return undefined
  }

  const regionOverride: string = $i18n.t(
    `country_selection.override_codes.${locale.region.toUpperCase()}`,
  )
  const regionName = regionOverride.startsWith('country_selection')
    ? regionNames.of(locale.region)
    : regionOverride

  if (includeLanguage && locale.language) {
    const languageName = languageNames.of(locale.language)
    return $i18n.t(`country_selection.country_with_language`, {
      country: regionName,
      language: languageName,
    })
  }

  return regionName
}

onMounted(async () => {
  // Do not show the country modal if the user is logged in or the user has already dismissed the modal
  if (isLoggedIn.value || hasPromptedUser.value) {
    return
  }

  const detectedRegion = getCurrentCountryFromTimezone()
  if (!detectedRegion) {
    return
  }

  // If the locale of the current shop matches the detected region => don't show the modal
  if (new Intl.Locale(currentShop.value.locale).region === detectedRegion) {
    return
  }

  const otherShops = getShopsForRegion(detectedRegion).filter(
    (shop) => shop.shopId !== currentShop.value.shopId,
  )

  if (otherShops.length) {
    suggestedShops.value = otherShops
    suggestedCountry.value = regionNames.of(detectedRegion)
    modalOpen.value = true
  }
})
</script>
