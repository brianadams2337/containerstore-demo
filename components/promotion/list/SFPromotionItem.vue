<template>
  <SFPromotionCard
    :promotion="promotion"
    class="relative w-80 min-w-xs overflow-hidden rounded-md border p-2"
    @click="closePromotionList"
  >
    <SFPromotionItemContent
      :custom-data="customData"
      :schedule="schedule"
      class="mb-2"
    />
    <SFPromotionItemTerms
      v-if="customData.terms"
      :content="customData.terms"
      :promotion-id="promotion.id"
    />
  </SFPromotionCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import SFPromotionCard from '../SFPromotionCard.vue'
import SFPromotionItemContent from './SFPromotionItemContent.vue'
import SFPromotionItemTerms from './SFPromotionItemTerms.vue'
import { usePromotionActions } from '~/composables'
import type { Promotion } from '~/types/promotion'

const { togglePromotionList } = usePromotionActions()
const { promotion } = defineProps<{ promotion: Promotion }>()

const schedule = computed(() => promotion.schedule)
const customData = computed(() => promotion.customData)
const id = computed(() => customData.value.category?.id)

const closePromotionList = () => id.value && togglePromotionList()
</script>
