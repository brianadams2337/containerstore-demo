<template>
  <div
    class="m-2 flex w-max max-w-[90vw] space-x-2 rounded-md bg-black p-2 text-white"
  >
    <span>{{ notification.message }}</span>
    <template v-for="action in notification.actions">
      <SFLink
        v-if="action.href"
        :key="`link-${action.text}`"
        :class="action.class || ''"
        :to="action.href"
        raw
        class="underline"
        @click="onClick($event, action)"
      >
        {{ action.text }}
      </SFLink>
      <div
        v-else
        :key="action.text"
        :class="action.class"
        class="cursor-pointer underline"
        @click="onClick($event, action)"
      >
        {{ action.text }}
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useTimeoutFn } from '@vueuse/core'
import { useNotification } from '#storefront-ui'

const props = defineProps<{ notification: AppNotification }>()

const { close: closeNotification } = useNotification()

const close = () => closeNotification(props.notification.id)

const onClick = (event: Event, action: NotificationActionHandler) => {
  if (!action?.onClick) {
    return
  }
  event.preventDefault()
  event.stopImmediatePropagation()
  action?.onClick(event, { ...props.notification, close })
}

useTimeoutFn(close, props.notification.duration)
</script>
