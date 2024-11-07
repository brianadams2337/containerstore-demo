<template>
  <SFButton
    type="raw"
    is-full-width
    class="!justify-start !rounded-md px-3 py-2 text-base hover:!bg-gray-100 hover:!text-gray-900"
    :class="{
      'font-semibold': isCurrent,
      '!text-gray-900': isCurrent,
      '!text-gray-600': !isCurrent,
    }"
  >
    {{ shopName(locale) }}
  </SFButton>
</template>
<script lang="ts" setup>
import { SFButton } from '#storefront-ui/components'
import { getShopName } from '~/utils'

const { includeFlag = false, includeLanguage = false } = defineProps<{
  locale: string
  isCurrent: boolean
  includeFlag?: boolean
  includeLanguage?: boolean
}>()

function getFlagEmoji(countryCode: string) {
  if (['AA', 'ZZ'].includes(countryCode)) {
    return '🌐'
  }
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt(0))
  return String.fromCodePoint(...codePoints)
}

const shopName = (locale: string) => {
  const [_languageCode, regionCode] = locale.split('-')
  const baseName = getShopName(locale, includeLanguage)

  if (includeFlag) {
    return `${getFlagEmoji(regionCode)} ${baseName}`
  }
  return baseName
}
</script>
