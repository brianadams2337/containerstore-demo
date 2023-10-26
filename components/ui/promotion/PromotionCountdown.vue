<template>
  <div class="inline-flex h-6 items-center rounded border p-px">
    <IconClockOutline class="ml-1.5 h-5 w-5 text-white" />
    <ClientOnly>
      <template #fallback>
        <div class="mx-1 flex">
          <SkeletonLoader
            v-for="n in 4"
            :key="n"
            type="custom"
            class="mx-1.5 h-3 !w-3.5 rounded-md" />
        </div>
      </template>
      <FadeInTransition :duration="300">
        <Countdown :until="until" />
      </FadeInTransition>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
defineProps({
  until: {
    type: String,
    required: true,
  },
})
</script>
