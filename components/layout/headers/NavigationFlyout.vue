<template>
  <div>
    <div
      id="flyout-menu-items-container-content"
      :key="flyoutNavigationItem.id"
    >
      <Headline size="sm" tag="p">
        <NavigationTreeItem
          :navigation-item="flyoutNavigationItem"
          type="quiet"
          class="text-sm"
          @click:navigation-item="closeFlyoutMenu"
        />
      </Headline>
      <TwoColumnList :items="childlessNavigationItems" class="mt-4">
        <template #item="{ item }">
          <NavigationTreeItem
            :navigation-item="item"
            type="quieter"
            class="text-gray-750"
            @click:navigation-item="closeFlyoutMenu"
          />
        </template>
      </TwoColumnList>
    </div>

    <template v-for="navigationItem in flyoutNavigationItem.children">
      <div
        v-if="navigationItem.children.length"
        :id="`flyout-menu-items-container-content-${navigationItem.id}`"
        :key="navigationItem.id"
      >
        <Headline size="sm" tag="p">
          <NavigationTreeItem
            :navigation-item="navigationItem"
            @click:navigation-item="closeFlyoutMenu"
          />
        </Headline>
        <TwoColumnList :items="navigationItem.children" class="mt-4">
          <template #item="{ item }">
            <NavigationTreeItem
              :navigation-item="item"
              type="quieter"
              @click:navigation-item="closeFlyoutMenu"
            />
          </template>
        </TwoColumnList>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
const { closeFlyoutMenu, flyoutNavigationItem } = useFlyouts()

const childlessNavigationItems = computed(() => {
  return flyoutNavigationItem.value.children.filter((item) => {
    return !item.children?.length
  })
})
</script>
