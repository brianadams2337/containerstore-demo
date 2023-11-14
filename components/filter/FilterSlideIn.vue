<template>
  <SlideIn
    name="FilterSlideIn"
    slide-class="mt-[7rem] border-t border-l border-primary xl:inset-y-0"
    @open="onSlideInOpen"
    @close="trackFilterFlyout('close', 'true')"
  >
    <template #slide-in-header="{ toggle: toggleItem }">
      <FiltersHeader :toggle-item="toggleItem" />
    </template>
    <template #slide-in-body>
      <FilterSlideInBody />
    </template>
    <template #slide-in-actions>
      <FilterActions />
    </template>
  </SlideIn>
</template>

<script setup lang="ts">
const { onSlideInOpen, trackFilterFlyout } = await useFilter()
</script>
