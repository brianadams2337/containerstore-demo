<template>
  <div>
    <div v-editable="blok" :class="marginClasses">
      <div class="grid justify-items-start md:grid md:grid-cols-2">
        <div class="w-full">
          <component
            :is="leftColumn.component"
            v-for="leftColumn in blok.column_left"
            :key="leftColumn._uid"
            :blok="leftColumn" />
        </div>
        <div class="w-full">
          <component
            :is="rightColumn.component"
            v-for="rightColumn in blok.column_right"
            :key="rightColumn._uid"
            :blok="rightColumn" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SbDoubleColumn } from '~/storyblok/types/storyblok'

const props = defineProps({
  blok: {
    type: Object as PropType<SbDoubleColumn>,
    required: true,
  },
})

const { marginClasses } = useStoryblokMargins(props.blok)
</script>
