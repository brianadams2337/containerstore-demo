<template>
  <div>
    <slot :data="resData" :pending="pending" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type {
  TypeContentPageSkeleton,
  TypeContentPageWithoutUnresolvableLinksResponse,
} from '../../types'
import { useCMS } from '../../composables/useCMS'
import { useContentfulEditor } from '../../composables/useContentfulEditor'

const props = defineProps<{
  slug: string
}>()

const { fetchBySlug } = useCMS(`services-page-${props.slug}`)

const { data, pending } = await fetchBySlug<TypeContentPageSkeleton>({
  content_type: 'contentPage',
  'fields.slug[match]': `s/${props.slug}`,
})

const resData = computed(() => {
  if (!data.value) {
    return {
      headline: '',
      name: '',
      slug: '',
      seo: '',
      content: '',
      subline: '',
      teaserImage: '',
      teaserImageMobile: '',
      uid: '',
    }
  }
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
