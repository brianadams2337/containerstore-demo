<script setup lang="ts">
import type { SbContentPage } from '~/modules/cms/providers/storyblok/types'
import { useCMS } from '~/modules/cms/providers/storyblok/composables/useCMS'

const props = defineProps<{
  slug: string
}>()

const { fetchBySlug } = useCMS(`content-page-${props.slug}`)

const { data, pending } = await fetchBySlug<SbContentPage>(`c/${props.slug}`)
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
