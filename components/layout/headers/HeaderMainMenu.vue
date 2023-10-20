<template>
  <div class="flex items-center justify-end text-primary">
    <HeaderSearch class="hidden md:flex" />
    <div class="ml-1 flex h-full items-center justify-center space-x-4">
      <ClientOnly>
        <UserPopover data-test-id="user-popover" />
        <WishlistLink />
        <BasketPopover />
      </ClientOnly>
    </div>
  </div>
</template>
