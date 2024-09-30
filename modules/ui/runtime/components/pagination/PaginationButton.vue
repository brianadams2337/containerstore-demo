<template>
  <SFLink
    data-testid="paginationButton"
    :to="page.to"
    :class="{
      '!border-accent !text-accent': page.isActive && !disabled,
      'pointer-events-none': page.isActive || disabled,
    }"
    raw
    class="inline-flex h-full w-10 items-center justify-center border-t-2 border-transparent text-center text-sm text-gray-500 hover:border-gray-400 hover:text-black"
    @click="scrollToTop"
  >
    <slot>
      {{ page.number }}
    </slot>
  </SFLink>
</template>

<script setup lang="ts">
import type { Page } from '#storefront-ui'
import { SFLink } from '#storefront-ui/components'

type Props = {
  disabled?: boolean
  page: Page
}

withDefaults(defineProps<Props>(), { disabled: false })

const scrollToTop = () => {
  setTimeout(() => window.scroll({ behavior: 'smooth', top: 0 }), 100)
}
</script>
