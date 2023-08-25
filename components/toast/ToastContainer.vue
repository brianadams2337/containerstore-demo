<template>
  <TransitionGroup
    name="alert"
    tag="div"
    enter-class="opacity-0 translate-y-8"
    leave-to-class="opacity-0 -z-10 -translate-y-8"
    leave-active-class="absolute"
    move-class="transition-all duration-500"
    class="fixed right-0 top-[5%] z-60 flex flex-col items-end">
    <Toast
      v-for="alert in alerts"
      :key="alert.id"
      :alert="alert"
      data-test-id="toast-info"
      class="right-0 transition-all duration-500" />
  </TransitionGroup>
</template>

<script setup lang="ts">
const { $alert } = useNuxtApp()
const alerts = computed(() => $alert.alerts.value)
</script>
