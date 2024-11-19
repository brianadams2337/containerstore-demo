<template>
  <SFButton
    variant="raw"
    class="flex items-center justify-between whitespace-pre-line !p-0 text-start text-sm font-semibold leading-5 text-gray-600"
    is-full-width
    size="xs"
    @click="toggle"
  >
    <span class="text-sm leading-5">{{ $t('basket.discount') }}</span>
    <template #append-icon="{ _class }">
      <IconChevronUp v-if="modelValue" :class="_class" />
      <IconChevronDown v-else :class="_class" />
    </template>
  </SFButton>
</template>

<script setup lang="ts">
import { SFButton } from '#storefront-ui/components'

const props = defineProps<{ modelValue: boolean }>()

const emit = defineEmits(['update:modelValue'])

const toggle = () => emit('update:modelValue', !props.modelValue)
</script>
