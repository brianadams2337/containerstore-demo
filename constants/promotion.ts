import { ValuesType } from 'utility-types'

/* eslint-disable @typescript-eslint/no-redeclare */
/* intentionally naming the variables the same as the type */

export const PromotionHeadlineSize = {
  BASE: 'base',
  SM: 'sm',
} as const

export type PromotionHeadlineSize = ValuesType<typeof PromotionHeadlineSize>

/* eslint-enable @typescript-eslint/no-redeclare */

export const COUNTDOWN_LOADER_UNITS = 4
export const PROMOTIONS_CHANGE_DELAY = 5000
