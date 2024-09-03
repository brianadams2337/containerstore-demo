<template>
  <SFButton
    :disabled="disabled"
    type="raw"
    class="group flex h-[52px] grow justify-between rounded-[10px] border-none bg-accent px-6 py-4 text-md font-semibold text-white hover:bg-accent-600 hover:text-white"
    @click="$emit('addToBasket')"
  >
    <div>
      <slot />
    </div>
    <div class="flex items-center">
      <IconNewPlus
        class="size-4 scale-x-0 text-white transition-transform duration-150 group-hover:scale-100"
      />
      <IconNewBasket class="size-5 text-white" />
    </div>
  </SFButton>
</template>

<script setup lang="ts">
type Props = {
  disabled?: boolean
}

withDefaults(defineProps<Props>(), {
  disabled: false,
})

defineEmits<{
  (e: 'addToBasket'): void
}>()
</script>
