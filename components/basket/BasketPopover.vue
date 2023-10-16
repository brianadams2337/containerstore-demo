<template>
  <Popover
    :is-open="isBasketFlyoutOpen"
    :disable-popover-content="isPopoverContentDisabled"
    content-wrapper-class="mt-8"
    @mouseenter="openBasketFlyout"
    @mouseleave="closeBasketFlyout">
    <template #action>
      <DefaultLink
        data-test-id="basket-link"
        :to="routeList.basket"
        class="relative"
        type="loud">
        <FloatingBadge v-if="items?.length" class="-right-2 -top-2">
          {{ countWithoutSoldOutItems }}
        </FloatingBadge>
        <IconCart class="h-6 w-6" />
      </DefaultLink>
      <div
        v-if="isBasketFlyoutOpen"
        class="absolute -bottom-3 h-0.5 w-8 bg-black" />
    </template>
    <template #content>
      <client-only>
        <div
          v-if="basketItems?.standAlone?.length"
          class="max-h-xs overflow-y-auto overscroll-none">
          <article v-for="item in basketItems?.standAlone" :key="item.key">
            <BasketCardPopover :items="[item]" is-light-variant />
          </article>
        </div>
        <div
          v-if="groupIds?.length"
          class="max-h-xs overflow-y-auto overscroll-none">
          <article v-for="groupId in groupIds" :key="groupId">
            <BasketCardPopover
              :items="basketItems.groups[groupId]"
              is-light-variant />
          </article>
        </div>
        <div
          v-if="!items?.length"
          class="flex w-full flex-col items-center justify-center py-4">
          <div class="w-2/3">
            <p class="text-center text-sm">
              {{ $t('basket.no_items_info') }}
            </p>
          </div>
        </div>
        <BasketPopoverCta v-if="items?.length" />
      </client-only>
    </template>
  </Popover>
</template>

<script setup lang="ts">
import { BasketItem } from '@scayle/storefront-nuxt'

const { isLessThan } = useViewport()

const isPopoverContentDisabled = computed(() => isLessThan('md'))
const { openBasketFlyout, closeBasketFlyout, isBasketFlyoutOpen } = useFlyouts()

const groupIds = computed(() => Object.keys(basketItems.value.groups))

const { items, countWithoutSoldOutItems } = await useBasket()
const { bundleByGroup } = await useBasketGroup()

const basketItems = computed(() => {
  const standAlone: BasketItem[] = []
  const groups: BasketItem[] = []
  items.value?.forEach((item: BasketItem) =>
    item.itemGroup?.id ? groups.push(item) : standAlone.push(item),
  )

  return {
    standAlone: sortBasketItems(standAlone),
    groups: bundleByGroup(sortBasketItems(groups)),
  }
})

const sortBasketItems = (items: BasketItem[]) =>
  items.sort(
    (a, b) => Number(a.product.isSoldOut) - Number(b.product.isSoldOut),
  )
</script>
