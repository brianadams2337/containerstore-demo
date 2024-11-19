<template>
  <label class="relative flex w-full items-center">
    <IconSearch class="absolute left-3 top-1/2 size-5 -translate-y-1/2" />
    <input
      v-model="content"
      :placeholder="$t('search.placeholder')"
      autocomplete="off"
      data-testid="sidebar-search-input"
      class="h-8 w-full appearance-none rounded border border-transparent bg-gray-100 px-2 pl-10 text-sm outline-0 ring-0 transition-colors duration-200 ease-linear placeholder:text-gray-600 focus:border-black focus:bg-white focus:outline-none focus:ring-0 md:border-none"
      @focus="emit('focus')"
      @blur="!content.length ? emit('cancel') : emit('blur')"
      @keydown.exact.enter="emit('keydown:enter')"
    />
    <SFButton
      class="absolute right-2 top-1/2 size-4 -translate-y-1/2"
      aria-label="Clear search"
      variant="raw"
      @click="clear"
    >
      <template #icon="{ _class }">
        <IconClose aria-hidden="true" :class="_class" />
      </template>
    </SFButton>
  </label>
</template>

<script setup lang="ts">
import { defineModel } from 'vue'
import { SFButton } from '#storefront-ui/components'

const emit = defineEmits<{
  'keydown:enter': []
  cancel: []
  focus: []
  blur: []
}>()

const content = defineModel<string>({ default: '' })

const clear = () => {
  content.value = ''
  emit('cancel')
}
</script>
