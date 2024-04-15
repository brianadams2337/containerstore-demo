import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode,
} from 'contentful'

export interface TypeNewsletterFields {
  uid?: EntryFieldTypes.Symbol
  upperText?: EntryFieldTypes.Symbol
  lowerText?: EntryFieldTypes.Symbol
}

export type TypeNewsletterSkeleton = EntrySkeletonType<
  TypeNewsletterFields,
  'newsletter'
>
export type TypeNewsletter<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode,
> = Entry<TypeNewsletterSkeleton, Modifiers, Locales>

export function isTypeNewsletter<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode,
>(
  entry: Entry<EntrySkeletonType, Modifiers, Locales>,
): entry is TypeNewsletter<Modifiers, Locales> {
  return entry.sys.contentType.sys.id === 'newsletter'
}

export type TypeNewsletterWithoutLinkResolutionResponse = TypeNewsletter<
  'WITHOUT_LINK_RESOLUTION',
  LocaleCode
>
export type TypeNewsletterWithoutUnresolvableLinksResponse = TypeNewsletter<
  'WITHOUT_UNRESOLVABLE_LINKS',
  LocaleCode
>
export type TypeNewsletterWithAllLocalesResponse<
  Locales extends LocaleCode = LocaleCode,
> = TypeNewsletter<'WITH_ALL_LOCALES', Locales>
export type TypeNewsletterWithAllLocalesAndWithoutLinkResolutionResponse<
  Locales extends LocaleCode = LocaleCode,
> = TypeNewsletter<'WITHOUT_LINK_RESOLUTION' | 'WITH_ALL_LOCALES', Locales>
export type TypeNewsletterWithAllLocalesAndWithoutUnresolvableLinksResponse<
  Locales extends LocaleCode = LocaleCode,
> = TypeNewsletter<'WITHOUT_UNRESOLVABLE_LINKS' | 'WITH_ALL_LOCALES', Locales>
