<template>
  <SFPopover
    :is-open="isBasketFlyoutOpen"
    :disable-popover-content="isSmaller('md')"
    content-wrapper-class="mt-8"
    @mouseenter="openBasketFlyout"
    @mouseleave="closeBasketFlyout"
  >
    <template #action>
      <SFLink
        data-test-id="basket-link"
        :to="routeList.basket"
        class="relative"
        type="loud"
      >
        <FloatingBadge v-if="!isEmpty" class="-right-2 -top-2">
          {{ countWithoutSoldOutItems }}
        </FloatingBadge>
        <IconCart class="size-6" />
      </SFLink>
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
  </SFPopover>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useBasket } from '#storefront/composables'
import { useDefaultBreakpoints, useFlyouts } from '~/composables'
import { routeList } from '~/utils/route'

const { isSmaller } = useDefaultBreakpoints()

const { openBasketFlyout, closeBasketFlyout, isBasketFlyoutOpen } = useFlyouts()

const { isEmpty, fetch, countWithoutSoldOutItems } = await useBasket()

onMounted(() => fetch())
</script>
