import type { ValuesType } from 'utility-types'

/* intentionally naming the variables the same as the type */

export const PromotionHeadlineSize = {
  BASE: 'base',
  SM: 'sm',
  XS: 'xs',
} as const

export type PromotionHeadlineSize = ValuesType<typeof PromotionHeadlineSize>

export const COUNTDOWN_LOADER_UNITS = 4
export const PROMOTIONS_CHANGE_DELAY = 5000
export const PROMOTION_SLIDE_IN_LIMIT = 10
