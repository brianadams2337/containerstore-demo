<template>
  <slot :data="resData" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type {
  TypePageSkeleton,
  TypePageWithoutUnresolvableLinksResponse,
} from '../../types'
import { useCMSBySlug } from '../../composables/useCMS'
import { useContentfulEditor } from '../../composables/useContentfulEditor'

const { slug } = defineProps<{ slug: string }>()

const { data } = await useCMSBySlug<TypePageSkeleton>(slug, {
  'fields.slug': slug,
  content_type: 'page',
})

const resData = computed(() => {
  return data.value as TypePageWithoutUnresolvableLinksResponse
})

useContentfulEditor<TypePageSkeleton>(data)
</script>
