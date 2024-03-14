<template>
  <div class="flex items-center justify-end text-primary">
    <HeaderSearch class="hidden md:flex" />
    <div class="ml-1 flex h-full items-center justify-center space-x-4">
      <div class="h-full w-12">
        <div class="inline-flex size-full items-center justify-center">
          <DefaultLink
            data-test-id="store-location-link"
            :to="routeList.location"
            type="loud"
          >
            <IconLocationMenu class="size-6 cursor-pointer" />
          </DefaultLink>
        </div>
      </div>
      <ClientOnly>
        <UserPopover data-test-id="user-popover" />
        <WishlistLink />
        <BasketPopover />
      </ClientOnly>
    </div>
  </div>
</template>
