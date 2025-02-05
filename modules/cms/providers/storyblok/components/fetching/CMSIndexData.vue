<template>
  <slot :data="data?.data.story" />
</template>

<script setup lang="ts">
import type { SbPage } from '../../types'
import { useCMSBySlug } from '../../composables/useCMS'
import { useStoryblokEditor } from '../../composables/useStoryblokEditor'

const { slug } = defineProps<{ slug: string }>()

const { data } = await useCMSBySlug<SbPage>(slug, slug)

useStoryblokEditor<SbPage>(data)
</script>
