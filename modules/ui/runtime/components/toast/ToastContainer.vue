<template>
  <TransitionGroup
    name="notification"
    tag="div"
    enter-class="opacity-0 translate-y-8"
    leave-to-class="opacity-0 -z-10 -translate-y-8"
    leave-active-class="absolute"
    move-class="transition-all duration-500"
    class="fixed right-0 top-[5%] z-[90] flex flex-col items-end"
  >
    <SFToast
      v-for="notification in notifications"
      :key="notification.id"
      :notification="notification"
      data-test-id="toast-info"
      class="right-0 transition-all duration-500"
    />
  </TransitionGroup>
</template>

<script setup lang="ts">
import { useNotification } from '#storefront-ui'

const { notifications } = useNotification()
</script>
