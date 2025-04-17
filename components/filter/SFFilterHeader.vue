<template>
  <div class="flex w-full items-center justify-between">
    <SFHeadline class="!font-semi-bold-variable md:text-lg" size="xl" tag="p">
      {{ $t('filter.title') }}
    </SFHeadline>
    <SFButton
      class="group my-3 -mr-2 bg-gray-100 md:bg-transparent hover:md:bg-gray-100"
      fab
      variant="raw"
      data-testid="close-filters"
      :aria-label="$t('filter.close')"
      @click="toggleItem"
    >
      <template #icon>
        <IconClose
          class="size-5 md:size-4 md:text-gray-400 group-hover:md:text-gray-900"
        />
      </template>
    </SFButton>
  </div>
</template>

<script setup lang="ts">
import { SFButton, SFHeadline } from '#storefront-ui/components'

defineProps<{ toggleItem: () => void }>()
</script>
