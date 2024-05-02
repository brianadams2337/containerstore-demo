<template>
  <section class="pb-10 pt-4">
    <div class="flex items-center justify-between">
      <slot name="label">
        <SFHeadline tag="h4" size="sm" class="leading-normal">
          {{ label }}{{ badge ? ` (${badge})` : '' }}
        </SFHeadline>
      </slot>
      <slot name="action">
        <SFButton
          size="sm"
          type="ghost"
          class="py-0 text-xs font-semibold text-secondary"
          :class="{
            'opacity-0': !(badge > 0 || showAction),
          }"
          @click="emit('click:reset')"
        >
          {{ resetLabel ?? $t('filter.reset') }}
        </SFButton>
      </slot>
    </div>
    <div class="mt-4">
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
type Props = {
  label?: string
  resetLabel?: string
  badge?: number
  showAction?: boolean
}
withDefaults(defineProps<Props>(), {
  label: '',
  resetLabel: undefined,
  badge: 0,
  showAction: false,
})

const emit = defineEmits<{ (e: 'click:reset'): void }>()
</script>
