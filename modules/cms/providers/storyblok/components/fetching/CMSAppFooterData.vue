<template>
  <footer id="footer" class="w-full" data-testid="footer">
    <slot name="promises" />
    <div
      class="container flex flex-col justify-between gap-6 px-6 py-8 md:flex-row xl:gap-16"
      data-testid="footer-columns"
    >
      <div
        v-if="footerContent?.text"
        class="flex flex-col"
        :class="{ 'order-last': footerContent.align_right }"
      >
        <CMSText
          :blok="{
            _uid: footerContent._uid,
            component: 'CmsText',
            body: footerContent.text,
          }"
          class="text-xs"
          no-margin-top
        />
      </div>

      <div
        v-for="group in footerContent?.link_groups"
        :key="group._uid"
        class="md:pr-8"
        data-testid="footer-link-group"
      >
        <h5
          v-if="group.title"
          class="mb-3 text-sm font-bold"
          data-testid="footer-group-title"
        >
          {{ group.title }}
        </h5>
        <CMSLink
          v-for="link in group.links"
          :key="link?._uid"
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

      <div v-if="footerContent?.social_media" class="flex flex-col">
        <div class="flex flex-wrap gap-4">
          <CMSStoryblokLink
            v-for="social in footerContent.social_media"
            :key="social?._uid"
            :to="social?.url?.cached_url ?? {}"
            :raw="false"
            open-in-new-tab
          >
            <component
              :is="`IconSocial${getSocialName(social?.type ?? '')}`"
              class="size-6"
            />
          </CMSStoryblokLink>
        </div>
      </div>
    </div>

    <div
      v-if="footerContent?.text_bottom"
      class="bg-primary p-2 text-center text-xs text-secondary"
    >
      {{ footerContent.text_bottom }}
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed, defineOptions } from 'vue'
import type { SbFooter } from '../../types'
import { useCMSBySlug } from '../../composables/useCMS'
import CMSText from '../Text.vue'
import CMSLink from '../Link.vue'
import { useStoryblokEditor } from '../../composables/useStoryblokEditor'
import CMSStoryblokLink from '../StoryblokLink.vue'
import { useNavigationTreeItems } from '~/composables/useNavigationTreeItems'
// TODO: This needs to be decoupled from the CMS module as it is coming from the SFB local components
import NavigationTreeItem from '~/components/NavigationTreeItem.vue'

const { data } = await useCMSBySlug<SbFooter>('footer', 'global/footer')

useStoryblokEditor<SbFooter>(data)

const footerContent = computed(() => data.value?.data.story.content)

const { navigationTreeItems } = useNavigationTreeItems('footer')

const getSocialName = (name: string) => {
  const firstLetter = name.substring(0, 1)
  return firstLetter.toUpperCase() + name.substring(1)
}

defineOptions({ name: 'CMSAppFooterData' })
</script>
