import {
  BasketItem,
  Product,
  ShopUser,
  Price,
  Variant,
  WishlistItem,
} from '@scayle/storefront-nuxt'

export {}

declare global {
  type EcommerceTrackingEvent =
    | 'view_item'
    | 'view_item_list'
    | 'view_promotion'
    | 'add_to_wishlist'
    | 'remove_from_wishlist'
    | 'view_cart'
    | 'add_to_cart'
    | 'remove_from_cart'
    | 'select_item'
    | 'select_promotion'

  type BasicTrackingEvent =
    | 'shop_init'
    | 'shop_change'
    | 'customer_data'
    | 'content_view'

  type CheckoutTrackingEvent = 'begin_checkout' | 'finish_checkout'

  type AdditionalTrackingEvent =
    | 'cart'
    | 'wishlist'
    | 'search'
    | 'filter_flyout'
    | 'filter_slider'

  type AuthTrackingEvent =
    | 'login'
    | 'logout'
    | 'sign_up'
    | 'forgot_password'
    | 'reset_password'
    | 'guest_login'

  type TrackingEvent =
    | EcommerceTrackingEvent
    | BasicTrackingEvent
    | AdditionalTrackingEvent
    | CheckoutTrackingEvent
    | AuthTrackingEvent

  type PageType =
    | 'homepage'
    | 'access'
    | 'lookbooks'
    | 'checkout'
    | 'checkout:#/shipping'
    | 'checkout:#/payment'
    | 'checkout:#/auth'
    | 'search result page'
    | 'service_pages'
    | 'content_pages'
    | 'browse'
    | 'navigation'
    | 'discovery'
    | 'category'
    | 'category_overview'
    | 'pdp'
    | 'basket'
    | 'wishlist'
    | 'brand'
    | 'brand_overview'
    | 'story'
    | 'story_overview'
    | 'outfit'
    | 'outfit_overview'
    | 'account_area'
    | 'account_area:OId'
    | 'account_area:userIndex'
    | 'osp'
    | 'help'
    | 'offCanvas'
    | 'other'
    | string

  interface BasicViewData {
    content_name: string
    page_type: PageType
    page_type_id: string
  }

  interface TrackingCategory {
    name: string
    id: string
  }

  interface ListItem {
    name: string
    id: string
    index?: number
  }

  interface ProductListData {
    product: Product
    category?: TrackingCategory
    list?: ListItem
    quantity?: number
    pagePayload?: BasicViewData
  }

  interface ProductViewData extends ProductListData {
    destination: string
    destinationUrl: string
    source: string
    position?: number
    pagePayload?: BasicViewData
  }

  interface MultipleActionData {
    currencyCode?: string
    valueWithoutTax?: number
    items: ProductListData[]
    pagePayload?: BasicViewData
  }

  interface ProductActionData {
    product: Product & { index?: number }
    variant?: Variant
    category?: TrackingCategory
    quantity?: number
    list?: ListItem
    currencyCode: string
    index?: number
    pagePayload?: BasicViewData
  }

  interface ProductInfo {
    item_id: string
    item_name: string
    price: number
    sale_discount: number
    campaign_discount: number
    original_price: number
    item_brand: string
    item_brand_id: string
    tax: number
  }

  interface AdditionalInfo {
    item_category: string
    item_category_id: string
    item_variant: string
    quantity?: string
    item_list_name: string
    item_list_id: string
    index?: number | null
  }

  interface ViewInfo extends AdditionalInfo {
    source: string
    destination: string
    destination_url: string
    sold_out?: boolean
    bi_price: string
  }

  interface ShopData {
    shop_id: string | number
    shop_gender: string
    locale: string
    shop_currency: string
  }

  interface FilterData {
    action: string
    label: string
    sortType?: string
  }

  interface BasketData {
    items: BasketItem[]
    total_campaign_reduction_with_tax: number
    total_sale_reduction_with_tax: number
    total_with_tax: number
    total_without_tax: number
  }
  interface WishlistData {
    items: WishlistItem[]
    total_campaign_reduction_with_tax: number
    total_sale_reduction_with_tax: number
    total_with_tax: number
    total_without_tax: number
  }

  interface PromotionItem {
    item_id?: string
    item_name?: string
    promotion_id?: string
    promotion_name?: string
    creative_name?: string
    creative_slot?: string
    location_id?: string
    index?: number
  }

  interface PromotionData {
    items: PromotionItem[]
  }

  interface ShopInitData extends ShopData {
    landing_page: string
    shop_version: string
    parameter: string
    referrer: string
    deeplink: string
    origin: string
  }

  interface PageViewData extends BasicViewData {
    title: string
    click_origin?: string
  }

  type SearchAction =
    | 'history_term'
    | 'suggested_product'
    | 'suggested_category'
    | 'search_button'
    | 'search_hotkey'

  interface SearchData {
    search_term: string
    search_term_completed: String
    search_action: SearchAction
    search_destination: string
  }

  type AuthenticationType = 'none' | 'email' | 'facebook' | 'apple' | 'password'

  type CustomerType = 'guest' | 'new' | 'existing'

  type StatusType = 'successful' | 'error'

  type EventType = 'login' | 'login_modal' | 'sign_up'

  interface CustomerData {
    customer_id?: number
    customer_type?: CustomerType
    login?: boolean
    method: AuthenticationType
    bi_vp?: boolean
    bi_sc?: number
    eh: string
    status?: StatusType
  }

  interface CustomerInfo {
    customer_id?: number
    customer_type: CustomerType
    method: AuthenticationType
    eh: string
    status?: StatusType
  }

  interface CustomerLogoutData {
    customer_id?: number
    eh: string
  }

  type TrackingPayload =
    | ProductActionData
    | MultipleActionData
    | ProductViewData
    | ProductListData
    | ShopData
    | ShopInitData
    | PageViewData
    | CustomerData
    | CustomerInfo
    | CustomerLogoutData
    | SearchData
    | FilterData
    | BasketData
    | WishlistData
    | PromotionData

  interface AdditionalItem extends AdditionalInfo {
    item_id: string
    item_name: string
    price: number
    sale_discount: number
    campaign_discount: number
    original_price: number
    item_brand: string
    item_brand_id: string
    quantity: string
  }

  type TrackAddToBasketParams = {
    product: Product
    quantity?: number
    variant?: Variant
    index?: number
    list?: ListItem
  }

  type TrackCustomerDataParams = {
    user?: ShopUser
    customerType: CustomerType
    isLoggedIn: boolean
    biVp?: boolean
    biSc?: number
  }

  type TrackViewItemListEventParams = {
    items: any[]
    listingMetaData: ListItem
    productIndex?: number
    paginationOffset?: number
    source?: string
    category?: { name: string; id: string }
    positionOffset?: number
  }

  type TrackSelectItemEventParams = {
    product: Product
    category?: { name?: string; id?: number | string }
    variant?: Variant
    listingMetaData?: ListItem
    index?: number
    source?: string
    position?: number
    quantity?: number
    soldOut?: boolean
    pagePayload: BasicViewData
  }

  type TrackViewItemParams = {
    product: Product
    quantity?: number
    variant?: Variant
  }

  type TrackSearchEventParams = {
    searchTerm: string
    suggestion?: string
    searchAction:
      | 'search_button'
      | 'suggested_product'
      | 'suggested_category'
      | 'search_hotkey'
      | 'history_term'
    searchDestination?: string
  }

  type TrackContentViewEventParams = {
    contentName: string
    title: string
    pageType: PageType
    pageTypeId: string
    clickOrigin: string
  }

  type TrackAddToWishListParams = {
    product: Product
    quantity?: number
    listingMetaData?: ListItem
    category?: { id?: number; name?: string }
    variant?: Variant
    index?: number
    pagePayload: BasicViewData
  }

  type TrackRemoveFromWishListParams = TrackAddToWishListParams

  type OrderItemVariant = {
    id: number
  }
  type OrderItemProduct = {
    name: string
    variant: OrderItemVariant
    price: Price
  }
}
