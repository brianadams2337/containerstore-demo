<template>
  <div
    class="relative mb-5 flex grow overflow-y-auto overflow-x-hidden px-1 scroll-shadow"
  >
    <Transition
      enter-from-class="-translate-x-full"
      enter-to-class="translate-x-0"
      leave-from-class="translate-x-0"
      leave-to-class="-translate-x-full"
      enter-active-class="transition-[display,transform,overlay] transition-discrete duration-200 ease-in-out"
      leave-active-class="transition-[display,transform,overlay] transition-discrete duration-200 ease-in-out"
    >
      <div
        v-if="!selectedItem"
        class="mt-2 flex w-full shrink-0 flex-col gap-y-5"
      >
        <div
          v-for="item in navigationItems"
          :key="item.id"
          class="flex cursor-pointer items-center pr-4"
          :aria-label="item.name"
          @click="selectItem(item)"
        >
          <template v-if="item.children.length === 0">
            <SFLink
              class="grow"
              :to="buildNavigationTreeItemRoute(item)?.path || ''"
              :target="
                buildNavigationTreeItemRoute(item)?.openInNew
                  ? '_blank'
                  : '_self'
              "
              @click="selectItem(item)"
            >
              <NavigationTreeItem
                :navigation-item="item"
                :text-color="theme.colors.gray[900]"
                class="min-h-11 rounded !text-2xl font-semi-bold-variable transition-all supports-hover:hover:mr-0 supports-hover:hover:bg-[var(--backgroundColor)] supports-hover:hover:px-1.5"
                disabled-link
              />
            </SFLink>
          </template>
          <template v-else>
            <NavigationTreeItem
              :navigation-item="item"
              :text-color="theme.colors.gray[900]"
              class="min-h-11 !text-2xl font-semi-bold-variable"
              role="button"
              disabled-link
            />
          </template>
          <SFButton
            v-if="item.children.length"
            variant="accent"
            class="ml-auto !h-auto min-h-11 rounded-md bg-gray-200 !p-3 hover:!bg-gray-200"
            aria-hidden="true"
            @click="selectItem(item)"
          >
            <IconChevronRight class="size-4 text-gray-600" />
          </SFButton>
        </div>
      </div>
    </Transition>
    <Transition
      enter-from-class="translate-x-0"
      enter-to-class="-translate-x-full"
      leave-from-class="-translate-x-full"
      leave-to-class="translate-x-0"
      enter-active-class="transition-[display,transform,overlay] transition-discrete duration-200 ease-in-out"
      leave-active-class="transition-[display,transform,overlay] transition-discrete  duration-200 ease-in-out"
    >
      <div v-if="selectedItem" class="mt-2 inline w-full shrink-0">
        <SFButton
          variant="raw"
          class="mb-5 h-11"
          @click="selectedItem = undefined"
        >
          <IconBack class="size-4" />
          <NavigationTreeItem
            class="!text-2xl font-semi-bold-variable"
            :navigation-item="selectedItem"
            :text-color="theme.colors.gray[900]"
            disabled-link
          />
        </SFButton>
        <div class="flex flex-col gap-y-5">
          <template v-for="item in selectedItem.children" :key="item.id">
            <SFAccordionEntry
              v-if="item.children.length"
              :id="`${item.id}`"
              class="!py-0"
              variant="narrow"
            >
              <template #title>
                <NavigationTreeItem
                  class="h-11 content-center py-0 !text-xl font-semi-bold-variable"
                  disabled-link
                  :navigation-item="item"
                  :text-color="theme.colors.gray[900]"
                />
              </template>
              <div class="flex flex-col gap-2 pl-2">
                <div
                  v-for="child in item.children"
                  :key="child.id"
                  class="flex items-center"
                >
                  <NavigationTreeItem
                    :navigation-item="child"
                    :text-color="theme.colors.gray[900]"
                    class="h-11 text-lg"
                    @click="$emit('clickLink')"
                  />
                </div>
              </div>
            </SFAccordionEntry>
            <NavigationTreeItem
              v-else
              :navigation-item="item"
              :text-color="theme.colors.gray[900]"
              class="min-h-11 !text-xl font-semi-bold-variable"
              @click="$emit('clickLink')"
            />
          </template>
        </div>
      </div>
    </Transition>
  </div>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue'
import type {
  NavigationItems,
  NavigationTreeItem as NavigationTreeItemType,
} from '@scayle/storefront-core'
import { SFButton, SFAccordionEntry, SFLink } from '#storefront-ui/components'
import NavigationTreeItem from '~/components/NavigationTreeItem.vue'
import { theme } from '#tailwind-config'
import { useRouteHelpers } from '~/composables'

const { isOpen, navigationItems } = defineProps<{
  isOpen: boolean
  navigationItems: NavigationItems | undefined
}>()

const emit = defineEmits(['clickLink'])

const { buildNavigationTreeItemRoute } = useRouteHelpers()

const selectedItem = ref<NavigationTreeItemType | undefined>(undefined)
const selectItem = (category: NavigationTreeItemType) => {
  if (category.children.length === 0) {
    emit('clickLink')
    return
  }
  selectedItem.value = category
}

watch(
  () => isOpen,
  () => (selectedItem.value = undefined),
)
</script>
