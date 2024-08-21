<template>
  <div>
    <slot :data="data?.data.story" :pending="pending" />
  </div>
</template>

<script setup lang="ts">
import type { SbContentPage } from '../../types'
import { useCMS } from '../../composables/useCMS'
import { useStoryblokEditor } from '../../composables/useStoryblokEditor'

const props = defineProps<{
  slug: string
}>()

const { fetchBySlug } = useCMS(`services-page-${props.slug}`)

const { data, pending } = await fetchBySlug<SbContentPage>(`s/${props.slug}`)
useStoryblokEditor<SbContentPage>(data)
</script>
