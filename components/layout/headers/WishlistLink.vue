<template>
  <div class="inline-flex h-full w-full items-center justify-center">
    <DefaultLink
      :to="routeList.wishlist"
      data-test-id="wishlist-link"
      class="relative"
      type="loud">
      <FloatingBadge v-if="count" class="-right-2 -top-2">
        {{ count }}
      </FloatingBadge>
      <IconHeartBold class="h-6 w-6" />
    </DefaultLink>
  </div>
</template>

<script setup lang="ts">
const { count } = await useWishlist()
</script>
