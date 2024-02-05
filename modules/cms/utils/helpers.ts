import type { StoryblokProvider } from '../providers/storyblok/types'
import type { ModuleOptions } from '../types'

export function isProviderStoryblok(
  options: ModuleOptions,
): options is StoryblokProvider {
  return options.provider === 'storyblok'
}
