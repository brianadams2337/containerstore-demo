<template>
  <div class="relative w-80 min-w-xs overflow-hidden rounded-md border p-2">
    <PromotionActiveChip v-if="isActive" />
    <div
      class="mb-2 flex flex-col items-start rounded-md p-4"
      :class="colorClass">
      <Headline tag="h2" size="base" class="whitespace-pre-wrap">
        {{ customData.headerText }}
      </Headline>
      <PromotionCountdown :until="schedule.to" class="mt-2" />
    </div>

    <div class="mt-1 text-gray-500">
      <AppButton
        type="raw"
        class="flex items-center justify-between text-xs font-semibold text-gray-500"
        is-full-width
        size="xs"
        @click="toggleTerms">
        <span class="inline-flex items-center">
          <IconInfoOutline class="mr-1 h-4 w-4" />
          {{ $t('promotion.terms') }}
        </span>
        <template #append-icon="{ _class }">
          <IconChevronUp v-if="areTermsShown" :class="_class" />
          <IconChevronDown v-else :class="_class" />
        </template>
      </AppButton>

      <FadeInFromBottomTransition>
        <div v-if="areTermsShown" class="text-2xs">
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s, when an unknown printer took a galley of type and
          scrambled it to make a type specimen book
        </div>
      </FadeInFromBottomTransition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Promotion } from '@scayle/storefront-nuxt'

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

const colorClass = computed(() => {
  return props.customData.cardBackgroundClass || 'bg-blue'
})

const toggleTerms = () => {
  areTermsShown.value = !areTermsShown.value
}
</script>
