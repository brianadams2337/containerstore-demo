<template>
  <div class="mt-1 !text-gray-500">
    <SFButton
      type="raw"
      class="flex !items-start justify-between whitespace-pre-line !px-1.5 text-start text-xs font-semibold !text-gray-500"
      is-full-width
      size="sm"
      @click="toggleTerms"
    >
      <span class="inline-flex items-start">
        <IconInfoOutlineSquare class="mr-1 size-4" />
        {{ $t('promotion.terms') }}
      </span>
      <template #append-icon="{ _class }">
        <IconChevronUp v-if="areTermsShown" :class="_class" />
        <IconChevronDown v-else :class="_class" />
      </template>
    </SFButton>

    <SFFadeInFromBottomTransition>
      <p v-if="areTermsShown" class="px-1.5 text-2xs">{{ content }}</p>
    </SFFadeInFromBottomTransition>
  </div>
</template>

<script setup lang="ts">
import { onUnmounted } from 'vue'
import { useState } from '#app/composables/state'
import {
  SFButton,
  SFFadeInFromBottomTransition,
} from '#storefront-ui/components'
import type { Promotion } from '~/types/promotion'

const props = defineProps<{
  promotionId: Promotion['id']
  content: string
}>()

const areTermsShown = useState(`terms-${props.promotionId}`, () => false)

const toggleTerms = () => {
  areTermsShown.value = !areTermsShown.value
}

onUnmounted(() => {
  areTermsShown.value = false
})
</script>
