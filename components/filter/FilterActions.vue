<template>
  <div class="relative flex gap-2">
    <Transition
      enter-from-class="translate-y-4 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      enter-active-class="transition ease-linear duration-200"
      leave-active-class="transition ease-linear duration-200 delay-100"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="translate-y-4 opacity-0"
    >
      <div v-if="areFiltersCleared" class="absolute size-full">
        <div
          class="flex h-full items-center space-x-2 rounded-xl bg-emerald-100 p-3 px-4 font-semi-bold-variable leading-none text-emerald-500"
        >
          <IconCheckGreen class="my-auto size-4" />
          <span>{{ $t('filter.cleared_notification') }}</span>
        </div>
      </div>
    </Transition>
    <SFButton
      data-testid="reset-filter-button"
      type="tertiary"
      size="lg"
      class="w-1/2"
      @click="$emit('reset')"
    >
      {{ $t('filter.reset_all') }}
    </SFButton>
    <SFButton
      data-testid="apply-filter-button"
      size="lg"
      class="w-1/2"
      @click="toggle()"
    >
      {{ showResultsLabel }}
    </SFButton>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useNuxtApp } from '#app'
import { useFilterSlideIn } from '~/composables'

const props = defineProps<{
  unfilteredCount: number
  areFiltersCleared: boolean
}>()

const { $i18n } = useNuxtApp()

const { toggle } = useFilterSlideIn()

defineEmits(['reset'])

const showResultsLabel = computed(() => {
  return props.unfilteredCount
    ? $i18n.t('filter.show_results_count', { count: props.unfilteredCount })
    : $i18n.t('filter.show_results')
})
</script>
