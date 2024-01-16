import { useNuxtApp } from '#app/nuxt'

export function useContentful() {
  const { $contentful } = useNuxtApp()
  return $contentful
}
