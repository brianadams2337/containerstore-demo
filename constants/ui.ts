import type { ValuesType } from 'utility-types'

/* intentionally naming the variables the same as the type */

export const Size = {
  '4XS': '4xs',
  XS: 'xs',
  SM: 'sm',
  MD: 'md',
  LG: 'lg',
  XL: 'xl',
} as const

export type Size = ValuesType<typeof Size>

export const HeadlineSize = {
  '4XL': '4xl',
  '2XL': '2xl',
  XL: 'xl',
  LG: 'lg',
  MD: 'base',
  SM: 'sm',
  XS: 'xs',
} as const

export type HeadlineSize = ValuesType<typeof HeadlineSize>

export const HeadlineTag = {
  H1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  P: 'p',
  DIV: 'div',
  SPAN: 'span',
} as const

export type HeadlineTag = ValuesType<typeof HeadlineTag>

export const SkeletonType = {
  BUTTON: 'button',
  HEADLINE: 'headline',
  CUSTOM: 'custom',
} as const

export type SkeletonType = ValuesType<typeof SkeletonType>

export const LinkVariant = {
  LOUD: 'loud',
  NORMAL: 'normal',
  WHISPER: 'whisper',
  QUIETER: 'quieter',
  QUIET: 'quiet',
} as const

export type LinkVariant = ValuesType<typeof LinkVariant>

export const ButtonType = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  TERTIARY: 'tertiary',
  GHOST: 'ghost',
  RAW: 'raw',
} as const

export type ButtonType = ValuesType<typeof ButtonType>

export const SlideInType = {
  DEFAULT: 'default',
  FROM_BOTTOM: 'fromBottom',
} as const

export type SlideInType = ValuesType<typeof SlideInType>

export const DividerItemTag = {
  DEFAULT_LINK: 'DefaultLink',
  NUXT_LINK: 'NuxtLink',
  PARAGRAPH: 'p',
} as const

export type DividerItemTag = ValuesType<typeof DividerItemTag>

export const ProgressType = {
  SUCCESS: 'success',
  WARN: 'warn',
  DANGER: 'danger',
  NEUTRAL: 'neutral',
} as const

export type ProgressType = ValuesType<typeof ProgressType>
