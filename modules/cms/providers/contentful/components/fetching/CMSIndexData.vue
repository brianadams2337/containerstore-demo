<template>
  <slot :data="resData" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type {
  TypePageSkeleton,
  TypePageWithoutUnresolvableLinksResponse,
} from '../../types'
import { useCMS } from '../../composables/useCMS'
import { useContentfulEditor } from '../../composables/useContentfulEditor'

const props = defineProps<{
  slug: string
}>()

const { fetchBySlug } = useCMS(`${props.slug}`)

const { data } = await fetchBySlug<TypePageSkeleton>({
  'fields.slug': props.slug,
  content_type: 'page',
})

const resData = computed(() => {
  return data.value as TypePageWithoutUnresolvableLinksResponse
})

useContentfulEditor<TypePageSkeleton>(data)
</script>
