<script setup lang="ts">
import type {
  TypeContentPageSkeleton,
  TypeContentPageWithoutUnresolvableLinksResponse,
} from '~/modules/cms/providers/contentful/types'
import { useCMS } from '~/modules/cms/providers/contentful/composables/useCMS'

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
