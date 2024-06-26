<template>
  <footer id="footer" class="w-full">
    <FooterPromises />
    <div
      class="container flex flex-col justify-between gap-6 px-6 py-8 md:flex-row xl:gap-16"
    >
      <div
        v-if="footerContent?.text"
        class="md:pr-16"
        :class="{
          'order-last': footerContent.alignRight,
        }"
      >
        <CMSText :blok="footerContent.text" class="text-xs" no-margin-top />
      </div>
      <div
        v-for="group in footerContent?.linkGroups"
        :key="group?.sys.id"
        class="md:pr-8"
      >
        <h5 v-if="group?.fields.title" class="mb-3 text-sm font-bold">
          {{ group.fields.title }}
        </h5>
        <CMSLink
          v-for="link in group?.fields.links"
          :key="link?.sys.id"
          :blok="link ?? null"
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
    <div v-if="footerContent?.socialMedia" class="container pb-8">
      <div class="flex justify-end gap-4">
        <SFLink
          v-for="social in footerContent.socialMedia"
          :key="social?.sys.id"
          :to="social?.fields.url ?? {}"
        >
          <component
            :is="`IconSocial${getSocialName(social?.fields.type ?? '')}`"
          />
        </SFLink>
      </div>
    </div>
    <div
      v-if="footerContent?.textBottom"
      class="bg-primary p-2 text-center text-xs text-secondary"
    >
      {{ footerContent.textBottom }}
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed, defineOptions } from 'vue'
import type {
  TypeFooterSkeleton,
  TypeFooterWithoutUnresolvableLinksResponse,
} from '../../types'
import { useCMS } from '../../composables/useCMS'
import CMSLink from '../Link.vue'
import { useContentfulEditor } from '../../composables/useContentfulEditor'
import { useNavigationTreeItems } from '~/composables'

const { fetchBySlug } = useCMS('footer')
const { data } = await fetchBySlug<TypeFooterSkeleton>({
  content_type: 'footer',
  'fields.slug[match]': 'global/footer',
})
const footerContent = computed(() => {
  return data.value
    ?.fields as TypeFooterWithoutUnresolvableLinksResponse['fields']
})

const { navigationTreeItems } = useNavigationTreeItems('footer')

const getSocialName = (name: string) => {
  const firstLetter = name.substring(0, 1)
  return firstLetter.toUpperCase() + name.substring(1)
}

useContentfulEditor<TypeFooterSkeleton>(data)
defineOptions({
  name: 'CMSAppFooter',
})
</script>
