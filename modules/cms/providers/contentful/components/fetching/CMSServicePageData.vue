<template>
  <div>
    <slot :data="resData" :pending="status === 'pending'" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type {
  TypeContentPageSkeleton,
  TypeContentPageWithoutUnresolvableLinksResponse,
} from '../../types'
import { useCMSBySlug } from '../../composables/useCMS'
import { useContentfulEditor } from '../../composables/useContentfulEditor'

const { slug } = defineProps<{ slug: string }>()

const { data, status } = await useCMSBySlug<TypeContentPageSkeleton>(
  `services-page-${slug}`,
  {
    content_type: 'contentPage',
    'fields.slug[match]': `s/${slug}`,
  },
)

const resData = computed(() => {
  const res = data.value as TypeContentPageWithoutUnresolvableLinksResponse

  return {
    ...res,
    headline: res?.fields.headline ?? '',
    name: res?.fields.headline ?? '',
    slug: res?.fields.slug ?? '',
  }
})

useContentfulEditor<TypeContentPageSkeleton>(data)
</script>
