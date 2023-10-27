<template>
  <div class="relative w-80 min-w-xs overflow-hidden rounded-md border p-2">
    <PromotionActiveChip v-if="isActive" />
    <div
      class="mb-2 flex flex-col items-start rounded-md bg-blue p-4"
      :style="colorStyle">
      <PromotionHeadline
        v-if="headlineParts"
        :headline-parts="headlineParts"
        size="sm"
        is-column
        class="mb-2" />
      <PromotionCountdown :until="schedule.to" />
    </div>

    <div class="mt-1 text-gray-500">
      <AppButton
        type="raw"
        class="flex !items-start justify-between whitespace-pre-line !px-1.5 text-start text-xs font-semibold text-gray-500"
        is-full-width
        size="xs"
        @click="toggleTerms">
        <span class="inline-flex items-start">
          <IconInfoOutline class="mr-1 h-4 w-4" />
          {{ $t('promotion.terms') }}
        </span>
        <template #append-icon="{ _class }">
          <IconChevronUp v-if="areTermsShown" :class="_class" />
          <IconChevronDown v-else :class="_class" />
        </template>
      </AppButton>

      <FadeInFromBottomTransition>
        <p v-if="areTermsShown" class="px-1.5 text-2xs">
          {{ customData.terms }}
        </p>
      </FadeInFromBottomTransition>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  id: {
    type: String as PropType<Promotion['id']>,
    required: true,
  },
  isActive: {
    type: Boolean as PropType<Promotion['isActive']>,
    required: true,
  },
  customData: {
    type: Object as PropType<Promotion['customData']>,
    default: () => ({}),
  },
  schedule: {
    type: Object as PropType<Promotion['schedule']>,
    required: true,
  },
})

const areTermsShown = useState(`terms-${props.id}`, () => false)

const colorStyle = computed(() => {
  const cardColorHex = props.customData.cardColorHex

  return { ...(!!cardColorHex && { backgroundColor: String(cardColorHex) }) }
})

const headlineParts = computed(() => {
  return props.customData.headlineChunks as string[]
})

const toggleTerms = () => {
  areTermsShown.value = !areTermsShown.value
}
</script>
