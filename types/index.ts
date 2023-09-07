import { Category } from '@scayle/storefront-nuxt'

export type FlyoutMenuCategory = {
  name: string
  path: string
  slug: string
  id: number
  children: Category[]
}

export type PaymentIcon = {
  component: any
  width: number
}

export type PaymentIconsMap = { [key: string]: PaymentIcon }
