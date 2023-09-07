<template>
  <div class="m-2 flex w-max max-w-[90vw] space-x-2 bg-black p-2 text-white">
    <span>{{ alert.message }}</span>
    <template v-for="action in alert.actions">
      <DefaultLink
        v-if="action.href"
        :key="`link-${action.text}`"
        :class="action.class || ''"
        :to="action.href"
        raw
        class="underline"
        @click="onClick($event, action)">
        {{ action.text }}
      </DefaultLink>
      <div
        v-else
        :key="action.text"
        :class="['cursor-pointer', action.class || '']"
        class="underline"
        @click="onClick($event, action)">
        {{ action.text }}
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { Alert, ActionHandler } from '~/plugins/toast'

const props = defineProps({
  alert: {
    type: Object as PropType<Alert>,
    required: true,
  },
})

const { $alert } = useNuxtApp()

const close = () => $alert.close(props.alert.id)

const onClick = (event: Event, action: ActionHandler) => {
  if (!action?.onClick) {
    return
  }
  event.preventDefault()
  event.stopImmediatePropagation()
  action?.onClick(event, { ...props.alert, close })
}
let timeout: NodeJS.Timeout

onMounted(() => {
  timeout = setTimeout(() => close(), props.alert.duration || 100000)
})

onUnmounted(() => timeout && clearTimeout(timeout))
</script>

<script lang="ts">
export default {
  name: 'AppToast',
}
</script>
