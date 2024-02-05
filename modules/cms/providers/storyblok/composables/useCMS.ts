export default function useCMS<_T = unknown>(key: string) {
  const storyblokApi = useStoryblokApi()
  const storyblokOptions = useDefaultStoryblokOptions()
  async function fetchBySlug(
    slug: string,
    asyncDataOption: {
      immediate: boolean
    } = {
      immediate: false,
    },
  ) {
    return await useAsyncData(
      key,
      () =>
        storyblokApi.get(`cdn/stories/${slug}`, {
          ...storyblokOptions,
        }),
      asyncDataOption,
    )
  }

  async function fetchByFolder(
    folder: string,
    params: any,
    asyncDataOption: {
      immediate: boolean
    } = {
      immediate: false,
    },
  ) {
    return await useAsyncData(
      key,
      () => {
        return storyblokApi.getStories({
          ...storyblokOptions,
          starts_with: folder,
          ...params,
        })
      },
      asyncDataOption,
    )
  }

  return { fetchBySlug, fetchByFolder }
}
