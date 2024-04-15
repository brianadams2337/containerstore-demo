export function useStoryblokHelpers() {
  const route = useRoute()

  const isInEditorMode = computed(() => Boolean('_storyblok' in route.query))

  // TODO: This is not runtime-safe (should be dealt via runtimeConfig)
  const getContentVersion = () => {
    const environment = process.env.NODE_ENV
    const isAllowedDraft = ['staging', 'integration', 'development']
    if (environment && isAllowedDraft.includes(environment)) {
      return isInEditorMode.value ? 'draft' : 'published'
    }
    return 'published'
  }

  return {
    isInEditorMode,
    getContentVersion,
  }
}
