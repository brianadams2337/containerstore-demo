import type {
  ChainModifiers,
  EntrySkeletonType,
  EntriesQueries,
  EntryCollection,
  LocaleCode,
  Entry,
  ContentfulCollection,
  ContentfulClientApi,
  AddChainModifier,
} from 'contentful'
import type { AsyncDataOptions } from 'nuxt/app'
import { useDefaultCMSOptions } from './useDefaultCMSOptions'
import { useContentful } from './useContentful'

export function useCMS(key: string) {
  const defaultCMSOptions = useDefaultCMSOptions()
  const contentfulClient = useContentful() as unknown as ContentfulClientApi<
    AddChainModifier<ChainModifiers, 'WITHOUT_UNRESOLVABLE_LINKS'>
  >
  async function fetchBySlug<
    T extends EntrySkeletonType = EntrySkeletonType,
    Modifiers extends ChainModifiers = ChainModifiers,
    Locale extends LocaleCode = LocaleCode,
  >(
    query?: EntriesQueries<T, Modifiers>,
    asyncDataOption?: AsyncDataOptions<
      ContentfulCollection<Entry<T, Modifiers, Locale>>,
      Entry<T, Modifiers, Locale> | undefined
    >,
  ) {
    return await useAsyncData(
      key,
      () =>
        contentfulClient.getEntries<T, Locale>({
          include: 10,
          limit: 1,
          ...defaultCMSOptions,
          ...query,
        }) as unknown as Promise<
          ContentfulCollection<Entry<T, Modifiers, Locale>>
        >,
      {
        transform: (data) => {
          return data.items.at(0)
        },
        ...asyncDataOption,
      },
    )
  }

  async function fetchByFolder<
    T extends EntrySkeletonType,
    Modifiers extends ChainModifiers =
      | 'WITH_ALL_LOCALES'
      | 'WITHOUT_LINK_RESOLUTION'
      | 'WITHOUT_UNRESOLVABLE_LINKS',
    Locale extends LocaleCode = LocaleCode,
  >(
    folder: string,
    query: EntriesQueries<T, Modifiers>,
    asyncDataOption?: AsyncDataOptions<
      EntryCollection<T, ChainModifiers, Locale>,
      Entry<T, ChainModifiers, Locale>
    >,
  ) {
    return await useAsyncData(
      key,
      () =>
        contentfulClient.getEntries<T, Locale>({
          include: 10,
          ...defaultCMSOptions,
          ...query,
        }) as unknown as Promise<EntryCollection<T, Modifiers, Locale>>,
      asyncDataOption,
    )
  }

  return { defaultCMSOptions, fetchBySlug, fetchByFolder }
}
