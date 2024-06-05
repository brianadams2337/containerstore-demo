<template>
  <div v-editable="blok">
    <button
      class="flex w-full justify-between py-8 text-3xl"
      @click.self="isCollapsed = !isCollapsed"
    >
      {{ blok.title }}
    </button>
    <SFFadeInTransition>
      <div v-if="!isCollapsed">
        <CMSText :blok="{ ...blok, component: 'CmsText' }" />
      </div>
    </SFFadeInTransition>
  </div>
</template>

<script setup lang="ts">
import { defineOptions , ref } from 'vue'
import type { CMSAccordionEntryProps } from '../types'
import CMSText from '~/modules/cms/providers/storyblok/components/Text.vue'

const props = withDefaults(defineProps<CMSAccordionEntryProps>(), {
  collapsed: true,
})

const isCollapsed = ref(props.collapsed)
defineOptions({ name: 'CMSAccordionEntry' })
</script>
