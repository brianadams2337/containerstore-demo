<template>
  <component
    :is="componentName"
    v-bind="attributes"
    :style="backgroundColor && { backgroundColor }"
  >
    <slot
      :headline-parts="headlineParts"
      :scheduled-to="scheduledTo"
      :custom-data="customData"
      :category-link="categoryLink"
    />
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { SFLink } from '#components'
import { useCurrentCategory, useRouteHelpers } from '~/composables'

const props = defineProps<{ promotion: Promotion; backgroundColor?: string }>()

const { buildCategoryPath } = useRouteHelpers()

const customData = computed(() => props.promotion.customData)
const headlineParts = computed(() => customData?.value.headlineParts)
const scheduledTo = computed(() => props.promotion.schedule.to)

const id = customData.value?.category?.id

const { data: category } = id ? useCurrentCategory(id) : { data: null }

const categoryLink = computed(() => {
  return category?.value ? buildCategoryPath(category.value) : undefined
})

const componentName = computed(() => (categoryLink.value ? SFLink : 'div'))

const attributes = computed(() => ({
  ...(categoryLink.value && { raw: true, to: categoryLink.value }),
}))
</script>
