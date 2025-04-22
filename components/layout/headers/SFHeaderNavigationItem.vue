<template>
  <li
    ref="root"
    class="relative flex h-full items-center pl-4 first:pl-0"
    @mouseenter="openFlyout(false)"
    @mouseleave="closeFlyout()"
  >
    <SFNavigationTreeItem
      ref="trigger"
      :navigation-item="item"
      class="!mr-0 flex !h-6 items-center py-1"
      :class="{
        'text-primary': !item.customData?.linkColor,
      }"
      data-testid="nav-link-main"
      :is-active="isActive"
    >
      <span class="text-md font-semi-bold-variable leading-10">
        {{ item.name }}
      </span>
    </SFNavigationTreeItem>
    <SFButton
      v-if="item.children.length"
      ref="button"
      class="pointer-events-none absolute -right-4 z-10 opacity-0 focus-within:opacity-100"
      :aria-expanded="isOpen"
      :aria-label="item.name"
      :aria-controls="`${item.id}`"
      variant="raw"
      @click="openFlyout(true)"
    >
      <IconChevronDown class="size-4" />
    </SFButton>
    <div :id="`${item.id}`">
      <SFDesktopNavigationFlyout
        v-if="showFlyout"
        ref="flyout"
        :item="item"
        class="absolute inset-x-0 top-[63px] z-100 w-screen"
        :style="flyoutTransform"
        @close="closeFlyout"
      />
    </div>
  </li>
</template>

<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import type { NavigationTreeItem as NavigationTreeItemType } from '@scayle/storefront-nuxt'
import { onKeyStroke, useElementBounding } from '@vueuse/core'
import { useFocusTrap } from '@vueuse/integrations/useFocusTrap'
import SFDesktopNavigationFlyout from './SFDesktopNavigationFlyout.vue'
import { usePageState } from '~/composables'
import { isNavigationItemCategoryActive } from '#storefront-navigation/utils'
import SFNavigationTreeItem from '~/components/SFNavigationTreeItem.vue'
import { SFButton } from '~/modules/ui/runtime/components'
import { useRoute } from '#app/composables/router'

const { item } = defineProps<{ item: NavigationTreeItemType }>()

const { pageState } = usePageState()
const route = useRoute()

const isOpen = ref(false)
const trapFocusImmediately = ref(false)
const flyout = ref()
const showFlyout = computed(() => isOpen.value && item.children.length > 0)

const { activate, deactivate } = useFocusTrap(flyout, {
  immediate: false,
  escapeDeactivates: true,
  allowOutsideClick: true,
  isKeyBackward: (keyEvent) => keyEvent.code === 'ArrowUp',
  isKeyForward: (keyEvent) => keyEvent.code === 'ArrowDown',
  onPostDeactivate() {
    isOpen.value = false
  },
  initialFocus: () => (trapFocusImmediately.value ? undefined : false),
})

const isActive = computed(() => {
  return (
    isNavigationItemCategoryActive(
      item,
      pageState.value.type,
      route.params.id as string,
    ) || isOpen.value
  )
})

const openFlyout = async (shouldTrapFocusImmediately: boolean) => {
  trapFocusImmediately.value = shouldTrapFocusImmediately
  isOpen.value = true
  await nextTick()
  activate()
}
const closeFlyout = () => {
  isOpen.value = false
  deactivate()
}

const ARROW_KEYS = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown']
onKeyStroke(
  ARROW_KEYS,
  (event: KeyboardEvent) => {
    // Prevent scrolling the page on arrow keys
    event.preventDefault()
  },
  { target: flyout },
)

const trigger = ref()
const NAVIGATION_ITEM_SPACE_BETWEEN_IN_PX = 16
const { x } = useElementBounding(trigger, {
  windowScroll: false,
})
const flyoutTransform = computed(() => {
  return {
    transform: `translateX(-${
      x.value - NAVIGATION_ITEM_SPACE_BETWEEN_IN_PX
    }px)`,
  }
})
</script>
