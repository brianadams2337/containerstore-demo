import { ValuesType } from 'utility-types'

export const Action = {
  CONFIRM: 'CONFIRM',
  RELOAD: 'RELOAD',
  ROUTE: 'ROUTE',
} as const

// eslint-disable-next-line @typescript-eslint/no-redeclare -- intentionally naming the variable the same as the type
export type Action = ValuesType<typeof Action>
