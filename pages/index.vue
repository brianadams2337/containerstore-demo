<template>
  <div class="flex flex-col items-center justify-center p-6">
    <Headline size="4xl">Homepage</Headline>
    <br />
    <br />
    <div class="mt-20">
      <h3 class="my-5">Form validations with Vuelidate</h3>
      <form
        class="flex w-[500px] flex-col space-y-3 rounded-md border p-6 shadow-sm">
        <CheckBox
          v-if="viewport.isLessThan('sm')"
          id="newsletter"
          v-model="payload.brands" />
        <RadioGroup
          v-model="payload.gender"
          :items="genderItems"
          title="Gender" />
        <TextInput v-model="payload.email" placeholder="Email" />
        <ValidatedInputGroup
          v-slot="{ isValid }"
          :errors="v$.oldPassword.$errors">
          <TextInput
            v-model="payload.oldPassword"
            :placeholder="$t('form_fields.old_password')"
            :has-errors="!isValid"
            type="password"
            required
            @change="v$.oldPassword.$touch" />
        </ValidatedInputGroup>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useVuelidate } from '@vuelidate/core'

const { $validation, $i18n } = useNuxtApp()

const viewport = useViewport()

const payload = reactive({
  email: '',
  oldPassword: '',
  gender: '',
  brands: [],
})

const rules = {
  email: {
    email: $validation.rule.email,
    required: $validation.rule.required,
  },
  oldPassword: { required: $validation.rule.required },
}

const v$ = useVuelidate(rules, payload)

const genderItems = computed(() => [
  {
    value: 'm',
    label: $i18n.t('form_fields.male'),
  },
  {
    value: 'f',
    label: $i18n.t('form_fields.female'),
  },
])

// jsonld
const count = ref(0)
useJsonld(() => ({
  '@context': 'https://schema.org',
  '@type': 'Thing',
  name: `reactive json: count is ${count.value}`,
}))
</script>

<script lang="ts">
export default {
  name: 'HomePage',
}
</script>
