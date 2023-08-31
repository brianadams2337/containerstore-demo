<template>
  <section class="pb-10 pt-4">
    <div class="flex items-center justify-between">
      <slot name="label">
        <Headline
          tag="h4"
          size="sm"
          :is-uppercase="false"
          class="leading-normal">
          {{ label }}{{ badge ? ` (${badge})` : '' }}
        </Headline>
      </slot>
      <slot name="action">
        <AppButton
          size="sm"
          type="ghost"
          class="text-secondary py-0 text-xs font-semibold"
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
    type: String as PropType<String>,
    default: '',
  },
  resetLabel: {
    type: String as PropType<String>,
    default: null,
  },
  badge: {
    type: Number as PropType<number>,
    default: 0,
  },
  showAction: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
})

const emit = defineEmits<{
  (e: 'click:reset'): void
}>()
</script>
