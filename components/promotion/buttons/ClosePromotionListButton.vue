<template>
  <SFButton
    variant="raw"
    size="xs"
    fab
    class="absolute z-100 bg-primary !p-1 !text-white"
    :class="positionClass"
    @click="togglePromotionList()"
  >
    <template #icon="{ _class }">
      <IconClose :class="_class" />
    </template>
  </SFButton>
</template>

<script setup lang="ts">
import { usePromotionActions } from '~/composables'
import { SFButton } from '#storefront-ui/components'

withDefaults(defineProps<{ positionClass?: string }>(), {
  positionClass: '-bottom-3 right-[50%]',
})

const { togglePromotionList } = usePromotionActions()
</script>
