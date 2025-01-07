<template>
  <SFLocalizedLink
    :to="routeList.wishlist"
    raw
    class="flex h-11 items-center justify-center rounded-md p-2 hover:bg-gray-100"
    data-testid="wishlist-link"
    :aria-label="ariaLabel"
  >
    <IconHeartBold class="size-6 shrink-0" />
    <span
      class="ml-1 min-w-[1ch] text-sm font-semibold leading-none"
      data-testid="header-wishlist-count"
    >
      <template v-if="mounted && count">
        {{ count }}
      </template>
    </span>
  </SFLocalizedLink>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'
import { useMounted } from '@vueuse/core'
import { useWishlist } from '#storefront/composables'
import SFLocalizedLink from '~/components/SFLocalizedLink.vue'
import { routeList } from '~/utils'

const mounted = useMounted()
const { count } = useWishlist()
const i18n = useI18n()
const ariaLabel = computed(() =>
  i18n.t(
    'navigation.wishlist-aria-label',
    mounted.value ? count.value || 0 : 0,
  ),
)
</script>
s
