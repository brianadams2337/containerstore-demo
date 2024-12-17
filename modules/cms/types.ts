import type { ContentfulModuleOptions } from './providers/contentful/types'
import type { StoryblokModuleOptions } from './providers/storyblok/types'
import type { CMSProviders } from './utils/config'

export type CMSModuleOptions = {
  provider?: CMSProviders
  componentPrefix?: string
} & (StoryblokModuleOptions | ContentfulModuleOptions)

// eslint-disable-next-line sonarjs/redundant-type-aliases
export type ModuleOptions = CMSModuleOptions
