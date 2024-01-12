<template>
  <Popover
    :is-open="isBasketFlyoutOpen"
    :disable-popover-content="isSmaller('md')"
    content-wrapper-class="mt-8"
    @mouseenter="openBasketFlyout"
    @mouseleave="closeBasketFlyout"
  >
    <template #action>
      <DefaultLink
        data-test-id="basket-link"
        :to="routeList.basket"
        class="relative"
        type="loud"
      >
        <FloatingBadge v-if="!isEmpty" class="-right-2 -top-2">
          {{ countWithoutSoldOutItems }}
        </FloatingBadge>
        <IconCart class="h-6 w-6" />
      </DefaultLink>
      <div
        v-if="isBasketFlyoutOpen"
        class="absolute -bottom-3 h-0.5 w-8 bg-black"
      />
    </template>
    <template #content>
      <ClientOnly>
        <BasketPopoverItems />
        <BasketPopoverActions v-if="!isEmpty" />
      </ClientOnly>
    </template>
  </Popover>
</template>

<script setup lang="ts">
const { isSmaller } = useDefaultBreakpoints()

const { openBasketFlyout, closeBasketFlyout, isBasketFlyoutOpen } = useFlyouts()

const { isEmpty, fetch, countWithoutSoldOutItems } = await useBasket({
  options: { autoFetch: false },
})

onMounted(() => fetch())
</script>
