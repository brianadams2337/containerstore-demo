<template>
  <form class="mx-auto mt-10 flex w-full flex-col md:mx-0 lg:w-[400px]">
    <RadioGroup v-model="payload.gender" :items="genders" class="items-start" />
    <div class="mt-8">
      <ValidatedInputGroup v-slot="{ isValid }" :errors="v.firstName.$errors">
        <TextInput
          v-model="payload.firstName"
          :has-errors="!isValid"
          :placeholder="$t('form_fields.first_name')"
          required
          @input="v.firstName.$touch"
        />
      </ValidatedInputGroup>
      <ValidatedInputGroup v-slot="{ isValid }" :errors="v.lastName.$errors">
        <TextInput
          v-model="payload.lastName"
          :has-errors="!isValid"
          :placeholder="$t('form_fields.last_name')"
          required
          @input="v.lastName.$touch"
        />
      </ValidatedInputGroup>
      <ValidatedInputGroup v-slot="{ isValid }" :errors="v.birthDate.$errors">
        <TextInput
          v-model="payload.birthDate"
          :placeholder="dobFormat.placeholder"
          :mask="dobFormat.mask"
          :has-errors="!isValid"
          @input="v.birthDate.$touch"
        />
      </ValidatedInputGroup>
      <TextInput
        v-model="payload.email"
        :placeholder="$t('form_fields.email')"
        :hint="$t('my_account.user.email_change_hint')"
        readonly
      />
      <div
        class="mt-6 flex w-full items-center justify-center"
        data-test-id="save-button"
      >
        <AppButton
          class="w-full capitalize md:w-auto md:min-w-[50%]"
          :disabled="isUpdating || v.$error"
          @click="update"
        >
          {{ $t('my_account.user.save_label') }}
        </AppButton>
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import { formatDate, getPayloadDate } from '@scayle/storefront-nuxt'
import useVuelidate from '@vuelidate/core'

const { user, updateUser } = await useUser()

const { $alert, $i18n } = useNuxtApp()
const currentShop = useCurrentShop()
const validationRules = useValidationRules()

const dobFormat = computed(() => {
  const locale = currentShop.value?.locale.replace('-', '_')
  return (locale && dateOfBirthFormats[locale]) || dateOfBirthFormats.de_DE
})

// initializes and keeps the payload in sync with the user data
const initPayload = () => ({
  firstName: user.value?.firstName || '',
  lastName: user.value?.lastName || '',
  email: user.value?.email || '',
  birthDate: formatDate(user.value?.birthDate) || '',
  gender: user.value?.gender,
})

const payload = reactive(initPayload())

const isUpdating = ref(false)

const rules = computed(() => ({
  firstName: {
    name: validationRules.name,
    required: validationRules.required,
    maxLength: validationRules.maxLength(30),
  },
  lastName: {
    name: validationRules.name,
    required: validationRules.required,
    maxLength: validationRules.maxLength(50),
  },
  birthDate: {
    required: validationRules.required,
    date: validationRules.date,
    futureDate: validationRules.futureDate,
  },
}))

const v = useVuelidate(rules.value, payload, { $scope: false })

const setPayload = () => Object.assign(payload, initPayload())

const genders = computed(() => [
  {
    label: $i18n.t('form_fields.male'),
    value: 'm',
  },
  {
    label: $i18n.t('form_fields.female'),
    value: 'f',
  },
])

watch(user, setPayload, { immediate: true })

const update = async () => {
  isUpdating.value = true

  const saveError = $i18n.t('my_account.user.save_error')
  try {
    const isValid = await v.value.$validate()
    if (!isValid) {
      throw new Error(saveError)
    }
    await updateUser({
      ...payload,
      birthDate: getPayloadDate(payload.birthDate),
    })
    $alert.show($i18n.t('my_account.user.save_message'), 'CONFIRM')
  } catch {
    $alert.show(saveError, 'CONFIRM')
  } finally {
    isUpdating.value = false
  }
}
</script>
