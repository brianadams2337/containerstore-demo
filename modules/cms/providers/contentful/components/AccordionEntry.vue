<template>
  <div v-if="blok">
    <button
      class="flex w-full justify-between py-8 text-3xl"
      @click.self="toggleCollapse"
    >
      {{ blok?.fields.title }}
    </button>
    <FadeInTransition>
      <div v-if="!isCollapsed">
        <CMSText v-if="blok.fields.body" :blok="blok.fields.body" />
      </div>
    </FadeInTransition>
  </div>
</template>

<script setup lang="ts">
import type { CMSAccordionEntryProps } from '~/modules/cms/providers/contentful/types'
import CMSText from '~/modules/cms/providers/contentful/components/Text.vue'
const props = withDefaults(defineProps<CMSAccordionEntryProps>(), {
  collapsed: false,
})

const isCollapsed = ref(props.collapsed)

function toggleCollapse() {
  isCollapsed.value = !isCollapsed.value
}

defineOptions({ name: 'CMSAccordionEntry' })
</script>
