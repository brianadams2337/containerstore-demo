<template>
  <div
    class="z-10 ml-2 mt-2 inline-block w-max bg-black px-2 py-1 text-xs font-bold uppercase leading-none text-white md:mt-3 md:text-sm">
    {{ $t((translate ? 'badge_labels.' : '') + badgeLabel) }}
  </div>
</template>

<script setup lang="ts">
defineProps({
  badgeLabel: { type: String, default: null },
  translate: { type: Boolean, default: true },
})
</script>
