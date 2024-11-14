<template>
  <div class="flex flex-col gap-5">
    <div
      class="flex cursor-pointer items-center p-1 text-lg font-semibold text-gray-900 md:cursor-default md:text-sm"
      @click="expanded = !expanded"
    >
      <h2>
        <NavigationTreeItem :navigation-item="section" disabled-link />
      </h2>
      <div class="ml-auto flex md:hidden">
        <IconPlus v-if="!expanded" class="size-6 text-black" />
        <IconMinus v-else class="size-6 text-black" />
      </div>
    </div>
    <ul
      ref="content"
      class="flex-col gap-x-2 gap-y-5 transition-all md:flex"
      :class="{
        flex: expanded,
        hidden: !expanded,
      }"
    >
      <li v-for="item in section.children" :key="item.id">
        <NavigationTreeItem
          :navigation-item="item"
          raw
          class="rounded-md p-1 text-gray-600 hover:bg-gray-100"
        />
      </li>
    </ul>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import type { NavigationItems } from '@scayle/storefront-nuxt'
import NavigationTreeItem from '~/components/NavigationTreeItem.vue'

defineProps<{
  section: NavigationItems[0]
}>()

const expanded = ref(false)
</script>
