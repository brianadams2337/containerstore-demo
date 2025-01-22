<template>
  <SFSlideIn ref="slideIn" name="ShopSwitcherSlideIn">
    <template #slide-in-header="">
      <SFShopSwitcherFlyoutHeader />
    </template>
    <template #slide-in-body>
      <SFShopSwitcherFlyoutBody />
    </template>
  </SFSlideIn>
</template>
<script lang="ts" setup>
import { useTemplateRef, watch, nextTick } from 'vue'
import { useFocusTrap } from '@vueuse/integrations/useFocusTrap'
import { onKeyStroke } from '@vueuse/core'
import SFShopSwitcherFlyoutBody from './SFShopSwitcherFlyoutBody'
import SFShopSwitcherFlyoutHeader from './SFShopSwitcherFlyoutHeader'
import { SFSlideIn } from '#storefront-ui/components'
import { useSlideIn } from '#storefront-ui/composables'

const { close, isOpen } = useSlideIn('ShopSwitcherSlideIn')
const slideInRef = useTemplateRef('slideIn')

const { activate: activateSlideInTrap, deactivate: deactivateSlideInTrap } =
  useFocusTrap(slideInRef, {
    escapeDeactivates: false,
    isKeyBackward: (keyEvent) =>
      keyEvent.code === 'ArrowLeft' ||
      keyEvent.code === 'ArrowUp' ||
      (keyEvent.key === 'Tab' && keyEvent.shiftKey),
    isKeyForward: (keyEvent) =>
      keyEvent.code === 'ArrowRight' ||
      keyEvent.code === 'ArrowDown' ||
      (keyEvent.key === 'Tab' && !keyEvent.shiftKey),
  })

watch(isOpen, async (value) => {
  if (value) {
    await nextTick()
    activateSlideInTrap()
  } else {
    deactivateSlideInTrap()
  }
})

onKeyStroke(
  'Esc',
  () => {
    close()
  },
  { target: slideInRef },
)
</script>
