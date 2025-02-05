<!-- NOTE: Related to @scayle/storefront-country-detection -->
<template>
  <SFFadeInTransition>
    <SFModal v-model:visible="modalOpen" data-testid="country-detection-dialog">
      <div class="mt-8 flex flex-col items-center gap-4 md:px-20">
        <div>
          {{ $t('country_selection.prompt', { country: suggestedCountry }) }}
        </div>
        <div class="mt-8 flex flex-col items-center gap-3">
          <SFButton
            v-for="(shop, index) in suggestedShops"
            :key="shop.shopId"
            :autofocus="index === 0"
            variant="primary"
            class="w-fit"
            data-testid="button-switch-shop"
            @click="switchToShop(shop)"
          >
            {{
              $t('country_selection.switch_to_shop', {
                country: getShopCountryName(shop, suggestedShops.length > 1),
              })
            }}
          </SFButton>
          <SFButton
            variant="secondary"
            class="w-fit"
            data-testid="button-stay-in-shop"
            @click="stayInShop"
          >
            {{
              $t('country_selection.stay_in_shop', { country: currentCountry })
            }}
          </SFButton>
        </div>
      </div>
    </SFModal>
  </SFFadeInTransition>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { whenever } from '@vueuse/core'
import { useI18n } from '#i18n'
import { useCurrentShop } from '#storefront/composables'
import {
  SFButton,
  SFFadeInTransition,
  SFModal,
} from '#storefront-ui/components'
import { useCountryDetection } from '#storefront-country-detection'
import { useCurrentShopTranslators } from '~/composables/useCurrentShopTranslators'

const currentShop = useCurrentShop()

const { t, te } = useI18n()

const { languageTranslator, regionTranslator } = useCurrentShopTranslators()

export interface ShopInfo {
  path?: string
  locale: string
  shopId: number
}
const modalOpen = ref<boolean>()

const emit = defineEmits<{
  (e: 'switchShop', targetShop: ShopInfo): void
}>()
const switchToShop = function (shop: ShopInfo) {
  modalOpen.value = false
  markUserAsPrompted()
  emit('switchShop', shop)
}

const stayInShop = function () {
  modalOpen.value = false
  markUserAsPrompted()
}

const currentCountry = computed<string | undefined>(() => {
  return getShopCountryName(currentShop.value, false)
})
const getShopCountryName = (shop: ShopInfo, includeLanguage: boolean) => {
  const locale = new Intl.Locale(shop.locale)
  if (!locale.region) {
    return undefined
  }

  const regionName = te(
    `country_selection.override_codes.${locale.region.toUpperCase()}`,
  )
    ? t(`country_selection.override_codes.${locale.region.toUpperCase()}`)
    : regionTranslator.value?.of(locale.region)

  if (includeLanguage && locale.language) {
    const languageName = languageTranslator.value?.of(locale.language)
    return t(`country_selection.country_with_language`, {
      country: regionName,
      language: languageName,
    })
  }

  return regionName
}

const suggestedCountry = ref<string>()
const { suggestedShops, detectedRegion, suggestionActive, markUserAsPrompted } =
  useCountryDetection({})

whenever(
  suggestionActive,
  () => {
    if (!detectedRegion.value) {
      return
    }
    suggestedCountry.value = regionTranslator.value?.of(detectedRegion.value)
    modalOpen.value = true
  },
  { immediate: true, once: true },
)
</script>
