<template>
  <SFButton
    type="secondary"
    size="xs"
    class="pr-1 text-xs"
    @click="goToCategory()"
  >
    {{ props.category?.ctaLabel || $t('promotion.show_deals_label') }}
    <template #append-icon="{ _class }">
      <IconChevronRight :class="_class" />
    </template>
  </SFButton>
</template>

<script setup lang="ts">
import {
  usePromotionActions,
  useRouteHelpers,
  useCurrentCategory,
} from '~/composables'

const props = defineProps<{ category: Promotion['customData']['category'] }>()

const { isPromotionListShown, togglePromotionList } = usePromotionActions()

const { localizedNavigateTo, buildCategoryPath } = useRouteHelpers()

const id = props.category?.id

const { data: categoryData } = id ? useCurrentCategory(id) : { data: null }

const goToCategory = async () => {
  if (!categoryData?.value) return

  await localizedNavigateTo(buildCategoryPath(categoryData.value))

  if (isPromotionListShown.value) {
    togglePromotionList()
  }
}
</script>
