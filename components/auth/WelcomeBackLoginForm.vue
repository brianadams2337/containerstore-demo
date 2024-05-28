<template>
  <SFVerticalAccordion
    :tabs="[$t('login_page.welcome_back.title', { username })]"
  >
    <template #0>
      <LoginForm />
      <button
        class="group relative text-left text-sm text-gray-600 hover:text-black"
        @click="removeLastLoggedInUser()"
      >
        <span>
          {{ $t('login_page.welcome_back.not_user', { username }) }}
        </span>
      </button>
    </template>
  </SFVerticalAccordion>
</template>

<script setup lang="ts">
const { lastLoggedInUser, removeLastLoggedInUser } = await useLastLoggedInUser()

const username = computed(() => lastLoggedInUser.value.firstName)
</script>
