<template>
  <div class="flex w-full">
    <DefaultLink
      :to="getProductDetailRoute(variant.product)"
      raw
      class="relative mr-3 flex w-32 items-center rounded-md bg-gray-200"
    >
      <ProductImage
        v-if="image"
        :image="image"
        :alt="name"
        sizes="xl:100vw lg:100vw lg:100vw lg:100vw xs:100vw"
        fit="cover"
      />
      <div
        class="absolute bottom-2 left-2 rounded-md p-0.5 px-1.5 text-2xs font-semibold uppercase text-white"
        :style="backgroundColorStyle"
      >
        {{ $t('pdp.promotion.free_label') }}
      </div>
    </DefaultLink>
    <div class="flex w-full flex-col justify-between">
      <Headline size="base" tag="h3" class="mt-2">{{ name }}</Headline>
      <div class="flex items-center justify-between">
        <AppButton size="sm" @click="isModalOpened = true">
          {{ $t('pdp.promotion.add_for_free_label') }}
        </AppButton>
        <div class="flex flex-col items-end">
          <span class="text-xs text-gray-600 line-through">
            {{ toCurrency(variant.price.withTax) }}
          </span>
          <span class="text-base font-bold text-black">
            {{ toCurrency(0) }}
          </span>
        </div>
      </div>
    </div>
    <ProductPromotionGiftModal
      v-if="isModalOpened"
      :product="variant.product"
      @close="isModalOpened = false"
    />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  variant: VariantWithProduct
  backgroundColorStyle: { backgroundColor?: string }
}>()

const isModalOpened = ref(false)

const { name, image } = useProductBaseInfo(props.variant.product)
</script>
