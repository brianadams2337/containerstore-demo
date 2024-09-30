<template>
  <li
    class="h-auto break-all rounded border p-2 transition-colors hover:border-primary hover:bg-secondary-450"
  >
    <SFLink
      class="flex w-full flex-1 items-center transition-colors duration-100 ease-in-out"
      :to="to"
      data-testid="search-exact-product-item"
      @click="emit('click:result')"
    >
      <NuxtImg
        v-if="imageUrl"
        :src="imageUrl"
        height="48"
        width="38"
        provider="scayle"
        class="mr-3 rounded border"
      />
      <slot />
    </SFLink>
  </li>
</template>

<script setup lang="ts">
import type { RouteLocationRaw } from '#vue-router'
import { SFLink } from '#storefront-ui/components'
import { NuxtImg } from '#components'

type Props = {
  imageUrl?: string
  to?: RouteLocationRaw
}

withDefaults(defineProps<Props>(), { imageUrl: '', to: '' })

const emit = defineEmits<{ 'click:result': [] }>()
</script>
