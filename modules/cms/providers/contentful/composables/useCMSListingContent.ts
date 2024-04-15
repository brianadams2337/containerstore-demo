import type { TypeListingPageWithoutUnresolvableLinksResponse } from '~/modules/cms/providers/contentful/types'

export function useCMSListingContent(
  data: Ref<TypeListingPageWithoutUnresolvableLinksResponse | null>,
) {
  if (!data.value) {
    return {
      content: computed(() => ({})),
      preListingContent: computed(() => []),
      postListingContent: computed(() => []),
      hasTeaserImage: computed(() => false),
    }
  }
  return {
    content: computed(() => data.value),
    preListingContent: computed(
      () =>
        data.value?.fields.preListingContent?.map((i) => {
          return {
            ...i,
            _uid: i?.sys.id,
            component: i?.sys.contentType.sys.id,
          }
        }) || [],
    ),
    postListingContent: computed(
      () =>
        data.value?.fields.postListingContent?.map((i) => {
          return {
            ...i,
            _uid: i?.sys.id,
            component: i?.sys.contentType.sys.id,
          }
        }) || [],
    ),
    hasTeaserImage: computed(() =>
      Boolean(data.value?.fields.teaserImage?.fields.file?.url),
    ),
  }
}
