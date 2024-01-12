import type { ContentfulProvider } from './providers/contentful/types'
import type { StoryblokProvider } from './providers/storyblok/types'

export type CMSProviders = 'storyblok' | 'contentful'

export type ModuleOptions = {
  provider: CMSProviders
} & (StoryblokProvider | ContentfulProvider)
