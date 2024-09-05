<template>
  <div>
    <slot :data="data?.data.story" :pending="status === 'pending'" />
  </div>
</template>

<script setup lang="ts">
import type { SbContentPage } from '../../types'
import { useCMSBySlug } from '../../composables/useCMS'
import { useStoryblokEditor } from '../../composables/useStoryblokEditor'

const props = defineProps<{
  slug: string
}>()

const { data, status } = await useCMSBySlug<SbContentPage>(
  `content-page-${props.slug}`,
  `content/${props.slug}`,
)

useStoryblokEditor<SbContentPage>(data)
</script>
