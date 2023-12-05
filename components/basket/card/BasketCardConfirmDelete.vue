<template>
  <div class="flex py-4 text-sm">
    <div class="w-28 pr-6">
      <NuxtImg
        :src="imageHash"
        :alt="name"
        provider="default"
        class="object-cover"
        sizes="xl:100vw lg:100vw lg:100vw lg:100vw xs:100vw"
      />
    </div>
    <div class="flex grow flex-col justify-center">
      <div class="space-y-2">
        <div class="mb-8 flex justify-center sm:justify-start md:mb-4">
          <Headline tag="p" size="base" is-uppercase>
            {{ $t('basket_card.confirm_remove_question') }}
          </Headline>
        </div>

        <div class="flex space-x-4 sm:max-w-md">
          <AppButton
            type="tertiary"
            is-full-width
            @click="emit('click:cancel')"
          >
            {{ $t('basket_card.cancel') }}
          </AppButton>
          <AppButton
            data-test-id="basket-remove-item-confirm-button"
            no-padding
            is-full-width
            @click="emit('click:confirm')"
          >
            <span class="sm:hidden">
              {{ $t('basket_card.remove_short') }}
            </span>
            <span class="hidden sm:block">
              {{ $t('basket_card.remove_long') }}
            </span>
          </AppButton>
        </div>
      </div>
    </div>
    <div class="flex flex-col justify-between" />
  </div>
</template>

<script setup lang="ts">
defineProps<{ name: string; imageHash: string }>()

const emit = defineEmits<{
  (e: 'click:confirm'): void
  (e: 'click:cancel'): void
}>()
</script>
