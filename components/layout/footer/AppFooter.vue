<template>
  <footer id="footer" class="w-full">
    <FooterPromises />
    <div
      class="container flex flex-col justify-between gap-6 px-6 py-8 md:flex-row xl:gap-16"
    >
      <div
        v-if="footerContent.text"
        class="md:pr-16"
        :class="{
          'order-last': footerContent.align_right,
        }"
      >
        <CmsText
          :blok="{
            body: footerContent.text,
            _uid: footerContent._uid,
            component: 'CmsText',
          }"
          class="text-xs"
          no-margin-top
        />
      </div>
      <div
        v-for="group in footerContent.link_groups"
        :key="group._uid"
        class="md:pr-8"
      >
        <h5 v-if="group.title" class="mb-3 text-sm font-bold">
          {{ group.title }}
        </h5>
        <CmsLink
          v-for="link in group.links"
          :key="link._uid"
          :blok="link"
          class="!block py-2 text-xs font-semibold text-gray-750 md:py-1"
        />
      </div>
      <div
        v-for="tree in navigationTreeItems"
        :key="`footer-navigation-tree-${tree.id}`"
        class="flex flex-col"
      >
        <h5 class="mb-3 text-sm font-bold">
          {{ tree.name }}
        </h5>
        <NavigationTreeItem
          v-for="navTree in tree.items"
          :key="`footer-navigation-sub-tree-${navTree.id}`"
          :navigation-item="navTree"
          class="block py-2 text-xs font-semibold !leading-4 text-gray-750 md:py-1"
        />
      </div>
    </div>
    <div v-if="footerContent.social_media" class="container pb-8">
      <div class="flex justify-end gap-4">
        <SFLink
          v-for="social in footerContent.social_media"
          :key="social._uid"
          :to="social.url?.cached_url ?? {}"
        >
          <component :is="`IconSocial${getSocialName(social.type)}`" />
        </SFLink>
      </div>
    </div>
    <div
      v-if="footerContent.text_bottom"
      class="bg-primary p-2 text-center text-xs text-secondary"
    >
      {{ footerContent.text_bottom }}
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAsyncStoryblok } from '@storyblok/nuxt/dist/runtime/composables/useAsyncStoryblok'
import { type Ref, onMounted } from 'vue'
import type { StoryblokStory } from 'storyblok-generate-ts'
import { useDefaultStoryblokOptions } from '~/modules/cms/providers/storyblok/composables/useDefaultStoryblokOptions'
import { useNavigationTreeItems } from '~/composables'
import type { SbFooter } from '~/modules/cms/providers/storyblok/types'

const storyblokOptions = useDefaultStoryblokOptions()

// TODO fix typings
onMounted(() => {
  console.error(
    'This component is deprecated. Use `<CMSAppFooterData>` instead.',
  )
})

const cmsData: Ref<StoryblokStory<SbFooter>> = await useAsyncStoryblok(
  'global/footer',
  storyblokOptions,
)
const footerContent = computed(() => cmsData.value.content)

const { navigationTreeItems } = useNavigationTreeItems('footer')

const getSocialName = (name: string) => {
  const firstLetter = name.substring(0, 1)
  return firstLetter.toUpperCase() + name.substring(1)
}
</script>
