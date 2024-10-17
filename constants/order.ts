import type { ValuesType } from 'utility-types'
import type { Package } from '~/types/order'

type UppercaseObjectKeys<T extends string> = {
  [x in Uppercase<T>]: Lowercase<x>
}

type StatusKeys = UppercaseObjectKeys<Package['deliveryStatus']>

export const OrderStatus: StatusKeys = {
  OPEN: 'open',
  SHIPMENT_PENDING: 'shipment_pending',
  DELEGATION_PENDING: 'delegation_pending',
  SHIPMENT_COMPLETED: 'shipment_completed',
  CANCELLATION_COMPLETED: 'cancellation_completed',
} as const

export type OrderStatus = ValuesType<typeof OrderStatus>

export const DeliveryProgress: Readonly<
  Record<OrderStatus, number> & { DEFAULT: number }
> = {
  [OrderStatus.OPEN]: 25,
  [OrderStatus.SHIPMENT_PENDING]: 50,
  [OrderStatus.DELEGATION_PENDING]: 75,
  [OrderStatus.SHIPMENT_COMPLETED]: 100,
  [OrderStatus.CANCELLATION_COMPLETED]: 100,
  DEFAULT: 5,
}
