<template>
  <PromotionCard
    :promotion="promotion"
    class="relative w-80 min-w-xs overflow-hidden rounded-md border p-2"
    @click="closePromotionList"
  >
    <PromotionItemContent v-bind="{ customData, schedule }" class="mb-2" />
    <PromotionItemTerms
      v-if="customData.terms"
      :content="customData.terms"
      :promotion-id="promotion.id"
    />
  </PromotionCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePromotionActions } from '~/composables'

const { togglePromotionList } = usePromotionActions()
const props = defineProps<{ promotion: Promotion }>()

const schedule = computed(() => props.promotion.schedule)
const customData = computed(() => props.promotion.customData)
const id = computed(() => customData.value.category?.id)

const closePromotionList = () => id.value && togglePromotionList()
</script>
