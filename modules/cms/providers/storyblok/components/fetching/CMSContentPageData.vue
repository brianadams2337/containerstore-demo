<script setup lang="ts">
import type { SbContentPage } from '../../types'
import { useCMS } from '../../composables/useCMS'
import { useStoryblokEditor } from '../../composables/useStoryblokEditor'

const props = defineProps<{
  slug: string
}>()

const { fetchBySlug } = useCMS(`content-page-${props.slug}`)

const { data, pending } = await fetchBySlug<SbContentPage>(`c/${props.slug}`)
useStoryblokEditor<SbContentPage>(data)
</script>

<template>
  <div>
    <slot
      v-bind="{
        data: data?.data.story,
        pending,
      }"
    />
  </div>
</template>
