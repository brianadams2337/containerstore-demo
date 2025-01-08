<template>
  <li
    ref="root"
    class="relative flex h-full items-center"
    @mouseenter="openFlyout(false)"
    @mouseleave="closeFlyout()"
  >
    <SFNavigationTreeItem
      :navigation-item="item"
      class="!mr-0 flex !h-6 items-center py-1"
      :class="{
        'text-primary': !item.customData?.linkColor,
      }"
      :data-testid="`nav-link-${item.name}`"
      :is-active="
        isNavigationItemCategoryActive(item, pageState.type, $route) || isOpen
      "
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
        class="fixed left-0 top-[99px] z-100 w-full"
        @close="closeFlyout"
      />
    </div>
  </li>
</template>

<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import type { NavigationTreeItem as NavigationTreeItemType } from '@scayle/storefront-core'
import { onKeyStroke } from '@vueuse/core'
import { useFocusTrap } from '@vueuse/integrations/useFocusTrap'
import SFDesktopNavigationFlyout from './SFDesktopNavigationFlyout.vue'
import { usePageState } from '~/composables'
import { isNavigationItemCategoryActive } from '#storefront-navigation/utils'
import SFNavigationTreeItem from '~/components/SFNavigationTreeItem.vue'
import { SFButton } from '~/modules/ui/runtime/components'

const { pageState } = usePageState()
const { item } = defineProps<{
  item: NavigationTreeItemType
}>()

const isOpen = ref(false)
const trapFocusImmediately = ref(false)
const flyout = ref()
const showFlyout = computed(() => isOpen.value && item.children.length > 0)

const { activate, deactivate } = useFocusTrap(flyout, {
  immediate: false,
  escapeDeactivates: true,
  allowOutsideClick: true,
  isKeyBackward: (keyEvent) =>
    keyEvent.code === 'ArrowLeft' || keyEvent.code === 'ArrowUp',
  isKeyForward: (keyEvent) =>
    keyEvent.code === 'ArrowRight' || keyEvent.code === 'ArrowDown',
  onPostDeactivate() {
    isOpen.value = false
  },
  initialFocus: () => (trapFocusImmediately.value ? undefined : false),
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
</script>
