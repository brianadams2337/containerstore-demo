<template>
  <div class="relative w-full">
    <label class="relative flex w-full items-center">
      <span class="absolute left-3 top-[50%] flex translate-y-[-50%]">
        <IconSearch class="h-5 w-5" />
      </span>
      <input
        id="search"
        v-model="content"
        :placeholder="$t('search.placeholder')"
        autocomplete="off"
        data-test-id="search-input"
        type="search"
        class="w-full appearance-none rounded border border-transparent bg-gray-100 px-2 pl-10 text-sm outline-0 ring-0 transition-colors duration-200 ease-linear placeholder:text-gray-800 focus:border-black focus:bg-white focus:outline-none focus:ring-0 md:border-none"
        @focus="emit('focus')"
        @blur="!content.length ? emit('cancel') : emit('blur')"
        @keydown.exact.enter="emit('keydown:enter')"
      />
    </label>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
})

const emit = defineEmits<{
  (e: 'update:model-value', value: string): void
  (e: 'cancel'): void
  (e: 'focus'): void
  (e: 'blur'): void
  (e: 'keydown:enter'): void
}>()

const content = computed({
  get: () => props.modelValue,
  set: (newValue: string) => emit('update:model-value', newValue),
})
</script>
