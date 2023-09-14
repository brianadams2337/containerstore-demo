<template>
  <div class="flex items-center justify-end text-primary">
    <HeaderSearch class="hidden md:flex" />
    <UserPopover class="w-12" data-test-id="user-popover" />
    <div class="flex w-12 justify-center">
      <DefaultLink
        :to="{ name: routeList.wishlist.name }"
        data-test-id="wishlist-link"
        class="relative"
        type="loud">
        <FloatingBadge v-if="wishlistCount" class="-right-2 -top-2">
          {{ wishlistCount }}
        </FloatingBadge>
        <IconHeart class="h-8 w-8" />
      </DefaultLink>
    </div>
    <BasketPopover />
  </div>
</template>

<script setup lang="ts">
const { count: wishlistCount } = await useWishlist()
</script>
