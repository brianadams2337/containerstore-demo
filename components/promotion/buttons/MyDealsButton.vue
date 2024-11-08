<template>
  <SFButton
    type="raw"
    size="sm"
    is-uppercase
    class="h-13 rounded-none border-l border-l-primary/25 px-3 py-2 font-semibold text-white hover:text-white"
    :class="{ 'bg-primary/10': isPromotionListShown }"
    @click="togglePromotionList()"
  >
    {{ $t('promotion.my_deals_label') }}

    <template #append-icon="{ _class }">
      <IconCloseSBold v-if="isPromotionListShown" :class="_class" />
      <IconEquals v-else :class="_class" />
    </template>
  </SFButton>
</template>

<script setup lang="ts">
import { usePromotionActions } from '~/composables'
import { SFButton } from '#storefront-ui/components'

const { isPromotionListShown, togglePromotionList } = usePromotionActions()
</script>
