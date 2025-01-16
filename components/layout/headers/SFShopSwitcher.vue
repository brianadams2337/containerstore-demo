<template>
  <SFListbox :value="currentShop?.path" class="shrink-0 max-lg:py-2">
    <template #default="{ isOpen, toggleListboxOpen }">
      <SFListboxButton
        ref="button"
        :listbox-button-aria-id="listboxButtonAriaId"
        :toggle-listbox-open="toggleListboxOpen"
        :is-open="isOpen"
        :aria-label="
          $t('shop_selector.aria_label', {
            selectedCountry,
            selectedLanguage,
          })
        "
        class="h-full gap-1.5 px-2 !text-gray-600 -outline-offset-5 hover:bg-indigo-200/10 focus-visible:shadow-inner-solid lg:!text-white"
        data-testid="language-listbox"
      >
        <IconGlobe
          class="size-5 lg:size-3.5"
          data-testid="shop-switcher-globe-icon"
        />
        <div
          class="text-[15px] lg:text-sm"
          data-testid="shop-switcher-current-shop"
        >
          {{ getShopName(currentShop.locale, multipleShopsForCountry) }}
        </div>
        <IconChevronDown
          class="size-3.5 transition-all"
          data-testid="shop-icon-chevron"
          :class="{ 'rotate-180': isOpen }"
        />
      </SFListboxButton>
    </template>
    <template #options="{ isOpen, toggleListboxOpen, close }">
      <SFListboxOptions
        v-if="isOpen"
        :id="listboxButtonAriaId"
        class="absolute z-60 flex max-h-[80vh] flex-col gap-1 overflow-y-auto rounded-10 bg-white p-2 shadow-md max-lg:bottom-0 max-lg:w-full max-lg:border-t lg:right-0 lg:top-0 lg:max-h-64"
        data-testid="shop-selector-list"
      >
        <div class="-mx-2 flex flex-col gap-1 border-b px-4 py-2 lg:hidden">
          <div class="flex">
            <div class="text-2xl font-semi-bold-variable">
              {{ $t('shop_selector.choose_shop') }}
            </div>
            <SFButton variant="raw" class="ml-auto" @click="close">
              <IconClose class="size-5 text-gray-400" />
            </SFButton>
          </div>
          <div class="text-base">
            <span class="font-semi-bold-variable">
              {{ $t('shop_selector.current_shop') }}:
            </span>
            <span
              class="text-gray-600"
              data-testid="shop-switcher-current-shop-mobile"
            >
              {{ getShopName(currentShop.locale, multipleShopsForCountry) }}
            </span>
          </div>
        </div>
        <SFListboxOption
          v-for="{ shopId, path, locale } in availableShops"
          :key="shopId"
          :toggle-listbox-open="toggleListboxOpen"
        >
          <SFShopSwitcherItem
            :key="`${locale}-locale`"
            :locale="locale"
            :is-current="locale === currentShop?.locale"
            :include-language="multipleShopsForCountry"
            @click="changeShop(path, locale, close)"
          />
        </SFListboxOption>
      </SFListboxOptions>
    </template>
  </SFListbox>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Locale } from '@nuxtjs/i18n/dist/runtime/composables'
import SFShopSwitcherItem from './SFShopSwitcherItem.vue'
import { useSwitchLocalePath, useI18n } from '#i18n'
import { useTrackingEvents } from '~/composables/useTrackingEvents'
import { useAvailableShops, useCurrentShop } from '#storefront/composables'
import {
  SFButton,
  SFListbox,
  SFListboxOption,
  SFListboxOptions,
  SFListboxButton,
} from '#storefront-ui/components'
import { getShopName, hasMultipleShopsForCountry } from '~/utils'

const currentShop = useCurrentShop()
const availableShops = useAvailableShops()
const switchLocalePath = useSwitchLocalePath()

const { trackShopChange } = useTrackingEvents()

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

const selectedLanguage = computed(() => {
  if (!currentShop.value) {
    return
  }
  const [language] = currentShop.value.locale.split('-')
  return languageTranslator.value?.of(language)
})

const selectedCountry = computed(() => {
  if (!currentShop.value) {
    return
  }
  const [, region] = currentShop.value.locale.split('-')

  return region ? regionTranslator.value?.of(region) : null
})

const multipleShopsForCountry = computed(() =>
  hasMultipleShopsForCountry(availableShops.value),
)

const { switchToHomePage = true } = defineProps<{
  switchToHomePage?: boolean
  listboxButtonAriaId: string
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
