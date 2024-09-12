<template>
  <div
    class="flex flex-col items-center justify-center gap-10 rounded bg-gray-50 py-10 md:flex-row md:px-10 lg:py-32"
    data-testid="empty-state"
  >
    <div class="w-32" data-testid="empty-state-icon">
      <component :is="iconComponent" class="w-full" />
    </div>
    <div class="px-8 text-center md:w-[32rem] md:px-0 md:text-start">
      <SFHeadline v-if="title" class="!block" size="xl">
        {{ title }}
      </SFHeadline>
      <SFHeadline
        v-if="description"
        size="sm"
        class="mt-4 !block text-gray-700"
      >
        {{ description }}
      </SFHeadline>
      <div
        v-if="showDefaultActions"
        class="mt-8 flex justify-center gap-4 md:justify-start"
      >
        <SFButton
          v-if="!isLoggedIn"
          :to="routeList.signin"
          data-testid="button-signin"
        >
          {{ $t('global.sign_in_label') }}
        </SFButton>
        <SFButton
          :to="routeList.home"
          type="tertiary"
          data-testid="button-continue-shopping"
        >
          {{ $t('global.continue_shopping_label') }}
        </SFButton>
      </div>
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useUser } from '#storefront/composables'
import { routeList } from '~/utils/route'
import { IconEmptyBasket, IconEmptyWishlist } from '#components'

type Props = {
  title?: string
  description?: string
  icon?: 'EmptyWishlist' | 'EmptyBasket'
  showDefaultActions?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  description: '',
  icon: 'EmptyBasket',
  showDefaultActions: false,
})

const { isLoggedIn } = useUser()

const iconComponent = computed(() => {
  return props.icon === 'EmptyBasket' ? IconEmptyBasket : IconEmptyWishlist
})
</script>
