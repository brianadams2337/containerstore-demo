<template>
  <section class="pb-10 pt-4">
    <div class="flex items-center justify-between">
      <slot name="label">
        <Headline tag="h4" size="sm" class="leading-normal">
          {{ label }}{{ badge ? ` (${badge})` : '' }}
        </Headline>
      </slot>
      <slot name="action">
        <AppButton
          size="sm"
          type="ghost"
          class="py-0 text-xs font-semibold text-secondary"
          :class="{
            'opacity-0': !(badge > 0 || showAction),
          }"
          @click="emit('click:reset')">
          {{ resetLabel ?? $t('filter.reset') }}
        </AppButton>
      </slot>
    </div>

    <div class="mt-4">
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps({
  label: {
    type: String,
    default: '',
  },
  resetLabel: {
    type: String,
    default: null,
  },
  badge: {
    type: Number,
    default: 0,
  },
  showAction: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits<{
  (e: 'click:reset'): void
}>()
</script>
