import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode,
} from 'contentful'
import type { TypeGridSkeleton } from './TypeGrid'
import type { TypeImageSkeleton } from './TypeImage'
import type { TypeProductSkeleton } from './TypeProduct'

export interface TypeListingDisruptorFields {
  uid?: EntryFieldTypes.Symbol
  content?: EntryFieldTypes.Array<
    EntryFieldTypes.EntryLink<
      TypeGridSkeleton | TypeImageSkeleton | TypeProductSkeleton
    >
  >
  isContainered?: EntryFieldTypes.Boolean
  width?: EntryFieldTypes.Symbol<'1' | '2' | 'full'>
  insertInRow?: EntryFieldTypes.Symbol
}

export type TypeListingDisruptorSkeleton = EntrySkeletonType<
  TypeListingDisruptorFields,
  'listingDisruptor'
>
export type TypeListingDisruptor<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode,
> = Entry<TypeListingDisruptorSkeleton, Modifiers, Locales>

export function isTypeListingDisruptor<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode,
>(
  entry: Entry<EntrySkeletonType, Modifiers, Locales>,
): entry is TypeListingDisruptor<Modifiers, Locales> {
  return entry.sys.contentType.sys.id === 'listingDisruptor'
}

export type TypeListingDisruptorWithoutLinkResolutionResponse =
  TypeListingDisruptor<'WITHOUT_LINK_RESOLUTION', LocaleCode>
export type TypeListingDisruptorWithoutUnresolvableLinksResponse =
  TypeListingDisruptor<'WITHOUT_UNRESOLVABLE_LINKS', LocaleCode>
export type TypeListingDisruptorWithAllLocalesResponse<
  Locales extends LocaleCode = LocaleCode,
> = TypeListingDisruptor<'WITH_ALL_LOCALES', Locales>
export type TypeListingDisruptorWithAllLocalesAndWithoutLinkResolutionResponse<
  Locales extends LocaleCode = LocaleCode,
> = TypeListingDisruptor<
  'WITHOUT_LINK_RESOLUTION' | 'WITH_ALL_LOCALES',
  Locales
>
export type TypeListingDisruptorWithAllLocalesAndWithoutUnresolvableLinksResponse<
  Locales extends LocaleCode = LocaleCode,
> = TypeListingDisruptor<
  'WITHOUT_UNRESOLVABLE_LINKS' | 'WITH_ALL_LOCALES',
  Locales
>
