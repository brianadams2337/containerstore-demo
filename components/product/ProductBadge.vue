<template>
  <div
    class="z-10 inline-block w-max rounded-md bg-black p-2 text-xs font-bold uppercase leading-none text-white md:mt-3"
  >
    {{ $t((translate ? 'badge_labels.' : '') + badgeLabel) }}
  </div>
</template>

<script setup lang="ts">
type Props = {
  badgeLabel?: string
  translate?: boolean
}
withDefaults(defineProps<Props>(), { badgeLabel: undefined, translate: true })
</script>
