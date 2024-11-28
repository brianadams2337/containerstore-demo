<template>
  <SFListbox
    :value="currentShop?.path"
    :name="'language-switch-' + id"
    class="shrink-0 max-lg:py-2"
  >
    <template #default="{ isOpen, list }">
      <SFListboxButton
        :id="id"
        ref="button"
        :aria-label="
          $t('shop_selector.aria_label', {
            selectedCountry,
            selectedLanguage,
          })
        "
        class="h-full gap-1.5 px-2 !text-gray-600 -outline-offset-4 hover:bg-indigo-200/10 lg:!text-white"
        :list-name="list"
        data-testid="language-listbox"
      >
        <IconNewGlobe class="size-5 lg:size-3.5" />
        <div class="text-[15px] lg:text-sm">
          {{ getShopName(currentShop.locale, multipleShopsForCountry) }}
        </div>
        <IconChevronDown
          class="size-3.5 transition-all"
          :class="{ 'rotate-180': isOpen }"
        />
      </SFListboxButton>
    </template>
    <template #options="{ isOpen, list, close }">
      <SFListboxOptions
        v-if="isOpen"
        :id="id"
        class="absolute z-60 flex max-h-[80vh] flex-col gap-1 overflow-y-auto rounded-10 bg-white p-2 shadow-md max-lg:bottom-0 max-lg:w-full max-lg:border-t lg:right-0 lg:top-0 lg:max-h-64"
      >
        <div class="-mx-2 flex flex-col gap-1 border-b px-4 py-2 lg:hidden">
          <div class="flex">
            <div class="text-2xl font-semi-bold-variable">
              {{ $t('shop_selector.choose_shop') }}
            </div>
            <SFButton variant="raw" class="ml-auto" @click="close">
              <IconNewClose class="size-5 text-gray-400" />
            </SFButton>
          </div>
          <div class="text-base">
            <span class="font-semi-bold-variable">
              {{ $t('shop_selector.current_shop') }}:
            </span>
            <span class="text-gray-600">
              {{ getShopName(currentShop.locale, multipleShopsForCountry) }}
            </span>
          </div>
        </div>
        <SFListboxOption
          v-for="{ shopId, path, locale } in availableShops"
          :key="shopId"
          :list-name="list"
        >
          <ShopSwitcherItem
            :key="`${locale}-locale`"
            :locale="locale"
            :is-current="locale === currentShop?.locale"
            :include-language="multipleShopsForCountry"
            @click="changeShop(path)"
          />
        </SFListboxOption>
      </SFListboxOptions>
    </template>
  </SFListbox>
</template>

<script setup lang="ts">
import { computed, useId } from 'vue'
import ShopSwitcherItem from './ShopSwitcherItem.vue'
import { useSwitchLocalePath } from '#i18n'
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

const id = useId()

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
  const [_, region] = currentShop.value.locale.split('-')

  return region ? regionTranslator.value?.of(region) : null
})

const multipleShopsForCountry = computed(() =>
  hasMultipleShopsForCountry(availableShops.value),
)

const changeShop = (value?: string) => {
  if (!value) {
    throw new Error('Shop has no path configured')
  }
  trackShopChange()
  const newLocalePath = switchLocalePath(value).split('?')[0]
  window.location.replace(newLocalePath)
}
</script>
