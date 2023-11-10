<template>
  <AppButton
    type="secondary"
    size="xs"
    class="pr-1 text-xs"
    @click="goToCategory()"
  >
    <template #append-icon="{ _class }">
      {{ $t('promotion.show_deals_label') }}
      <IconChevronRight :class="_class" />
    </template>
  </AppButton>
</template>

<script setup lang="ts">
const props = defineProps<{ category: string }>()

const { isPromotionListShown, togglePromotionList } = usePromotionActions()

const goToCategory = async () => {
  await localizedNavigateTo(props.category)
  isPromotionListShown.value && togglePromotionList()
}
</script>
