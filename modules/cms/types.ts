import type { ContentfulModuleOptions } from './providers/contentful/types'
import type { StoryblokModuleOptions } from './providers/storyblok/types'
import type { CMSProviders } from './utils/config'

export type CMSModuleOptions = {
  provider?: CMSProviders
  componentPrefix?: string
} & (StoryblokModuleOptions | ContentfulModuleOptions)

export type ModuleOptions = CMSModuleOptions
