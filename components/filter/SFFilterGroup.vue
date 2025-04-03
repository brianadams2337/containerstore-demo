<template>
  <section class="flex flex-col gap-4 px-6 py-7 xl:py-4">
    <div v-if="label" class="flex items-center justify-between">
      <slot name="label">
        <SFHeadline
          v-if="label"
          tag="h4"
          size="lg"
          class="!font-semi-bold-variable leading-normal"
        >
          {{ label }}
          <span
            class="inline-flex h-4 items-center justify-center rounded-full bg-black px-1.5 text-xs text-white opacity-0"
            :class="{ 'opacity-100': badge > 0 }"
            data-testid="filter-group-counter"
          >
            {{ badge }}
          </span>
        </SFHeadline>
      </slot>
      <slot name="action">
        <SFButton
          v-if="badge > 0 || showAction"
          size="sm"
          variant="raw"
          class="rounded bg-gray-100 p-1 text-sm font-medium leading-none !text-gray-600 xl:bg-white xl:hover:translate-x-[-4px] xl:hover:bg-gray-100"
          @click="$emit('clickReset')"
        >
          {{ resetLabel ?? $t('filter.reset') }}
        </SFButton>
      </slot>
    </div>
    <div>
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
import { SFButton, SFHeadline } from '#storefront-ui/components'

const {
  resetLabel,
  label = '',
  badge = 0,
  showAction = false,
} = defineProps<{
  label?: string
  resetLabel?: string
  badge?: number
  showAction?: boolean
}>()

defineEmits<{ clickReset: [] }>()
</script>
