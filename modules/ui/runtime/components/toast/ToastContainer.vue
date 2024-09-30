<template>
  <div
    class="md:container md:fixed md:right-8 md:top-48 md:w-min"
    :class="notifications.length ? 'z-110' : 'z-0'"
  >
    <TransitionGroup
      name="notification"
      tag="div"
      enter-class="opacity-0 translate-y-8"
      leave-to-class="opacity-0 -z-10 -translate-y-8"
      leave-active-class="absolute"
      move-class="transition-all duration-500"
      class="fixed bottom-0 flex w-full flex-col items-end gap-4 p-4 md:absolute"
    >
      <SFToast
        v-for="notification in notifications"
        :key="notification.id"
        :notification="notification"
        data-testid="toast-info"
        class="right-0 transition-all duration-500"
      />
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { useNotification } from '#storefront-ui'
import { SFToast } from '#storefront-ui/components'

const { notifications } = useNotification()
</script>
