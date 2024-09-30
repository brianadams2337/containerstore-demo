<template>
  <div class="flex w-full items-center justify-between">
    <SFHeadline class="!font-semi-bold-variable md:text-lg" size="xl" tag="p">
      {{ $t('filter.title') }}
    </SFHeadline>
    <SFButton
      class="bg-gray-100 !p-3 md:bg-transparent md:!pr-0"
      fab
      type="raw"
      data-testid="close-filters"
      @click="toggleItem"
    >
      <template #icon>
        <IconClose class="size-5 md:size-4 md:text-gray-400" />
      </template>
    </SFButton>
  </div>
</template>

<script setup lang="ts">
import { SFButton, SFHeadline } from '#storefront-ui/components'

defineProps<{ toggleItem: () => void }>()
</script>
