<script setup lang="ts">
import type { SbPage } from '~/modules/cms/providers/storyblok/types'
import { useCMS } from '~/modules/cms/providers/storyblok/composables/useCMS'
import { useStoryblokEditor } from '~/modules/cms/providers/storyblok/composables/useStoryblokEditor'

const props = defineProps<{
  slug: string
}>()

const { fetchBySlug } = useCMS(`${props.slug}`)

const { data } = await fetchBySlug<SbPage>(`${props.slug}`)
useStoryblokEditor<SbPage>(data)
</script>

<template>
  <slot v-bind="{ data: data?.data.story }" />
</template>
