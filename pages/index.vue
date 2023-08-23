<template>
  <div>
    <NuxtLazyHydrate when-visible>
      <div class="h-[600px]">
        <p>Nuxt Img</p>
        <nuxt-img
          class="h-full"
          provider="default"
          src="images/1bef383677e1873e174d75f52fc51a2a.jpg" />
      </div>
    </NuxtLazyHydrate>

    <br />
    <br />
    <AppButton> Test primary </AppButton>

    <br />
    <br />
    <AppButton type="secondary"> Test secondary </AppButton>

    <br />
    <br />
    <AppButton type="tertiary"> Test tertiary</AppButton>

    <br />
    <br />
    <AppButton type="ghost"> Test ghost </AppButton>

    <div class="mt-20">
      <h3 class="my-5">Form validations with Vuelidate</h3>
      <form
        class="flex w-[500px] flex-col space-y-3 rounded-md border p-6 shadow-sm">
        <div class="flex items-center">
          <RadioGroup
            v-model="payload.gender"
            :items="genderItems"
            title="Gender" />
        </div>
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

const count = ref(0)

const payload = reactive({
  email: '',
  oldPassword: '',
  gender: '',
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
