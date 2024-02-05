import type { StoryblokProvider } from './providers/storyblok/types'
export type * from './providers/storyblok/types'

export type CMSProviders = 'storyblok' | 'contentful'

export type ModuleOptions = {
  provider: CMSProviders
} & StoryblokProvider
