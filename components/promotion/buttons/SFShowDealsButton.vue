<template>
  <SFButton
    variant="secondary"
    size="xs"
    class="pr-1 text-xs"
    @click.stop.prevent="goToCategory()"
  >
    {{ category?.ctaLabel || $t('promotion.show_deals_label') }}
    <template #append-icon="{ _class }">
      <IconChevronRight :class="_class" />
    </template>
  </SFButton>
</template>

<script setup lang="ts">
import {
  usePromotionActions,
  useRouteHelpers,
  usePromotionCategory,
} from '~/composables'
import { SFButton } from '#storefront-ui/components'
import type { Promotion } from '~/types/promotion'

const { category } = defineProps<{
  category: Promotion['customData']['category']
}>()

const { isPromotionListShown, togglePromotionList } = usePromotionActions()

const { localizedNavigateTo, buildCategoryPath } = useRouteHelpers()

const id = category?.id

const { data: categoryData } = id ? usePromotionCategory(id) : { data: null }

const goToCategory = async () => {
  if (!categoryData?.value) {
    return
  }

  await localizedNavigateTo(buildCategoryPath(categoryData.value))

  if (isPromotionListShown.value) {
    togglePromotionList()
  }
}
</script>
