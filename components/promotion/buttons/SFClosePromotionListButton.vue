<template>
  <SFButton
    variant="raw"
    size="sm"
    fab
    class="absolute z-100 bg-primary !p-1 !text-white"
    :class="positionClass"
    @click="togglePromotionList()"
  >
    <template #icon="{ _class }">
      <IconCloseSBold :class="_class" />
    </template>
  </SFButton>
</template>

<script setup lang="ts">
import { usePromotionActions } from '~/composables'
import { SFButton } from '#storefront-ui/components'

const { positionClass = '-bottom-3 right-[50%]' } = defineProps<{
  positionClass?: string
}>()

const { togglePromotionList } = usePromotionActions()
</script>
