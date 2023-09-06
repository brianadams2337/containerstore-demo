import { ValuesType } from 'utility-types'

/* eslint-enable @typescript-eslint/no-redeclare */

/* eslint-disable @typescript-eslint/no-redeclare */
/* intentionally naming the variables the same as the type */

export const Size = {
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
} as const

export type ButtonType = ValuesType<typeof ButtonType>

export const DEFAULT_UI_SIZE_PROP = {
  size: {
    type: String as PropType<Size>,
    default: 'md',
    validator: (val: Size) => ['xl', 'lg', 'md', 'sm', 'xs'].includes(val),
  },
}

export const CLASSES_FOR_LINK_TYPES: { [key: string]: string } = {
  loud: 'font-bold',
  'extra-loud': 'font-bold uppercase',
  normal: 'font-semibold',
  whisper: 'text-gray-700',
  quieter: 'text-xs font-medium text-gray-750 tracking-normal',
  quiet: 'text-sm font-semibold tracking-normal',
}
export const SlideInType = {
  DEFAULT: 'default',
  FROM_BOTTOM: 'fromBottom',
}
export type SlideInType = ValuesType<typeof SlideInType>

/* eslint-enable @typescript-eslint/no-redeclare */
