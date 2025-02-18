<template>
  <SFButton
    class="inline-block w-fit rounded-md p-1 text-sm !text-gray-500 duration-300 ease-out hover:bg-gray-100 focus-visible:transition-none"
    data-testid="reset-password-button"
    variant="raw"
    @click.prevent="toggle"
  >
    {{ $t('sign_in_page.forgot_password.title') }}
  </SFButton>
  <SFSlideIn
    :name="SLIDE_IN_KEY"
    class="max-md:top-auto max-md:!h-auto max-md:rounded-t-xl md:!w-96"
    data-testid="reset-password-flyout"
    slide-class="!max-w-none"
    borderless
  >
    <template #slide-in-header>
      <SFAuthForgotPasswordSlideInHeader @close="closeAndClear" />
    </template>
    <template #slide-in-body>
      <SFAuthForgotPasswordSlideInBody
        v-if="isOpen"
        class="px-6 py-4 max-lg:pb-11"
        :prefilled-email="prefilledEmail"
        @close="closeAndClear"
      />
    </template>
  </SFSlideIn>
</template>

<script setup lang="ts">
import SFAuthForgotPasswordSlideInHeader from './SFAuthForgotPasswordSlideInHeader.vue'
import SFAuthForgotPasswordSlideInBody from './SFAuthForgotPasswordSlideInBody.vue'
import { SFButton, SFSlideIn } from '#storefront-ui/components'
import { useSlideIn } from '#storefront-ui/composables'
import { useAuthentication } from '~/composables'

const SLIDE_IN_KEY = 'ForgotPasswordSlideIn'

defineProps<{ prefilledEmail: string }>()

const { toggle, close, isOpen } = useSlideIn(SLIDE_IN_KEY)

const { clearErrorMessage } = useAuthentication('forgot_password')

const closeAndClear = () => {
  clearErrorMessage()
  close()
}
</script>
