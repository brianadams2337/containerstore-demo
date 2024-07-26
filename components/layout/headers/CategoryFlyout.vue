<template>
  <div>
    <div
      id="flyout-menu-items-container-content"
      :key="flyoutMenuCategory.slug"
    >
      <SFHeadline size="sm" tag="p">
        <SFLink
          :to="routeList.home"
          type="quiet"
          class="text-sm"
          @click="forceCloseFlyout"
        >
          {{ flyoutMenuCategory.name }}
        </SFLink>
      </SFHeadline>
      <SFTwoColumnList :items="childlessCategoryItems" class="mt-3">
        <template #item="{ item }">
          <SFLink
            :to="buildCategoryPath(item)"
            badge-placement="top"
            badge-size="sm"
            type="quieter"
            class="text-gray-750"
            @click="forceCloseFlyout"
          >
            {{ item.name }}
          </SFLink>
        </template>
      </SFTwoColumnList>
    </div>
    <template v-for="category in flyoutMenuCategory.children">
      <div
        v-if="category.children?.length"
        :id="`flyout-menu-items-container-content-${category.slug}`"
        :key="category.slug"
      >
        <SFHeadline size="sm" tag="p">
          <SFLink
            :to="buildCategoryPath(category)"
            type="quiet"
            @click="forceCloseFlyout"
          >
            {{ category.name }}
          </SFLink>
        </SFHeadline>
        <SFTwoColumnList :items="category.children" class="mt-4">
          <template #item="{ item }">
            <SFLink
              :to="buildCategoryPath(item)"
              badge-placement="top"
              badge-size="sm"
              type="quieter"
              @click="forceCloseFlyout"
            >
              {{ item.name }}
            </SFLink>
          </template>
        </SFTwoColumnList>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouteHelpers } from '~/composables/useRouteHelpers'
import { useFlyouts } from '~/composables/useFlyouts'
import { routeList } from '~/utils/route'

const { closeFlyoutMenu, flyoutMenuCategory } = useFlyouts()
const { buildCategoryPath } = useRouteHelpers()

const childlessCategoryItems = computed(() => {
  return flyoutMenuCategory.value.children.filter((item) => {
    return !item.children?.length
  })
})

const forceCloseFlyout = (event: MouseEvent) => closeFlyoutMenu(event, true)
</script>
