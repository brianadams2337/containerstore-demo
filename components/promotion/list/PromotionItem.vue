<template>
  <component
    :is="componentName"
    v-bind="attributes"
    class="relative w-80 min-w-xs overflow-hidden rounded-md border p-2"
    @click="closePromotionList"
  >
    <PromotionItemContent v-bind="{ customData, schedule }" class="mb-2" />
    <PromotionItemTerms
      v-if="customData.terms"
      :content="customData.terms"
      :promotion-id="id"
    />
  </component>
</template>

<script setup lang="ts">
import { SFLink } from '#components'

type Props = {
  id: Promotion['id']
  customData?: Promotion['customData']
  schedule: Promotion['schedule']
}

const { togglePromotionList } = usePromotionActions()
const props = withDefaults(defineProps<Props>(), { customData: () => ({}) })

const to = computed(() => props.customData.category?.to)

const componentName = computed(() => (to.value ? SFLink : 'div'))

const attributes = computed(() => {
  return { ...(to.value && { raw: true, to: to.value }) }
})

const closePromotionList = () => to.value && togglePromotionList()
</script>
