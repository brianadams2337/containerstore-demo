import type { ContentfulProvider } from './providers/contentful/types'
import type { StoryblokProvider } from './providers/storyblok/types'

// Module options TypeScript interface definition
export type CMSProviders = 'storyblok' | 'contentful'

export type ModuleOptions = {
  provider: CMSProviders
} & (StoryblokProvider | ContentfulProvider)
