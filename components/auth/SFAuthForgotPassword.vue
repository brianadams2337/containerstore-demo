<template>
  <SFButton
    class="inline-block w-fit rounded-md p-1 text-sm !text-gray-500 duration-300 ease-out hover:bg-gray-100 focus-visible:transition-none"
    variant="raw"
  >
    {{ $t('sign_in_page.forgot_password.title') }}
  </SFButton>
  <!--forgot password slide in will be injected here-->
</template>

<script setup lang="ts">
import { SFButton } from '#storefront-ui/components'
</script>
