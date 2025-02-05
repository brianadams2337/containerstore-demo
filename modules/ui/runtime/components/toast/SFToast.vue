<template>
  <div
    class="flex min-h-16 w-full items-center justify-center space-x-2 rounded-md p-3 px-4 font-semi-bold-variable leading-none md:h-11 md:w-max md:max-w-[90vw]"
    :class="notification.type?.classes"
  >
    <component :is="notification.type?.iconComponent" class="size-4 shrink-0" />
    <span>{{ notification.message }}</span>
    <template v-for="action in notification.actions">
      <SFLink
        v-if="action.href"
        :key="`link-${action.text}`"
        :class="action.class"
        :to="action.href"
        raw
        class="underline"
        @click="onClick($event, action)"
      >
        {{ action.text }}
      </SFLink>
      <button
        v-else
        :key="action.text"
        :class="action.class"
        class="underline"
        @click="onClick($event, action)"
      >
        {{ action.text }}
      </button>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useTimeoutFn } from '@vueuse/core'
import { useNotification } from '#storefront-ui'
import type {
  NotificationActionHandler,
  StorefrontNotification,
} from '#storefront-ui'
import { SFLink } from '#storefront-ui/components'

const { notification } = defineProps<{ notification: StorefrontNotification }>()

const { close: closeNotification } = useNotification()

const close = () => closeNotification(notification.id)

const onClick = (event: Event, action: NotificationActionHandler) => {
  if (!action?.onClick) {
    return
  }
  event.preventDefault()
  event.stopImmediatePropagation()
  action?.onClick({ close })
}

useTimeoutFn(close, notification.duration)
</script>
