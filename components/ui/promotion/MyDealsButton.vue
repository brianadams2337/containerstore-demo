<template>
  <AppButton
    type="raw"
    size="sm"
    class="pr-1 text-xs font-semibold"
    is-uppercase
    @click="togglePromotionList()">
    <template #append-icon="{ _class }">
      {{ $t('promotion.my_deals_label') }}
      <IconCloseSBold v-if="isPromotionListShown" :class="_class" />
      <IconEquals v-else :class="_class" />
    </template>
  </AppButton>
</template>

<script setup lang="ts">
const { isPromotionListShown, togglePromotionList } = usePromotionActions()
</script>
