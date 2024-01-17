<template>
  <div
    class="inline-flex h-6 items-center p-px"
    :class="!borderless && 'rounded border'"
  >
    <IconClockOutline class="ml-1.5 size-5 text-white" />
    <ClientOnly>
      <template #fallback>
        <div class="mx-1 flex">
          <SkeletonLoader
            v-for="n in COUNTDOWN_LOADER_UNITS"
            :key="n"
            type="custom"
            class="mx-1.5 h-3 !w-3.5 rounded-md"
          />
        </div>
      </template>
      <FadeInTransition :duration="300">
        <Countdown :until="until" data-test-id="countdown" />
      </FadeInTransition>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
type Props = {
  until: string
  borderless?: boolean
}

withDefaults(defineProps<Props>(), { borderless: false })
</script>
