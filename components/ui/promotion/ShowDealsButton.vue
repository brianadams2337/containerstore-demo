<template>
  <AppButton
    type="secondary"
    size="sm"
    class="pr-1"
    @click="togglePromotionList()">
    <template #append-icon="{ _class }">
      {{ $t('promotion.show_deals_label') }}
      <IconChevronRight :class="_class" />
    </template>
  </AppButton>
</template>

<script setup lang="ts">
const { togglePromotionList } = usePromotionActions()
</script>
