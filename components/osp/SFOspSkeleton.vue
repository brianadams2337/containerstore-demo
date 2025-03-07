<template>
  <div class="relative flex flex-col md:flex-row">
    <div
      class="flex w-full flex-col px-5 py-8 lg:ml-7 lg:mr-13 lg:w-3/5 lg:items-end"
    >
      <div class="w-[400px]">
        <SFSkeletonLoader
          type="custom"
          class="h-8 max-w-[200px] rounded-lg bg-gray-200"
        />
        <SFSkeletonLoader
          type="custom"
          class="mt-4 h-[100px] w-full rounded-lg"
        />
        <div class="text-base sm:grid">
          <div class="mt-4 grid w-full grid-cols-1 gap-4 md:grid-cols-2">
            <SFSkeletonLoader
              v-for="index in 4"
              :key="`osp-basic-data-${index}`"
              type="custom"
              class="flex h-[90px] rounded-lg border"
            />
          </div>
        </div>
      </div>
    </div>
    <div
      class="flex w-full flex-col border-gray-200 bg-gray-50 px-5 py-8 md:border-l lg:w-2/5 lg:items-start lg:pl-13 lg:pr-7"
    >
      <div class="w-full">
        <SFSkeletonLoader
          type="custom"
          class="h-5 max-w-[12.875rem] rounded-lg bg-gray-200"
        />
        <ul class="mb-3 flex flex-col gap-3 divide-y *:pt-3">
          <div
            v-for="index in 3"
            :key="`osp-loading-${index}`"
            class="flex gap-4"
          >
            <SFSkeletonLoader
              type="custom"
              class="size-20 rounded-lg bg-gray-200"
            />
            <div class="flex flex-1 flex-col">
              <SFSkeletonLoader
                type="custom"
                class="mb-1 h-3 max-w-[6.5rem] rounded-lg bg-gray-200"
              />
              <SFSkeletonLoader
                type="custom"
                class="mb-5 h-3 max-w-[12.875rem] rounded-lg bg-gray-200"
              />
              <SFSkeletonLoader
                type="custom"
                class="h-4 max-w-20 rounded-lg bg-gray-200"
              />
            </div>
          </div>
        </ul>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { SFSkeletonLoader } from '#storefront-ui/components'
</script>
