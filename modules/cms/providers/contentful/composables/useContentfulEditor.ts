import type { ChainModifiers, Entry, EntrySkeletonType } from 'contentful'

export function useContentfulEditor<T extends EntrySkeletonType>(
  content?: Ref<Entry<T, ChainModifiers, string> | null | undefined>,
) {
  const route = useRoute()
  const isInEditorMode = '_editorMode' in route.query
  const currentShop = useCurrentShop()
  const instance = getCurrentInstance()

  if (isInEditorMode && import.meta.client) {
    import('@contentful/live-preview').then(({ ContentfulLivePreview }) => {
      if (!content?.value) return
      ContentfulLivePreview.init({ locale: currentShop.value.locale })
      const unsubscribe = ContentfulLivePreview.subscribe({
        data: content.value,
        callback(update) {
          content.value = update as Entry<T, ChainModifiers, string>
        },
      })
      onBeforeUnmount(() => unsubscribe(), instance)
    })
  }

  return {
    isInEditorMode,
  }
}
