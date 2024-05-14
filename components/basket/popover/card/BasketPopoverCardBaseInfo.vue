<template>
  <div
    class="flex grow flex-col justify-center"
    :class="{ 'flex-row': isLightVariant }"
  >
    <p class="text-sm font-semibold">
      <span v-if="name" class="text-xs text-secondary">{{ name }}</span>
      <br />
      <span v-if="title">{{ title }}</span>
    </p>
    <div class="text-xs text-secondary">
      <p>
        {{ $t('basket_card.size_label') }}:
        <span class="font-bold text-primary">{{ size }}</span>
      </p>
      <p v-if="cupsizeLabel">
        {{ $t('basket_card.cup_size_label') }}:
        <span class="font-bold text-primary">{{ cupsizeLabel }}</span>
      </p>
      <p>
        {{ $t('basket_card.quantity_label') }}:
        <span class="font-bold text-primary">
          {{ quantity }}
        </span>
      </p>
      <p>
        {{ $t('basket_card.color_label') }}:
        <span class="font-bold text-primary">{{ color }}</span>
      </p>
      <p v-if="isSoldOut">
        <ProductBadge class="mt-2" :text="$t('badge_labels.sold_out')" />
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type BasketItem } from '@scayle/storefront-nuxt'

type Props = {
  item: BasketItem
  isLightVariant?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isLightVariant: false,
})

const basketItem = computed(() => props.item)

const {
  name,
  brand: title,
  size,
  color,
  cupsizeLabel,
  isSoldOut,
  quantity,
} = await useBasketItem(basketItem)
</script>
