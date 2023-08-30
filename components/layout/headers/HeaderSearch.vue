<template>
  <div class="flex items-center rounded-md border p-1">
    <input
      ref="inputRef"
      placeholder="Search Products"
      class="px-2"
      type="text" />
    <SvgoUiSearch class="w-5" />
  </div>
</template>

<script setup lang="ts">
const inputRef = ref()
const { focused } = useFocus(inputRef)

watch(focused, () => {
  console.log('Input field focused')
})
</script>
