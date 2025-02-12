<template>
  <SFSlideIn
    :name="SLIDE_IN_KEY"
    class="max-md:top-auto max-md:!h-auto max-md:rounded-t-xl md:!w-96"
    slide-class="!max-w-none"
    borderless
  >
    <template #slide-in-header>
      <SFAuthResetPasswordSlideInHeader @close="closeAndClear" />
    </template>
    <template #slide-in-body>
      <SFAuthResetPasswordSlideInBody
        v-if="isOpen"
        class="px-6 py-4 max-lg:pb-11"
        @close="closeAndClear"
      />
    </template>
  </SFSlideIn>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import SFAuthResetPasswordSlideInHeader from './SFAuthResetPasswordSlideInHeader.vue'
import SFAuthResetPasswordSlideInBody from './SFAuthResetPasswordSlideInBody.vue'
import { SFSlideIn } from '#storefront-ui/components'
import { useSlideIn } from '#storefront-ui/composables'
import { useAuthentication } from '~/composables'
import { useRoute } from '#app/composables/router'

const SLIDE_IN_KEY = 'ResetPasswordSlideIn'

const route = useRoute()

const hasToken = computed(() => !!route.query.hash)

const { close, isOpen } = useSlideIn(SLIDE_IN_KEY, hasToken.value)

const { clearErrorMessage } = useAuthentication('reset_password')

const closeAndClear = () => {
  clearErrorMessage()
  close()
}
</script>
