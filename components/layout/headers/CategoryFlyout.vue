<template>
  <div>
    <div
      id="flyout-menu-items-container-content"
      :key="flyoutMenuCategory.slug"
    >
      <Headline size="sm" tag="p">
        <DefaultLink
          :to="routeList.home"
          type="quiet"
          class="text-sm"
          @click="forceCloseFlyout"
        >
          {{ flyoutMenuCategory.name }}
        </DefaultLink>
      </Headline>
      <TwoColumnList :items="childlessCategoryItems" class="mt-3">
        <template #item="{ item }">
          <DefaultLink
            :to="item.path"
            badge-placement="top"
            badge-size="sm"
            type="quieter"
            class="text-gray-750"
            @click="forceCloseFlyout"
          >
            {{ item.name }}
          </DefaultLink>
        </template>
      </TwoColumnList>
    </div>
    <template v-for="category in flyoutMenuCategory.children">
      <div
        v-if="category.children?.length"
        :id="`flyout-menu-items-container-content-${category.slug}`"
        :key="category.slug"
      >
        <Headline size="sm" tag="p">
          <DefaultLink
            :to="category.path"
            type="quiet"
            @click="forceCloseFlyout"
          >
            {{ category.name }}
          </DefaultLink>
        </Headline>
        <TwoColumnList :items="category.children" class="mt-4">
          <template #item="{ item }">
            <DefaultLink
              :to="item.path"
              badge-placement="top"
              badge-size="sm"
              type="quieter"
              @click="forceCloseFlyout"
            >
              {{ item.name }}
            </DefaultLink>
          </template>
        </TwoColumnList>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
const { closeFlyoutMenu, flyoutMenuCategory } = useFlyouts()

const childlessCategoryItems = computed(() => {
  return flyoutMenuCategory.value.children.filter((item) => {
    return !item.children?.length
  })
})

const forceCloseFlyout = (event: MouseEvent) => closeFlyoutMenu(event, true)
</script>
