<template>
  <label class="relative flex w-full items-center">
    <IconSearch class="absolute left-3 top-[50%] size-5 translate-y-[-50%]" />
    <input
      id="search"
      v-model="content"
      :placeholder="$t('search.placeholder')"
      autocomplete="off"
      data-test-id="search-input"
      class="h-8 w-full appearance-none rounded border border-transparent bg-gray-100 px-2 pl-10 text-sm outline-0 ring-0 transition-colors duration-200 ease-linear placeholder:text-gray-800 focus:border-black focus:bg-white focus:outline-none focus:ring-0 md:border-none"
      @focus="emit('focus')"
      @blur="!content.length ? emit('cancel') : emit('blur')"
      @keydown.exact.enter="emit('keydown:enter')"
    />
    <AppButton
      class="absolute right-2 top-[50%] size-4 translate-y-[-50%]"
      type="raw"
      @click="clear"
    >
      <template #icon="{ _class }">
        <IconClose :class="_class" />
      </template>
    </AppButton>
  </label>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{ modelValue?: string }>(), {
  modelValue: '',
})

const emit = defineEmits<{
  'update:model-value': [string]
  'keydown:enter': []
  cancel: []
  focus: []
  blur: []
}>()

const content = computed({
  get: () => props.modelValue,
  set: (newValue: string) => emit('update:model-value', newValue),
})

const clear = () => {
  content.value = ''
  emit('cancel')
}
</script>
