<template>
  <div class="flex w-full items-center justify-between">
    <Headline size="xl" tag="p">{{ $t('filter.title') }}</Headline>
    <AppButton
      type="ghost"
      size="xs"
      data-test-id="closeCross"
      @click="toggleItem"
    >
      <template #icon="{ _class }">
        <IconClose :class="_class" />
      </template>
    </AppButton>
  </div>
</template>

<script setup lang="ts">
defineProps<{ toggleItem: () => void }>()
</script>
