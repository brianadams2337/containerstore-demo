<template>
  <select
    class="w-full rounded border-2 border-transparent bg-secondary-450 p-3 text-sm font-medium placeholder:text-secondary focus:outline-none focus:ring-0"
    :value="model"
    @input="triggerInputEvent($event)"
  >
    <option
      v-for="(gender, index) in genders"
      :key="index"
      :value="gender.value"
    >
      {{ gender.label }}
    </option>
  </select>
</template>

<script setup lang="ts">
import type { Gender } from '@scayle/storefront-nuxt'
import { useI18n } from '#i18n'

const model = defineModel<Gender>({
  required: true,
  default: 'f',
})

const { t } = useI18n()

const triggerInputEvent = (event: Event) => {
  model.value = (event?.target as HTMLInputElement)?.value as Gender
}

const genders: { label: string; value: Gender }[] = [
  {
    label: t('form_fields.female'),
    value: 'f',
  },
  {
    label: t('form_fields.male'),
    value: 'm',
  },
  {
    label: t('form_fields.diverse'),
    value: 'd',
  },
]
</script>
