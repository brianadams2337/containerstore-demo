import type { ValuesType } from 'utility-types'

type UppercaseObjectKeys<T extends string> = {
  [x in Uppercase<T>]: Lowercase<x>
}

type StatusKeys = UppercaseObjectKeys<Package['deliveryStatus']>

export const Status: StatusKeys = {
  OPEN: 'open',
  SHIPMENT_PENDING: 'shipment_pending',
  DELEGATION_PENDING: 'delegation_pending',
  SHIPMENT_COMPLETED: 'shipment_completed',
  CANCELLATION_COMPLETED: 'cancellation_completed',
} as const

/* eslint-disable-next-line @typescript-eslint/no-redeclare */
export type Status = ValuesType<typeof Status>

export const DeliveryProgress: Readonly<
  Record<Status, number> & { DEFAULT: number }
> = {
  [Status.OPEN]: 25,
  [Status.SHIPMENT_PENDING]: 50,
  [Status.DELEGATION_PENDING]: 75,
  [Status.SHIPMENT_COMPLETED]: 100,
  [Status.CANCELLATION_COMPLETED]: 100,
  DEFAULT: 5,
}
