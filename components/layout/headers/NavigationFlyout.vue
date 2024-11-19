<template>
  <div>
    <div
      id="flyout-menu-items-container-content"
      :key="flyoutNavigationItem.id"
    >
      <SFHeadline size="sm" tag="p">
        <NavigationTreeItem
          :navigation-item="flyoutNavigationItem"
          variant="quiet"
          class="text-sm"
          @click:navigation-item="closeFlyoutMenu"
        />
      </SFHeadline>
      <SFTwoColumnList :items="childlessNavigationItems" class="mt-4">
        <template #item="{ item }">
          <NavigationTreeItem
            :navigation-item="item"
            variant="quieter"
            class="text-gray-750"
            @click:navigation-item="closeFlyoutMenu"
          />
        </template>
      </SFTwoColumnList>
    </div>

    <template v-for="navigationItem in flyoutNavigationItem.children">
      <div
        v-if="navigationItem.children.length"
        :id="`flyout-menu-items-container-content-${navigationItem.id}`"
        :key="navigationItem.id"
      >
        <SFHeadline size="sm" tag="p">
          <NavigationTreeItem
            :navigation-item="navigationItem"
            @click:navigation-item="closeFlyoutMenu"
          />
        </SFHeadline>
        <SFTwoColumnList :items="navigationItem.children" class="mt-4">
          <template #item="{ item }">
            <NavigationTreeItem
              :navigation-item="item"
              variant="quieter"
              @click:navigation-item="closeFlyoutMenu"
            />
          </template>
        </SFTwoColumnList>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useFlyouts } from '~/composables/useFlyouts'
import { SFHeadline, SFTwoColumnList } from '#storefront-ui/components'
import NavigationTreeItem from '~/components/NavigationTreeItem.vue'

const { closeFlyoutMenu, flyoutNavigationItem } = useFlyouts()

const childlessNavigationItems = computed(() => {
  return flyoutNavigationItem.value.children.filter((item) => {
    return !item.children?.length
  })
})
</script>
