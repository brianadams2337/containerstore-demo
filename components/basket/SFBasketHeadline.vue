<template>
  <SFHeadline
    tag="h1"
    class="w-full gap-1 font-semi-bold-variable lg:max-w-156 lg:font-medium"
    data-testid="headline"
    :aria-label="$t('basket.basket_aria_label', count)"
  >
    {{ $t('basket.heading') }}
    <span
      class="ml-1 inline-flex h-4.5 items-center rounded-full bg-gray-900 px-2 text-xs font-semibold leading-4 text-white"
    >
      {{ count }}
    </span>
  </SFHeadline>
</template>

<script setup lang="ts">
import { SFHeadline } from '#storefront-ui/components'

const { count } = defineProps<{ count: number }>()
</script>
