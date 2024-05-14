<template>
  <div
    class="z-10 w-max rounded-md bg-black p-1 px-2 text-xs font-semibold uppercase text-white"
  >
    {{ text }}
  </div>
</template>

<script setup lang="ts">
type Props = {
  text: string
}

defineProps<Props>()
</script>
