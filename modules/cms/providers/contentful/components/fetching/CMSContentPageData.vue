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

const { fetchBySlug } = useCMS(`content-page-${props.slug}`)

const { data: responseData, pending } =
  await fetchBySlug<TypeContentPageSkeleton>({
    content_type: 'contentPage',
    'fields.slug[match]': `c/${props.slug}`,
  })

const data = computed(() => {
  const res =
    responseData?.value as TypeContentPageWithoutUnresolvableLinksResponse
  return {
    uuid: res.fields.uid ?? '',
    _uid: res.fields.uid ?? '',
    slug: res.fields.slug ?? '',
    teaser_image: res.fields.teaserImage ?? '',
    teaser_image_mobile: res.fields.teaserImageMobile ?? '',
    headline: res.fields.headline ?? '',
    subline: res.fields.subline ?? '',
    content: res.fields.content ?? [],
    name: res.fields.headline ?? '',
    seo: res.fields.seo ?? {},
  }
})

useContentfulEditor<TypeContentPageSkeleton>(responseData)
</script>

<template>
  <div>
    <slot
      v-bind="{
        data,
        pending,
      }"
    />
  </div>
</template>
