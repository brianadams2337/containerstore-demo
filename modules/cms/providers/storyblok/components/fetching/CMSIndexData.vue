<script setup lang="ts">
import type { SbPage } from '../../types'
import { useCMS } from '../../composables/useCMS'
import { useStoryblokEditor } from '../../composables/useStoryblokEditor'

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
