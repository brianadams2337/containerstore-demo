import type { StoryblokProvider } from './types'
declare module 'nuxt/schema' {
  interface RuntimeConfig {
    cms: StoryblokProvider
  }
  interface PublicRuntimeConfig {
    cms: StoryblokProvider
  }
}
// It is always important to ensure you import/export something when augmenting a type
export {}
