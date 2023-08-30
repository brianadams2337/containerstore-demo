export const useStoryblokHelpers = () => {
  const route = useRoute()

  const isInEditorMode = computed(() => Boolean('_storyblok' in route.query))

  const getContentVersion = () => {
    const environment = process.env.NODE_ENV
    const isAllowedDraft = ['staging', 'integration', 'development']
    if (environment && isAllowedDraft.includes(environment)) {
      return isInEditorMode.value ? 'draft' : 'published'
    } else {
      return 'published'
    }
  }

  return {
    isInEditorMode,
    getContentVersion,
  }
}
