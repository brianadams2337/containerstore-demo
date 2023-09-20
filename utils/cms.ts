const env = process.env.NODE_ENV
const draftAllowedForEnv = ['staging', 'integration', 'development']

export const getStoryblokContentVersion = () => {
  const route = useRoute()
  if (env && draftAllowedForEnv.includes(env)) {
    return route.query._storyblok ? 'draft' : 'published'
  }
  return 'published'
}
