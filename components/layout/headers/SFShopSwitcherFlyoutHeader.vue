<template>
  <div class="flex w-full items-center justify-between">
    <SFHeadline class="!font-semi-bold-variable md:text-lg" size="xl" tag="p">
      <IconGlobe class="size-6" />
      {{ $t('shop_selector.flyout_title') }}
    </SFHeadline>
    <SFButton
      class="my-3 -mr-2 bg-gray-100 md:bg-transparent"
      fab
      variant="raw"
      data-testid="close-shopswitcher"
      :aria-label="$t('shop_selector.close_flyout')"
      @click="close"
    >
      <template #icon>
        <IconClose class="size-5 md:size-4 md:text-gray-500" />
      </template>
    </SFButton>
  </div>
</template>
<script lang="ts" setup>
import { SFHeadline, SFButton } from '#storefront-ui/components'
import { useSlideIn } from '#storefront-ui/composables'

const { close } = useSlideIn('ShopSwitcherSlideIn')
</script>
