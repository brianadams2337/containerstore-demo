<template>
  <NuxtLink
    :to="to"
    class="inline-flex items-center px-4 py-2 text-center text-sm"
    :class="{
      'font-bold': isActive,
    }"
    data-test-id="paginationButton"
    @click.native="scrollToTop">
    <slot />
  </NuxtLink>
</template>

<script setup lang="ts">
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
  const attributes: {
    path: string
    query: Record<string | number, string | (string | null)[]>
  } = {
    path: route.path,
    query: {
      ...route.query,
      page: props.page.toString(),
    },
  }

  if (props.page === 1) {
    delete attributes.query.page
  }

  return attributes
})

const scrollToTop = () => {
  window.scroll({
    behavior: 'smooth',
    top: 0,
  })
}
</script>
