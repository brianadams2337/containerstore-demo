<template>
  <PromotionCard
    :promotion="promotion"
    class="relative w-80 min-w-xs overflow-hidden rounded-md border p-2"
    @click="closePromotionList"
  >
    <PromotionItemContent
      :custom-data="customData"
      :schedule="schedule"
      class="mb-2"
    />
    <PromotionItemTerms
      v-if="customData.terms"
      :content="customData.terms"
      :promotion-id="promotion.id"
    />
  </PromotionCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import PromotionCard from '../PromotionCard.vue'
import PromotionItemContent from './PromotionItemContent.vue'
import PromotionItemTerms from './PromotionItemTerms.vue'
import { usePromotionActions } from '~/composables'

const { togglePromotionList } = usePromotionActions()
const props = defineProps<{ promotion: Promotion }>()

const schedule = computed(() => props.promotion.schedule)
const customData = computed(() => props.promotion.customData)
const id = computed(() => customData.value.category?.id)

const closePromotionList = () => id.value && togglePromotionList()
</script>
