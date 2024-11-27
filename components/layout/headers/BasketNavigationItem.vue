<template>
  <SFPopover
    :is-open="isOpen && !blockPopup"
    @mouseenter="isOpen = true"
    @mouseleave="isOpen = false"
  >
    <template #action>
      <LocalizedLink
        :to="routeList.basket"
        raw
        class="flex h-10 items-center justify-center rounded-md p-2 hover:bg-gray-100"
        data-testid="basket-link"
        :class="{ 'bg-gray-100': isOpen }"
        :aria-label="ariaLabel"
      >
        <IconBasket class="size-6 shrink-0" />
        <span
          class="ml-1 min-w-[1ch] text-sm font-semibold leading-none"
          data-testid="header-basket-count"
        >
          <template v-if="mounted && count">
            {{ count }}
          </template>
        </span>
      </LocalizedLink>
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
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMounted } from '@vueuse/core'
import { useBasket } from '#storefront/composables'
import LocalizedLink from '~/components/LocalizedLink.vue'
import { SFPopover } from '~/modules/ui/runtime/components'
import { routeList } from '~/utils'
import AsyncDataWrapper from '~/components/AsyncDataWrapper.vue'
import BasketPopoverItems from '~/components/basket/popover/BasketPopoverItems.vue'
import BasketPopoverActions from '~/components/basket/popover/BasketPopoverActions.vue'

const { count, status, isEmpty } = useBasket()
const mounted = useMounted()

const isOpen = ref(false)
const i18n = useI18n()
const ariaLabel = computed(() =>
  mounted.value
    ? i18n.t('navigation.basket-aria-label', count.value || 0)
    : i18n.t('navigation.basket-aria-label', 0),
)

defineProps<{ blockPopup?: boolean }>()
</script>
