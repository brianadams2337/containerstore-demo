<template>
  <div
    class="rounded-br-xl rounded-tl-xl p-0.5 px-1.5 text-2xs font-semibold uppercase text-white"
    :style="{ ...backgroundColorStyle }"
  >
    {{ $t('pdp.promotion.free_label') }}
  </div>
</template>

<script setup lang="ts">
defineProps<{
  backgroundColorStyle: { backgroundColor?: string }
}>()
</script>
