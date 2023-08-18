<template>
  <div class="flex items-center border p-1 rounded-md">
    <input
      placeholder="Search Products"
      class="px-2"
      ref="inputRef"
      type="text"
    />
    <SvgoUiSearch class="w-5" />
  </div>
</template>

<script setup lang="ts">
const inputRef = ref();
const { focused } = useFocus(inputRef);

watch(focused, () => {
  console.log("Input field focused");
});
</script>
