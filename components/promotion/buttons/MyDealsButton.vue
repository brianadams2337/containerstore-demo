<template>
  <AppButton
    type="raw"
    size="sm"
    is-uppercase
    class="h-[3.25rem] rounded-none border-l border-l-primary/25 text-xs font-semibold"
    :class="{ 'bg-primary/10': isPromotionListShown }"
    @click="togglePromotionList()"
  >
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
