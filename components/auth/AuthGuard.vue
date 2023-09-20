<template>
  <div>
    <div v-if="isLoggedIn">
      <slot />
    </div>
    <div v-else>
      <NuxtPage name="signin" />
    </div>
  </div>
</template>

<script setup lang="ts">
const { isLoggedIn } = await useUser({ autoFetch: false })
</script>
