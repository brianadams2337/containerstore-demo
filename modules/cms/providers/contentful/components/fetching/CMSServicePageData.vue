<script setup lang="ts">
import type {
  TypeContentPageSkeleton,
  TypeContentPageWithoutUnresolvableLinksResponse,
} from '~/modules/cms/providers/contentful/types'
import { useCMS } from '~/modules/cms/providers/contentful/composables/useCMS'

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
</script>

<template>
  <div>
    <slot
      v-bind="{
        data: resData,
        pending,
      }"
    />
  </div>
</template>
