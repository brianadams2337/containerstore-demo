<template>
  <form class="mx-auto mt-10 flex w-full flex-col md:mx-0 lg:w-[400px]">
    <client-only>
      <SFRadioGroup
        v-model="payload.gender"
        :items="genders"
        class="items-start"
      />
      <div class="mt-8">
        <SFValidatedInputGroup
          v-slot="{ isValid }"
          :errors="v.firstName.$errors"
        >
          <SFTextInput
            v-model="payload.firstName"
            :has-errors="!isValid"
            :placeholder="$t('form_fields.first_name')"
            required
            @input="v.firstName.$touch"
          />
        </SFValidatedInputGroup>
        <SFValidatedInputGroup
          v-slot="{ isValid }"
          :errors="v.lastName.$errors"
        >
          <SFTextInput
            v-model="payload.lastName"
            :has-errors="!isValid"
            :placeholder="$t('form_fields.last_name')"
            required
            @input="v.lastName.$touch"
          />
        </SFValidatedInputGroup>
        <SFValidatedInputGroup
          v-slot="{ isValid }"
          :errors="v.birthDate.$errors"
        >
          <SFTextInput
            v-model="payload.birthDate"
            :placeholder="dobFormat.placeholder"
            :mask="dobFormat.mask"
            :has-errors="!isValid"
            @input="v.birthDate.$touch"
          />
        </SFValidatedInputGroup>
        <SFTextInput
          v-model="payload.email"
          :placeholder="$t('form_fields.email')"
          :hint="$t('my_account.user.email_change_hint')"
          readonly
        />
        <div
          class="mt-6 flex w-full items-center justify-center"
          data-test-id="save-button"
        >
          <SFButton
            class="w-full capitalize md:w-auto md:min-w-[50%]"
            :disabled="isUpdating || v.$error"
            @click="update"
          >
            {{ $t('my_account.user.save_label') }}
          </SFButton>
        </div>
      </div>
      <template #fallback>
        <div class="w-full space-y-6">
          <SFSkeletonLoader />
          <SFSkeletonLoader v-for="i in 4" :key="i" full-width />
          <div class="flex w-full justify-center pt-4">
            <SFSkeletonLoader />
          </div>
        </div>
      </template>
    </client-only>
  </form>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { formatDate, getPayloadDate } from '@scayle/storefront-nuxt'
import useVuelidate from '@vuelidate/core'
import { dateOfBirthFormats } from '~/constants/mask'
import { useToast, useValidationRules } from '~/composables'
import { useCurrentShop, useUser } from '#storefront/composables'
import { useNuxtApp } from '#app'

const { user, updateUser } = await useUser()

const { $i18n } = useNuxtApp()
const currentShop = useCurrentShop()
const validationRules = useValidationRules()

const toast = useToast()

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
  {
    label: $i18n.t('form_fields.diverse'),
    value: 'd',
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
      birthDate: payload.birthDate
        ? getPayloadDate(payload.birthDate)
        : undefined,
    })
    toast.show($i18n.t('my_account.user.save_message'), 'CONFIRM')
  } catch {
    toast.show(saveError, 'CONFIRM')
  } finally {
    isUpdating.value = false
  }
}
</script>
