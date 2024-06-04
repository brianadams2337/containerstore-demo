<script setup lang="ts">
import type { SbContentPage } from '~/modules/cms/providers/storyblok/types'
import { useCMS } from '~/modules/cms/providers/storyblok/composables/useCMS'
import { useStoryblokEditor } from '~/modules/cms/providers/storyblok/composables/useStoryblokEditor'
const props = defineProps<{
  slug: string
}>()

const { fetchBySlug } = useCMS(`services-page-${props.slug}`)

const { data, pending } = await fetchBySlug<SbContentPage>(`s/${props.slug}`)
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
