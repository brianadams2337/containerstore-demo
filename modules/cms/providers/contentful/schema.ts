import type { ContentfulProvider } from './types'
declare module 'nuxt/schema' {
  interface RuntimeConfig {
    cms: ContentfulProvider
  }
  interface PublicRuntimeConfig {
    cms: ContentfulProvider
  }
}
// It is always important to ensure you import/export something when augmenting a type
export {}
