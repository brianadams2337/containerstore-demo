import { useStoryblokBridge } from '@storyblok/vue'
import type { SbStory } from '../types/storyblok'

export function useStoryblokEditor<T>(content?: Ref<SbStory<T> | null>) {
  const route = useRoute()
  const isInEditorMode = '_storyblok' in route.query

  if (isInEditorMode && content?.value && import.meta.client) {
    useStoryblokBridge(content.value.data.story.id, (evStory) => {
      if (content.value?.data.story) {
        content.value.data.story = evStory
      }
    })
  }

  return {
    isInEditorMode,
  }
}
