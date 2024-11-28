<template>
  <div
    class="relative mb-5 grow overflow-y-auto overflow-x-hidden scroll-shadow"
  >
    <SFSlideInFromLeftTransition>
      <div v-if="!selectedItem" class="mt-2 flex flex-col gap-y-5">
        <div
          v-for="item in navigationItems"
          :key="item.id"
          class="flex items-center pr-4"
        >
          <NavigationTreeItem
            :navigation-item="item"
            :text-color="theme.colors.gray[900]"
            class="min-h-11 !text-2xl font-semi-bold-variable"
            @click="$emit('clickLink')"
          />
          <SFButton
            v-if="item.children.length"
            variant="accent"
            class="ml-auto !h-auto min-h-11 rounded-md bg-gray-200 !p-3"
            @click="selectedItem = item"
          >
            <IconChevronRight class="size-4 text-gray-600" />
          </SFButton>
        </div>
      </div>
    </SFSlideInFromLeftTransition>
    <SFSlideInFromRightTransition>
      <div v-if="selectedItem">
        <SFButton
          variant="raw"
          class="mb-5 min-h-11"
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
        <div class="flex flex-col gap-y-4">
          <template v-for="item in selectedItem.children" :key="item.id">
            <SFAccordionEntry
              v-if="item.children.length"
              class="!py-0"
              variant="narrow"
            >
              <template #title>
                <NavigationTreeItem
                  class="min-h-11 content-center py-0 !text-xl font-semi-bold-variable"
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
                    class="min-h-11 text-lg"
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
    </SFSlideInFromRightTransition>
  </div>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue'
import type { NavigationItems } from '@scayle/storefront-core'
import {
  SFButton,
  SFAccordionEntry,
  SFSlideInFromLeftTransition,
  SFSlideInFromRightTransition,
} from '#storefront-ui/components'
import NavigationTreeItem from '~/components/NavigationTreeItem.vue'
import { theme } from '#tailwind-config'

const { isOpen, navigationItems } = defineProps<{
  isOpen: boolean
  navigationItems: NavigationItems | undefined
}>()

defineEmits(['clickLink'])

const selectedItem = ref<NavigationItems[0] | undefined>(undefined)

watch(
  () => isOpen,
  () => (selectedItem.value = undefined),
)
</script>
