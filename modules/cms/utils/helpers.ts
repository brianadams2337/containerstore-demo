import type { ContentfulProvider } from '../providers/contentful/types'
import type { StoryblokProvider } from '../providers/storyblok/types'
import type { ModuleOptions } from '../types'

export function isProviderStoryblok(
  options: ModuleOptions,
): options is StoryblokProvider {
  return options.provider === 'storyblok'
}
export function isProviderContentful(
  options: ModuleOptions,
): options is ContentfulProvider {
  return options.provider === 'contentful'
}
