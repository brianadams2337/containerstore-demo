<template>
  <SFFadeInTransition>
    <div
      v-if="message"
      class="flex items-center space-x-2 rounded-10 bg-status-error/20 px-4 py-3 text-sm font-semi-bold-variable leading-3.5 text-gray-900 lg:mt-0.5"
    >
      <IconErrorHexagon class="size-4 fill-white text-gray-900" />
      <span>{{ message }}</span>
    </div>
  </SFFadeInTransition>
</template>

<script lang="ts" setup>
import { SFFadeInTransition } from '#storefront-ui/components'

defineProps<{ message: string | null }>()
</script>
