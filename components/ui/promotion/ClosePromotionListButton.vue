<template>
  <AppButton
    type="raw"
    size="xs"
    fab
    no-padding
    class="absolute z-[200] bg-primary !p-1"
    :class="positionClass"
    @click="toggle()">
    <template #icon="{ _class }">
      <IconCloseBold :class="_class" class="text-white" />
    </template>
  </AppButton>
</template>

<script setup lang="ts">
defineProps({
  positionClass: {
    type: String,
    default: '-bottom-3 right-[50%]',
  },
})

const { togglePromotionList: toggle } = usePromotionActions()
</script>
