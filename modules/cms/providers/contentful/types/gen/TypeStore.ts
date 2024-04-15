import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode,
} from 'contentful'
import type { TypeSeoSkeleton } from './TypeSeo'

export interface TypeStoreFields {
  uid?: EntryFieldTypes.Symbol
  slug: EntryFieldTypes.Symbol
  image?: EntryFieldTypes.AssetLink
  city?: EntryFieldTypes.Symbol
  name: EntryFieldTypes.RichText
  address: EntryFieldTypes.RichText
  openingHours?: EntryFieldTypes.RichText
  contact?: EntryFieldTypes.RichText
  phone?: EntryFieldTypes.Symbol
  email?: EntryFieldTypes.Symbol
  seo?: EntryFieldTypes.EntryLink<TypeSeoSkeleton>
}

export type TypeStoreSkeleton = EntrySkeletonType<TypeStoreFields, 'store'>
export type TypeStore<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode,
> = Entry<TypeStoreSkeleton, Modifiers, Locales>

export function isTypeStore<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode,
>(
  entry: Entry<EntrySkeletonType, Modifiers, Locales>,
): entry is TypeStore<Modifiers, Locales> {
  return entry.sys.contentType.sys.id === 'store'
}

export type TypeStoreWithoutLinkResolutionResponse = TypeStore<
  'WITHOUT_LINK_RESOLUTION',
  LocaleCode
>
export type TypeStoreWithoutUnresolvableLinksResponse = TypeStore<
  'WITHOUT_UNRESOLVABLE_LINKS',
  LocaleCode
>
export type TypeStoreWithAllLocalesResponse<
  Locales extends LocaleCode = LocaleCode,
> = TypeStore<'WITH_ALL_LOCALES', Locales>
export type TypeStoreWithAllLocalesAndWithoutLinkResolutionResponse<
  Locales extends LocaleCode = LocaleCode,
> = TypeStore<'WITHOUT_LINK_RESOLUTION' | 'WITH_ALL_LOCALES', Locales>
export type TypeStoreWithAllLocalesAndWithoutUnresolvableLinksResponse<
  Locales extends LocaleCode = LocaleCode,
> = TypeStore<'WITHOUT_UNRESOLVABLE_LINKS' | 'WITH_ALL_LOCALES', Locales>
