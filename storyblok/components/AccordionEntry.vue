<template>
  <div v-editable="blok">
    <button
      class="flex w-full justify-between py-8 text-3xl"
      @click.self="isCollapsed = !isCollapsed">
      {{ blok.title }}
    </button>
    <FadeInTransition>
      <div v-if="!isCollapsed">
        <CmsText :blok="{ ...blok, component: 'CmsText' }" />
      </div>
    </FadeInTransition>
  </div>
</template>

<script setup lang="ts">
import type { SbAccordionEntry } from '~/storyblok/types/storyblok'

const props = defineProps({
  blok: {
    type: Object as PropType<SbAccordionEntry>,
    required: true,
  },
  collapsed: {
    type: Boolean,
    default: true,
  },
})

const isCollapsed = ref(props.collapsed)
</script>
