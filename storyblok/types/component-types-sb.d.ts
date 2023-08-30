import { StoryblokStory } from 'storyblok-generate-ts'

export interface AccordionStoryblok {
  has_link_list?: boolean
  entries?: AccordionEntryStoryblok[]
  margin_top?: '' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  _uid: string
  component: 'Accordion'
  [k: string]: any
}

export interface RichtextStoryblok {
  type: string
  content?: RichtextStoryblok[]
  marks?: RichtextStoryblok[]
  attrs?: any
  text?: string
  [k: string]: any
}

export interface AccordionEntryStoryblok {
  title?: string
  link_title: string
  body?: RichtextStoryblok
  _uid: string
  component: 'AccordionEntry'
  [k: string]: any
}

export type MultilinkStoryblok =
  | {
      cached_url?: string
      linktype?: string
      [k: string]: any
    }
  | {
      id?: string
      cached_url?: string
      anchor?: string
      linktype?: 'story'
      story?: {
        name: string
        created_at?: string
        published_at?: string
        id: number
        uuid: string
        content?: {
          [k: string]: any
        }
        slug: string
        full_slug: string
        sort_by_date?: null | string
        position?: number
        tag_list?: string[]
        is_startpage?: boolean
        parent_id?: null | number
        meta_data?: null | {
          [k: string]: any
        }
        group_id?: string
        first_published_at?: string
        release_id?: null | number
        lang?: string
        path?: null | string
        alternates?: any[]
        default_full_slug?: null | string
        translated_slugs?: null | any[]
        [k: string]: any
      }
      [k: string]: any
    }
  | {
      url?: string
      cached_url?: string
      anchor?: string
      linktype?: 'asset' | 'url'
      [k: string]: any
    }
  | {
      email?: string
      linktype?: 'email'
      [k: string]: any
    }

export interface BannerStoryblok {
  is_active?: boolean
  type?: '' | 'info' | 'sale' | 'highlight'
  body?: RichtextStoryblok
  countdown_until?: string
  links?: BannerLinkStoryblok[]
  item_id: string
  item_name: string
  promotion_id: string
  promotion_name: string
  creative_name: string
  creative_slot: string
  location_id: string
  index: string
  cta_url?: MultilinkStoryblok
  _uid: string
  component: 'Banner'
  [k: string]: any
}

export interface BannerLinkStoryblok {
  label?: string
  cta_url?: MultilinkStoryblok
  item_id?: string
  item_name?: string
  promotion_id?: string
  promotion_name?: string
  creative_name?: string
  creative_slot?: string
  location_id?: string
  index?: string
  _uid: string
  component: 'BannerLink'
  [k: string]: any
}

export interface ClickableImageStoryblok {
  item_id?: string
  image: CmsImageStoryblok[]
  cta_url: MultilinkStoryblok
  item_name?: string
  promotion_id?: string
  promotion_name?: string
  creative_name?: string
  creative_slot?: string
  location_id?: string
  index?: string
  margin_top?: '' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  _uid: string
  component: 'ClickableImage'
  [k: string]: any
}

export interface AssetStoryblok {
  alt?: string
  copyright?: string
  id: number
  filename: string
  name: string
  title?: string
  focus?: string
  [k: string]: any
}

export interface CmsImageStoryblok {
  desktop_image?: AssetStoryblok
  mobile_image?: AssetStoryblok
  item_id?: string
  item_name?: string
  promotion_id?: string
  promotion_name?: string
  creative_name?: string
  creative_slot?: string
  location_id?: string
  index?: string
  _uid: string
  component: 'CmsImage'
  [k: string]: any
}

export interface CmsTextStoryblok {
  body?: RichtextStoryblok
  _uid: string
  component: 'CmsText'
  [k: string]: any
}

export interface ContentPageStoryblok {
  teaser_image?: AssetStoryblok
  teaser_image_mobile?: AssetStoryblok
  headline?: string
  subline?: string
  content?: (
    | CmsImageStoryblok
    | CmsTextStoryblok
    | GridStoryblok
    | ImageSliderStoryblok
    | ProductSliderStoryblok
    | SlideShowStoryblok
    | SocialMediaLinkStoryblok
    | VideoStoryblok
    | AccordionStoryblok
    | CustomerServiceInfoStoryblok
    | DoubleColumnStoryblok
    | ParagraphStoryblok
  )[]
  SEO?: {
    _uid?: string
    title?: string
    plugin?: string
    og_image?: string
    og_title?: string
    description?: string
    twitter_image?: string
    twitter_title?: string
    og_description?: string
    twitter_description?: string
    [k: string]: any
  }
  _uid: string
  component: 'ContentPage'
  [k: string]: any
}

export interface CustomerServiceInfoStoryblok {
  _uid: string
  component: 'CustomerServiceInfo'
  [k: string]: any
}

export interface DetailImageStoryblok {
  image: AssetStoryblok
  product_ids?: string
  _uid: string
  component: 'DetailImage'
  [k: string]: any
}

export interface DoubleColumnStoryblok {
  column_left?: any[]
  column_right?: any[]
  margin_top?: '' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'
  _uid: string
  component: 'DoubleColumn'
  [k: string]: any
}

export interface FooterStoryblok {
  text?: RichtextStoryblok
  align_right?: boolean
  link_groups?: LinkGroupStoryblok[]
  text_bottom?: string
  social_media?: SocialMediaLinkStoryblok[]
  _uid: string
  component: 'Footer'
  [k: string]: any
}

export interface GridStoryblok {
  margin_top?: '' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'
  is_containered?: boolean
  is_containered_desktop?: boolean
  is_spaced?: boolean
  columns?: (
    | ShopableImageStoryblok
    | ProductStoryblok
    | ClickableImageStoryblok
    | ParagraphStoryblok
    | VideoStoryblok
    | CmsImageStoryblok
    | CmsTextStoryblok
    | GridTileStoryblok
    | ImageTextStoryblok
  )[]
  _uid: string
  component: 'Grid'
  [k: string]: any
}

export interface GridTileStoryblok {
  content: (
    | ShopableImageStoryblok
    | ProductStoryblok
    | ClickableImageStoryblok
    | VideoStoryblok
    | CmsImageStoryblok
  )[]
  headline?: string
  cta?: string
  cta_link?: MultilinkStoryblok
  _uid: string
  component: 'GridTile'
  [k: string]: any
}

export interface ImageSliderStoryblok {
  headline?: string
  cta_label?: string
  cta_url?: string
  slides?: ImageSliderSlideStoryblok[]
  margin_top?: '' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  _uid: string
  component: 'ImageSlider'
  [k: string]: any
}

export interface ImageSliderSlideStoryblok {
  image: AssetStoryblok
  topline?: string
  headline: string
  is_new?: boolean
  cta_label: string
  cta_url: MultilinkStoryblok
  item_id?: string
  item_name?: string
  promotion_id?: string
  promotion_name?: string
  creative_name?: string
  creative_slot?: string
  location_id?: string
  index?: string
  _uid: string
  component: 'ImageSliderSlide'
  [k: string]: any
}

export interface ImageTextStoryblok {
  align?: 'start' | 'center' | 'end'
  image: CmsImageStoryblok[]
  topline?: string
  headline?: string
  text?: string
  cta?: string
  cta_link?: MultilinkStoryblok
  justify?: 'start' | 'center' | 'end'
  _uid: string
  component: 'ImageText'
  [k: string]: any
}

export interface LinkStoryblok {
  label: string
  cta_url: MultilinkStoryblok
  open_in_new_tab?: boolean
  _uid: string
  component: 'Link'
  [k: string]: any
}

export interface LinkGroupStoryblok {
  title?: string
  links?: LinkStoryblok[]
  _uid: string
  component: 'LinkGroup'
  [k: string]: any
}

export interface ListingDisruptorStoryblok {
  content?: (GridStoryblok | ProductStoryblok | CmsImageStoryblok)[]
  is_containered?: boolean
  width?: '' | '1' | '2' | 'full'
  insert_in_row?: string
  _uid: string
  component: 'ListingDisruptor'
  [k: string]: any
}

export interface ListingPageStoryblok {
  teaser_image?: AssetStoryblok
  teaser_image_mobile?: AssetStoryblok
  pre_listing_content?: any[]
  listing?: ListingDisruptorStoryblok[]
  SEO?: {
    _uid?: string
    title?: string
    plugin?: string
    og_image?: string
    og_title?: string
    description?: string
    twitter_image?: string
    twitter_title?: string
    og_description?: string
    twitter_description?: string
    [k: string]: any
  }
  post_listing_content?: any[]
  _uid: string
  component: 'ListingPage'
  [k: string]: any
}

export interface NewsletterStoryblok {
  upper_text?: string
  lower_text?: string
  _uid: string
  component: 'Newsletter'
  [k: string]: any
}

export interface PageStoryblok {
  teaser_image?: AssetStoryblok
  teaser_image_mobile?: AssetStoryblok
  content?: (
    | CmsImageStoryblok
    | CmsTextStoryblok
    | GridStoryblok
    | ImageSliderStoryblok
    | ProductSliderStoryblok
    | SlideShowStoryblok
    | SocialMediaLinkStoryblok
    | VideoStoryblok
    | AccordionStoryblok
    | CustomerServiceInfoStoryblok
    | DoubleColumnStoryblok
    | ParagraphStoryblok
  )[]
  SEO?: {
    _uid?: string
    title?: string
    plugin?: string
    og_image?: string
    og_title?: string
    description?: string
    twitter_image?: string
    twitter_title?: string
    og_description?: string
    twitter_description?: string
    [k: string]: any
  }
  _uid: string
  component: 'Page'
  [k: string]: any
}

export type MultiassetStoryblok = {
  alt?: string
  copyright?: string
  id: number
  filename: string
  name: string
  title?: string
  [k: string]: any
}[]

export interface ParagraphStoryblok {
  headline?: string
  cta?: MultilinkStoryblok
  body?: RichtextStoryblok
  sub_title?: string
  images?: MultiassetStoryblok
  _uid: string
  component: 'Paragraph'
  [k: string]: any
}

export interface ProductStoryblok {
  product_id?: string
  _uid: string
  component: 'Product'
  [k: string]: any
}

export interface ProductSliderStoryblok {
  headline?: string
  cta_label?: string
  cta_url?: string
  product_ids?: string
  margin_top?: '' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  _uid: string
  component: 'ProductSlider'
  [k: string]: any
}

export interface ShopableImageStoryblok {
  image?: CmsImageStoryblok[]
  detail_images?: DetailImageStoryblok[]
  title?: string
  product_ids?: string
  margin_top?: '' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  _uid: string
  component: 'ShopableImage'
  [k: string]: any
}

export interface SlideStoryblok {
  image?: (CmsImageStoryblok | VideoStoryblok)[]
  topline?: string
  headline?: string
  cta_label?: string
  cta_url?: MultilinkStoryblok
  is_dark?: boolean
  align?: 'start' | 'center' | 'end'
  justify?: 'start' | 'center' | 'end'
  _uid: string
  component: 'Slide'
  [k: string]: any
}

export interface SlideShowStoryblok {
  h1?: string
  slides?: SlideStoryblok[]
  margin_top?: '' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  _uid: string
  component: 'SlideShow'
  [k: string]: any
}

export interface SocialMediaLinkStoryblok {
  type: '' | 'facebook' | 'instagram' | 'snapchat' | 'twitter' | 'youtube'
  url?: MultilinkStoryblok
  isActive?: boolean
  _uid: string
  component: 'SocialMediaLink'
  [k: string]: any
}

export interface StoreStoryblok {
  image?: AssetStoryblok
  city?: string
  name: RichtextStoryblok
  address: RichtextStoryblok
  opening_hours?: RichtextStoryblok
  contact?: RichtextStoryblok
  phone?: string
  email?: string
  SEO?: {
    _uid?: string
    title?: string
    plugin?: string
    og_image?: string
    og_title?: string
    description?: string
    twitter_image?: string
    twitter_title?: string
    og_description?: string
    twitter_description?: string
    [k: string]: any
  }
  _uid: string
  component: 'Store'
  [k: string]: any
}

export interface StorePageStoryblok {
  teaser_image: CmsImageStoryblok[]
  contact_email: string
  SEO?: {
    _uid?: string
    title?: string
    plugin?: string
    og_image?: string
    og_title?: string
    description?: string
    twitter_image?: string
    twitter_title?: string
    og_description?: string
    twitter_description?: string
    [k: string]: any
  }
  _uid: string
  component: 'StorePage'
  [k: string]: any
}

export interface StoryStoryblok {
  color?: string
  image?: AssetStoryblok
  label?: string
  cta_url?: string
  _uid: string
  component: 'Story'
  [k: string]: any
}

export interface TitleStoryblok {
  text?: string
  image?: AssetStoryblok
  _uid: string
  component: 'Title'
  [k: string]: any
}

export interface VideoStoryblok {
  margin_top?: '' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'
  control_color?: string
  autoplay?: boolean
  has_controls?: boolean
  is_containered?: boolean
  video: AssetStoryblok
  preview_desktop_image?: AssetStoryblok
  preview_mobile_image?: AssetStoryblok
  item_id?: string
  item_name?: string
  promotion_id?: string
  promotion_name?: string
  creative_name?: string
  creative_slot?: string
  location_id?: string
  index?: string
  loop?: boolean
  _uid: string
  component: 'Video'
  [k: string]: any
}
