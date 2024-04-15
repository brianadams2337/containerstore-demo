import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode,
} from 'contentful'
import type { TypeImageSkeleton } from './TypeImage'
import type { TypeSeoSkeleton } from './TypeSeo'

export interface TypeStorePageFields {
  uid?: EntryFieldTypes.Symbol
  slug: EntryFieldTypes.Symbol
  teaserImage: EntryFieldTypes.Array<
    EntryFieldTypes.EntryLink<TypeImageSkeleton>
  >
  contactEmail: EntryFieldTypes.Symbol
  seo?: EntryFieldTypes.EntryLink<TypeSeoSkeleton>
}

export type TypeStorePageSkeleton = EntrySkeletonType<
  TypeStorePageFields,
  'storePage'
>
export type TypeStorePage<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode,
> = Entry<TypeStorePageSkeleton, Modifiers, Locales>

export function isTypeStorePage<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode,
>(
  entry: Entry<EntrySkeletonType, Modifiers, Locales>,
): entry is TypeStorePage<Modifiers, Locales> {
  return entry.sys.contentType.sys.id === 'storePage'
}

export type TypeStorePageWithoutLinkResolutionResponse = TypeStorePage<
  'WITHOUT_LINK_RESOLUTION',
  LocaleCode
>
export type TypeStorePageWithoutUnresolvableLinksResponse = TypeStorePage<
  'WITHOUT_UNRESOLVABLE_LINKS',
  LocaleCode
>
export type TypeStorePageWithAllLocalesResponse<
  Locales extends LocaleCode = LocaleCode,
> = TypeStorePage<'WITH_ALL_LOCALES', Locales>
export type TypeStorePageWithAllLocalesAndWithoutLinkResolutionResponse<
  Locales extends LocaleCode = LocaleCode,
> = TypeStorePage<'WITHOUT_LINK_RESOLUTION' | 'WITH_ALL_LOCALES', Locales>
export type TypeStorePageWithAllLocalesAndWithoutUnresolvableLinksResponse<
  Locales extends LocaleCode = LocaleCode,
> = TypeStorePage<'WITHOUT_UNRESOLVABLE_LINKS' | 'WITH_ALL_LOCALES', Locales>
