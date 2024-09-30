<template>
  <SFPopover
    :is-open="isBasketFlyoutOpen"
    :disable-popover-content="isMobile"
    content-wrapper-class="mt-8"
    @mouseenter="openBasketFlyout"
    @mouseleave="closeBasketFlyout"
    @focusout="closeBasketFlyout"
    @focusin="openBasketFlyout"
  >
    <template #action>
      <SFLink
        data-testid="basket-link"
        :to="routeList.basket"
        class="relative"
        type="loud"
      >
        <FloatingBadge
          v-if="!isEmpty && status === 'success'"
          class="-right-2 -top-2"
        >
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
      <AsyncDataWrapper :status="status">
        <BasketPopoverItems />
        <BasketPopoverActions v-if="!isEmpty" />
      </AsyncDataWrapper>
    </template>
  </SFPopover>
</template>

<script setup lang="ts">
import BasketPopoverItems from './BasketPopoverItems.vue'
import BasketPopoverActions from './BasketPopoverActions.vue'
import { useBasket } from '#storefront/composables'
import { useDefaultBreakpoints, useFlyouts } from '~/composables'
import { routeList } from '~/utils/route'
import { SFLink, SFPopover } from '#storefront-ui/components'
import FloatingBadge from '~/components/layout/headers/FloatingBadge.vue'
import AsyncDataWrapper from '~/components/AsyncDataWrapper.vue'

const { smaller } = useDefaultBreakpoints()

const isMobile = smaller('md')

const { openBasketFlyout, closeBasketFlyout, isBasketFlyoutOpen } = useFlyouts()

const { isEmpty, countWithoutSoldOutItems, status } = useBasket()
</script>
