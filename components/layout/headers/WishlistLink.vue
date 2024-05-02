<template>
  <div class="inline-flex h-full items-center justify-center">
    <SFLink
      :to="routeList.wishlist"
      data-test-id="wishlist-link"
      class="relative"
      type="loud"
    >
      <FloatingBadge v-if="count" class="-right-2 -top-2">
        {{ count }}
      </FloatingBadge>
      <IconHeartBold class="size-6" />
    </SFLink>
  </div>
</template>

<script setup lang="ts">
const { count } = await useWishlist()
</script>
