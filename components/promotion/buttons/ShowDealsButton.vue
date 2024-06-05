<template>
  <SFButton
    type="secondary"
    size="xs"
    class="pr-1 text-xs"
    @click="goToCategory()"
  >
    <template #append-icon="{ _class }">
      {{ props.category?.ctaLabel || $t('promotion.show_deals_label') }}
      <IconChevronRight :class="_class" />
    </template>
  </SFButton>
</template>

<script setup lang="ts">
import { normalizePathRoute } from '~/utils/route'
import { usePromotionActions, useRouteHelpers } from '~/composables'

const props = defineProps<{ category: Promotion['customData']['category'] }>()

const { isPromotionListShown, togglePromotionList } = usePromotionActions()

const { localizedNavigateTo } = useRouteHelpers()

const goToCategory = async () => {
  if (!props.category?.to) {
    return
  }

  await localizedNavigateTo(normalizePathRoute(props.category.to))

  isPromotionListShown.value && togglePromotionList()
}
</script>
