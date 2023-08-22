<template>
  <div>
    <NuxtLazyHydrate when-visible>
      <div class="h-[600px]">
        {{ $t('global.user_greeting', { name: appUser }) }}
        <p>Nuxt Img</p>
        <nuxt-img
          class="h-full"
          provider="default"
          src="images/1bef383677e1873e174d75f52fc51a2a.jpg" />
      </div>
    </NuxtLazyHydrate>

    <div class="mt-20">
      <h3 class="my-5">Form validations with Vuelidate</h3>
      <form
        class="flex w-[500px] flex-col space-y-3 rounded-md border p-6 shadow-sm">
        <div class="flex">
          <label class="mr-5" for="email">Email</label>
          <input
            id="email"
            v-model="formPayload.email"
            placeholder="Enter Email"
            class="flex-1 px-3 py-1"
            type="text" />
        </div>
        <div
          class="flex"
          :class="{ 'border border-red-400 p-1': v$.password.$errors.length }">
          <label class="mr-5" for="password">Password</label>
          <input
            id="password"
            v-model="formPayload.password"
            placeholder="Enter Password"
            class="flex-1 px-3 py-1"
            type="text"
            @keyup="v$.password.$touch" />
        </div>

        <p v-if="v$.password.$errors.length">
          Password {{ v$.password.$errors[0].$message }}
        </p>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useVuelidate } from '@vuelidate/core'
import { required, email } from '@vuelidate/validators'

const appUser = ['AYK', 'Connor', 'Rob'][
  Math.floor(Math.random() * (2 - 0 + 1) + 0)
]

const count = ref(0)

const formPayload = reactive({
  email: '',
  password: '',
})

const v$ = useVuelidate(
  {
    email: { email, required },
    password: {
      required,
    },
  },
  formPayload,
)

watch(
  () => v$.value,
  () => {
    console.log({ validations: v$.value })
  },
)

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
