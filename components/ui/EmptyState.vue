<template>
  <div
    class="flex flex-col items-center justify-center gap-10 rounded bg-gray-50 py-10 md:flex-row md:px-10 lg:py-32">
    <div class="w-32">
      <component :is="icon" class="w-full" />
    </div>
    <div class="px-8 text-center md:w-[32rem] md:px-0 md:text-start">
      <Headline v-if="title" class="!block" size="xl" :is-uppercase="false">
        {{ title }}
      </Headline>
      <Headline
        v-if="description"
        size="sm"
        :is-uppercase="false"
        class="mt-4 !block text-gray-700">
        {{ description }}
      </Headline>
      <div
        v-if="showDefaultActions"
        class="mt-8 flex justify-center gap-4 md:justify-start">
        <AppButton v-if="!isLoggedIn" :to="routeList.signin">
          {{ $t('global.sign_in_label') }}
        </AppButton>
        <AppButton :to="routeList.home" type="tertiary">
          {{ $t('global.continue_shopping_label') }}
        </AppButton>
      </div>
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  title: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
  icon: {
    type: String as PropType<'IconEmptyWishlist' | 'IconEmptyBasket'>,
    default: 'IconEmptyBasket',
  },
  showDefaultActions: {
    type: Boolean,
    default: false,
  },
})

const { isLoggedIn } = await useUser()
</script>
