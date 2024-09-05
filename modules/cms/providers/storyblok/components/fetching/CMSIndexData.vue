<template>
  <slot :data="data?.data.story" />
</template>

<script setup lang="ts">
import type { SbPage } from '../../types'
import { useCMSBySlug } from '../../composables/useCMS'
import { useStoryblokEditor } from '../../composables/useStoryblokEditor'

const props = defineProps<{
  slug: string
}>()

const { data } = await useCMSBySlug<SbPage>(`${props.slug}`, `${props.slug}`)
useStoryblokEditor<SbPage>(data)
</script>
