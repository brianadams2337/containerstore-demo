<template>
  <div class="inline-flex h-full items-center justify-center">
    <LocalizedLink
      :to="routeList.wishlist"
      data-testid="wishlist-link"
      class="relative"
      variant="loud"
    >
      <AsyncDataWrapper :status="status">
        <FloatingBadge
          v-if="count"
          class="-right-2 -top-2"
          data-testid="wishlist-items-badge"
        >
          {{ count }}
        </FloatingBadge>
      </AsyncDataWrapper>
      <IconHeartBold class="size-6" />
    </LocalizedLink>
  </div>
</template>

<script setup lang="ts">
import FloatingBadge from './FloatingBadge.vue'
import AsyncDataWrapper from '~/components/AsyncDataWrapper.vue'
import { useWishlist } from '#storefront/composables'
import { routeList } from '~/utils/route'
import LocalizedLink from '~/components/LocalizedLink.vue'

const { count, status } = useWishlist()
</script>
