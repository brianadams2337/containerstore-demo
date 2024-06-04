<script setup lang="ts">
import type {
  TypePageSkeleton,
  TypePageWithoutUnresolvableLinksResponse,
} from '~/modules/cms/providers/contentful/types'
import { useCMS } from '~/modules/cms/providers/contentful/composables/useCMS'
import { useContentfulEditor } from '~/modules/cms/providers/contentful/composables/useContentfulEditor'

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

<template>
  <slot v-bind="{ data: resData }" />
</template>
