import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode,
} from 'contentful'
import type { TypeLinkGroupSkeleton } from './TypeLinkGroup'
import type { TypeSocialMediaLinkSkeleton } from './TypeSocialMediaLink'

export interface TypeFooterFields {
  uid?: EntryFieldTypes.Symbol
  slug: EntryFieldTypes.Symbol
  text?: EntryFieldTypes.RichText
  alignRight?: EntryFieldTypes.Boolean
  linkGroups?: EntryFieldTypes.Array<
    EntryFieldTypes.EntryLink<TypeLinkGroupSkeleton>
  >
  textBottom?: EntryFieldTypes.Symbol
  socialMedia?: EntryFieldTypes.Array<
    EntryFieldTypes.EntryLink<TypeSocialMediaLinkSkeleton>
  >
}

export type TypeFooterSkeleton = EntrySkeletonType<TypeFooterFields, 'footer'>
export type TypeFooter<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode,
> = Entry<TypeFooterSkeleton, Modifiers, Locales>

export function isTypeFooter<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode,
>(
  entry: Entry<EntrySkeletonType, Modifiers, Locales>,
): entry is TypeFooter<Modifiers, Locales> {
  return entry.sys.contentType.sys.id === 'footer'
}

export type TypeFooterWithoutLinkResolutionResponse = TypeFooter<
  'WITHOUT_LINK_RESOLUTION',
  LocaleCode
>
export type TypeFooterWithoutUnresolvableLinksResponse = TypeFooter<
  'WITHOUT_UNRESOLVABLE_LINKS',
  LocaleCode
>
export type TypeFooterWithAllLocalesResponse<
  Locales extends LocaleCode = LocaleCode,
> = TypeFooter<'WITH_ALL_LOCALES', Locales>
export type TypeFooterWithAllLocalesAndWithoutLinkResolutionResponse<
  Locales extends LocaleCode = LocaleCode,
> = TypeFooter<'WITHOUT_LINK_RESOLUTION' | 'WITH_ALL_LOCALES', Locales>
export type TypeFooterWithAllLocalesAndWithoutUnresolvableLinksResponse<
  Locales extends LocaleCode = LocaleCode,
> = TypeFooter<'WITHOUT_UNRESOLVABLE_LINKS' | 'WITH_ALL_LOCALES', Locales>
