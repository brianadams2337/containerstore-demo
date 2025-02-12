<template>
  <div class="flex w-full items-center justify-between">
    <SFHeadline
      class="my-2 !font-semi-bold-variable md:text-lg"
      size="xl"
      tag="h3"
    >
      {{ $t('sign_in_page.forgot_password.title') }}
    </SFHeadline>
    <SFButton
      class="group my-2 -mr-2 hover:bg-gray-100 max-lg:hidden md:bg-transparent"
      fab
      variant="raw"
      data-testid="close-forgot-password-slide-in"
      @click.prevent="$emit('close')"
    >
      <template #icon>
        <IconClose
          class="size-3 text-gray-400 group-hover:text-gray-900"
          aria-hidden="true"
        />
      </template>
    </SFButton>
  </div>
  <p class="text-md text-gray-500">
    {{ $t('sign_in_page.forgot_password.description') }}
  </p>
</template>

<script setup lang="ts">
import { SFButton, SFHeadline } from '#storefront-ui/components'

defineEmits<{ close: [] }>()
</script>
