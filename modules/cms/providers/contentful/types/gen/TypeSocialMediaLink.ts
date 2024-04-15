import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode,
} from 'contentful'

export interface TypeSocialMediaLinkFields {
  uid?: EntryFieldTypes.Symbol
  type: EntryFieldTypes.Symbol<
    'facebook' | 'instagram' | 'snapchat' | 'twitter' | 'youtube'
  >
  url?: EntryFieldTypes.Symbol
  isActive?: EntryFieldTypes.Boolean
}

export type TypeSocialMediaLinkSkeleton = EntrySkeletonType<
  TypeSocialMediaLinkFields,
  'socialMediaLink'
>
export type TypeSocialMediaLink<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode,
> = Entry<TypeSocialMediaLinkSkeleton, Modifiers, Locales>

export function isTypeSocialMediaLink<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode,
>(
  entry: Entry<EntrySkeletonType, Modifiers, Locales>,
): entry is TypeSocialMediaLink<Modifiers, Locales> {
  return entry.sys.contentType.sys.id === 'socialMediaLink'
}

export type TypeSocialMediaLinkWithoutLinkResolutionResponse =
  TypeSocialMediaLink<'WITHOUT_LINK_RESOLUTION', LocaleCode>
export type TypeSocialMediaLinkWithoutUnresolvableLinksResponse =
  TypeSocialMediaLink<'WITHOUT_UNRESOLVABLE_LINKS', LocaleCode>
export type TypeSocialMediaLinkWithAllLocalesResponse<
  Locales extends LocaleCode = LocaleCode,
> = TypeSocialMediaLink<'WITH_ALL_LOCALES', Locales>
export type TypeSocialMediaLinkWithAllLocalesAndWithoutLinkResolutionResponse<
  Locales extends LocaleCode = LocaleCode,
> = TypeSocialMediaLink<'WITHOUT_LINK_RESOLUTION' | 'WITH_ALL_LOCALES', Locales>
export type TypeSocialMediaLinkWithAllLocalesAndWithoutUnresolvableLinksResponse<
  Locales extends LocaleCode = LocaleCode,
> = TypeSocialMediaLink<
  'WITHOUT_UNRESOLVABLE_LINKS' | 'WITH_ALL_LOCALES',
  Locales
>
