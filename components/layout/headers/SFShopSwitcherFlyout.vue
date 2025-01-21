<template>
  <SFSlideIn name="ShopSwitcherSlideIn">
    <template #slide-in-header="">
      <div class="flex w-full items-center justify-between">
        <SFHeadline
          class="!font-semi-bold-variable md:text-lg"
          size="xl"
          tag="p"
        >
          <IconGlobe class="size-6" />
          {{ $t('shop_selector.flyout_title') }}
        </SFHeadline>
        <SFButton
          class="my-3 -mr-2 bg-gray-100 md:bg-transparent"
          fab
          variant="raw"
          data-testid="close-shopswitcher"
          @click="close"
        >
          <template #icon>
            <IconClose class="size-5 md:size-4 md:text-gray-400" />
          </template>
        </SFButton>
      </div>
    </template>
    <template #slide-in-body>
      <div class="flex flex-col overflow-hidden p-5 lg:w-96" role="menu">
        <div v-if="availableLanguages.length > 1" class="mb-5">
          <div class="mb-4 text-md font-semi-bold-variable">
            {{ $t('shop_selector.choose_language') }}
          </div>
          <div class="grid grid-cols-2 gap-5">
            <SFButton
              v-for="shop in availableLanguages"
              :key="shop.id"
              :variant="
                shop.locale.split('-')[0] === currentLanguage
                  ? 'accent'
                  : 'secondary'
              "
              @click="changeShop(shop.path, shop.locale, close)"
            >
              {{ languageTranslator.of(shop.locale.split('-')[0]) }}
            </SFButton>
          </div>
        </div>
        <div
          v-if="availableCountries.length > 1"
          class="flex flex-col overflow-hidden"
        >
          <div class="mb-4 text-md font-semi-bold-variable">
            {{ $t('shop_selector.choose_country') }}
          </div>
          <div class="grid grid-cols-1 gap-2 overflow-auto p-1">
            <SFButton
              v-for="country in availableCountries"
              :key="country.shop.id"
              variant="secondary"
              class="!justify-start"
              @click="
                country.code === currentRegion
                  ? close()
                  : changeShop(country.shop.path, country.shop.locale, close)
              "
            >
              <span :class="{ 'font-bold': country.code === currentRegion }">{{
                country.name
              }}</span>
              <IconCheck
                v-if="country.code === currentRegion"
                class="ml-auto size-4 text-accent"
              />
            </SFButton>
          </div>
        </div>
      </div>
    </template>
  </SFSlideIn>
</template>
<script lang="ts" setup>
import { computed } from 'vue'
import { useSwitchLocalePath, useI18n } from '#i18n'
import { SFSlideIn, SFHeadline, SFButton } from '#storefront-ui/components'
import { useSlideIn } from '#storefront-ui/composables'
import { useCurrentShop, useAvailableShops } from '#storefront/composables'
import { useTrackingEvents } from '~/composables/useTrackingEvents'

const { close } = useSlideIn('ShopSwitcherSlideIn')
const currentShop = useCurrentShop()
const availableShops = useAvailableShops()

const switchLocalePath = useSwitchLocalePath()

const { trackShopChange } = useTrackingEvents()

const currentLanguage = computed(() => currentShop.value?.locale.split('-')[0])
const currentRegion = computed(() => currentShop.value?.locale.split('-')[1])

const languageTranslator = computed(() => {
  if (!currentShop.value) {
    return
  }
  return new Intl.DisplayNames([currentShop.value.locale], { type: 'language' })
})

const regionTranslator = computed(() => {
  if (!currentShop.value) {
    return
  }
  return new Intl.DisplayNames([currentShop.value.locale], { type: 'region' })
})

const availableLanguages = computed(() => {
  return availableShops.value.filter((shop) =>
    shop.locale.endsWith('-' + currentRegion.value),
  )
})

const availableCountries = computed(() => {
  const grouped = Object.groupBy(
    availableShops.value,
    (shop) => shop.locale.split('-')[1],
  )

  return (
    Object.entries(grouped)
      // .filter(([regionCode]) => regionCode !== currentRegion.value)
      .map(([regionCode, shops]) => ({
        name: regionTranslator.value.of(regionCode),
        code: regionCode,
        shop: shops[0],
      }))
      .toSorted((a, b) =>
        a.name.localeCompare(b.name, currentShop.value.locale),
      )
  )
})

const { switchToHomePage = true } = defineProps<{
  switchToHomePage?: boolean
}>()
const i18n = useI18n()

/**
 * Updates the shop's locale to the specified value.
 * If `locale` matches the current locale, the function will exit early and close the dropdown.
 */
const changeShop = (path?: string, locale?: string, close?: () => void) => {
  if (!path) {
    throw new Error('Shop has no path configured')
  }

  if (locale === currentShop.value.locale) {
    close?.()
    return
  }

  trackShopChange()
  if (switchToHomePage) {
    if (i18n.differentDomains) {
      // When `i18n.differentDomains` is true, `switchLocalePath()` will return a full URL.
      // We only need the origin to redirect to the home page.
      const { origin } = new URL(switchLocalePath(path as Locale))
      window.location.replace(`${origin}`)
    } else {
      // For path based shop selection, the homepage is under `/<shopPath>`. We just redirect to the passed path.
      window.location.replace(`/${path}`)
    }
  } else {
    // When `i18n.differentDomains` is false we preserve the current path and only change the origin or shop path using `switchLocalePath()`
    const newLocalePath = switchLocalePath(path as Locale).split('?')[0]
    window.location.replace(newLocalePath)
  }
}
</script>
