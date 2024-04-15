import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode,
} from 'contentful'

export interface TypeMammutCeFields {
  uid?: EntryFieldTypes.Symbol
  image?: EntryFieldTypes.AssetLink
  headline?: EntryFieldTypes.Symbol
  cta?: EntryFieldTypes.Symbol
  ctaLink?: EntryFieldTypes.Symbol
}

export type TypeMammutCeSkeleton = EntrySkeletonType<
  TypeMammutCeFields,
  'mammutCe'
>
export type TypeMammutCe<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode,
> = Entry<TypeMammutCeSkeleton, Modifiers, Locales>

export function isTypeMammutCe<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode,
>(
  entry: Entry<EntrySkeletonType, Modifiers, Locales>,
): entry is TypeMammutCe<Modifiers, Locales> {
  return entry.sys.contentType.sys.id === 'mammutCe'
}

export type TypeMammutCeWithoutLinkResolutionResponse = TypeMammutCe<
  'WITHOUT_LINK_RESOLUTION',
  LocaleCode
>
export type TypeMammutCeWithoutUnresolvableLinksResponse = TypeMammutCe<
  'WITHOUT_UNRESOLVABLE_LINKS',
  LocaleCode
>
export type TypeMammutCeWithAllLocalesResponse<
  Locales extends LocaleCode = LocaleCode,
> = TypeMammutCe<'WITH_ALL_LOCALES', Locales>
export type TypeMammutCeWithAllLocalesAndWithoutLinkResolutionResponse<
  Locales extends LocaleCode = LocaleCode,
> = TypeMammutCe<'WITHOUT_LINK_RESOLUTION' | 'WITH_ALL_LOCALES', Locales>
export type TypeMammutCeWithAllLocalesAndWithoutUnresolvableLinksResponse<
  Locales extends LocaleCode = LocaleCode,
> = TypeMammutCe<'WITHOUT_UNRESOLVABLE_LINKS' | 'WITH_ALL_LOCALES', Locales>
