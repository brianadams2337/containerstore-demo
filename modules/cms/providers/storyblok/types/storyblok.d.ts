import '@nuxt/types'
import { SbPage } from './storyblok.gen'
export type BlokProps<T> = { blok: T }
export type MarginKey =
  | ''
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | '2xl'
  | '3xl'
  | '4xl'

export interface StoryblokTrackingContent {
  _uid?: string
  item_id?: string
  item_name?: string
  promotion_id?: string
  promotion_name?: string
  creative_name?: string
  creative_slot?: string
  location_id?: string
  index?: string
}

interface Margins {
  margin_top: MarginKey
}

export interface Alignment {
  justify: 'start' | 'center' | 'end'
  align: 'start' | 'center' | 'end'
}

// CLIENT TYPES

export interface StoryblokBridgeConfig {
  initOnlyOnce?: boolean
  accessToken?: string
}
export interface StoryblokEventPayload<
  S extends StoryblokComponent<string> = any,
> {
  action:
    | 'customEvent'
    | 'published'
    | 'input'
    | 'change'
    | 'unpublished'
    | 'enterEditmode'
  event?: string
  story?: S
  slug?: string
  slugChanged?: boolean
  storyId?: string
  reload?: boolean
}

export interface StoryblokBridge {
  init: (config?: StoryblokBridgeConfig) => void
  pingEditor: (callback: (instance: StoryblokBridge) => void) => void
  isInEditor: () => boolean
  enterEditmode: () => void
  on: (
    event:
      | 'customEvent'
      | 'published'
      | 'input'
      | 'change'
      | 'unpublished'
      | 'enterEditmode'
      | string[],
    callback: (payload?: StoryblokEventPayload) => void,
  ) => void
  addComments: (
    tree: StoryblokComponent<string>,
    storyId: string,
  ) => StoryblokComponent<string>
  resolveRelations: (
    story: any,
    resolve: string[],
    callback: (storyContent: any) => void,
  ) => void
}

export interface CmsFetchOptions {
  startsWith?: string
  perPage?: number
  language?: string
  version?: StoriesParams['version']
}

export * from './storyblok.gen'

export type SbSeo = Partial<{
  _uid: string
  title: string
  plugin: string
  og_image: string
  og_title: string
  description: string
  twitter_image: string
  twitter_title: string
  og_description: string
  twitter_description: string
}>
