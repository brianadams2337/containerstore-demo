<template>
  <div v-editable="blok">
    <div v-if="blok.has_link_list" class="max-w-lg">
      <ul class="grid grid-cols-2 justify-items-start">
        <li v-for="b in blok.entries" :key="b._uid" class="my-1 font-bold">
          <DefaultLink raw to="#" class="inline-flex items-center">
            <IconDropdown class="my-1 mr-2 h-2.5 w-2.5" />
            {{ b.link_title }}
          </DefaultLink>
        </li>
      </ul>
      <hr class="mt-8" />
    </div>
    <div class="divide-y divide-gray-300" :class="{ marginClasses }">
      <component
        :is="entry.component"
        v-for="entry in blok.entries"
        :key="entry._uid"
        :blok="entry"
        :collapsed="collapseByAnchorSlug(entry.link_title)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { slugify } from '@scayle/storefront-nuxt'
import type { SbAccordion } from '~/storyblok/types/storyblok'

const props = defineProps({
  blok: {
    type: Object as PropType<SbAccordion>,
    required: true,
  },
})

const collapseByAnchorSlug = (linkTitle: string) => {
  return `#${prepareForUrl(linkTitle)}` !== route.hash
}

const prepareForUrl = (title: string) => {
  return slugify(title)
}
const route = useRoute()
const { marginClasses } = useStoryblokMargins(props.blok)

defineOptions({ name: 'CmsAccordion' })
</script>
