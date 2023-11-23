<template>
  <VerticalAccordion
    v-if="lastLoggedInUser.email"
    :tabs="[$t('login_page.welcome_back.title', { name })]"
  >
    <template #0>
      <LoginForm />
      <button
        class="group relative text-left text-sm text-gray-600 hover:text-black"
        @click="removeLastLoggedInUser()"
      >
        <span>
          {{ $t('login_page.welcome_back.not_user', { name }) }}
        </span>
      </button>
    </template>
  </VerticalAccordion>
</template>

<script setup lang="ts">
const { lastLoggedInUser, removeLastLoggedInUser } = await useLastLoggedInUser()

const name = computed(() => lastLoggedInUser.value.firstName)
</script>
