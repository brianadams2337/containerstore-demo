<template>
  <SFVerticalAccordion
    :tabs="[$t('login_page.welcome_back.title', { username })]"
    tab-tag="h2"
  >
    <template #0>
      <SFLoginForm />
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
import { computed } from 'vue'
import SFLoginForm from './SFLoginForm.vue'
import { useLastLoggedInUser } from '~/composables'
import { SFVerticalAccordion } from '#storefront-ui/components'

const { lastLoggedInUser, removeLastLoggedInUser } = await useLastLoggedInUser()

const username = computed(() => lastLoggedInUser.value.firstName)
</script>
