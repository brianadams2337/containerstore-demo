<template>
  <div
    class="inline-flex h-6 items-center p-px"
    :class="!borderless && 'rounded border'"
  >
    <IconClockOutline class="ml-1.5 size-5 text-white" />
    <ClientOnly>
      <template #fallback>
        <div class="mx-1 flex">
          <SFSkeletonLoader
            v-for="n in COUNTDOWN_LOADER_UNITS"
            :key="n"
            type="custom"
            class="mx-1.5 h-3 !w-3.5 rounded-md"
          />
        </div>
      </template>
      <SFFadeInTransition :duration="300">
        <SFCountdown
          :until="until"
          :show-units="true"
          unit-size="short"
          data-test-id="promotion-countdown"
        />
      </SFFadeInTransition>
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
