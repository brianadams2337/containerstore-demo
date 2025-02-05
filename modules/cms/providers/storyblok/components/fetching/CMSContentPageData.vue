<template>
  <div>
    <slot :data="data?.data.story" :pending="status === 'pending'" />
  </div>
</template>

<script setup lang="ts">
import type { SbContentPage } from '../../types'
import { useCMSBySlug } from '../../composables/useCMS'
import { useStoryblokEditor } from '../../composables/useStoryblokEditor'

const { slug } = defineProps<{ slug: string }>()

const { data, status } = await useCMSBySlug<SbContentPage>(
  `content-page-${slug}`,
  `content/${slug}`,
)

useStoryblokEditor<SbContentPage>(data)
</script>
