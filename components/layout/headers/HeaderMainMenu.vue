<template>
  <div class="flex items-center justify-end text-primary">
    <HeaderSearch class="hidden md:flex" />
    <UserPopover class="w-12" data-test-id="user-popover" />
    <div class="flex w-12 justify-center">
      <DefaultLink
        :to="{ name: route.routes.wishlist.name }"
        data-test-id="wishlist-link"
        class="relative"
        type="loud">
        <!-- <FloatingBadge v-show="wishlistCount" class="-right-2 -top-2"> -->
        <!--   {{ wishlistCount }} -->
        <!-- </FloatingBadge> -->
        <SvgoHeart class="h-8 w-8" />
      </DefaultLink>
    </div>
  </div>
</template>

<script setup lang="ts">
// const { count: wishlistCount } = await useCurrentWishlist()
</script>
