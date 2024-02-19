<template>
  <DefaultLink
    data-test-id="paginationButton"
    :to="to"
    :class="{
      'font-bold': isActive,
    }"
    raw
    class="inline-flex items-center px-4 py-2 text-center text-sm"
    @click="scrollToTop"
  >
    <slot />
  </DefaultLink>
</template>

<script setup lang="ts">
import type { RouteLocationRaw } from '#vue-router'

const props = defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
  page: {
    type: Number,
    required: true,
  },
})

const route = useRoute()

const to = computed(() => {
  const attributes: Partial<RouteLocationRaw> = {
    path: route.path,
    query: {
      ...route.query,
      page: props.page.toString(),
    },
  }

  if (props.page === 1) {
    delete attributes?.query?.page
  }

  return attributes
})

const scrollToTop = () => {
  setTimeout(() => window.scroll({ behavior: 'smooth', top: 0 }), 100)
}
</script>
