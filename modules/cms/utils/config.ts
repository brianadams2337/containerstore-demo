export const CMSProvidersMap = {
  STORYBLOK: 'storyblok',
  CONTENTFUL: 'contentful',
} as const

export type CMSProviders =
  (typeof CMSProvidersMap)[keyof typeof CMSProvidersMap]
